import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  AuthenticatedContext,
  type AuthenticatedContextType,
} from "~/contexts/AuthenticatedContext";
import type { Route } from "./+types/authenticatedLayout";
import Header from "~/components/Header";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log(import.meta.env.VITE_SERVER_URL);
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
  }).then((res) => res.json());

  return res;
}

export default function AuthenticatedLayout({
  loaderData,
}: Route.ComponentProps) {
  // console.log(loaderData);
  const navigate = useNavigate();

  const { setUserData } = useContext(
    AuthenticatedContext
  ) as AuthenticatedContextType;

  useEffect(() => {
    if (loaderData.user && loaderData.session) {
      setUserData(loaderData);
    } else {
      // Unauthenticated
      navigate("/");
    }
  }, [loaderData, setUserData]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
