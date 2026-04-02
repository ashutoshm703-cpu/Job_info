# Admin Section 4: Scalable Age Matrix & Marital Gates

This section handles the mathematical "Temporal Anchor" for eligibility. It transitions from simple age limits to a granular matrix capable of handling military and gender-specific requirements.

---

### 🎨 ASK I (ASCII) Layout

```text
+-------------------------------------------------------------------------+
|  4. ELIGIBILITY MATRIX (Temporal Anchor & Social Gates)                 |
+-------------------------------------------------------------------------+
|                                                                         |
|  CUT-OFF DATE (AS ON): [ 2025 - 01- 01 ] (The Anchor)                   |
|                        *Can be [TBA] for Tentative Notifications*       |
+-------------------------------------------------------------------------+
|  BASE AGE BOUNDARIES (INDEPENDENT GENDER MATRIX)                        |
|                                                                         |
|  MALE CANDIDATES:     MIN [ 18 ]    MAX [ 35 ]                          |
|  FEMALE CANDIDATES:   MIN [ 18 ]    MAX [ 35 ] (Independent Min/Max)      |
|                      (Defaults to Male Min if not specified)            |
|                                                                         |
+-------------------------------------------------------------------------+
|  SOCIAL & MARITAL GATE (Conditional Logic)                              |
|                                                                         |
|  MARITAL RESTRICTION: ( ) DISABLED  (X) ACTIVE (e.g. MNS-Style)         |
|                                                                         |
|  (VISIBLE ONLY IF ACTIVE)                                               |
|  ALLOWED STATUSES: [ ] UNMARRIED  [ ] DIVORCED  [ ] WIDOW   [ ] MARRIED  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 🧠 Logic & Discussion Points

#### **1. The Independent Matrix**
The engine now supports **Independent Boundaries for Different Genders** within the same recruitment. 
- **Min Inheritance:** By default, the Female Minimum inherits from the Global Minimum unless a specific Female Min is provided.
- **Bonus Caps:** Female candidates often have 5-year higher caps in specific state staff-nurse recruitments. This is now fully configurable.

#### **2. Marital Status Gating**
Inspired by **Military Nursing Services (MNS)** research, this gate defines which social statuses are legally eligible. This is a critical filter for military and specific all-women recruitment drives.

#### **3. The Cut-off Anchor & Tentative State**
The `as_on_date` is the absolute reference for decimal age calculation (`t - b`). Changes to this date automatically shift the result for all candidates.
*Note:* If the Master Job is in "Tentative/Short" status, the Admin can set this to `[T B A]`, and the Eligibility Engine will perform a standard check without forcing a hard failure on borderline age calculations since the final date is unknown.
