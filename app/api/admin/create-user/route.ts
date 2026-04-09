import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminServices } from "@/lib/firebase/admin";

const payloadSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["teacher", "student"]),
});

function getBearerToken(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export async function POST(req: NextRequest) {
  const services = getAdminServices();
  if (!services) {
    return NextResponse.json({ error: "Admin Firebase is not configured" }, { status: 500 });
  }

  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
  }

  const parsed = payloadSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const requester = await services.auth.verifyIdToken(token).catch(() => null);
  if (!requester) {
    return NextResponse.json({ error: "Invalid authorization token" }, { status: 401 });
  }

  const requesterDoc = await services.db.collection("users").doc(requester.uid).get();
  const requesterRole = requesterDoc.exists ? requesterDoc.data()?.role : null;
  if (requesterRole !== "admin") {
    return NextResponse.json({ error: "Only admins can create accounts" }, { status: 403 });
  }

  const { fullName, email, password, role } = parsed.data;

  try {
    const created = await services.auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    await services.auth.setCustomUserClaims(created.uid, { role });

    const now = Date.now();
    await services.db.collection("users").doc(created.uid).set({
      uid: created.uid,
      role,
      fullName,
      email,
      createdAt: now,
      updatedAt: now,
      ...(role === "teacher" ? { teacherSubjectIds: [] } : { studentSubjectIds: [] }),
    });

    return NextResponse.json({ uid: created.uid, email: created.email, role });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: string }).code === "string" &&
      (error as { code: string }).code === "auth/email-already-exists"
    ) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
