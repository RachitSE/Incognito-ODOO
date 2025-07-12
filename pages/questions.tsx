"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/QuestionCard";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import Link from "next/link";
import { Trash } from "lucide-react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filter, setFilter] = useState("recent");
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("user");
  const router = useRouter();
  

  // ✅ Fetch questions
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("id, title, description, tags, votes, author, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching questions:", error.message);
    } else {
      setQuestions(data);
    }
  };

  // ✅ Fetch user role
useEffect(() => {
  const fetchData = async () => {
    const session = await supabase.auth.getSession();
    const user = session?.data?.session?.user;
    if (user) {
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(userData?.role || "user");
    }

    const { data, error } = await supabase
      .from("questions")
      .select("id, title, description, tags, votes, author, created_at")
      .order("created_at", { ascending: false });

    if (!error) setQuestions(data || []);
  };

  fetchData();
}, []);


  // ✅ Handle deletion
const deleteQuestion = async (id: number) => {
  const confirmDelete = confirm("Are you sure you want to delete this question?");
  if (!confirmDelete) return;

  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (!error) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  } else {
    alert("Failed to delete question: " + error.message);
  }
};


  // ✅ Filter logic
  const filtered = questions
    .filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "top") return (b.votes || 0) - (a.votes || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <Button
          variant="default"
          className="rounded-full px-6 py-2 text-sm"
          onClick={() => router.push("/ask")}
        >
          Ask a Question
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="top">Top</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((q) => (
            <div key={q.id} className="relative group">
              <Link href={`/questions/${q.id}`} className="block">
                <QuestionCard
  key={q.id}
  id={q.id}
  title={q.title}
  description={q.description}
  tags={q.tags}
  votes={q.votes || 0}
  author={q.author}
  postedAt={new Date(q.created_at).toLocaleString()}
  showDelete={userRole === "admin"}
  onDelete={() => deleteQuestion(q.id)}
/>


              </Link>

              {/* ✅ Admin delete button */}
              {userRole === "admin" && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition"
                  onClick={() => deleteQuestion(q.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted text-center">No questions found.</p>
        )}
      </div>
    </div>
  );
}
