export function getYoutubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

/**
 * Builds a YouTube embed URL for a single video, stripping playlist/radio
 * params (list, start_radio) so the modal always plays just that one film
 * instead of autoqueuing YouTube's related-video radio.
 */
export function getYoutubeEmbedUrl(url: string, opts: { autoplay?: boolean } = {}): string {
  const id = getYoutubeVideoId(url);
  if (!id) return url;

  let start: string | undefined;
  try {
    const t = new URL(url).searchParams.get("t");
    const match = t?.match(/(\d+)/);
    if (match) start = match[1];
  } catch {
    // ignore malformed URL, no start offset
  }

  const params = new URLSearchParams({
    autoplay: opts.autoplay === false ? "0" : "1",
    rel: "0",
    modestbranding: "1",
  });
  if (start) params.set("start", start);

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
