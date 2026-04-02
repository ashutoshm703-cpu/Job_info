# Admin Section 5: The Inclusion Matrix (Relaxations)

This section establishes the "Boost Logic" that extends the base age boundaries for specific candidate groups. It handles complex additive relaxations for Social Categories, Disabilities, and Service History.

---

### 🎨 ASK I (ASCII) Layout

```text
+-------------------------------------------------------------------------+
|  4. RELAXATION MATRIX (Years Added to Base Max)                         |
+-------------------------------------------------------------------------+
|                                                                         |
|  SOCIAL CATEGORY RELAXATIONS:                                           |
|  [ OBC: +3 ]  [ SC / ST: +5 ]  [ EWS: 0 ]                               |
|                                                                         |
+-------------------------------------------------------------------------+
|  PwBD INCLUSION MATRIX (Physical Disability)                            |
|  [ UR-PwBD: +10 ]   [ OBC-PwBD: +13 ]   [ SC/ST-PwBD: +15 ]             |
|                                                                         |
+-------------------------------------------------------------------------+
|  EX-SERVICEMEN (ESM) CALCULATION                                        |
|  [X] ESM RULES ACTIVE                                                   |
|      (Logic: Base_Max + Service_Duration + 3 Years Grace)               |
|                                                                         |
+-------------------------------------------------------------------------+
|  GOVERNMENT EMPLOYEE (LIGHT-TOUCH LOGIC)                                |
|  [X] SHOW CAUTION WARNING FOR GOVT. ASPIRANTS                           |
|      "Check your Specific Group (B/C/D) eligibility in notification."   |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 🧠 Logic & Discussion Points

#### **1. PwBD Tiers**
The PwBD section is not a single number; it's a **Matrix** because the relaxation amount frequently changes based on the candidate's *Social Category* (e.g., an SC candidate with PwBD receives more boost than a UR candidate with PwBD).

#### **2. ESM Calculation**
Ex-Servicemen rules are standardized based on Indian Govt. norms:
`Eligibility = (Current_Age - Service_Years - 3) <= Base_Max_Age`.

#### **3. The "Light-Touch" Govt. Caution**
Following discussion, we dropped the complex Group B/C/D input for candidates. Instead, if "Govt. Employee" is toggled, the engine **flags a concern** prompting the user to self-verify their group-specific criteria in the PDF.
