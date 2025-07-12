// pages/_app.tsx
"use client";

import "@/styles/globals.css";
import "@/components/editor.css";

import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const isLoginPage = router.pathname === "/login";

useEffect(() => {
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session) {
      setIsAuth(true);

      // ✅ Upsert user into `users` table
      await supabase.from("users").upsert({
        id: session.user.id,
        email: session.user.email,
        role: "user", // optional
      });
    } else {
      if (!isLoginPage) {
        router.push("/login");
      }
    }
    setLoading(false);
  });

  // Session change listener (unchanged)
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session && !isLoginPage) {
      router.push("/login");
    }
  });

  return () => {
    listener?.subscription.unsubscribe();
  };
}, [router.pathname]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted">Checking authentication...</span>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
