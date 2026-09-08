"use client";

import { useState } from "react";
import { ProjectMedia } from "@/lib/types";
import { VideoEmbed } from "./VideoEmbed";

export function MediaGallery({
  media,
  heroImage,
  heroVideo,
}: {
  media: ProjectMedia[];
  heroImage?: string;
  heroVideo?: string;
}) {
  const allItems: { url: string; type: "image" | "video"; caption: string }[] =
    [];

  // Add hero video first if present
  if (heroVideo) {
    allItems.push({ url: heroVideo, type: "video", caption: "" });
  }

  // Add hero image if no video
  if (heroImage && !heroVideo) {
    allItems.push({ url: heroImage, type: "image", caption: "" });
  }

  // Add gallery media
  for (const m of media) {
    allItems.push({ url: m.url, type: m.type, caption: m.caption });
  }

  // Add hero image as a gallery item too if we had a video
  if (heroImage && heroVideo) {
    allItems.push({ url: heroImage, type: "image", caption: "" });
  }

  const [activeIndex, setActiveIndex] = useState(0);

  if (allItems.length === 0) return null;

  const active = allItems[activeIndex];

  return (
    <div className="mb-8">
      {/* Main display */}
      <div className="mb-3">
        {active.type === "video" ? (
          <VideoEmbed url={active.url} />
        ) : (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
            <img
              src={active.url}
              alt={active.caption || "Project screenshot"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        {active.caption && (
          <p className="text-sm text-muted mt-2 text-center">
            {active.caption}
          </p>
        )}
      </div>

      {/* Thumbnails */}
      {allItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-accent"
                  : "border-border hover:border-accent/50"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
