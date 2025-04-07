import { authClient } from "@/lib/auth-client";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    console.log(credentialResponse.credential);

    if (!credentialResponse.credential) {
      console.error("No credential response");
      setLoading(false);
      return;
    }

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
      router.navigate({
        to: "/dashboard",
      });
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* <h1 className="text-7xl">
        <span className="font-bold text-purple-500">Scopey</span> scope
      </h1> */}
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
