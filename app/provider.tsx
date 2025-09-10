// /app/providers.tsx
"use client"; // Must be a client component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AppProviders({
  children,
}: {
  children: ReactNode;
  session?: any;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
