import { youtubeEmbedUrl } from '@/lib/youtube';

// Full-bleed, muted, looping YouTube embed standing in for a native <video>
// background — the classic "oversize + center + translate" trick so the
// iframe always covers its container regardless of aspect ratio, since an
// iframe has no object-fit: cover equivalent of its own.
export function YouTubeBackground({ videoId }: { videoId: string }) {
  const src = youtubeEmbedUrl(videoId, { autoplay: true, loop: true, muted: true, controls: false });
  return (
    <div className="absolute inset-0 overflow-hidden">
      <iframe
        src={src}
        title="Background video"
        allow="autoplay; encrypted-media"
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: '177.78vh',
          height: '56.25vw',
          minWidth: '100%',
          minHeight: '100%',
          transform: 'translate(-50%, -50%)',
          border: 0,
        }}
      />
    </div>
  );
}
