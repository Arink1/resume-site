"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Experience } from "@/lib/types";

const emptyExp: Partial<Experience> = {
  company: "",
  role: "",
  description: "",
  start_date: "",
  end_date: null,
  sort_order: 0,
};

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order")
      .returns<Experience[]>();
    setExperiences(data || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!editing) return;
    const { id, ...rest } = editing as Experience;
    const payload = { ...rest, end_date: rest.end_date || null };

    if (id) {
      await supabase.from("experiences").update(payload).eq("id", id);
    } else {
      await supabase.from("experiences").insert(payload);
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    load();
  }

  if (editing) {
    return (
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-6">
          {editing.id ? "Edit Experience" : "New Experience"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              value={editing.company || ""}
              onChange={(e) =>
                setEditing({ ...editing, company: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              value={editing.role || ""}
              onChange={(e) =>
                setEditing({ ...editing, role: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={editing.start_date || ""}
                onChange={(e) =>
                  setEditing({ ...editing, start_date: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                value={editing.end_date || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    end_date: e.target.value || null,
                  })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
                placeholder="Leave empty for current"
              />
              <p className="text-xs text-muted mt-1">
                Leave empty for current position
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={editing.sort_order || 0}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  sort_order: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-2 border border-border text-muted hover:text-foreground rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Experiences</h2>
        <button
          onClick={() => setEditing({ ...emptyExp })}
          className="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Experience
        </button>
      </div>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4"
          >
            <div>
              <h3 className="font-medium">{exp.role}</h3>
              <p className="text-sm text-muted">
                {exp.company} &middot; {exp.start_date} &mdash;{" "}
                {exp.end_date || "Present"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing({ ...exp })}
                className="px-3 py-1.5 text-sm border border-border rounded-lg text-muted hover:text-foreground transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="px-3 py-1.5 text-sm border border-border rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-center text-muted py-8">
            No experiences yet. Add your first one!
          </p>
        )}
      </div>
    </div>
  );
}
