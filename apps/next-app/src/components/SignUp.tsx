import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function SignUp({
  documentName,
}: {
  documentName: string | undefined;
}) {
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
        <p>Continue with Google</p>
      </Button>
    </main>
  );
}
