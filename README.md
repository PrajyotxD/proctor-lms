# ProctorAI LMS (Next.js + Firebase)

Production-oriented scaffold for a cross-platform LMS with realtime proctoring.

## Stack
- Next.js 16 (App Router)
- React 19
- Firebase (Auth, Firestore, Storage)
- Zod + React Hook Form
- Recharts
- TensorFlow.js + blazeface
- Tesseract.js (scratchpad OCR)

## Setup
1. Copy `.env.example` to `.env.local` and fill Firebase values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId).
2. Create Firebase Authentication users and matching `users/{uid}` documents with `role` (`admin|teacher|student`).
3. Run:

```bash
npm install
npm run dev
```

## Data Model (Core Collections)
- `users`
- `subjects`
- `exams`
- `attempts`
- `incidents`
- `attemptControls`
- `verifications`

## Key Routes
- `/signin`
- `/dashboard`
- `/dashboard/student`
- `/dashboard/teacher`
- `/dashboard/admin`
- `/exam/[examId]`

## Student Verification
- Students must register roll number and capture selfie in dashboard verification card.
- Verification metadata stored in `verifications/{uid}` and mirrored in `users/{uid}`.
- Verification selfie stored at `verification/{uid}/...` in Storage.

## Proctoring Logic Included
- Visibility + blur monitoring
- Copy/paste/context menu interception
- Mobile orientation anomaly detection
- AI face checks (missing face, multiple faces)
- Gaze-away signal based on prolonged hidden state
- Incident cooldown guard to reduce duplicate alerts
- Teacher remote freeze/warning via `attemptControls`
- Evidence capture:
  - Desktop: short screen recording clip on incident (when supported)
  - Mobile: webcam frame snapshot fallback

## Student Wow Features
- Holographic HUD (simulated focus + heart rate)
- AI Study Buddy (technical/time-management only)
- Digital Scratchpad with OCR export
- Dynamic exam risk theme (calm -> alert)

## Teacher Features
- Live Gaze Heatmap view
- Matrix mode highlighting high-risk attempts
- AI cheating prediction panel (risk heuristics)
- Manual grading panel with score override + text feedback + audio upload
- Realtime incident log and one-click freeze/warn

## Security
- Firestore rules in `firestore.rules`
- Storage rules in `storage.rules`
- Role should be assigned in custom claims for strict rule evaluation.
