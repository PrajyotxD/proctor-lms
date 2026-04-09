export type Role = "admin" | "teacher" | "student";

export type ProctorIncidentType =
  | "tab_hidden"
  | "window_blur"
  | "copy_attempt"
  | "paste_attempt"
  | "context_menu"
  | "missing_face"
  | "multiple_faces"
  | "gaze_away"
  | "orientation_suspicious"
  | "fullscreen_exit"
  | "manual_teacher_flag";

export interface UserProfile {
  uid: string;
  role: Role;
  fullName: string;
  email: string;
  rollNumber?: string;
  teacherSubjectIds?: string[];
  studentSubjectIds?: string[];
  photoUrl?: string;
  verificationPhotoPath?: string;
  verifiedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherIds: string[];
  createdAt: number;
}

export interface MCQQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  startsAt: number;
  endsAt: number;
  durationMinutes: number;
  negativeMarking: number;
  autoSubmitViolationThreshold: number;
  requireFullscreen: boolean;
  webcamRequired: boolean;
  questions: MCQQuestion[];
  createdBy: string;
  createdAt: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  startedAt: number;
  submittedAt?: number;
  status: "in_progress" | "submitted" | "auto_submitted" | "paused";
  answers: Record<string, number>;
  score?: number;
  violationCount: number;
  proctoringScore: number;
  warningMessage?: string;
  graderFeedbackText?: string;
  graderFeedbackAudioPath?: string;
  gradedBy?: string;
  gradedAt?: number;
}

export interface ProctorIncident {
  id: string;
  examId: string;
  attemptId: string;
  studentId: string;
  type: ProctorIncidentType;
  severity: "low" | "medium" | "high";
  createdAt: number;
  meta?: Record<string, string | number | boolean | null>;
  evidencePath?: string;
}

export interface AttemptControl {
  id: string;
  attemptId: string;
  frozen: boolean;
  message?: string;
  updatedBy: string;
  updatedAt: number;
}
