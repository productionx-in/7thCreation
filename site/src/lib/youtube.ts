// Small self-contained YouTube helpers — no SDK, since all we need is: turn
// whatever URL someone pastes into a bare video ID, build a thumbnail URL,
// and build an embed URL. Keeping video off Supabase Storage entirely for
// anything linked this way is the whole point (storage/bandwidth cost).

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (ID_RE.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1);
      return ID_RE.test(id) ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && ID_RE.test(v)) return v;
      const match = url.pathname.match(/\/(embed|shorts)\/([A-Za-z0-9_-]{11})/);
      if (match) return match[2];
    }
  } catch {
    // not a parseable URL — fall through to "invalid"
  }
  return null;
}

export function youtubeThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(
  id: string,
  opts: { autoplay?: boolean; loop?: boolean; muted?: boolean; controls?: boolean } = {},
): string {
  const params = new URLSearchParams({
    autoplay: opts.autoplay ? '1' : '0',
    mute: opts.muted ? '1' : '0',
    controls: opts.controls === false ? '0' : '1',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  });
  if (opts.loop) {
    params.set('loop', '1');
    params.set('playlist', id);
  }
  // youtube-nocookie.com avoids setting tracking cookies until the viewer
  // actually interacts with the player.
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
