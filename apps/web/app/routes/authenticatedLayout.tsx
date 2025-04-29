import { useContext } from "react";
import { Outlet } from "react-router";
import {
  AuthenticatedContext,
  type AuthenticatedContextType,
} from "~/contexts/AuthenticatedContext";

export default function AuthenticatedLayout() {
  const { setUserData } = useContext(
    AuthenticatedContext
  ) as AuthenticatedContextType;

  return (
    <>
      <div>auth</div>
      <Outlet />
    </>
  );
}
