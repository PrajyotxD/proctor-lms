#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function loadEnvFromDotEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }
  return value;
}

async function main() {
  loadEnvFromDotEnvLocal();

  const projectId = requireEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const email = process.env.BOOTSTRAP_EMAIL || "prajyot@proctor.com";
  const password = process.env.BOOTSTRAP_PASSWORD || "prajyot123";
  const fullName = process.env.BOOTSTRAP_FULL_NAME || "Prajyot Admin";
  const role = process.env.BOOTSTRAP_ROLE || "admin";
  const rollNumber = process.env.BOOTSTRAP_ROLL_NUMBER || "prajyotxD";

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  }

  const auth = getAuth();
  const db = getFirestore();

  let user;
  try {
    user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password, displayName: fullName });
    console.log(`Updated existing auth user: ${email} (${user.uid})`);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "auth/user-not-found") {
      user = await auth.createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: true,
      });
      console.log(`Created auth user: ${email} (${user.uid})`);
    } else {
      throw error;
    }
  }

  await auth.setCustomUserClaims(user.uid, { role });
  console.log(`Set custom claim role=${role} for ${user.uid}`);

  const now = Date.now();
  await db.collection("users").doc(user.uid).set(
    {
      uid: user.uid,
      email,
      fullName,
      role,
      createdAt: now,
      updatedAt: now,
      teacherSubjectIds: [],
      studentSubjectIds: [],
      ...(role === "student" ? { rollNumber } : {}),
    },
    { merge: true },
  );

  console.log(`Upserted Firestore users/${user.uid}`);
  console.log("Bootstrap complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

