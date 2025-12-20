"use client";
import { useEffect } from "react";

interface GoogleSignInProps {
  clientId: string;
  onSignIn: (idToken: string, user: any) => void;
}

export default function GoogleSignIn({ clientId, onSignIn }: GoogleSignInProps) {
  useEffect(() => {
    // Load Google Identity Services script if not already present
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGsi;
      document.body.appendChild(script);
    } else {
      initializeGsi();
    }

    function initializeGsi() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "outline", size: "large" }
      );
    }

    function handleCredentialResponse(response: any) {
      // response.credential is the JWT ID token
      // Optionally decode user info from the token
      const idToken = response.credential;
      // You can decode the JWT for user info if needed
      onSignIn(idToken, null);
    }
  }, [clientId, onSignIn]);

  return <div id="g_id_signin"></div>;
}
