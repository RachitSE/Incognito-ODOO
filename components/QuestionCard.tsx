"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUp, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  author: string;
  postedAt: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

export default function QuestionCard({
  title,
  description,
  tags,
  votes,
  author,
  postedAt,
  showDelete = false,
  onDelete,
}: QuestionProps) {
  return (
    <div className="group relative flex gap-4 p-4 border border-border rounded-xl hover:bg-muted/10 transition cursor-pointer">
      {/* ✅ Admin Delete Button */}
      {showDelete && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 text-destructive"
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation on card
            e.preventDefault();
            if (confirm("Are you sure you want to delete this question?")) {
              onDelete?.();
            }
          }}
        >
          <Trash className="w-4 h-4" />
        </Button>
      )}

      <div className="flex flex-col items-center justify-start pt-1">
        <ArrowUp className="w-4 h-4 text-muted group-hover:text-foreground transition" />
        <span className="text-sm font-medium text-muted-foreground">{votes}</span>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold leading-snug group-hover:underline">
          {title}
        </h2>

        <div
          className="text-sm text-muted-foreground mt-1 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs rounded-full border-muted-foreground px-2 py-1"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          {author} • {postedAt}
        </div>
      </div>
    </div>
  );
}
