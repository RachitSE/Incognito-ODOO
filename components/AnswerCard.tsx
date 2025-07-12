"use client";

import { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Check,
  Trash,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";


interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface AnswerProps {
  id: string;
  content: string;
  author: string;
  postedAt: string;
  votes: number;
  userVote: number;
  isAccepted?: boolean;
  canAccept?: boolean;
  onVote?: () => void;
  onAccept?: () => void;
}

export default function AnswerCard({
  id,
  content,
  author,
  postedAt,
  votes,
  userVote,
  isAccepted,
  canAccept,
  onVote,
  onAccept,
}: AnswerProps) {
  const [voteState, setVoteState] = useState(userVote);
const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState("user");

useEffect(() => {
  const init = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    setCurrentUser(user ?? null);

    if (user) {
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (userData?.role) setUserRole(userData.role);
    }

    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("answer_id", id)
      .order("created_at", { ascending: true });

    if (commentsData) setComments(commentsData);
  };

  init();
}, [id]);

  const handleVote = async (value: number) => {
    const newVote = voteState === value ? 0 : value;
    setVoteState(newVote);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    await supabase.from("votes").delete().match({ user_id: user.id, answer_id: id });

    if (newVote !== 0) {
      await supabase.from("votes").insert([
        { user_id: user.id, answer_id: id, value: newVote },
      ]);
    }

    if (onVote) onVote();
  };

  const handleAccept = async () => {
    if (onAccept) onAccept();
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("answer_id", id)
      .order("created_at", { ascending: true });

    if (!error) setComments(data || []);
  };

  const postComment = async () => {
    if (!newComment.trim()) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { error } = await supabase.from("comments").insert([
      {
        answer_id: id,
        user_id: user.id,
        content: newComment,
      },
    ]);

    if (!error) {
      setNewComment("");
      fetchComments();
    }
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
    fetchComments();
  };

  const deleteAnswer = async () => {
    const confirmed = confirm("Are you sure you want to delete this answer?");
    if (!confirmed) return;

    await supabase.from("answers").delete().eq("id", id);
    if (onVote) onVote(); // trigger refresh
  };

  const canEditOrDelete =
    userRole === "admin" || currentUser?.email === author;

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/10 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center pt-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleVote(1)}
            className={voteState === 1 ? "text-primary" : ""}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold">{votes}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleVote(-1)}
            className={voteState === -1 ? "text-destructive" : ""}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1">
          <div
            className="text-sm text-foreground"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
            <span>{author} • {postedAt}</span>

            {canEditOrDelete && (
              <div className="flex gap-2">
                {/* You can implement edit logic too */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={deleteAnswer}
                  className="text-destructive"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {isAccepted && (
            <Badge className="mt-2 bg-green-600 text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Accepted
            </Badge>
          )}

          {!isAccepted && canAccept && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={handleAccept}
            >
              <Check className="w-3 h-3 mr-1" />
              Accept Answer
            </Button>
          )}

          {/* Comments Section */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Comments</h4>
            {comments.map((c) => (
              <div key={c.id} className="text-xs text-muted-foreground border-l pl-3 border-border flex justify-between items-center">
                <span>{c.content}</span>
                {(userRole === "admin" || c.user_id === currentUser?.id) && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteComment(c.id)}
                    className="text-destructive"
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 mt-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="text-xs"
              />
              <Button size="sm" onClick={postComment}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
