import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/use-auth";
import QueryClientWrapper from "@/Provider/tanstack-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/note")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <QueryClientWrapper>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full ">
          <SidebarTrigger className="absolute" />
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </main>
      </SidebarProvider>
    </QueryClientWrapper>
  );
}
