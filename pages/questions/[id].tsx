"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import AnswerCard from "@/components/AnswerCard";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author_id: string;
  author: string;
  created_at: string;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  created_at: string;
  votes: number;
  userVote: number;
  is_accepted: boolean;
  question_id: string;
  author_id: string;
}

interface Vote {
  answer_id: string;
  value: number;
}

export default function QuestionDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [answerContent, setAnswerContent] = useState("");

  const refreshAnswers = useCallback(async () => {
    if (!id) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    setCurrentUser(user ?? null);

    const { data: answerData, error } = await supabase
      .from("answers")
      .select("*, votes(value)")
      .eq("question_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching answers:", error.message);
      return;
    }

    let enrichedAnswers = answerData?.map((ans) => {
      const votesSum = ans.votes?.reduce(
        (sum: number, v: { value: number }) => sum + v.value,
        0
      ) || 0;
      return {
        ...ans,
        votes: votesSum,
        userVote: 0,
      };
    }) || [];

    if (user) {
      const { data: votes } = await supabase
        .from("votes")
        .select("answer_id, value")
        .eq("user_id", user.id);

      enrichedAnswers = enrichedAnswers.map((ans) => {
        const vote = votes?.find((v: Vote) => v.answer_id === ans.id);
        return {
          ...ans,
          userVote: vote?.value || 0,
        };
      });
    }

    setAnswers(enrichedAnswers);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchQuestionAndUser = async () => {
      // 1. Get question
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("*")
        .eq("id", id)
        .single();

      if (questionError) {
        console.error("Error fetching question:", questionError.message);
        return;
      }

      setQuestion(questionData);

      // 2. Get session user
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      setCurrentUser(user ?? null);
    };

    fetchQuestionAndUser();
    refreshAnswers();
  }, [id, refreshAnswers]);

  const submitAnswer = async () => {
    if (!answerContent || answerContent.trim() === "<p></p>") {
      alert("Answer cannot be empty.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("answers").insert([
      {
        question_id: id,
        content: answerContent,
        author_id: user.id,
        author: user.email,
      },
    ]);

    if (error) {
      alert("Error posting answer: " + error.message);
      console.error(error);
      return;
    }

    // ✅ Notify question owner
    if (question?.author_id && question.author_id !== user.id) {
      await supabase.from("notifications").insert([
        {
          user_id: question.author_id,
          type: "answer",
          message: `${user.email} answered your question.`,
          link: `/questions/${id}`,
        },
      ]);
    }

    setAnswerContent("");
    refreshAnswers();
  };

  const handleAcceptAnswer = async (answerId: string) => {
    // Set accepted = true for this one
    await supabase
      .from("answers")
      .update({ is_accepted: true })
      .eq("id", answerId);

    // Remove accepted from others in this question
    await supabase
      .from("answers")
      .update({ is_accepted: false })
      .eq("question_id", id)
      .neq("id", answerId);

    refreshAnswers();
  };

  if (!question) return <p className="text-center mt-10">Loading...</p>;

  const userIsAuthor = currentUser?.id === question.author_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{question.title}</h1>

      <div
        className="text-muted-foreground mb-4"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {question.tags?.map((tag: string, i: number) => (
          <Badge key={i} variant="outline">
            #{tag}
          </Badge>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Post an Answer</h2>
        <Editor content={answerContent} onChange={setAnswerContent} />
        <Button onClick={submitAnswer} className="mt-3">
          Submit Answer
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Answers</h2>
        {answers.length > 0 ? (
          answers.map((ans) => (
            <AnswerCard
              key={ans.id}
              id={ans.id}
              content={ans.content}
              author={ans.author}
              postedAt={new Date(ans.created_at).toLocaleString()}
              votes={ans.votes}
              userVote={ans.userVote}
              isAccepted={ans.is_accepted}
              onVote={refreshAnswers}
              canAccept={userIsAuthor}
              onAccept={() => handleAcceptAnswer(ans.id)}
            />
          ))
        ) : (
          <p className="text-muted">No answers yet.</p>
        )}
      </div>
    </div>
  );
}