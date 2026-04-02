# Admin Section 6: Education Qualification & Legal Registration Gate

This technical blueprint defines the comprehensive UI configuration settings for the final "Permission to Practice" hurdle. In this Elite Edition interface, we use a **Universal Rule Drawer** geometry: every permitted degree unlocks a mathematically uniform configuration sidebar.

---

## 🎨 UI Component 1: Foundational Schooling

**Section Title:** Academic Baseline
**Subheading:** Minimum secondary education required prior to nursing qualifications.

**[Label] Required Baseline Education:**
*(Some state notifications, such as UPPSC, specifically penalize applicants without a science block in 10+2)*
- `(○) Matriculation / Standard 10+2 (e.g., DSSSB / RRB standard)`
- `(◉) 10+2 with Science (Physics, Chemistry, Biology) (e.g., UPPSC standard)`

---

## 🎨 UI Component 2: Academic Routes (Fixed Degrees)

**Section Title:** Permissible Nursing Qualifications
**Subheading:** Select accepted academic routes to edit their specific rules.

**[Interactive Card Grid] Recognized Qualifications:**
*Clicking any enabled card slides out the Universal Rule Drawer for that specific degree.*
- [Card/Checkbox] `B.Sc. (Hons.) Nursing / B.Sc. Nursing`
- [Card/Checkbox] `B.Sc. (Post-Certificate) / Post-Basic B.Sc. Nursing`
- [Card/Checkbox] `Diploma in General Nursing and Midwifery (G.N.M.)`
- [Card/Checkbox] `Diploma in Psychiatry` 

---

## 🎨 UI Component 3: The Universal Rule Drawer (Per-Degree Configuration)

*When an Admin clicks on any activated degree card (e.g., B.Sc. OR G.N.M.), this drawer consistently slides out, ensuring zero mental load and flawless uniformity.*

**Drawer Header**: `[Degree Name]` Registration & Clinical Protocol

### Block A: Legal Registration Policy
**Subheading:** Does this specific route accept national licenses, or enforce target-state registration?

**[Label] Council Mandate:**
- `(◉) National Portability:` Registered as Nurses & Midwife with State / Indian Nursing Council (Default).
- `(○) Target State Enforcement:` Mandatory registration with a specific State Board. 

**If "Target State Enforcement" is selected, reveal Matrix:**
- Select Enforced Board: `[Dropdown List: Bihar Nurses Registration Council (BNRC), U.P. Nurses and Midwives Council, Rajasthan Nursing Council (RNC), etc.]`
- Out-of-State Exemption Policy: `[Checkbox] Allow 'Suitability Certificate' from Indian Nursing Council (INC) for out-of-state candidates.`

> **Help Text (Under 'Target State Enforcement'):**
> *If active, out-of-state candidates will receive a high-contrast 'Mandatory Transfer Required' flag during their HUD evaluation. This prevents outright rejection while ensuring legal compliance prior to official appointment.*

### Block B: Conditional Clinical Experience
**Subheading:** Define specific post-qualification experience required for this route.

**[Label] Required Experience:**
- Toggle: `[ ] Require Mandatory Clinical Experience`

**If Toggle is ON, reveal Configuration Field:**
- Minimum Duration: `[Numeric Input: e.g., 24]` `[Dropdown: Months / Years]`
- Facility Constraint: `[Numeric Input: e.g., minimum 50]` `bedded Hospital`
