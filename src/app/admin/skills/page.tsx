"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Skill } from "@/lib/types";

const emptySkill: Partial<Skill> = {
  name: "",
  category: "Frontend",
  proficiency: 50,
  icon_name: "",
  sort_order: 0,
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order")
      .returns<Skill[]>();
    setSkills(data || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!editing) return;
    const { id, ...rest } = editing as Skill;

    if (id) {
      await supabase.from("skills").update(rest).eq("id", id);
    } else {
      await supabase.from("skills").insert(rest);
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    await supabase.from("skills").delete().eq("id", id);
    load();
  }

  if (editing) {
    return (
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-6">
          {editing.id ? "Edit Skill" : "New Skill"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={editing.name || ""}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={editing.category || "Frontend"}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>DevOps</option>
              <option>Tools</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Proficiency ({editing.proficiency || 50}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={editing.proficiency || 50}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  proficiency: parseInt(e.target.value),
                })
              }
              className="w-full accent-accent"
            />
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

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Skills</h2>
        <button
          onClick={() => setEditing({ ...emptySkill })}
          className="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-3">{category}</h3>
          <div className="space-y-2">
            {skills
              .filter((s) => s.category === category)
              .map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between bg-card border border-border rounded-lg p-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-sm">{skill.name}</span>
                    <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing({ ...skill })}
                      className="px-3 py-1 text-xs border border-border rounded text-muted hover:text-foreground transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="px-3 py-1 text-xs border border-border rounded text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <p className="text-center text-muted py-8">
          No skills yet. Add your first one!
        </p>
      )}
    </div>
  );
}
