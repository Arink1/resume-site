"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Profile } from "@/lib/types";

export default function AdminProfile() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profile")
        .select("*")
        .single<Profile>();
      if (data) setProfile(data);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    const { id, ...rest } = profile as Profile;

    if (id) {
      await supabase.from("profile").update(rest).eq("id", id);
    } else {
      await supabase.from("profile").insert(rest);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: keyof Profile; label: string; type?: string }[] = [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "email", label: "Email", type: "email" },
    { key: "github_url", label: "GitHub URL", type: "url" },
    { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
    { key: "resume_url", label: "Resume URL", type: "url" },
    { key: "avatar_url", label: "Avatar URL", type: "url" },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Profile</h2>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              value={(profile[field.key] as string) || ""}
              onChange={(e) =>
                setProfile({ ...profile, [field.key]: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            rows={5}
            value={profile.bio || ""}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {saved && (
            <span className="text-green-400 text-sm">Saved!</span>
          )}
        </div>
      </div>
    </div>
  );
}
