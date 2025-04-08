import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import {
  AuthenticatedContext,
  type AuthenticatedContextType,
} from "@/contexts/AuthenticatedContext";
import { UserQueries } from "@/lib/queries/UserQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense, useContext, useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(UserQueries.getCurrentUser),
  component: RouteComponent,
  // pendingComponent: () => <div>Loading...</div>,
  // pendingMs: 200,
});

function RouteComponent() {
  const { setUserData } = useContext(
    AuthenticatedContext
  ) as AuthenticatedContextType;

  const data = useSuspenseQuery(UserQueries.getCurrentUser);

  useEffect(() => {
    if (data.data) {
      setUserData(data.data);
    }
  }, [data.data, setUserData]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
    </Suspense>
  );
}
