"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Project } from "@/lib/types";

const emptyProject: Partial<Project> = {
  title: "",
  description: "",
  long_description: "",
  image_url: "",
  tech_stack: [],
  category: "Web App",
  github_url: "",
  live_url: "",
  video_url: "",
  features: [],
  featured: false,
  sort_order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .returns<Project[]>();
    setProjects(data || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!editing) return;
    const { id, created_at, media, ...rest } = editing as Project;

    if (id) {
      await supabase.from("projects").update(rest).eq("id", id);
    } else {
      await supabase.from("projects").insert(rest);
    }
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  }

  function addTech() {
    if (!techInput.trim() || !editing) return;
    setEditing({
      ...editing,
      tech_stack: [...(editing.tech_stack || []), techInput.trim()],
    });
    setTechInput("");
  }

  function removeTech(tech: string) {
    if (!editing) return;
    setEditing({
      ...editing,
      tech_stack: (editing.tech_stack || []).filter((t) => t !== tech),
    });
  }

  if (editing) {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold mb-6">
          {editing.id ? "Edit Project" : "New Project"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={editing.title || ""}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Long Description
            </label>
            <textarea
              rows={4}
              value={editing.long_description || ""}
              onChange={(e) =>
                setEditing({ ...editing, long_description: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Image URL
            </label>
            <input
              value={editing.image_url || ""}
              onChange={(e) =>
                setEditing({ ...editing, image_url: e.target.value })
              }
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tech Stack
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="Add technology..."
                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(editing.tech_stack || []).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-accent/10 text-accent-light rounded flex items-center gap-1"
                >
                  {tech}
                  <button
                    onClick={() => removeTech(tech)}
                    className="hover:text-red-400"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={editing.category || "Web App"}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              >
                <option>Web App</option>
                <option>Game</option>
                <option>Mobile</option>
                <option>AI/ML</option>
                <option>CLI</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Video URL (YouTube)
              </label>
              <input
                value={editing.video_url || ""}
                onChange={(e) =>
                  setEditing({ ...editing, video_url: e.target.value })
                }
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Key Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!featureInput.trim()) return;
                    setEditing({
                      ...editing,
                      features: [...(editing.features || []), featureInput.trim()],
                    });
                    setFeatureInput("");
                  }
                }}
                placeholder="Add a feature..."
                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => {
                  if (!featureInput.trim()) return;
                  setEditing({
                    ...editing,
                    features: [...(editing.features || []), featureInput.trim()],
                  });
                  setFeatureInput("");
                }}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {(editing.features || []).map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="text-accent">-</span>
                  <span className="flex-1">{feat}</span>
                  <button
                    onClick={() =>
                      setEditing({
                        ...editing,
                        features: (editing.features || []).filter(
                          (_, j) => j !== i
                        ),
                      })
                    }
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                GitHub URL
              </label>
              <input
                value={editing.github_url || ""}
                onChange={(e) =>
                  setEditing({ ...editing, github_url: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Live URL
              </label>
              <input
                value={editing.live_url || ""}
                onChange={(e) =>
                  setEditing({ ...editing, live_url: e.target.value })
                }
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.featured || false}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
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
        <h2 className="text-xl font-bold">Projects</h2>
        <button
          onClick={() => setEditing({ ...emptyProject })}
          className="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4"
          >
            <div>
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-muted">
                {project.tech_stack?.join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing({ ...project })}
                className="px-3 py-1.5 text-sm border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1.5 text-sm border border-border rounded-lg text-red-400 hover:bg-red-400/10 hover:border-red-400/50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-center text-muted py-8">
            No projects yet. Add your first one!
          </p>
        )}
      </div>
    </div>
  );
}
