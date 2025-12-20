"use client";
import { useState } from "react";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function LoginPage() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const handleSignIn = (token: string, userInfo: any) => {
    setIdToken(token);
    setUser(userInfo);
    // Optionally: send token to backend for verification
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in with Google</h1>
        <GoogleSignIn clientId="YOUR_GOOGLE_CLIENT_ID" onSignIn={handleSignIn} />
        {idToken && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded">
            <div className="font-semibold">Signed in!</div>
            <div className="break-all text-xs mt-2">ID Token: {idToken}</div>
          </div>
        )}
      </div>
    </div>
  );
}
