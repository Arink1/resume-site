"use client";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
  );
  return match ? match[1] : null;
}

export function VideoEmbed({ url }: { url: string }) {
  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Fallback for direct video URLs
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
      <video
        src={url}
        controls
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
