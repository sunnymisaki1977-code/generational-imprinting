"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import liff, { Liff } from "@line/liff";

interface LiffContextType {
  liff: Liff | null;
  liffError: string | null;
  isReady: boolean;
  profile: any | null;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  liffError: null,
  isReady: false,
  profile: null,
});

export const useLiff = () => useContext(LiffContext);

export function LiffProvider({ children }: { children: ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      console.warn("NEXT_PUBLIC_LIFF_ID is not set.");
      setIsReady(true);
      return;
    }

    liff
      .init({ liffId })
      .then(async () => {
        setLiffObject(liff);
        
        if (liff.isLoggedIn()) {
          try {
            const userProfile = await liff.getProfile();
            setProfile(userProfile);
          } catch (error) {
            console.error("Failed to get LIFF profile", error);
          }
        }
        
        setIsReady(true);
      })
      .catch((err: Error) => {
        setLiffError(err.toString());
        setIsReady(true);
      });
  }, []);

  return (
    <LiffContext.Provider value={{ liff: liffObject, liffError, isReady, profile }}>
      {children}
    </LiffContext.Provider>
  );
}
