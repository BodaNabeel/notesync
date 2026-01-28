import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function SignUp({
  documentName,
}: {
  documentName: string | undefined;
}) {
  const [triggerLogin, setTriggerLogin] = useState<boolean>(false);
  const handleSignIn = async () => {
    setTriggerLogin(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: documentName ? `/note/${documentName}` : `/note`,
    });
  };
  return (
    <main className="flex gap-y-4 flex-col h-svh w-full items-center justify-center">
      <h1 className="text-xl font-semibold">Welcome to NoteSync </h1>

      <Button
        size={"lg"}
        disabled={triggerLogin}
        className="text-lg  py-6 px-10 flex w-2xs "
        onClick={handleSignIn}
      >
        {triggerLogin ? (
          <>
            <LoaderCircle className="animate-spin size-6 " />
            <p>signing you in......</p>
          </>
        ) : (
          <p>Continue with Google</p>
        )}
      </Button>
    </main>
  );
}
