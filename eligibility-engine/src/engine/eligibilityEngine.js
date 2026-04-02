export default class EvaluationEngine {
  constructor(rules, studentProfile) {
    this.rules = rules;
    this.profile = studentProfile;
    this.reasons = [];
    this.warnings = [];
    this.isEligible = true;
    this.debugObject = {};
  }

  addFail(msg) {
    this.reasons.push(msg);
    this.isEligible = false;
  }

  addWarning(msg) {
    this.warnings.push(msg);
  }

  evaluate() {
    // ------------------------------------------------------------------
    // 1. Domicile Category Strip (Protectionism Logic)
    // ------------------------------------------------------------------
    let effectiveCategory = this.profile.category;
    
    // In many exams, Domicile is proxied by 'High School Location' or 'Employment Exchange'. 
    // We will use high_school_state as the primary domicile proxy for this engine unless configured otherwise.
    if (this.rules.category_benefits_locked_to_state && this.profile.high_school_state !== this.rules.category_benefits_locked_to_state) {
      if (this.profile.category !== 'UR') {
        this.addWarning(`Category Restriction Warning: You lose your ${this.profile.category} reservation because your High School state (${this.profile.high_school_state}) does not match the Domicile Lock boundary (${this.rules.category_benefits_locked_to_state}). You are being evaluated as Unreserved (UR).`);
      }
      effectiveCategory = 'UR';
    }

    // ------------------------------------------------------------------
    // 2. Comprehensive Age Matrix Evaluation & Gender Lock
    // ------------------------------------------------------------------
    
    // --- 0. HARD FATAL GENDER LOCK ---
    if (this.rules.gender_restriction === 'Female' && this.profile.gender !== 'Female') {
       this.addFail(`Gender Restriction: This recruitment is strictly limited to Female candidates only (e.g. MNS rules).`);
       return this.results; // Fatal flaw
    } else if (this.rules.gender_restriction === 'Male' && this.profile.gender !== 'Male') {
       this.addFail(`Gender Restriction: This recruitment is strictly limited to Male candidates only.`);
       return this.results;
    }

    const calculateExactAge = (dob, asOnDate) => {
      if (!dob || !asOnDate) return 0;
      const b = new Date(dob);
      const t = new Date(asOnDate);
      let exact = t.getFullYear() - b.getFullYear();
      let m = t.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && t.getDate() < b.getDate())) {
         exact--;
      }
      return exact + (m / 12); // Decimal proxy for exactness tracking
    };

    const currentAge = calculateExactAge(this.profile.dob, this.rules.as_on_date);
    this.debugObject.exactAgeCalculated = currentAge;
    
    // Step A: Determine Gender Base Boundary
    let baseMin = this.rules.base_age_min;
    let baseMax = this.rules.base_age_max_male;
    
    if (this.rules.has_female_specific_age && this.profile.gender === 'Female') {
       baseMin = this.rules.base_age_min_female ?? this.rules.base_age_min;
       baseMax = this.rules.base_age_max_female;
    }

    // Check Floor
    if (currentAge < baseMin) {
      this.addFail(`Mathematical Age Rejection: Your age (${currentAge.toFixed(1)}) is strictly below the minimum allowed age of ${baseMin}.`);
    } else {
      
      // Step B: Calculate Highest Possible Category/Physical/Service Relaxation (They rarely stack infinitely)
      let defaultCategoryRelax = 0;
      if (effectiveCategory !== 'UR') {
         defaultCategoryRelax = this.rules.category_relaxations?.[effectiveCategory] || 0;
      }

      let pwbdRelax = 0;
      if (this.profile.is_pwbd) {
         if (effectiveCategory === 'UR') pwbdRelax = this.rules.pwbd_relaxations?.UR || 10;
         else if (effectiveCategory === 'OBC') pwbdRelax = this.rules.pwbd_relaxations?.OBC || 13;
         else if (effectiveCategory === 'SC') pwbdRelax = this.rules.pwbd_relaxations?.SC || 15;
         else if (effectiveCategory === 'ST') pwbdRelax = this.rules.pwbd_relaxations?.ST || 15;
         else pwbdRelax = this.rules.pwbd_relaxations?.EWS || 10;
      }

      let serviceRelax = 0;
      if (this.profile.is_esm) {
         let esmFormulaBonus = (this.rules.esm_relaxation || 0) + (this.profile.esm_years || 0);
         serviceRelax = Math.max(serviceRelax, esmFormulaBonus);
      }
      if (this.profile.is_govt_employee) {
         serviceRelax = Math.max(serviceRelax, this.rules.govt_employee_relaxation || 0);
      }
      if (this.profile.is_contractual) {
         let contractEarned = (this.rules.contractual_relaxation_per_year || 0) * (this.profile.contractual_years || 0);
         if (contractEarned > (this.rules.contractual_relaxation_max || 0)) contractEarned = this.rules.contractual_relaxation_max;
         serviceRelax = Math.max(serviceRelax, contractEarned);
      }

      // Final Age Math: Base + Max(Categorical, PwBD Matrix, Service History)
      let overallRelaxation = Math.max(defaultCategoryRelax, pwbdRelax, serviceRelax);
      const effectiveMaxAge = baseMax + overallRelaxation;

      if (currentAge > effectiveMaxAge) {
         this.addFail(`Age Limit Exceeded: Your age (${currentAge.toFixed(1)}) exceeds your maximum categorical threshold of ${effectiveMaxAge} (Base Ceiling: ${baseMax} + Aggregated Edge-Case Bonuses: ${overallRelaxation}).`);
      } else if (overallRelaxation > 0) {
         this.addWarning(`Age Grace Invoked: You surpassed the base UR ceiling (${baseMax}) but remain mathematically eligible due to a verified +${overallRelaxation} demographic/service allowance.`);
      }
    }

    // ------------------------------------------------------------------
    // 3. Clinical & Degree Verification Vectors
    // ------------------------------------------------------------------
    if (this.rules.requires_recognized_institute && !this.profile.is_institute_recognized) {
       this.addFail(`Institute Accreditation Failure: Your Nursing College/Institute holds no official recognition by the Indian Nursing Council (INC) or State Nursing Council. This exam strictly rejects unaccredited degrees.`);
    }
    // --- 3A. Academic Baseline Gate ---
    const baseline = this.rules.academic_baseline || (this.rules.hs_science_required ? '12th_science' : '12th');
    
    if (baseline === '12th_science') {
      if (!this.profile.passed_hs_science) {
        this.addFail(`High School Stream Rejection: This position strictly mandates 10+2 with Science (PCB). Your profile does not meet the foundational science requirement.`);
      }
    } else if (baseline === '12th') {
      // Assuming profile.highest_schooling_level or similar. Fallback to passed_hs_science as proxy if 12th isn't explicitly tracked
      const is12thPass = this.profile.highest_schooling_level >= 12 || this.profile.passed_hs_science;
      if (!is12thPass) {
        this.addFail(`Educational Level Deficiency: This position requires a minimum of 10+2 (Higher Secondary). Matriculation alone is insufficient.`);
      }
    }

    if (this.rules.required_high_school_state_location && this.profile.high_school_state !== this.rules.required_high_school_state_location) {
      this.addFail(`Geographical Schooling Block: This exam mandates that your primary education was completed identically inside the territory of ${this.rules.required_high_school_state_location}.`);
    }

    // Degree matching logic
    const evalDegree = this.profile.degree;
    const degreeConstraints = this.rules.degrees?.[evalDegree];
    
    if (!degreeConstraints || !degreeConstraints.allowed) {
       this.addFail(`Academic Nullification: The degree you selected (${evalDegree}) is not legally recognized for this recruitment band.`)
    } else {
       if (this.profile.degree_status === 'Final_Year_Appearing') {
          this.addWarning(`Provisional Warning: Final Year applicants must produce passing transcripts before the official cutoff date or face immediate disqualification.`);
       }

       // Experience Math
       let totalMonthsHistory = (parseInt(this.profile.exp_years || 0) * 12) + parseInt(this.profile.exp_months || 0);
       if (totalMonthsHistory < degreeConstraints.req_exp_months) {
          this.addFail(`Clinical Deficiency: Your degree (${evalDegree}) demands a strict minimum of ${degreeConstraints.req_exp_months} months ( ${degreeConstraints.req_exp_months/12} Years ) proven clinical experience. You currently reported ${totalMonthsHistory} months.`);
       }

       if (degreeConstraints.req_min_hospital_beds > 0 && parseInt(this.profile.hospital_beds || 0) < degreeConstraints.req_min_hospital_beds) {
          this.addFail(`Hospital Scale Failure: Your clinical experience must have been earned in a facility containing no fewer than ${degreeConstraints.req_min_hospital_beds} functional beds.`);
       }
    }

    // ------------------------------------------------------------------
    // 4. Bureaucratic Sub-Limits
    // ------------------------------------------------------------------
    if (this.rules.registration_accepted_scope !== 'Any State' && this.profile.nursing_council_state !== this.rules.registration_accepted_scope) {
       this.addFail(`Council Jurisdiction Rejection: You MUST be registered explicitly under the ${this.rules.registration_accepted_scope} Nursing Council. Outsider council documents are blocked.`);
    }

    if (this.rules.required_employment_exchange_state && this.profile.employment_exchange_state !== this.rules.required_employment_exchange_state) {
       this.addFail(`Employment Exchange Block: You must carry an active Employment Exchange Registration precisely within the state of ${this.rules.required_employment_exchange_state}.`);
    }

    if (this.rules.requires_permanent_registration && !this.profile.is_permanent_registration) {
       this.addFail(`Provisional Rejection: You marked your council registration as Provisional/Temporary. This recruitment board requires Permanent Authorization.`);
    }

    if (this.rules.prohibit_multiple_living_spouses && this.profile.has_multiple_spouses) {
       this.addFail(`Marital Rejection Code: Individuals possessing more than one living spouse are legally barred from undertaking this recruitment.`);
    }

    return {
       isEligible: this.isEligible,
       reasons: this.reasons,
       warnings: this.warnings,
       targetedExam: this.rules,
       debugObject: this.debugObject
    };
  }
}
