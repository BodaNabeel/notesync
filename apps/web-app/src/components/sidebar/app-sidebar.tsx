import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import CreateDocumentBtn from "./CreateDocumentBtn";
import SidebarList from "./SidebarList";
import Logout from "../Logout";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="mt-4">
        <div className="flex items-center gap-3  w-fit mx-auto mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            N
          </div>
          <span className="font-serif text-xl font-bold text-foreground">
            NoteSync
          </span>
        </div>

        <CreateDocumentBtn />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarList />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Logout />
      </SidebarFooter>
    </Sidebar>
  );
}
