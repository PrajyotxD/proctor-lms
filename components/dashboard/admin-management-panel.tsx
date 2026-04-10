"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BookOpen, ShieldCheck, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { getFirebaseServices } from "@/lib/firebase/client";
import { Subject, UserProfile } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminManagementPanel() {
  const services = getFirebaseServices();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"teacher" | "student">("teacher");
  const [newUserRollNumber, setNewUserRollNumber] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserProfile["role"]>("student");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    if (!services) return;

    const unsubUsers = onSnapshot(collection(services.db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ ...(d.data() as Omit<UserProfile, "uid">), uid: d.id })));
    });

    const unsubSubjects = onSnapshot(collection(services.db, "subjects"), (snap) => {
      setSubjects(snap.docs.map((d) => ({ ...(d.data() as Omit<Subject, "id">), id: d.id })));
    });

    return () => {
      unsubUsers();
      unsubSubjects();
    };
  }, [services]);

  const selectedUser = useMemo(() => users.find((u) => u.uid === selectedUserId) ?? null, [users, selectedUserId]);

  async function createSubject() {
    if (!services || !newSubjectName.trim() || !newSubjectCode.trim()) {
      toast.error("Subject name and code are required");
      return;
    }

    await addDoc(collection(services.db, "subjects"), {
      name: newSubjectName.trim(),
      code: newSubjectCode.trim().toUpperCase(),
      teacherIds: [],
      createdAt: Date.now(),
    });

    setNewSubjectName("");
    setNewSubjectCode("");
    toast.success("Subject created");
  }

  async function createManagedUser() {
    if (!services) {
      toast.error("Firebase is not configured");
      return;
    }
    if (!newUserName.trim() || !newUserEmail.trim() || newUserPassword.length < 8) {
      toast.error("Name, email, and minimum 8-char password are required");
      return;
    }

    const current = services.auth.currentUser;
    if (!current) {
      toast.error("Please sign in as admin first");
      return;
    }

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${await current.getIdToken()}`,
        },
        body: JSON.stringify({
          fullName: newUserName.trim(),
          email: newUserEmail.trim(),
          password: newUserPassword,
          role: newUserRole,
          ...(newUserRole === "student" ? { rollNumber: newUserRollNumber.trim() } : {}),
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to create account");
      }

      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("teacher");
      setNewUserRollNumber("");
      toast.success("Account created in Firebase");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    }
  }

  async function assignRole() {
    if (!services || !selectedUser) {
      toast.error("Select a user first");
      return;
    }

    await updateDoc(doc(services.db, "users", selectedUser.uid), {
      role: selectedRole,
      updatedAt: Date.now(),
    });

    toast.success("Role updated");
  }

  async function mapSubject() {
    if (!services || !selectedUser || !selectedSubjectId) {
      toast.error("Select user and subject");
      return;
    }

    const subject = subjects.find((s) => s.id === selectedSubjectId);
    if (!subject) return;

    if (selectedUser.role === "teacher") {
      const nextTeacherIds = Array.from(new Set([...(subject.teacherIds ?? []), selectedUser.uid]));
      await updateDoc(doc(services.db, "subjects", subject.id), { teacherIds: nextTeacherIds });
      const nextSubjects = Array.from(new Set([...(selectedUser.teacherSubjectIds ?? []), subject.id]));
      await updateDoc(doc(services.db, "users", selectedUser.uid), { teacherSubjectIds: nextSubjects, updatedAt: Date.now() });
      toast.success("Teacher mapped to subject");
      return;
    }

    const nextSubjects = Array.from(new Set([...(selectedUser.studentSubjectIds ?? []), subject.id]));
    await updateDoc(doc(services.db, "users", selectedUser.uid), { studentSubjectIds: nextSubjects, updatedAt: Date.now() });
    toast.success("Student enrolled in subject");
  }

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <Card className="xl:col-span-2 border-slate-700/70 bg-[#0c1220] text-slate-100">
        <CardHeader><h3 className="flex items-center gap-2 text-lg font-semibold"><UserPlus size={16} />Create Teacher / Student Account</h3></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Full name" />
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="Email" type="email" />
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Temporary password" type="password" />
          <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as "teacher" | "student")} className="w-full rounded-xl border border-slate-600 bg-slate-900/65 px-3 py-2 text-sm text-slate-100">
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          {newUserRole === "student" && (
            <Input 
              className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" 
              value={newUserRollNumber} 
              onChange={(e) => setNewUserRollNumber(e.target.value)} 
              placeholder="Roll Number (optional)" 
            />
          )}
          <Button onClick={createManagedUser} className="md:col-span-2">Create account in Firebase</Button>
        </CardContent>
      </Card>

      <Card className="border-slate-700/70 bg-[#0c1220] text-slate-100">
        <CardHeader><h3 className="flex items-center gap-2 text-lg font-semibold"><BookOpen size={16} />Create Subject</h3></CardHeader>
        <CardContent className="space-y-3">
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="Subject name" />
          <Input className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400" value={newSubjectCode} onChange={(e) => setNewSubjectCode(e.target.value)} placeholder="Code (MATH101)" />
          <Button onClick={createSubject}>Create</Button>
        </CardContent>
      </Card>

      <Card className="border-slate-700/70 bg-[#0c1220] text-slate-100">
        <CardHeader><h3 className="flex items-center gap-2 text-lg font-semibold"><ShieldCheck size={16} />Role Assignment</h3></CardHeader>
        <CardContent className="space-y-3">
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-900/65 px-3 py-2 text-sm text-slate-100">
            <option value="">Select user</option>
            {users.map((user) => <option key={user.uid} value={user.uid}>{user.fullName} ({user.email})</option>)}
          </select>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserProfile["role"])} className="w-full rounded-xl border border-slate-600 bg-slate-900/65 px-3 py-2 text-sm text-slate-100">
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <Button variant="ghost" onClick={assignRole}>Update role</Button>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2 border-slate-700/70 bg-[#0c1220] text-slate-100">
        <CardHeader><h3 className="flex items-center gap-2 text-lg font-semibold"><Users size={16} />Subject Mapping</h3></CardHeader>
        <CardContent className="space-y-3">
          <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="w-full rounded-xl border border-slate-600 bg-slate-900/65 px-3 py-2 text-sm text-slate-100">
            <option value="">Select subject</option>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.code} - {subject.name}</option>)}
          </select>
          <Button variant="ghost" onClick={mapSubject}>Apply mapping</Button>
        </CardContent>
      </Card>
    </section>
  );
}
