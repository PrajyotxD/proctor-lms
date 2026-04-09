"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebase/client";
import type { UserProfile } from "@/lib/types";

type AuthContextValue = {
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  envReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => getFirebaseServices(), []);
  const [loading, setLoading] = useState(Boolean(services));
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!services) {
      return;
    }

    const unsub = onAuthStateChanged(services.auth, async (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(services.db, "users", authUser.uid));
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      setLoading(false);
    });

    return () => unsub();
  }, [services]);

  async function signIn(email: string, password: string) {
    if (!services) {
      throw new Error("Firebase env is not configured");
    }

    await signInWithEmailAndPassword(services.auth, email, password);
  }

  async function signOutUser() {
    if (!services) {
      return;
    }

    await signOut(services.auth);
  }

  const value: AuthContextValue = {
    loading,
    user,
    profile,
    envReady: Boolean(services),
    signIn,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
