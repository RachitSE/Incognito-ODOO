"use client";

import { LayoutDashboard, MessageCircleMore, Bell, UserCheck, CheckCircle, ShieldCheck } from "lucide-react";

export default function AboutMe() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Ask & Explore",
      description: "Post questions, share insights, and explore a rich feed of tech problems and solutions.",
    },
    {
      icon: MessageCircleMore,
      title: "Rich Answers",
      description: "Use a powerful editor with formatting, lists, images, links, and emoji to create engaging answers.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get real-time alerts for answers, comments, and @mentions, so you never miss out.",
    },
    {
      icon: CheckCircle,
      title: "Accept Answers",
      description: "Mark the best answers as accepted to help others and reward quality content.",
    },
    {
      icon: UserCheck,
      title: "Voting System",
      description: "Upvote or downvote answers to surface the most helpful responses in the community.",
    },
    {
      icon: ShieldCheck,
      title: "Admin Controls",
      description: "Admins can moderate content, delete questions, and ensure a safe space for discussion.",
    },
  ];

  return (
    <section className="py-16 bg-background text-foreground border-t border-border">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">About StackIt</h2>
        <p className="text-muted-foreground text-lg mb-12">
          StackIt is your go-to Q&A platform built for developers, by developers. Fast. Minimal. Powerful.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition"
            >
              <feature.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
