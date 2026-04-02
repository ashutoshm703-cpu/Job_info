# Nursing Recruitment: Master Experience Experience (The Grand Bible V2.6)

This document is the absolute **Single Source of Truth** for the recruitment engine. It consolidates all ASCII layouts, logic chains, and research history.

---

## 🏛️ PART 1: ADMINISTRATIVE CONFIGURATION (ENGINE COCKPIT)

### SECTION 1: IDENTITY & BRANDING
*See [admin_section1_identity.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/admin_section1_identity.md) for full logic.*

```text
(Layout Highlights: Name, Dual-Mode Uploads, Salary Range, Live Student Card Preview)
```

### SECTION 2: JOB TYPE & JURISDICTION
*See [admin_section2_job_type.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/admin_section2_job_type.md) for full logic.*

```text
(Layout Highlights: Central vs State Toggle, National Scope selection, Registration Board & Regional Language locks)
```

### SECTION 3: RECRUITMENT TIMELINE
*See [admin_section3_timeline.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/admin_section3_timeline.md) for full logic.*

```text
(Layout Highlights: Reorderable Milestones, Primary CTAs, Resource Attachments)
```

### SECTION 4: ELIGIBILITY MATRIX (AGE & RELAXATIONS)
*See [admin_section4_age_matrix.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/admin_section4_age_matrix.md) for full logic.*

```text
(Layout Highlights: Independent M/F Min/Max Boundaries, OBC/SC/ST tiers, Marital Gate Toggle)
```

### SECTION 5: QUALIFICATIONS & COUNCIL MANDATE
*See [admin_section5_qualifications.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/admin_section6_qualifications.md) for full logic.*

```text
(Layout Highlights: Degree logic, Experience mapping, Clinical Bed Requirement mapping)
```

### SECTION 6: TECHNICAL SPECS (BLUEPRINT & FEES)
*See [admin_section6_technical.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/admin_section6_technical.md) for full logic.*

```text
(Layout Highlights: Exam Stage Selection, Single vs Two-Stage, Category-wise Application Fees)
```

---

## 🏥 PART 2: THE STUDENT PORTAL (THE EVALUATEE JOURNEY)

### THE ELIGIBILITY PIPELINE
*See [student_experience_journey.md](file:///c:/Users/Owner/Desktop/Job%20Portal/important%20documents/student_experience_journey.md) for full logic.*

```text
(Layout Highlights: Professional Verdict HUD, Pass/Fail/Flag Logic, Action Routing)
```

---

## 🔍 CORE RESEARCH REPOSITORY (THE BRAIN)

> [!NOTE]
> **Interstate Portability**: Research confirms states like **UPPSC** treat out-of-state as UR (Unreserved) but often mandate a **Target State Council** registration.
> **Short Notifications (Indicative Advertisements)**: Major bodies (AIIMS, DSSSB, ESIC) frequently release tentative notices with unknown or partially known dates. The system natively supports `Notification Status: Short` in the Identity Hub. Crucially, the Timeline supports **granular, event-specific `[x] Tentative` toggles**, allowing admins to mix exact dates (e.g., Application Start) with `[TBA]` dates (e.g., Exam Date). Events marked Tentative automatically switch their CTAs to `[NOTIFY ME]`.
> **Military (MNS)**: Requires "Unmarried / Widow / Divorced" status. Standard recruitments allow all marital statuses.
> **Govt. Employees**: Relaxation is usually for **Central Govt. Civilian** employees with 3+ years of regular service (mostly Group B/C).

---

## 🏛️ PART 3: ADVANCED ASSESSMENT & FINANCIAL ARCHITECTURE

### SECTION 7: MARKING SCHEME (THE MULTI-TIER ENGINE)
*Defines the structure of the examination phases.*

> [!IMPORTANT]
> **Research Context:**
> *   **UPPSC**: 2-Tier. Stage 1 (Prelims Objective, 170 Qs, 85 Marks, 1/3 negative). Stage 2 (Mains Descriptive, 9 Qs, 85 Marks).
> *   **AIIMS NORCET**: 2-Tier. Both Stages Objective (100 Qs theory, 100 Qs clinical, 1/3 negative).
> *   **DSSSB**: 1-Tier massive objective test (200 Qs, 1/4 negative).

**Cockpit UI Design:**
Requires a `[ 1 Stage ]` vs `[ 2 Stages ]` toggle. Each active stage needs a format lock (Objective vs Descriptive), question count, marks, duration, and a Negative Marking dropdown (None, 1/3, 1/4, 1/5).

### SECTION 8: SYLLABUS ARCHITECTURE (THE WEIGHTAGE SPLIT)
*Defines the core domain versus aptitude balance.*

> [!IMPORTANT]
> **Research Context:**
> *   **AIIMS**: 80% Nursing / 20% Non-Nursing.
> *   **DSSSB**: 50% Nursing / 50% Non-Nursing (divided exactly into Math, Reasoning, English, Hindi, GK).
> *   **UPPSC**: 120 Nursing / 30 GK / 20 Hindi.

**Cockpit UI Design:**
A Master Split Matrix (100-Point Block Builder). Admin sets the Nursing Percentage. For the remaining Non-Nursing percentage, an "Add Subject" injector forces the admin to map specific tags (e.g., General Knowledge: 20%) until it equals the exact remainder.

### SECTION 9: THE UNIVERSAL FEE MATRIX
*Defines exact financial burdens based on category and domicile vectors.*

> [!IMPORTANT]
> **Research Context:**
> *   **AIIMS**: UR/OBC ₹3000, SC/ST ₹2400, PwBD Exempt.
> *   **DSSSB**: UR Men ₹100. Women and SC/ST Exempt.
> *   **MP / UP State Law**: Domiciled SC/ST get discounts, but ALL out-of-state candidates pay standard UR fee regardless of actual caste.

**Cockpit UI Design:**
A literal 1-to-1 Category Matrix (UR, OBC, EWS, SC/ST, Women, PwBD, Ex-Servicemen). Next to every category is an explicit `[ ₹ Amount Input ]` and a `[ ] Waive Fee` override checkbox. Must include a master legal toggle at the top: `[x] Force Out-of-State candidates to pay the Unreserved (UR) Fee.`
