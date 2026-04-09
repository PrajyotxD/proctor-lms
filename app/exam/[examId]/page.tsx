import { ExamConsole } from "@/components/student/exam-console";

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  return <ExamConsole examId={examId} />;
}
