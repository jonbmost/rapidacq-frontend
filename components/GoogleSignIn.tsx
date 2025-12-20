"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInProps {
  clientId: string;
  onSignIn: (token: string, userInfo: any) => void;
}

export default function GoogleSignIn({ clientId, onSignIn }: GoogleSignInProps) {
  useEffect(() => {
    // Load Google Identity Services script if not already present
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="g_id_onload"
      data-client_id={clientId}
      data-callback="handleCredentialResponse"
    />
  );
}
