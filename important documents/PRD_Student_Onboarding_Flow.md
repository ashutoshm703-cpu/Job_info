# PRD: NPrep JOBS — Student Onboarding Flow

**Document type:** Product Requirements Document
**Product:** NPrep JOBS (Student Job Portal)
**Author:** Product Team
**Last updated:** 15 April 2026
**Status:** Draft — Ready for Review

---

## Executive Summary

This document defines the complete student onboarding flow for NPrep JOBS — a mobile-first job portal that matches nursing students and graduates with eligible government nursing exams across India. The onboarding collects the minimum profile data needed to show personalized exam results, following a Headspace-inspired "3 screens to value" approach.

**Core principle:** Collect the minimum mandatory data upfront (7 fields across 2 screens), make everything else optional and skippable, and get the student to their results in under 45 seconds.

---

## Table of Contents

1. [Problem & Context](#1-problem--context)
2. [User Personas](#2-user-personas)
3. [Flow Architecture](#3-flow-architecture)
4. [Screen-by-Screen Specifications](#4-screen-by-screen-specifications)
5. [Field Definitions & Dropdown Options](#5-field-definitions--dropdown-options)
6. [Conditional Logic Rules](#6-conditional-logic-rules)
7. [Validation Rules & Error Messages](#7-validation-rules--error-messages)
8. [Edge Cases](#8-edge-cases)
9. [Data Model](#9-data-model)
10. [Design Specifications](#10-design-specifications)
11. [Copy & Microcopy Guide](#11-copy--microcopy-guide)
12. [Post-Onboarding: Profile Completion](#12-post-onboarding-profile-completion)
13. [Success Metrics](#13-success-metrics)
14. [Appendix](#14-appendix)

---

## 1. Problem & Context

### What is the problem?

Nursing students in India face a fragmented landscape of 50+ government nursing exams (AIIMS NORCET, UPPSC, RRB, BTSC, UKMSSB, ESIC, state-level recruitments). Each exam has different eligibility rules — age limits, category relaxations, degree requirements, experience mandates, domicile restrictions. Students waste hours reading notification PDFs and manually checking if they qualify.

### Why does this matter?

- Students miss eligible exams because they didn't know they qualified
- Students waste application fees on exams they're ineligible for
- The eligibility rules are complex (age + category + PwBD + ESM relaxations stack differently per exam)
- Students from Tier 2/3 cities have no mentor to guide them

### What we're building

An onboarding flow that collects a student's profile in under 45 seconds and instantly shows them which exams they're eligible for. The profile feeds into the Eligibility Engine (already built — `eligibilityEngine.js`) which evaluates each exam's rules against the student's data.

---

## 2. User Personas

| Persona | Age | Background | Key Need |
|---------|-----|------------|----------|
| **Neha** (Early Planner) | 18-21 | B.Sc. 1st/2nd year, in college | Know which exams to target, start planning early |
| **Kavya** (Parallel Preparer) | 20-23 | B.Sc. 3rd/4th year, countdown is real | Map exams to her graduation timeline |
| **Priya** (Rerouted Dreamer) | 23-25 | B.Sc. Nursing, re-attempting | Find all possible exams before age limit hits |
| **Rahul** (Silent Provider) | 25-28 | GNM, working 10-hour shifts | Quickly find exams he can apply to right now |
| **Anjali** (Invisible Aspirant) | 22-26 | B.Sc., preparing in secret | Private, fast, no social features |
| **Deepak** (Age-Limit Racer) | 28-30 | 4-6 years prep, last attempts | Every eligible exam matters — can't miss one |

**Common emotional state at onboarding:** Cautiously hopeful. First time on the platform. Willing to share data IF they see value quickly. Will abandon if the form feels long or invasive.

---

## 3. Flow Architecture

### High-Level Flow Map

```
                    ┌─────────────┐
                    │   SPLASH    │
                    │  (5 sec)    │
                    │  NPrep JOBS │
                    └──────┬──────┘
                           │ "Enter Job Portal"
                           ▼
                    ┌─────────────┐
                    │  STEP 1/3   │
                    │  About you  │
                    │ (MANDATORY) │
                    │  4 fields   │
                    └──────┬──────┘
                           │ [Next]
                           ▼
                    ┌─────────────┐
                    │  STEP 2/3   │
                    │ Qualification│
                    │ (MANDATORY) │
                    │  3 fields   │
                    └──────┬──────┘
                           │ [Next]
                    ┌──────┴──────┐
                    │             │
              Status =       Status ≠
             "Passed Out"   "Passed Out"
                    │             │
                    ▼             │
             ┌─────────────┐     │
             │  STEP 2B    │     │
             │ Registration│     │
             │ & Experience│     │
             │(CONDITIONAL)│     │
             └──────┬──────┘     │
                    │             │
                    ▼             ▼
                    ┌─────────────┐
                    │  STEP 3/3   │
                    │Anything else│
                    │ (OPTIONAL)  │
                    │ [Skip avail]│
                    └──────┬──────┘
                           │ [Show me my eligible exams]
                           ▼
                    ┌─────────────┐
                    │  RESULTS    │
                    │ X exams     │
                    │ match you   │
                    └─────────────┘
```

### Path Summary

| Path | Who | Screens | Est. Time |
|------|-----|---------|-----------|
| **Fastest** | Student still studying, no special categories | Splash → Step 1 → Step 2 → Skip Step 3 → Results | ~30 seconds |
| **Standard** | Student still studying, fills optional | Splash → Step 1 → Step 2 → Step 3 → Results | ~45 seconds |
| **Full** | Passed-out nurse, all details | Splash → Step 1 → Step 2 → Step 2B → Step 3 → Results | ~60 seconds |

---

## 4. Screen-by-Screen Specifications

### Screen 0: Splash

**Purpose:** Brand recognition, trust establishment, emotional transition from "browsing" to "finding my eligible jobs."

**Duration:** Always visible until user taps "Enter Job Portal." No auto-advance timer.

**Layout:**

```
┌─────────────────────────┐
│                         │
│      [NPrep JOBS        │
│       Logo/Icon]        │
│                         │
│   NPrep JOBS            │
│                         │
│   Your nursing career,  │
│   sorted.               │
│                         │
│   Government nursing    │
│   jobs across India —   │
│   matched to you.       │
│                         │
│  ┌──────┐┌──────┐┌──────┐
│  │ 80K+ ││ 50+  ││ 100% │
│  │Studs ││Exams ││Verif │
│  └──────┘└──────┘└──────┘
│                         │
│  ✓ All jobs verified    │
│    by NPrep             │
│                         │
│                         │
│ Trusted by 1,00,000+   │
│ Students                │
│                         │
│ [  Enter Job Portal  ]  │
│                         │
└─────────────────────────┘
```

**Components:**
- Logo icon: 80x80px, gradient (Midnight Blue → Clear Sky Blue), rounded 20px
- App name: "NPrep" in Midnight Blue, "JOBS" in Clear Sky Blue, Poppins Bold
- Tagline: Poppins Regular, 0.95rem, Midnight Blue at 70% opacity
- Stats row: 3 items, each with icon (48px, Ice Blue bg, Clear Sky Blue icon), number (Poppins Bold 1.1rem), label (Poppins Regular 0.7rem)
- Trust badge: Ice Blue pill, Poppins SemiBold 0.75rem
- Trusted text: 0.75rem, 40% opacity, "1,00,000+" in bold
- CTA button: Full width, Midnight Blue bg, white text, 14px radius, Poppins SemiBold

**Interactions:**
- Logo has subtle float animation (translateY -8px, 3s loop)
- Stats count up on load (0 → 80K+, 0 → 50+, 0 → 100%)
- CTA button: hover lift, active scale 0.98

---

### Screen 1: "About you" (Step 1/3 — MANDATORY)

**Purpose:** Collect the 4 core identity fields needed for 80% of eligibility checks.

**Header (persistent across all steps):**
- Title: "Tell us about you to find eligible jobs!"
- Subtitle: "We'll use this to filter exams and opportunities specific to your profile."
- Close button (×): top-right, returns to splash

**Progress bar:** 3 segments. Segment 1 filled (Midnight Blue). Label: "1/3"

**Card:**
- Title: "About you"
- Subtitle: "The basics — takes 20 seconds"

**Fields (in order):**

| # | Field | Label | Type | Mandatory | Default |
|---|-------|-------|------|-----------|---------|
| 1 | Date of Birth | "Date of birth" | Date picker | Yes | Empty |
| 2 | Gender | "Gender" | Dropdown | Yes | Placeholder: "Gender" |
| 3 | Category | "Category" | Dropdown | Yes | Placeholder: "Category" |
| 4 | Home State | "Your home state" | Searchable dropdown | Yes | Placeholder: "Search your state..." |

**Bottom bar:**
- [Next] button — full width, Midnight Blue

**Field entrance animation:** Each field fades in from 8px below, staggered by 50ms.

---

### Screen 2: "Your nursing qualification" (Step 2/3 — MANDATORY)

**Purpose:** Collect education data to match against exam degree requirements.

**Progress bar:** Segment 1 filled (dot), Segment 2 filling. Label: "2/3"

**Card:**
- Title: "Your nursing qualification"
- Subtitle: "So we can match you to the right exams"

**Fields:**

| # | Field | Label | Type | Mandatory | Default |
|---|-------|-------|------|-----------|---------|
| 1 | Schooling | "Highest school exam passed" | Dropdown | Yes | Placeholder: "Select" |
| 2 | Qualification | "Nursing qualification" | Dropdown | Yes | Placeholder: "Select" |
| 3 | Status | "Where are you now?" | Dropdown (conditional) | Yes | Placeholder: "Select qualification first" |

**Conditional behavior:** Status dropdown options change based on Qualification selected. See Section 5 for the mapping.

**Bottom bar:**
- [Back] button — Ice Blue bg, Midnight Blue text (flex: 0.6)
- [Next] button — Midnight Blue (flex: 1)

**Fork logic after [Next]:**
- If Status = "Passed Out" → navigate to Screen 2B
- If Status ≠ "Passed Out" → skip Screen 2B, navigate to Screen 3

---

### Screen 2B: "Your nursing career so far" (CONDITIONAL — Passed Out only)

**Purpose:** Collect registration and experience data that only applies to graduated nurses.

**When shown:** Only when Status = "Passed Out" on Screen 2.

**Card:**
- Title: "Your nursing career so far"
- Subtitle: "Registration and work experience"

**Fields:**

| # | Field | Label | Type | Mandatory | Default | Conditional |
|---|-------|-------|------|-----------|---------|-------------|
| 1 | INC Recognition | "Is your college recognised by INC?" | Toggle | Yes | ON (Yes) | If OFF → show warning |
| 2 | Nursing Council | "Registered with which state council?" | Searchable dropdown | Yes | Empty | — |
| 3 | Experience | "Any work experience after passing out?" | Toggle | No | OFF (No) | If ON → show fields 4 & 5 |
| 4 | Experience Months | "How many months?" | Number input | No | Empty | Only if field 3 = ON |
| 5 | Bed Count | "Hospital size (bed count)" | Dropdown | No | Empty | Only if field 3 = ON |

**INC Warning (when toggle = OFF):**
- Amber box (#FEF3C7 bg, #F59E0B border)
- Text: "Most exams need INC recognition. Your results may be limited."
- Appears with slide-down animation

**Bottom bar:**
- [Back] — goes to Screen 2
- [Next] — goes to Screen 3

---

### Screen 3: "Anything else?" (Step 3/3 — OPTIONAL, SKIPPABLE)

**Purpose:** Collect special category data that affects relaxations. 80%+ students will skip this.

**Progress bar:** All 3 segments filled. Label: "3/3"

**Skip button (ABOVE the card):**
- Text: "Skip — show me my jobs"
- Style: Ghost/outline button, full width, subtle border
- Position: Between progress bar and card
- Behavior: Skips all fields, navigates to Results

**Card:**
- Title: "Anything else?"
- Subtitle: "Most students skip this — you can always add it later"

**Fields:**

| # | Field | Label | Type | Mandatory | Default | Conditional |
|---|-------|-------|------|-----------|---------|-------------|
| 1 | Marital Status | "Marital status (optional)" | Dropdown | No | Empty | — |
| 2 | PwD | "Person with disability (40%+)?" | Toggle | No | OFF | — |
| 3 | ESM | "Ex-serviceman?" | Toggle | No | OFF | If ON → show field 4 |
| 4 | ESM Months | "Months of service" | Number input | No | Empty | Only if field 3 = ON |
| 5 | Govt Employee | "Central govt employee?" | Toggle | No | OFF | — |
| 6 | J&K Domicile | "J&K domicile (1980-1989)?" | Toggle | No | OFF | — |

**Bottom bar:**
- [Back] — goes to Screen 2B (if passed out) or Screen 2 (if still studying)
- [Show me my eligible exams] — Midnight Blue, navigates to Results

---

### Screen 4: Results

**Purpose:** Show the student their matched exams and encourage profile completion.

**Layout:**

```
┌─────────────────────────┐
│                         │
│          12             │
│   exams match your      │
│        profile          │
│ Based on your           │
│ qualification & category│
│                         │
│ ┌─────────────────────┐ │
│ │ AIIMS NORCET 11     │ │
│ │ 2,551 · Level 7 ·  │ │
│ │ National            │ │
│ │ [Likely eligible]   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ UPPSC Staff Nurse   │ │
│ │ 2,240 · Level 7 ·  │ │
│ │ Uttar Pradesh       │ │
│ │ [Likely eligible]   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ RRB Staff Nurse     │ │
│ │ 713 · Level 7 ·    │ │
│ │ National            │ │
│ │ [Check eligibility] │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Complete profile ──┐ │
│ │ 65% complete        │ │
│ │ ████████░░░░        │ │
│ │ Add languages &     │ │
│ │ experience for more │ │
│ │ [Complete profile]  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Components:**
- Results count: Clear Sky Blue, 3rem, Poppins Bold
- Results label: Midnight Blue, 1rem, Poppins SemiBold
- Exam cards: White bg, Ice Blue border (1.5px), 14px radius, hover → border turns Clear Sky Blue + lift
- Eligibility tags:
  - "Likely eligible" — green (#D1FAE5 bg, #065F46 text)
  - "Check eligibility" — amber (#FEF3C7 bg, #92400E text)
- Profile completion nudge: Ice Blue bg, 12px radius, progress bar (Clear Sky Blue fill), percentage + hint text

---

## 5. Field Definitions & Dropdown Options

### Date of Birth
- **Type:** Native date picker
- **Format:** DD/MM/YYYY
- **Constraints:** Must be a valid date. Age must be between 15 and 55 years as of today.
- **Stored as:** ISO date string (YYYY-MM-DD)

### Gender
- **Type:** Dropdown
- **Options:**
  1. Male
  2. Female

### Category
- **Type:** Dropdown
- **Options:**
  1. Unreserved (UR)
  2. OBC
  3. SC
  4. ST

### Home State (Searchable)
- **Type:** Searchable dropdown with text filter
- **Options (36 total):**

**States (28):**
Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal

**Union Territories (8):**
Andaman & Nicobar Islands, Chandigarh, Dadra & Nagar Haveli and Daman & Diu, Delhi, Jammu & Kashmir, Ladakh, Lakshadweep, Puducherry

### Highest School Exam Passed
- **Type:** Dropdown
- **Options:**
  1. 10th Pass
  2. 12th Pass — Arts / Commerce / Other
  3. 12th Pass — Science (PCB)

### Nursing Qualification
- **Type:** Dropdown
- **Options (ordered by level):**
  1. ANM (Auxiliary Nurse Midwifery)
  2. GNM (General Nursing & Midwifery)
  3. B.Sc. Nursing
  4. Post-Basic B.Sc. Nursing
  5. M.Sc. Nursing

### Current Status (Conditional)
- **Type:** Dropdown
- **Options depend on selected qualification:**

| Qualification | Status Options |
|---------------|---------------|
| ANM | 1st Year, 2nd Year, Passed Out |
| GNM | 1st Year, 2nd Year, 3rd Year, Passed Out |
| B.Sc. Nursing | 1st Year, 2nd Year, 3rd Year, 4th Year, Passed Out |
| Post-Basic B.Sc. Nursing | 1st Year, 2nd Year, Passed Out |
| M.Sc. Nursing | 1st Year, 2nd Year, Passed Out |

- **Placeholder (before qualification selected):** "Select qualification first"
- **Placeholder (after qualification selected):** "Select"

### INC Recognition
- **Type:** Toggle switch
- **Default:** ON (Yes)
- **Stored as:** Boolean

### Nursing Council State (Searchable)
- **Type:** Searchable dropdown
- **Options:** "Indian Nursing Council (INC)" at the top, followed by the same 36 states/UTs as Home State

### Experience Toggle
- **Type:** Toggle switch
- **Default:** OFF (No)
- **Stored as:** Boolean

### Experience Months
- **Type:** Number input
- **Placeholder:** "e.g. 24"
- **Constraints:** Min 0, Max 600 (50 years)
- **Stored as:** Integer (months)

### Hospital Bed Count
- **Type:** Dropdown
- **Options:**
  1. Under 50
  2. 50 - 100
  3. 100 - 200
  4. 200 - 500
  5. 500+

### Marital Status
- **Type:** Dropdown
- **Options:**
  1. Unmarried
  2. Married
  3. Divorced / Separated
- **Label suffix:** "(optional)"

### PwD Toggle
- **Type:** Toggle switch
- **Label:** "Person with disability (40%+)?"
- **Default:** OFF

### Ex-Serviceman Toggle
- **Type:** Toggle switch
- **Default:** OFF
- **Conditional:** If ON → show "Months of service" number input

### ESM Months of Service
- **Type:** Number input
- **Placeholder:** "e.g. 60"
- **Constraints:** Min 0, Max 600
- **Only visible when:** Ex-serviceman toggle = ON

### Central Govt Employee
- **Type:** Toggle switch
- **Default:** OFF
- **Note:** Can coexist with Ex-serviceman = ON. The eligibility engine applies `Math.max()` of both relaxations.

### J&K Domicile
- **Type:** Toggle switch
- **Label:** "J&K domicile (1980-1989)?"
- **Default:** OFF
- **Note:** Specific relaxation for persons displaced from J&K during 1980-1989.

---

## 6. Conditional Logic Rules

### Rule 1: Status Options Based on Qualification
- **Trigger:** User selects a value in the "Nursing qualification" dropdown
- **Effect:** "Where are you now?" dropdown options are updated to match the qualification's duration
- **If qualification is cleared:** Status resets to placeholder

### Rule 2: Passed Out → Show Screen 2B
- **Trigger:** User selects "Passed Out" in Status dropdown AND clicks [Next] on Screen 2
- **Effect:** Navigate to Screen 2B (Registration & Experience)

### Rule 3: Not Passed Out → Skip Screen 2B
- **Trigger:** User selects any status OTHER than "Passed Out" AND clicks [Next] on Screen 2
- **Effect:** Skip Screen 2B entirely, navigate directly to Screen 3

### Rule 4: INC Toggle OFF → Show Warning
- **Trigger:** User toggles INC recognition to OFF on Screen 2B
- **Effect:** Amber warning box appears below the toggle with slide-down animation
- **When toggled back ON:** Warning disappears

### Rule 5: Experience Toggle ON → Show Sub-fields
- **Trigger:** User toggles "Any work experience" to ON on Screen 2B
- **Effect:** "How many months?" and "Hospital size" fields appear with fade-in animation
- **When toggled OFF:** Fields disappear, values are cleared

### Rule 6: ESM Toggle ON → Show Months of Service
- **Trigger:** User toggles "Ex-serviceman?" to ON on Screen 3
- **Effect:** "Months of service" number input appears
- **When toggled OFF:** Field disappears, value is cleared

### Rule 7: Back Button on Screen 3
- **Trigger:** User clicks [Back] on Screen 3
- **Effect:** If user went through Screen 2B (is passed out) → go back to Screen 2B. If user skipped Screen 2B (still studying) → go back to Screen 2.

### Rule 8: Skip on Screen 3
- **Trigger:** User clicks "Skip — show me my jobs"
- **Effect:** All optional fields on Screen 3 are set to their defaults (all toggles OFF, marital status empty). Navigate to Results.

---

## 7. Validation Rules & Error Messages

### Screen 1 Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Date of Birth | Must not be empty | "Please enter your date of birth" |
| Date of Birth | Age must be 15-55 | "Please enter a valid date of birth" |
| Gender | Must not be empty | "Please select your gender" |
| Category | Must not be empty | "Please select your category" |
| Home State | Must not be empty | "Please select your home state" |

**When validation fails:**
- Red border (1.5px, #EF4444) appears on the invalid field
- Error message appears below the field in red (0.7rem, #EF4444)
- Page scrolls to the first invalid field
- Error clears when the user interacts with the field

### Screen 2 Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Schooling | Must not be empty | "Please select your schooling level" |
| Qualification | Must not be empty | "Please select your qualification" |
| Status | Must not be empty | "Please select your current status" |

### Screen 2B Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Nursing Council | Must not be empty | "Please select your nursing council" |
| Experience Months | If experience = ON, must be > 0 | "Please enter your months of experience" |

**Note:** INC toggle has no validation — it defaults to ON and the warning is informational only.

### Screen 3 Validation
- **No validation.** All fields are optional. The screen is fully skippable.

---

## 8. Edge Cases

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | User changes qualification after selecting status | Status resets to placeholder, previous value cleared |
| 2 | User selects "Passed Out" then goes back and changes to "2nd Year" | Screen 2B is skipped on next [Next] click. Any data entered on 2B is preserved but not used |
| 3 | User toggles experience ON, enters data, then toggles OFF | Experience months and bed count are cleared |
| 4 | User toggles ESM ON, enters months, then toggles OFF | ESM months value is cleared |
| 5 | User enters DOB making them under 15 or over 55 | Validation error on DOB field |
| 6 | User types in state search but no match found | Dropdown shows empty state — "No results" message |
| 7 | User clicks close (×) button on any screen | Returns to splash screen. All data is preserved for when they return |
| 8 | User refreshes the page mid-flow | Data is lost. Flow restarts from splash. (Future: persist to localStorage) |
| 9 | User selects "10th Pass" schooling but "B.Sc. Nursing" qualification | No conflict — the app doesn't validate schooling vs qualification compatibility at onboarding. The eligibility engine handles this during exam matching |
| 10 | User has both ESM and Govt Employee toggled ON | Both are stored. The eligibility engine uses `Math.max(esmRelaxation, govtRelaxation)` |
| 11 | User skips Screen 3 entirely | All special category fields default to OFF/empty. Profile shows as 65% complete on Results |
| 12 | No exams match the profile | Results screen shows "0 exams match" with a message: "Try expanding your profile or check back when new notifications are released" |

---

## 9. Data Model

### Student Profile Object

```json
{
  "personal": {
    "dob": "1998-05-15",
    "gender": "Female",
    "category": "OBC",
    "home_state": "Rajasthan"
  },
  "education": {
    "highest_schooling": "12th_science",
    "qualification": "B.Sc. Nursing",
    "status": "Passed Out"
  },
  "registration": {
    "inc_recognised": true,
    "nursing_council_state": "Rajasthan",
    "has_experience": true,
    "experience_months": 24,
    "hospital_bed_count": "100-200"
  },
  "special_categories": {
    "marital_status": "",
    "is_pwd": false,
    "is_esm": false,
    "esm_months": 0,
    "is_govt_employee": false,
    "is_jk_domicile": false
  },
  "profile_completion": 65,
  "onboarding_completed_at": "2026-04-15T10:30:00Z"
}
```

### Field-to-Engine Mapping

| Profile Field | Engine Field | Used In |
|---------------|-------------|---------|
| dob | profile.dob | Age calculation |
| gender | profile.gender | Gender lock check |
| category | profile.category | Category relaxations |
| home_state | profile.high_school_state | Domicile check |
| highest_schooling | profile.passed_hs_science | Academic baseline |
| qualification | profile.degree | Degree validation |
| status | profile.degree_status | Provisional check |
| inc_recognised | profile.is_institute_recognized | INC check |
| nursing_council_state | profile.nursing_council_state | Council jurisdiction |
| experience_months | profile.exp_months | Experience check |
| hospital_bed_count | profile.hospital_beds | Hospital scale check |
| is_pwd | profile.is_pwbd | PwBD relaxation |
| is_esm | profile.is_esm | ESM relaxation |
| esm_months | profile.esm_years (÷12) | ESM formula |
| is_govt_employee | profile.is_govt_employee | Govt relaxation |
| marital_status | profile.has_multiple_spouses | Marital check |

---

## 10. Design Specifications

### Brand Colors (from NPrep Design Philosophy)

| Role | Color | Hex |
|------|-------|-----|
| Primary / Headings | Midnight Blue | #131B63 |
| Accent / CTAs | Clear Sky Blue | #15CAE8 |
| Secondary BG | Ice Blue | #E5F0F8 |
| Background | White | #FFFFFF |
| Dividers | Gray | #CCCCCC |
| Error | Red | #EF4444 |
| Success | Green | #065F46 on #D1FAE5 |
| Warning | Amber | #92400E on #FEF3C7 |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Screen title | Poppins | Bold (700) | 1.2rem |
| Screen subtitle | Poppins | Regular (400) | 0.8rem |
| Card title | Poppins | Bold (700) | 0.95rem |
| Card subtitle | Poppins | Regular (400) | 0.75rem |
| Field label | Poppins | SemiBold (600) | 0.8rem |
| Field input | Poppins | Medium (500) | 0.85rem |
| Button text | Poppins | SemiBold (600) | 0.9-1rem |
| Error message | Poppins | Regular (400) | 0.7rem |
| Helper text | Poppins | Regular (400) | 0.7rem |

### Layout

| Property | Value |
|----------|-------|
| Mobile viewport | 390px width |
| Card border radius | 16px |
| Input border radius | 10px |
| Button border radius | 14px |
| Card padding | 1.25rem |
| Field spacing | 1rem between fields |
| Screen padding (horizontal) | 1.5rem |

### Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Screen transition | Slide + fade | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Field entrance | Fade up (8px) | 400ms, staggered 50ms | ease-out |
| Toggle switch | Thumb slide | 200ms | ease |
| Warning box | Slide down | 300ms | ease-out |
| Conditional fields | Fade in | 300ms | ease-out |
| Error state | Red border + message | Instant | — |
| Progress bar fill | Width expansion | 400ms | ease-out |

### Component Specs

**Primary Button:**
- Background: #131B63
- Text: White, Poppins SemiBold, 0.9rem
- Padding: 1rem vertical
- Border radius: 14px
- Hover: darken to #0d1347, translateY(-1px)
- Active: scale(0.98)

**Back Button:**
- Background: #E5F0F8
- Text: #131B63, Poppins SemiBold, 0.9rem
- Flex: 0.6 (narrower than primary)

**Skip Button:**
- Background: transparent
- Border: 1.5px solid #E5F0F8
- Text: #131B63 at 50% opacity
- Full width, below progress bar

**Toggle Switch:**
- Width: 44px, Height: 24px
- Track OFF: #CCCCCC
- Track ON: #15CAE8
- Thumb: 20px circle, white, shadow
- Status label: "Yes" / "No" next to toggle

**Searchable Dropdown:**
- Input with search icon or placeholder
- Dropdown list: max-height 200px, scrollable
- Items: 0.8rem, hover bg: #E5F0F8
- Selected item: #131B63 bg, white text
- Shadow: 0 8px 24px rgba(0,0,0,0.1)

---

## 11. Copy & Microcopy Guide

### Tone
Headspace-style: warm, simple, encouraging. Like a calm friend guiding you through a process. Zero jargon. No bureaucratic language.

### Screen Titles & Subtitles

| Screen | Title | Subtitle |
|--------|-------|----------|
| Header (all steps) | "Tell us about you to find eligible jobs!" | "We'll use this to filter exams and opportunities specific to your profile." |
| Step 1 Card | "About you" | "The basics — takes 20 seconds" |
| Step 2 Card | "Your nursing qualification" | "So we can match you to the right exams" |
| Step 2B Card | "Your nursing career so far" | "Registration and work experience" |
| Step 3 Card | "Anything else?" | "Most students skip this — you can always add it later" |

### Field Labels

| Field | Label | Why this wording |
|-------|-------|-----------------|
| DOB | "Date of birth" | Standard, universally understood |
| Gender | "Gender" | Simple, no "Sex" or "Biological gender" |
| Category | "Category" | Every Indian student knows this term from forms |
| State | "Your home state" | "Your" makes it personal. "Home state" is how students say it ("main Rajasthan se hoon") |
| Schooling | "Highest school exam passed" | Removes ambiguity — "highest" makes it clear to pick 12th, not 10th |
| Qualification | "Nursing qualification" | Drops "highest" — implied by dropdown order |
| Status | "Where are you now?" | Conversational, like a friend asking |
| INC | "Is your college recognised by INC?" | Direct yes/no question |
| Council | "Registered with which state council?" | Tells them exactly what we're asking |
| Experience | "Any work experience after passing out?" | Contextualizes "after passing out" |
| Months | "How many months?" | Simple, specific |
| Beds | "Hospital size (bed count)" | "Hospital size" is intuitive, "(bed count)" clarifies |
| Marital | "Marital status" + "(optional)" suffix | Familiar term + explicit optional tag |
| PwD | "Person with disability (40%+)?" | Includes the 40% threshold — students know this from forms |
| ESM | "Ex-serviceman?" | Short, direct |
| ESM months | "Months of service" | Specific to military context |
| Govt | "Central govt employee?" | Specifies "central" — state govt has different rules |
| J&K | "J&K domicile (1980-1989)?" | Includes the year range — makes it specific |

### Button Labels

| Button | Label | Context |
|--------|-------|---------|
| Splash CTA | "Enter Job Portal" | Action-oriented, tells them where they're going |
| Next | "Next" | Simple, universal |
| Back | "Back" | Simple, universal |
| Skip | "Skip — show me my jobs" | Tells them what happens when they skip — they get VALUE |
| Final CTA | "Show me my eligible exams" | The button IS the reward — not "Submit" or "Finish" |

### Placeholder Text

| Field | Placeholder |
|-------|-------------|
| DOB | DD/MM/YYYY |
| Gender | "Gender" |
| Category | "Category" |
| State search | "Search your state..." |
| Schooling | "Select" |
| Qualification | "Select" |
| Status (before qual) | "Select qualification first" |
| Status (after qual) | "Select" |
| Council search | "Search state council..." |
| Exp months | "e.g. 24" |
| Bed count | "Select" |
| Marital | "Select" |
| ESM months | "e.g. 60" |

### Warning & Info Messages

| Situation | Message | Style |
|-----------|---------|-------|
| INC = OFF | "Most exams need INC recognition. Your results may be limited." | Amber box |
| 0 results | "No exams match right now. Try expanding your profile or check back when new notifications are released." | Centered, subtle |
| Profile incomplete | "65% complete — add languages & experience for more results" | Ice Blue nudge card |

---

## 12. Post-Onboarding: Profile Completion

Fields NOT collected during onboarding (deferred to "Complete your profile"):

| Field | Where to Collect | Why Deferred |
|-------|-----------------|--------------|
| Languages (read & write) | Profile settings | Only affects state exams with language requirements |
| Other states interest | Job listing filter | Preference, not eligibility |
| Citizenship | Profile settings (rare) | 99%+ are Indian citizens |
| Detailed work history | Profile settings | Only needed when checking specific exam eligibility |

**Profile completion percentage calculation:**

| Fields Filled | Percentage |
|---------------|-----------|
| Step 1 (4 fields) | +30% |
| Step 2 (3 fields) | +25% |
| Step 2B - INC + Council | +15% |
| Step 2B - Experience | +10% |
| Step 3 - Any field filled | +5% each, max +15% |
| Languages added | +5% |

**Nudge strategy:**
- Show completion bar on Results screen
- "Complete profile" button leads to profile settings
- Contextual prompts: when user views a state exam → "Add your languages to check if you qualify for the language requirement"

---

## 13. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Onboarding completion rate | >80% | Users who reach Results / Users who tap "Enter Job Portal" |
| Time to Results | <45 seconds (median) | Timestamp: splash CTA click → results screen render |
| Step 1 completion | >95% | Users who complete Step 1 / Users who start Step 1 |
| Step 2 completion | >90% | Users who complete Step 2 / Users who complete Step 1 |
| Step 3 skip rate | 70-85% | Users who skip Step 3 / Users who reach Step 3 |
| Profile completion (post-onboarding) | >40% reach 80%+ within 7 days | Users with 80%+ profile / Total onboarded users |
| Return rate | >50% return within 3 days | Users who re-open app within 72 hours |

---

## 14. Appendix

### A. Eligibility Engine Integration

The student profile collected during onboarding maps directly to the `EvaluationEngine` class in `eligibility-engine/src/engine/eligibilityEngine.js`. The engine evaluates each exam's rules against the profile and returns:

```json
{
  "isEligible": true,
  "reasons": [],
  "warnings": ["Age Grace Invoked: ..."],
  "debugObject": { "exactAgeCalculated": 27.3 }
}
```

### B. Exam Data Source

Exam configurations are stored in `eligibility-engine/src/data/configDatabase.js` with pre-loaded exams:
- AIIMS NORCET 8 (2025)
- UPPSC Staff Nurse (2023)
- BTSC Bihar Nursing Officer
- UKMSSB Uttarakhand Nursing Officer
- RRB Staff Nurse

### C. Interactive Prototype

A working HTML prototype exists at `eligibility-engine/student-onboarding-prototype.html`. It includes all screens, conditional logic, validation, animations, and both user paths (studying vs passed out). Open in any browser to test.

### D. Related Documents

- `important documents/Nursing_Recruitment_Experience_Master_Plan.md` — Full product specification
- `important documents/student_experience_journey.md` — Student portal UX flow
- `_agents/skills/copywriting_skill/` — Copy reference files and persona definitions
- `~/.claude/nprep-design-philosophy.md` — Brand design system

---

*End of document.*
