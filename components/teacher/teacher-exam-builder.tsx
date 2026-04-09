"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "sonner";
import { getFirebaseServices } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { now } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const questionSchema = z.object({
  prompt: z.string().min(5),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctOptionIndex: z.number().int().min(0).max(3),
  marks: z.number().min(1),
});

const formSchema = z.object({
  subjectId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(5),
  startsAt: z.string().min(1),
  durationMinutes: z.number().min(5),
  negativeMarking: z.number().min(0),
  autoSubmitViolationThreshold: z.number().int().min(1).max(25),
  requireFullscreen: z.boolean(),
  webcamRequired: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;
type QuestionData = z.infer<typeof questionSchema>;

export function TeacherExamBuilder() {
  const services = getFirebaseServices();
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  const examForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      title: "",
      description: "",
      startsAt: "",
      durationMinutes: 60,
      negativeMarking: 0,
      autoSubmitViolationThreshold: 5,
      requireFullscreen: true,
      webcamRequired: true,
    },
  });

  const questionForm = useForm<QuestionData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      prompt: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOptionIndex: 0,
      marks: 1,
    },
  });

  function addQuestion(values: QuestionData) {
    setQuestions((prev) => [...prev, values]);
    questionForm.reset();
  }

  async function createExam(values: FormData) {
    if (!services || !profile) {
      toast.error("Firebase/auth not ready");
      return;
    }

    if (!questions.length) {
      toast.error("Add at least one question");
      return;
    }

    const startsAt = new Date(values.startsAt).getTime();
    const endsAt = startsAt + values.durationMinutes * 60_000;

    await addDoc(collection(services.db, "exams"), {
      subjectId: values.subjectId,
      title: values.title,
      description: values.description,
      startsAt,
      endsAt,
      durationMinutes: values.durationMinutes,
      negativeMarking: values.negativeMarking,
      autoSubmitViolationThreshold: values.autoSubmitViolationThreshold,
      requireFullscreen: values.requireFullscreen,
      webcamRequired: values.webcamRequired,
      questions: questions.map((q, index) => ({
        id: `q${index + 1}`,
        prompt: q.prompt,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctOptionIndex: q.correctOptionIndex,
        marks: q.marks,
      })),
      createdBy: profile.uid,
      createdAt: now(),
    });

    toast.success("Exam created");
    setQuestions([]);
    examForm.reset();
  }

  return (
    <Card className="border-slate-700/75 bg-[#0b1220] text-slate-100">
      <CardContent className="space-y-4 p-5">
        <h3 className="text-xl font-semibold">Create Exam</h3>

        <form onSubmit={examForm.handleSubmit(createExam)} className="space-y-3">
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" placeholder="Subject ID" {...examForm.register("subjectId")} />
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" placeholder="Title" {...examForm.register("title")} />
          <Textarea className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" placeholder="Description" {...examForm.register("description")} />
          <Input type="datetime-local" className="border-slate-600 bg-slate-900/65 text-slate-100" {...examForm.register("startsAt")} />

          <div className="grid gap-2 sm:grid-cols-3">
            <Input type="number" placeholder="Duration (min)" className="border-slate-600 bg-slate-900/65 text-slate-100" {...examForm.register("durationMinutes", { valueAsNumber: true })} />
            <Input type="number" step="0.25" placeholder="Negative marking" className="border-slate-600 bg-slate-900/65 text-slate-100" {...examForm.register("negativeMarking", { valueAsNumber: true })} />
            <Input type="number" placeholder="Violation threshold" className="border-slate-600 bg-slate-900/65 text-slate-100" {...examForm.register("autoSubmitViolationThreshold", { valueAsNumber: true })} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...examForm.register("requireFullscreen")} /> Fullscreen required
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...examForm.register("webcamRequired")} /> Webcam required
            </label>
          </div>

          <div className="rounded-xl border border-slate-600 bg-slate-900/50 p-3">
            <p className="mb-2 font-medium">Add Question</p>
            <div className="space-y-2">
              <Input className="border-slate-600 bg-slate-950/60 text-slate-100 placeholder:text-slate-400" placeholder="Question prompt" {...questionForm.register("prompt")} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input className="border-slate-600 bg-slate-950/60 text-slate-100 placeholder:text-slate-400" placeholder="Option A" {...questionForm.register("optionA")} />
                <Input className="border-slate-600 bg-slate-950/60 text-slate-100 placeholder:text-slate-400" placeholder="Option B" {...questionForm.register("optionB")} />
                <Input className="border-slate-600 bg-slate-950/60 text-slate-100 placeholder:text-slate-400" placeholder="Option C" {...questionForm.register("optionC")} />
                <Input className="border-slate-600 bg-slate-950/60 text-slate-100 placeholder:text-slate-400" placeholder="Option D" {...questionForm.register("optionD")} />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input type="number" min={0} max={3} placeholder="Correct option index (0-3)" className="border-slate-600 bg-slate-950/60 text-slate-100" {...questionForm.register("correctOptionIndex", { valueAsNumber: true })} />
                <Input type="number" min={1} placeholder="Marks" className="border-slate-600 bg-slate-950/60 text-slate-100" {...questionForm.register("marks", { valueAsNumber: true })} />
              </div>
              <Button type="button" variant="ghost" onClick={questionForm.handleSubmit(addQuestion)}>Add question</Button>
              <p className="text-xs text-slate-400">Questions added: {questions.length}</p>
            </div>
          </div>

          <Button type="submit">Publish Exam</Button>
        </form>
      </CardContent>
    </Card>
  );
}
