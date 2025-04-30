import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Scope Cup" },
    { name: "Scope Cup", content: "Welcome to the Scope Cup Tracker!" },
  ];
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    console.log(credentialResponse.credential);

    if (!credentialResponse.credential) {
      console.error("No credential response");
      setLoading(false);
      return;
    }

    console.log("sending authclient");

    const res = await authClient.signIn.social({
      provider: "google",
      idToken: {
        token: credentialResponse.credential,
      },
    });

    console.log(typeof res);
    console.log(res);

    setLoading(false);
    if (res.data && "user" in res.data && res.data.user) {
      console.log("success");
      navigate("/dashboard");
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-7xl">
        <span className="font-bold text-purple-500">Scopey</span> scope
      </h1>
      <div className="mt-10">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <GoogleLogin onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
