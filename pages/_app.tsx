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
  const [, setIsAuth] = useState(false);

  const isLoginPage = router.pathname === "/login";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
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
    };

    checkAuth();

    // Session change listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.push("/login");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, isLoginPage]);

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