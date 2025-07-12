// components/LogoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed");
      console.error(error);
    } else {
      toast.success("Logged out");
      router.push("/login");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}
