"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Loader2, ShieldCheck } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect to home if already logged in
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) router.push("/");
  });
}, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error("Failed to send magic link");
    } else {
      toast.success("Magic link sent to your email");
    }

    setLoading(false);
  };

  const loginWithProvider = async (provider: "google" | "github") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error(`Login failed with ${provider}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Toaster />
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Login to StackIt
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
              Sign in with Email
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <div className="flex-grow h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
            <div className="flex-grow h-px bg-border" />
          </div>

          <div className="flex gap-3">
            <Button
  variant="outline"
  onClick={() => loginWithProvider("google")}
  className="w-full"
  disabled={loading}
>
<Image src="/assets/google.svg" alt="Google" width={16} height={16} className="mr-2" />
  Google
</Button>

            <Button
              variant="outline"
              onClick={() => loginWithProvider("github")}
              className="w-full"
              disabled={loading}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
