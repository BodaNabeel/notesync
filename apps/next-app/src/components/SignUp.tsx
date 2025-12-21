"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";

export default function SignUp() {
  const searchParams = useSearchParams();
  const documentName = searchParams.get("documentName");
  console.log(documentName);
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: documentName ? `/note/${documentName}` : `/note`,
    });
  };
  return (
    <main className="flex gap-y-4 flex-col h-svh w-full items-center justify-center">
      <h1 className="text-xl font-semibold">Welcome to collab notes</h1>
      <Button
        className="text-lg  py-6 px-10 flex space-x-5 "
        onClick={handleSignIn}
      >
        {/* <Image
          width={20}
          height={20}
          src="/google-icon.svg"
          alt="google-icon"
        /> */}
        <p>Continue with Google</p>
      </Button>
    </main>
  );
}
