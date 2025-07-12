"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { User } from "@supabase/supabase-js";

// ✅ Define proper types
interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  link: string;
  read: boolean;
  created_at: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null); // ✅ Fixed: proper type instead of any
  const [notifications, setNotifications] = useState<Notification[]>([]); // ✅ Fixed: proper type
  const router = useRouter();

  useEffect(() => {
    const getUserAndNotifications = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData?.session?.user;
      setUser(sessionUser || null);

      if (sessionUser) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", sessionUser.id)
          .order("created_at", { ascending: false });

        if (!error) setNotifications(data || []);
      }
    };

    getUserAndNotifications();

    // Optional: real-time notifications
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => getUserAndNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigate = async (link: string, id: string) => {
    // mark as read
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    router.push(link);
  };

  return (
    <header className="w-full border-b border-border py-4 px-6">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          StackIt
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72">
                {notifications.length === 0 ? (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      onClick={() => handleNavigate(notif.link, notif.id)}
                      className="cursor-pointer"
                    >
                      {notif.message}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/ask">
            <Button size="sm" className="font-medium">
              Ask Question
            </Button>
          </Link>

          {user ? (
            <LogoutButton />
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="font-medium">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;