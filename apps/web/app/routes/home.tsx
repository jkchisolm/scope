import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { GoogleLogin } from "@react-oauth/google";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-7xl">
        <span className="font-bold text-purple-500">Scopey</span> scope
      </h1>
      <div className="mt-10">
        <GoogleLogin onSuccess={() => {}} />
      </div>
    </div>
  );
}
