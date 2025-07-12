// lib/vote.ts
import { supabase } from "@/lib/supabase";

export async function voteOnAnswer(answerId: number, userId: string) {
  // Check if user has already voted
  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", userId)
    .eq("answer_id", answerId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // Unexpected error
    return { error: fetchError };
  }

  if (existingVote) {
    return { error: "You’ve already voted on this answer." };
  }

  const { error: insertError } = await supabase
    .from("votes")
    .insert([{ user_id: userId, answer_id: answerId, value: 1 }]);

  return { error: insertError };
}
