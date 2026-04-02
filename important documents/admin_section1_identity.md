# Admin Section 1: Identity & Branding Hub

This section establishes the "First Impression" of the recruitment engine. It handles official branding, titles, and salary disclosures, ensuring the recruitment post looks professional and trustworthy.

---

### 🎨 ASK I (ASCII) Layout

```text
+-------------------------------------------------------------------------+
|  1. IDENTITY & BRANDING HUB (Admin Config)                              |
+-------------------------------------------------------------------------+
|                                                                         |
|  EXAM TITLE:       [ AIIMS NORCET 8.0 - 2025          ] (Edit Icon)     |
|                                                                         |
|  NOTIF. STATUS:    ( ) Detailed   (X) Short / Tentative                 |
|                                                                         |
|  THUMBNAIL ICON:   ( ) URL Link   (X) Upload File                       |
|                    [ aiims_logo.png                   ] [ PREVIEW ICON ]|
|                                                                         |
|  SALARY RANGE:     [ 12-13 Lakhs per Annum            ]                 |
|                                                                         |
|  NOTIF. SOURCE:    (X) URL Link   ( ) Upload File                       |
|                    [ https://aiimsexams.ac.in/...     ]                 |
|                                                                         |
+-------------------------------------------------------------------------+
|  [!] LIVE STUDENT CARD PREVIEW (Real-time HUD)                          |
|  +-----------------------------------------------------+                |
|  | [LOGO] AIIMS NORCET 8.0 - 2025        [ UPCOMING ]  |                |
|  |        Salary: 12-13 Lakhs per Annum  | [ NOTIF ]   |                |
|  +-----------------------------------------------------+                |
+-------------------------------------------------------------------------+
```

---

### 🧠 Logic & Discussion Points (Branding Excellence)

#### **1. The "First Impression" Mandate & Notification Status**
Section 1 is strictly for **Visual Identity**. By removing technical classification logic, we ensure the administrator focus on the "Look and Feel". 
- **Notification Status:** This new toggle defines if the job is a "Short/Indicative" notice or a detailed official PDF. Switching to "Short" will append an "UPCOMING" badge to the student card.

#### **2. Dual-Mode Uploads**
The Admin UI provides both **URL Link** and **Binary File Upload** for:
- **Thumbnail Icon**: Key for professional appearance in student feeds.
- **Official Notification**: Critical for legal reference. 

#### **3. Magnetic Copy (Salary Range)**
Following user feedback, we use the descriptive **Salary Range** (e.g., "12-13 Lakhs per Annum") instead of rigid grades. This provides immediate value clarity to the candidate.

#### **4. Live Student Card HUD**
A non-interactive preview element that shows exactly how the "Exam Tile" will appear in the student's dashboard. Any change to the Title, Logo, or Salary in this section reflects here instantly.

