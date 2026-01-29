import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function CreateDocumentBtn() {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const handleCreateDocument = () => {
    navigate({
      to: "/note/$documentName",
      params: {
        documentName: crypto.randomUUID(),
      },
      search: {
        new: true,
      },
    });
    setOpenMobile(false);
  };
  return <Button onClick={handleCreateDocument}>Create Document</Button>;
}
