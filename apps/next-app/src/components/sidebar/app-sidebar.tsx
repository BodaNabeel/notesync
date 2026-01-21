import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarList from "./SidebarList";
import CreateDocumentBtn from "./CreateDocumentBtn";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="mt-4">
        <h1 className="text-center font-bold text-lg mb-4">
          Collaboration Notes
        </h1>
        <CreateDocumentBtn />
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
