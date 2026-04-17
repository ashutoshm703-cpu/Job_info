# Design Spec: Job Tracking Flow

**Document type:** Design Specification
**Product:** NPrep JOBS (Student Job Portal)
**Scope:** FR 4.6.5 (Track Button), FR 4.6.6 (First-Time Nudge), Notification Permission, Untrack
**Status:** Approved
**Date:** 16 April 2026

---

## Overview

This spec defines the complete user journey when a student tracks a government nursing exam on the NPrep JOBS feed. Tracking is the primary engagement action — it turns a passive browser into an active candidate by opting them into milestone updates for that exam.

---

## 1. Card Default State (Untracked)

Every untracked job card shows two elements at the bottom:

### 1.1 Avatar Stack + Tracking Count

- **Display:** 3 avatar circles (P, R, S initials) + text: "You + {count} preparing"
- **Count formula:** `admin_baseline + real_student_tracks`
  - Admin sets a baseline number per job (e.g., 1,000) in the admin panel
  - Every real student track adds +1
  - Example: admin baseline 1,000 + 234 real tracks = "You + 1,234 preparing"
- **Purpose:** Social proof nudge to drive Track Now action
- **Visibility:** Only on untracked cards. Disappears when tracked (replaced by timeline).

### 1.2 Track Now Button

- **Style:** Midnight Blue gradient, white text, 11px bold, rounded-xl
- **Icon:** Bookmark icon (not bell)
- **Label:** "Track Now"
- **Position:** Right-aligned, same row as avatar stack

---

## 2. First-Time Nudge (FR 4.6.6)

### When shown

- Student's first visit to the jobs feed
- Zero tracked jobs in localStorage

### What it shows

- Appears on the **topmost card only**
- Copy: "Start tracking exams to get live updates on registration, admit cards, and results."
- Style: Subtle text below the card's salary/vacancy row, above the avatar stack

### When it disappears

- Student tracks their first job, OR
- Student dismisses it (tap X or scroll past)
- Never shows again after first track (persisted in localStorage)

---

## 3. Tracking Animation (Phases)

### Phase 1: Button Transform (0–300ms)

- "Track Now" button transforms to "Tracked!" with accent gradient glow
- Bookmark icon replaced by CheckCircle2 icon
- Button scales up briefly (1.08x) with spring animation
- Avatar stack begins fading out

### Phase 2: Confirmation Message (300–1300ms)

- Avatar stack + Track Now button fully gone (height collapses)
- Confirmation message fades in on the card, in the same area:

```
[Ice Blue background card, 12px radius]
You're now tracking this exam.
We'll notify you about registration, admit cards, and results.
```

