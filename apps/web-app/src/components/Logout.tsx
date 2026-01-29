import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Logout() {
  const navigate = useNavigate();
  const [triggerLogout, setTriggerLogout] = useState<boolean>(false);
  const handleClick = async () => {
    setTriggerLogout(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({
            to: "/",
          });
        },
      },
    });
  };
  return (
    <Button disabled={triggerLogout} variant={"outline"} onClick={handleClick}>
      {triggerLogout ? (
        <>
          <LoaderCircle className="animate-spin" />
          <p>Logging out....</p>
        </>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
