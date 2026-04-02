# Admin Section 2: Job Type & Jurisdiction (The Three Locks)

This section defines the "Legal Territory" of the recruitment post. It establishes the three critical locks—Domicile, Registration, and Language—that determine a candidate's basic right to apply.

---

### 🎨 ASK I (ASCII) Final Layout

```text
+-------------------------------------------------------------------------+
|  2. JOB TYPE & JURISDICTION (Admin Config)                              |
+-------------------------------------------------------------------------+
|                                                                         |
|  RECRUITMENT TYPE: (X) NATIONAL / CENTRAL JOB   ( ) STATE-SPECIFIC JOB  |
|                                                                         |
+-------------------------------------------------------------------------+
|  (VISIBLE ONLY IF STATE-SPECIFIC JOB IS SELECTED)                       |
|                                                                         |
|  TARGET STATE:     [ Select State (e.g., West Bengal / Maharashtra) ]   |
|                                                                         |
|  LOCK I: DOMICILE (Residency Status)                                    |
|   (X) OPEN INDIA (Anyone can apply)                                     |
|   ( ) STATE RESIDENTS ONLY (Mandatory Domicile Certificate)             |
|                                                                         |
|  LOCK II: REGISTRATION (Licensing Board)                                |
|   ( ) ANY STATE COUNCIL / INC Accepted                                  |
|   (X) MANDATORY HOST STATE BOARD (Select Board)                         |
|       [ Select Board (e.g. WBNC / BNRC / MNC) ]                         |
|                                                                         |
|  LOCK III: LANGUAGE (Communication Skill)                               |
|   ( ) NOT REQUIRED (English/Hindi only)                                 |
|   (X) MANDATORY REGIONAL LANGUAGE Proficiency                           |
|       [ Language: BENGALI / MARATHI / TAMIL / etc. ]                    |
|                                                                         |
+-------------------------------------------------------------------------+
|  [ PREVIEW STUDENT CARD ]  <-- (Global HUD Toggle)                      |
+-------------------------------------------------------------------------+
```

---

### 🧠 Logic & Discussion Points (The Iron Triangle)

#### **1. Domicile (Who you are)**
Determines if residency in the target state is a hard prerequisite.
- **National Scope**: Anyone in India can apply (Typical for AIIMS/ESIC).
- **Restricted Scope**: Only residents with a valid Sthayi Niwas Patra (Domicile) are permitted.

#### **2. Registration (Where you are licensed)**
Crucial for state-level hiring. Many states (like WB, UP, Bihar) require you to be registered with *their* specific council at the time of application. 
- *Note*: If "Host State Board" is selected, the engine will automatically block candidates registered in other states unless they have a transfer slip.

#### **3. Language (How you talk)**
Essential for patient care in rural or state-specific settings. 
- *Logic*: Selecting a Mandatory Regional language adds a check for the candidate: "Do you have 10th/12th proof of [Language] proficiency?"
- *Downstream*: This reflects in the **Student Card** as a specific "Language Requirement" badge.
