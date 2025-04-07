import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import NavUser from "./NavUser";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex flex-row justify-center items-center w-full">
                <img
                  src={
                    new URL(
                      "../../../public/infinity-logo-sash-embroidered.png",
                      import.meta.url
                    ).href
                  }
                  width={48}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(2794%) hue-rotate(252deg) brightness(83%) contrast(96%)",
                  }}
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>content</SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
