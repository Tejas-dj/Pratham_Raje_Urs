export interface Project {
  id: string;
  title: string;
  role: string;
  poster: string;
  posterLandscape?: string;
  /** Muted, looping hover-preview clip shown on the vault card — not the full film. */
  video: string | null;
  /** YouTube link opened in the cinematic modal on click, for films that live on YouTube. */
  youtubeUrl?: string;
  /** True for feature films that live off-YouTube (e.g. Amazon Prime); shows a trailer-or-watch chooser instead of an immediate embed. */
  isFeatureFilm?: boolean;
  /** YouTube trailer link, used when isFeatureFilm is true. */
  trailerYoutubeUrl?: string;
  /** External watch page (e.g. Amazon Prime) for the full film, used when isFeatureFilm is true. */
  externalWatchUrl?: string;
  /** Label for the external watch platform, e.g. "Amazon Prime". Defaults to "Amazon Prime". */
  externalWatchLabel?: string;
  badges: string[];
  year: number;
  description: string;
  category: 'narrative' | 'wedding' | 'acting' | 'commercial';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  videoLoop?: string;
}

export type CursorVariant = 'default' | 'crosshair' | 'video' | 'drag' | 'hidden';

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

/* ─── Photography ────────────────────────────────────────────────────────── */

export type PhotoCategory = 'film-stills' | 'portraits' | 'bts' | 'street' | 'landscapes';

export interface PhotoExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutter?: string;
}

export interface Photo {
  id: number;
  src: string;
  blurDataURL?: string;
  alt: string;
  project?: string;
  year?: string;
  category?: PhotoCategory;
  role?: string;
  btsNote?: string;
  aspect: 'tall' | 'wide' | 'square';
  exif?: PhotoExif;
  isThumbnail?: boolean;
  width?: number;
  height?: number;
}
