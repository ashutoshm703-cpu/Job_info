# Admin Section 3: Recruitment Timeline (Milestones)

This section establishes the chronological schedule for the entire recruitment process. These dates are the "Temporal Anchor" for all candidate notifications.

---

### 🎨 ASK I (ASCII) Layout

```text
+-------------------------------------------------------------------------+
|  2. RECRUITMENT TIMELINE (Event Milestones)                             |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ SORT ]  [ EVENT NAME ]     [ OFFICIAL DATE ]  [ ACTIONS / RESOURCES ]  |
|  [: : : ]  Application Start  [ 2025-01-10 ]     [+ Action] [+ Video] [x]|
|  [: : : ]  Reg. Last Date     [ 2025-02-10 ](T)  [ Ready  ] [+ Video] [x]|
|  [: : : ]  Written Exam (CBT) [   TBA    ](T)    [+ Action] [+ Video] [x]|
|                                                                         |
+-------------------------------------------------------------------------+
|  (+) ADD NEW CUSTOM MILESTONE (e.g. Result / Skill Test)                |
+-------------------------------------------------------------------------+
|                                                                         |
|  [!] ATOMIC ACTION POP-OVER (When [+ Action] clicked)                   |
|      CTA Text: [ Apply Now ]  URL: [ https://portal.com/login ]         |
|      *Rule: URL is Mandatory if CTA Text is provided.*                  |
|                                                                         |
|  [!] VIDEO EXPLAINER ATTACHMENT (When [+ Video] clicked)                |
|      Video Title: [ Strategy ]  URL: [ https://youtube... ]             |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 🧠 Logic & Discussion Points

#### **1. Chronological Sorting**
Individual milestones can be reordered via a "Drag-Handle" (`:::`) to reflect the actual recruitment sequence.

#### **2. Atomic Action (Coupled CTA & URL)**
Each milestone can have a **Primary Call-To-Action** (e.g., "Download Admit Card"). 
*   **Logic Constraint:** To prevent broken UX, the **Button Text** and **Action URL** are managed as a single atomic unit. If text is provided, a URL must be attached.
*   **Opt-in:** The Primary CTA is strictly **Optional**. If left blank, no button will be rendered.
*   **Tentative Indicator:** If an event is marked "Tentative," the popover suggests `e.g. NOTIFY ME` as a placeholder, encouraging users to sign up for alerts.

#### **3. Video Explainer Resources**
Admin can attach "Prep-Videos" or "How-to-Apply" guides directly to specific milestones (e.g., attaching a "CBT Strategy" video to the Written Exam date).

#### **4. Granular Tentative (TBA) Support**
Dates are no longer strictly clamped to `YYYY-MM-DD` requirements. Admins can toggle `[(X) Tentative]` explicitly for *each individual event*. If an event is tentative, the admin can either **provide an expected date** (e.g., "15-Aug but subject to change") or **leave it entirely blank** (TBA). This ensures maximum flexibility for "Short Notifications".
