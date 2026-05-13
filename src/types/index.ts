export interface Project {
  id: string;
  title: string;
  role: string;
  poster: string;
  video: string | null;
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

export interface JournalPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  video?: string;
  readTime: string;
}

export type CursorVariant = 'default' | 'crosshair' | 'video' | 'drag' | 'hidden';

export interface CursorState {
  variant: CursorVariant;
  label?: string;
}

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export interface SoundState {
  enabled: boolean;
  volume: number;
  toggle: () => void;
}
