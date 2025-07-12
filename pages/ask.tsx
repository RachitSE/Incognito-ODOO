"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Editor from "@/components/Editor";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { User } from "@supabase/supabase-js";

export default function AskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // ✅ Fixed: User type instead of any
  const router = useRouter();

  // ✅ Fetch session user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("questions").insert([
        {
          title,
          description,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          author_id: user.id,
          author: user.email,
        },
      ]);

      if (error) {
        alert("Error submitting question: " + error.message);
        console.error(error);
        return;
      }

      router.push("/questions");
    } catch (err) {
      console.error(err);
      alert("Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Editor content={description} onChange={setDescription} />

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}