- Style: Ice Blue (#E5F0F8) background, Midnight Blue text (11px semibold for title, 10px regular for subtitle)
- Duration: Visible for ~1 second

### Phase 3: Notification Permission Check (at 1300ms)

- App checks: are push notifications enabled for NPrep JOBS?
- **If YES:** Skip to Phase 4 immediately
- **If NO:** Show notification nudge below the confirmation:

```
[Amber background, 10px text]
Turn on notifications so you don't miss registration deadlines and results.
[Enable Notifications] → opens system notification settings
```

- This nudge shows a maximum of 2 times total across all tracks. After that, never again.
- If the student enables notifications at any point (even outside the app), the nudge never shows again — the counter stops.
- If the student dismisses it, proceed to Phase 4.

### Phase 4: Timeline Reveal (1300–1700ms)

- Confirmation message fades out
- Timeline slides in from below with staggered animation (each milestone 80ms delay)
- Apply Now CTA appears below timeline (if registration is open)
- Bookmark badge animates onto the org icon (scale from 0 to 1)

### Total Animation Duration

~1.7 seconds from tap to final tracked state.

---

## 4. Tracked Card State (Persistent)

### Visual Changes from Default

| Element | Default (untracked) | Tracked |
|---------|-------------------|---------|
| Org icon | Plain | Bookmark badge overlay (top-right, accent gradient, 20x20px) |
| Top-right | Chevron (›) | Chevron removed |
| Bottom section | Avatar stack + Track Now | Timeline + Apply Now CTA |
| Card background | Standard gradient | Same (no change) |

### 4.1 Bookmark Badge

- Position: Absolute, top-right of org icon (-4px, -4px)
- Size: 20x20px, rounded-md (6px)
- Style: Accent gradient background, white bookmark icon (9px), white ring-2 border
- Animation: Scale from 0 to 1 with spring (stiffness 400, damping 15)

### 4.2 Mini Timeline

- Horizontally scrollable row of milestone pills
- Data source: `job.jobTracker` array — populated from admin-entered important dates
- Each milestone has 3 possible states:

| State | Visual | Icon |
|-------|--------|------|
| Completed | 60% opacity, small (20px circle), green bg | CheckCircle2 (11px, white) |
| Current | Full opacity, larger (28px circle), accent gradient, subtle glow shadow | CircleDot (14px, white) |
| Upcoming | 35% opacity, small (20px circle), slate-200 bg | Circle (11px, muted) |

- Current milestone shows days remaining: "14d left" in accent color (or "Xd left" in error color if <= 5 days)
- Scroll snaps to items horizontally

### 4.3 Apply Now CTA

- **When shown:** `job.registrationOpen === true`
- **When hidden:** Registration not yet open, or registration closed
- **Normal style:** Navy text on navy/5 background, rounded-xl
- **Urgent style (<=5 days left):** Navy gradient background, white text, pulse animation
- **Label:** "Apply Now" (normal) or "Apply Now — Xd left" (urgent)
- **Tap behavior:** Opens `job.applyUrl` in external browser. Does NOT navigate within the app.

---

## 5. Untrack Flow

### Where it lives

Untrack is only available inside the **Job Detail page** (`/job/:id`). It is intentionally not on the feed card.

**Rationale:** Tracking is a low-effort, high-value action (one tap = updates forever). Untracking should require slightly more effort to prevent accidental untracks. This is good friction.

### How it works

1. Student taps a tracked card in the feed → navigates to Job Detail page
2. On the detail page, a track/untrack toggle is visible (bookmark icon, filled state)
3. Student taps the untrack button
4. Confirmation: "Stop tracking [Exam Name]?" with Cancel / Stop Tracking buttons
5. On confirm: card reverts to default state (avatar stack + Track Now returns)
6. Student stays on the detail page — back button returns to feed

### What changes on untrack

- Bookmark badge removed from org icon
- Timeline and Apply Now CTA removed from card
- Avatar stack and Track Now button restored
- Tracking count decrements by 1
- "Tracked" pill count decrements by 1 (if count reaches 0, pill hides)
- Push notifications for this exam are unsubscribed

---

## 6. Notification System

### What students opt into when tracking

Every tracked exam subscribes the student to push notifications for these events:

| Event | When it fires | Notification copy |
|-------|--------------|-------------------|
| Registration opens | Admin-entered date arrives | "[Exam] registration is now open. Apply before [deadline]." |
| Registration closing soon | 3 days before deadline | "[Exam] registration closes in 3 days. Don't miss it." |
| Admit card released | Admin marks milestone | "Your [Exam] admit card is available. Download now." |
| Exam date reminder | 1 day before exam | "[Exam] is tomorrow. Check your admit card and center details." |
| Result declared | Admin marks milestone | "[Exam] results are out. Check your result now." |

### Notification channel

- **Primary:** Push notifications (FCM / APNs)
- **No in-app notification inbox** — the lifecycle badges and timeline on tracked cards already communicate status changes. A separate inbox would be redundant.

### Permission handling

- On first track: check if push notifications are enabled
- If disabled: show gentle nudge (max 2 times across all tracks)
- Never block the tracking action — track succeeds regardless of notification permission
- Students can enable notifications later from system settings

---

## 7. Data Model Additions

### Tracking Count (per job)

```json
{
  "admin_baseline_count": 1000,
  "real_track_count": 234,
  "display_count": 1234
}
```

- `display_count` = `admin_baseline_count` + `real_track_count`
- Admin sets baseline in admin panel per job
- `real_track_count` increments/decrements with student tracks/untracks

### Student Tracked Jobs (localStorage for prototype)

```json
{
  "trackedJobs": ["job_1", "job_3", "job_7"],
  "firstTrackDone": true,
  "notificationNudgeCount": 1
}
```

### Notification Subscription (future backend)

```json
{
  "student_id": "...",
  "job_id": "...",
  "subscribed_at": "2026-04-16T10:30:00Z",
  "events": ["registration_open", "closing_soon", "admit_card", "exam_reminder", "result"]
}
```

---

## 8. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Student tracks then immediately untracks | Count returns to previous value. No notification sent. |
| Student tracks a job with registration already closed | Tracking works. Timeline shows "Closed" milestone as current. No Apply Now CTA. Still gets admit card / result notifications. |
| Student tracks all jobs | All cards show tracked state. Feed becomes a timeline dashboard. |
| Student clears localStorage | All tracking state lost. Cards revert to default. First-time nudge reappears. |
| Student tracks a job in "Past" pill | Track button is disabled in Past tab (FR 4.7). No tracking possible. |
| Push notification fails silently | No fallback. Student sees lifecycle changes on the card timeline next time they open the app. |
| Admin deletes a tracked job | Job disappears. Student sees no notification about deletion. Tracked count decrements. |
| Admin changes timeline dates | Timeline on tracked cards updates in real-time. If a date moves forward, the "Xd left" countdown adjusts. |

---

## 9. What This Spec Does NOT Cover

- Job Detail page layout and specs (separate PRD)
- Notification backend architecture (FCM integration, delivery guarantees)
- Offline behavior (what happens with no internet)
- Analytics events (track impressions, conversion rates)

---

*End of spec.*
