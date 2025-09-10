import Homepage from "@/components/Homepage";

import { redirect, useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  redirect("/homepage");
}
