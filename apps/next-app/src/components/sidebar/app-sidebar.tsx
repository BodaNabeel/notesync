import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { randomUUID } from "crypto";
import Link from "next/link";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import SidebarList from "./SidebarList";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="mt-4">
        <h1 className="text-center font-bold text-lg mb-4">
          Collaboration Notes
        </h1>
        <Button asChild>
          {/* TODO: FIx the same UUID always */}
          <Link href={`/note/${randomUUID()}?new=true`}>
            Create Document <PlusIcon />
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarList />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
