import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
