"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [p, s, e, m] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase
          .from("experiences")
          .select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: p.count || 0,
        skills: s.count || 0,
        experiences: e.count || 0,
        messages: m.count || 0,
      });
    }
    load();
  }, []);

  const cards = [
    {
      label: "Projects",
      count: counts.projects,
      href: "/admin/projects",
      color: "from-indigo-500 to-purple-500",
    },
    {
      label: "Skills",
      count: counts.skills,
      href: "/admin/skills",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Experiences",
      count: counts.experiences,
      href: "/admin/experiences",
      color: "from-pink-500 to-rose-500",
    },
    {
      label: "Messages",
      count: counts.messages,
      href: "#",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-colors"
        >
          <p className="text-muted text-sm">{card.label}</p>
          <p className="text-3xl font-bold mt-1">{card.count}</p>
          <div
            className={`w-full h-1 rounded mt-4 bg-gradient-to-r ${card.color} opacity-50`}
          />
        </Link>
      ))}
    </div>
  );
}
