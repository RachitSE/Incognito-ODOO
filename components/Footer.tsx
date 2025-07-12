"use client";

import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/5 text-foreground py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Left */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold tracking-tight">StackIt</h3>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using Next.js, Supabase, and ShadCN.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <Link href="mailto:rachitofficial77@gmail.com" className="text-muted-foreground hover:text-primary">
            <Mail className="w-5 h-5" />
          </Link>
          <Link href="https://github.com/rachitse" target="_blank" className="text-muted-foreground hover:text-primary">
            <Github className="w-5 h-5" />
          </Link>
          <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-primary">
            <Twitter className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
