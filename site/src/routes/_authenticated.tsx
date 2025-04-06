import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.navigate({
      to: "/",
    });
  };

  return (
    <AuthenticatedLayout>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="hover:cursor-pointer"
      >
        Log out
      </Button>
      <Outlet />
    </AuthenticatedLayout>
  );
}
