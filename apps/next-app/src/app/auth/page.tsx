import SignUp from "@/components/SignUp";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function AuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/", RedirectType.replace);
  }
  return <SignUp />;
}
