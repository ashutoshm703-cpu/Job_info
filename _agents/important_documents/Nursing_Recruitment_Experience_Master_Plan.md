# Nursing Recruitment: Master Experience Workflow (V2.0)

This document is the **Single Source of Truth** for the Eligibility Engine's logical architecture. It follows a non-technical, role-based workflow for Admin (Configurator) and Student (Candidate).

---

## Step 1: Identity & Authority (Branding)

### Admin Component (Configuration)
1.  **Name the Exam**: Official Title (e.g., UPPSC Staff Nurse 2025).
2.  **Authority Icon**: High-fidelity logo of the recruiting board/hospital.
3.  **Financial Reward**: Salary Level (e.g., Level 7 as per 7th CPC).
4.  **Official Source**: Direct URL/PDF for the official recruitment notification.

### Student Component (Recognition)
-   **Verification**: A "High-Density Exam Card" shows these details immediately to confirm the correct evaluatee journey.

---

## Step 2: Geographical Jurisdiction & Council Gate

### Admin Component (Configuration)
1.  **Recruitment Scope**: Toggle "Central/National" vs. "State-Specific".
2.  **State Anchor**: If State-Specific, pick the target state (e.g., Bihar).
3.  **Domicile Lock (Reservation)**: Decide if reserved benefits (OBC/SC/ST) are restricted to residents only.
4.  **State Council Transfer**: Decide if mandatory registration with the Target State Council is required at the time of application.

### Student Component (Jurisdiction)
1.  **Domicile Basis**: Where you have your certificate (State of 10th/12th).
2.  **Nursing Registration**: Which state council are you currently registered with?

### 🔍 Research Analytics (Step 2)
> [!NOTE]
> **Interstate Eligibility**: Research from **UPPSC** and **BTSC** confirms that out-of-state candidates **can** apply but are treated as **UR (Unreserved)**. 
> **The Critical "Registration Lock"**: Most state notifications (UPPSC/BNRC) require a registration certificate from the *target state council* specifically, meaning out-of-state candidates must often transfer their registration prior to final selection.

---

## Step 3: Temporal Anchor & Scalable Age Boundaries

### Admin Component (The Scalable Matrix)
Instead of a single limit, the Admin configures a **Flexible Age Scale**:
1.  **Cut-off Anchor**: The `as_on_date` for all calculations.
2.  **Global or Gender-Specific Limits**:
    -   Option A: Universal (Same for all).
    -   Option B: Gender-Specific (e.g., Male Max: 37, Female Max: 42).
    -   *Strategy*: Capturing specific `Min/Max` for both genders to ensure future-proof scaling.

### Student Component (Selection)
1.  **Date of Birth**: Captured for decimal age conversion.
2.  **Gender (and Marital Status)**:
    -   **Marital Gate**: Select Single / Married / Divorced / Widow.

### 🔍 Research Analytics (Step 3)
> [!IMPORTANT]
> **Gender & Marital Status**: Specialized recruitments like **Military Nursing Services (MNS)** explicitly restrict entry to "Unmarried / Widowed / Legally Divorced (Issueless)" candidates. The engine must support this "Social Gate" to remain high-fidelity for military recruitment.

---

## Step 4: The Inclusion Matrix (Relaxation Logic)

### Admin Component (Configuration)
Configure the **Relaxation Years Aggregate**:
1.  **Social Category**: OBC (+3), SC/ST (+5).
2.  **PwBD Inclusion**: Specific bonuses per category (e.g., 10+5 for SC-PwBD).
3.  **Govt. Employee Groups**: Define eligibility by **Group B, C, or D** and **Central vs. State** employment.

### Student Component (Selection)
1.  **Govt. Employee Toggles**: 
    -   Selection of **Service Classification** (Central/State/Autonomous/PSU).
    -   Selection of **Employee Group** (B, C, or D).
    -   Years of continuous regular service.

### 🔍 Research Analytics (Step 4)
> [!IMPORTANT]
> **The "Regular Service" Rule**: Central recruitment (AIIMS/RRB) typically grants a **+5 year** relaxation only for **Central Government Civilian Employees** with 3+ years of continuous regular service. 
> **Group Limitations**: Research indicates that **Group C** employees often have a flat age-cap (e.g., 40 years) rather than a simple "+N" addition. The engine must differentiate between Group B (Scalable Relaxation) and Group C (Hard Ceiling).

---

## Step 5: Final Evaluation & Decision HUD

### The Final Logic Gate
-   **Highest Benefit Logic**: Computes `Math.max(Category, PwBD, Service_History)`.
-   **Decision Transparency**: The Student sees exactly *why* they are eligible (e.g., "Eligible via Female-Specific Boundary + PwBD Relaxation").

