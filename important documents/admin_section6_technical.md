# Admin Section 6: Technical Specs (Blueprint & Fees)

This section defines the final operational layer of the recruitment post: the selection process flow and the financial barrier for application.

---

### 🎨 ASK I (ASCII) Final Layout

```text
+-------------------------------------------------------------------------+
|  6. TECHNICAL SPECS (Exam Blueprint & Application Fees)                 |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ EXAM BLUEPRINT ]                                                     |
|                                                                         |
|  PROCESS FLOW: [ Single Stage (Written/CBT) | Prelims & Mains ]         |
|                                                                         |
|  (Detailed Schema editor - Phase II)                                    |
|                                                                         |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ APPLICATION FEES (₹) ]                                                |
|                                                                         |
|  (UR)  [ 3000 ]    (OBC) [ 3000 ]    (SC/ST) [ 2400 ]                   |
|  (EWS) [ 2400 ]    (PwBD) [ 0    ]                                      |
|                                                                         |
+-------------------------------------------------------------------------+
|  [ PREVIEW STUDENT CARD ]  <-- (Global HUD Toggle)                      |
+-------------------------------------------------------------------------+
```

---

### 🧠 Logic & Discussion Points

#### **1. Exam Blueprint (Process Selection)**
Determines the complexity of the recruitment stages.
- **Single Stage**: Direct CBT/Written exam (Standard for most posts).
- **Two-Stage**: Prelims used as a screening gate, followed by Mains for final merit (Typical for massive notifications like AIIMS NORCET).

#### **2. Application Fees (Category-wise Barrier)**
Standardizes the pricing structure across social castes.
- **UR / OBC**: Usually the highest tier.
- **SC / ST / EWS**: Typically discounted.
- **PwBD (Persons with Benchmark Disabilities)**: Often exempted (₹0) from fees.

#### **3. High-Density Consolidation**
By bringing these two technical configurations into one view, we ensure the administrator can finalize the "Cost and Method" of recruitment in a single cockpit session, avoiding unnecessary navigation.