### Student HUD (Heads-Up Display)
1.  **Verdict Banner**: High-contrast Eligibility Status.
2.  **Requirement List**: A checklist showing exactly where they passed (e.g., "Age: Correct", "Council: Registered").
3.  **Action Router**: Direct link back to the Notification Source or the Application Portal.

---
## Step 6: Education Qualification & Legal Registration Gate

### Admin Component (Configuration via Universal Drawer)
1. **Foundational Academic Baseline**: Define secondary education mandates (e.g., standard 10+2 vs. 10+2 with Science).
2. **Recognized Academic Pathways**: Select permissible nursing degrees, using exact nomenclature (e.g., "B.Sc. (Hons.) Nursing", "Post-Basic B.Sc. Nursing", "General Nursing and Midwifery (G.N.M.)").
3. **Universal Degree Configuration Drawer**: Clicking ANY allowed degree opens a consistent configuration panel for that specific pathway.
4. **Conditional Clinical Experience (Per Degree)**: Inside the drawer, Admin toggles `[ ] Require Mandatory Clinical Experience`. If ON, they define duration (e.g., 24 Months) and strict facility mandates (e.g., minimum 50 bedded Hospital).
5. **The Domicile Barrier (Per Degree)**: Inside the drawer, Admin sets the Registration Policy for that degree:
   - Option A: "National Portability" (Any State Nursing Council or INC).
   - Option B: "Target State Enforcement" (e.g., strict limit to "U.P. Nurses and Midwives Council") with an option to permit an INC Suitability Certificate.

### Student Component (Verification HUD)
1. **Foundational Check**: The candidate confirms their 10+2 stream (Science vs Other).
2. **Degree Selection**: The candidate selects their highest achieved nursing qualification.
3. **Dynamic Rule Matching**: The HUD pulls the exact Configuration Drawer rules mapping to that degree.
4. **Clinical Validation**: If the chosen degree's profile demands experience, the candidate inputs their total months of service and hospital bed count.
5. **Council Flagging**: If the candidate holds an out-of-state registration and the explicit degree profile requires strict "Target State Enforcement", the HUD displays a "Suitability Certificate / Transfer Required" action item.
### 🔍 Deep Research Analytics & Legal Requirements Report (Step 6)
> [!IMPORTANT]
> **Foundational Schooling Nuances**: 
> Central boards (like RRB and DSSSB) accept traditional Matriculation or standard 10+2 as the academic floor before nursing. However, strict state notifications like the **UPPSC (Uttar Pradesh Public Service Commission)** explicitly require candidates to have passed the *"High School Examination with Science and Intermediate (10+2) Examination"*. If a candidate does not have a Science background in 10+2, they are legally disqualified for UPPSC, regardless of their nursing degree.
>
> **Exact Degree Vernacular**: 
> Legal documents differentiate variations of degrees. The UI must match these exact terms to prevent legal disputes:
> - `B.Sc. (Hons.) Nursing / B.Sc. Nursing`
> - `B.Sc. (Post-Certificate) / Post-Basic B.Sc. Nursing`
> - `Diploma in General Nursing and Midwifery (G.N.M.)` 
> - *Exception Handling*: Some states include parallel pathways, such as UPPSC accepting a `Diploma in Psychiatry` as an equivalent for male Staff Nurses.
>
> **The "GNM Experience Penalty" Clause**: 
> Central recruitment architectures (most notably **AIIMS NORCET**) actively penalize diplomate candidates. While B.Sc. candidates require exactly `0` months of post-qualification experience, GNM candidates face a hard constraint requiring a minimum of **"Two Years’ Experience in a minimum 50 bedded Hospital"**.
>
> **State Domicile Protectionism & Council Barriers**: 
> Nursing is regulated heavily at the state level yielding deep variations in recruitment legality:
> - **National Exams** (AIIMS, ESIC, RRB): Acknowledge registration with ANY State / Indian Nursing Council.
> - **State Exams** (BTSC Bihar, UPPSC, RPSC Rajasthan): Exercise absolute domain protectionism. BTSC mandates registration with the *"Bihar Nurses Registration Council, Patna"*, while UP demands the *"U.P. Nurses and Midwives Council"*. 
> - *The Suitability Loophole*: In states like Bihar, out-of-state applicants can sometimes apply provided they acquire a "Suitability Certificate" from the INC or commit to a council transfer before official appointment. The UI must therefore "Flag" this error rather than triggering a hard "Fail", preserving the candidate flow.
