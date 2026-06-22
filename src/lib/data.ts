import type { Project, Service, Photo, Reel } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "sunflowers",
    title: "She Asked for Sunflowers",
    role: "Director · DOP · Editor · Actor",
    poster: "/images/She asked for Sunflowers.jpeg",
    video: "/videos/sample_video.mp4",
    badges: ["He Stars In This"],
    year: 2024,
    category: "narrative",
    description:
      "A raw, emotional Kannada short about longing and unrequited love, shot amidst the sunflower fields of rural Karnataka. Pratham stars, directs, and frames every aching moment himself.",
  },
  {
    id: "christmas",
    title: "The Christmas Guest",
    role: "Director · DOP",
    poster: "/images/The Christmas Guest.jpeg",
    video: "/videos/sample_video.mp4",
    badges: ["Dada Saheb Phalke Selected"],
    year: 2023,
    category: "narrative",
    description:
      "A Dada Saheb Phalke Film Festival selection. A quiet, luminous story about the strangers who change us. Shot with festive Christmas lights bleeding warmth into Bengaluru's midnight streets.",
  },
  {
    id: "coffee",
    title: "Before The Coffee Gets Cold",
    role: "Director · DOP · Editor",
    poster: "/images/Before The Coffee Gets Cold.jpeg",
    video: "/videos/sample_video.mp4",
    badges: [],
    year: 2024,
    category: "narrative",
    description:
      "Time, memory, and the bittersweet ritual of morning coffee. A meditative Kannada short that asks: what would you say if you had one more moment?",
  },
  {
    id: "dot",
    title: "DOT.",
    role: "Director · DOP",
    poster: "/images/DOT..jpeg",
    video: null,
    badges: [],
    year: 2024,
    category: "narrative",
    description:
      "A single frame. A single feeling. DOT. is Pratham's most experimental short, a visual poem about existence stripped down to its most elemental form.",
  },
  {
    id: "sees-kaddi",
    title: "Sees Kaddi",
    role: "Actor",
    poster: "/images/sees_kaddi.png",
    video: "/videos/sample_video.mp4",
    badges: ["Acting Reel"],
    year: 2023,
    category: "acting",
    description:
      "Stepping in front of the lens for the first time. Pratham's acting debut, a deeply personal performance that proved the director understands his actors because he has been one.",
  },
];

export const SERVICES: Service[] = [
  {
    id: "narrative",
    title: "Narrative Shorts & Indie Kannada Films",
    description:
      "Emotionally raw stories that chase feelings, not formulas. From concept to final grade, Pratham brings the full weight of a festival-selected filmmaker to every project.",
    color: "#7EADA9",
    icon: "film",
    videoLoop: "/videos/sample_video.mp4",
  },
  {
    id: "commercial",
    title: "Commercial & Brand Films",
    description:
      "Visual stories that make brands unforgettable. Cinematic storytelling applied to your product, because great brands deserve more than ads. They deserve films.",
    color: "#1F5560",
    icon: "star",
    videoLoop: "/videos/sample_video.mp4",
  },
  {
    id: "dop",
    title: "DOP · Editing · Color Grading",
    description:
      "Hire the eye. Phalke-selected. Full post-production pipeline, from set to screen, with obsessive cinematic precision and that signature Kannada golden-hour warmth.",
    color: "#F8F4ED",
    icon: "aperture",
    videoLoop: "/videos/sample_video.mp4",
  },
];

export const ABOUT_FRAMES: { year: string; title: string; description: string; image: string; hasVideo?: boolean }[] = [
  {
    year: "2006",
    title: "Born in Mysuru",
    description: "Under golden-hour Karnataka skies, in the shadow of a palace. Pratham Raje Urs draws first breath.",
    image: "/images/image_tester_1.png",
  },
  {
    year: "2016",
    title: "First Frame",
    description: "A smartphone. A sunlit lane. The first time light was trapped in a frame. Nothing was ever the same.",
    image: "/images/image_tester_1.png",
    hasVideo: true,
  },
  {
    year: "2023",
    title: "Sees Kaddi · Actor",
    description: "The director steps in front of the lens. Understanding the actor's vulnerability from the inside.",
    image: "/images/Sees_Kaddi_Landscape.jpg",
  },
  {
    year: "2024",
    title: "Talon Production House",
    description: "Founded in Bengaluru. A home for Kannada stories that dare to feel something.",
    image: "/images/Talon_productions_logo.png",
  },
  {
    year: "Now",
    title: "Still Chasing Feelings",
    description: "Every frame. Every film. Still chasing that one perfect feeling.",
    image: "/images/image_tester_1.png",
  },
];

/* ─── Photography ────────────────────────────────────────────────────────── */

export const PHOTOS: Photo[] = [
  { id: 1, src: "/images/V_motionblur.webp", alt: "Golden-hour sunflower field", project: "She Asked for Sunflowers", year: "2024", category: "film-stills", role: "Director | DOP", btsNote: "Shot entirely during a 15-minute magic hour window before the storm hit.", aspect: "tall", exif: { camera: "Sony FX3", lens: "Sigma 35mm f/1.4", aperture: "f/1.4", iso: "800", shutter: "1/500" } },
  { id: 2, src: "/images/Model_Team.webp", alt: "Rain-streaked cafe window portrait", project: "Before The Coffee Gets Cold", year: "2024", category: "portraits", role: "DOP", btsNote: "Used a custom prism filter to catch the neon reflections off the wet window.", aspect: "wide", exif: { camera: "Sony A7III", lens: "85mm f/1.8", aperture: "f/1.8", iso: "640", shutter: "1/200" } },
  { id: 3, src: "/images/still_christmas.png", alt: "Festive living room, warm light", project: "The Christmas Guest", year: "2023", category: "film-stills", role: "Director", btsNote: "We lit the entire scene using only practical tungsten bulbs and the Christmas tree lights.", aspect: "square" },
  { id: 4, src: "/images/Two_women.webp", alt: "Red umbrella in monsoon cobblestones", project: "Mysuru Streets", year: "2024", category: "street", role: "Photographer", aspect: "tall" },
  { id: 5, src: "/images/Beach_Couple.webp", alt: "Golden-hour garden ceremony", project: "Wedding Cinema: Talon", year: "2025", category: "portraits", role: "Director | Editor", btsNote: "Captured on a vintage 35mm lens to give the digital sensor an organic, timeless feel.", aspect: "wide" },
  { id: 6, src: "/images/still_dot.png", alt: "Silhouette against concrete wall", project: "DOT.", year: "2024", category: "film-stills", role: "DOP", btsNote: "The stark contrast was achieved with a single 10K light positioned 50 feet down the alley.", aspect: "tall" },
  { id: 7, src: "/images/still_bts.webp", alt: "Blue-hour rooftop shoot", project: "Behind The Frame", year: "2025", category: "bts", role: "Director", aspect: "wide" },
  { id: 8, src: "/images/Beach_Scenic.webp", alt: "Karnataka sunrise paddy fields", project: "Karnataka Diaries", year: "2023", category: "landscapes", role: "DOP | Drone Op", btsNote: "Woke up at 4 AM to hike 3 miles just to catch the morning mist rolling off the fields.", aspect: "wide" },
  { id: 9, src: "/images/still_sees_kaddi.png", alt: "Night alley, dramatic sidelight", project: "Sees Kaddi", year: "2023", category: "film-stills", role: "Actor | Co-Director", aspect: "tall" },
  { id: 10, src: "/images/still_temple.png", alt: "Ancient temple archway at dawn", project: "Karnataka Diaries", year: "2023", category: "landscapes", role: "Photographer", aspect: "tall" },
  { id: 11, src: "/images/HeadShot_Pratham.jpeg", alt: "Director portrait with camera", project: "Self Portrait", year: "2024", category: "portraits", role: "Self", aspect: "tall" },
  { id: 12, src: "/images/Sees_Kaddi_Landscape.jpg", alt: "Wide landscape from Sees Kaddi set", project: "Sees Kaddi", year: "2023", category: "bts", role: "Behind the Scenes", aspect: "wide" },
  // Placeholder Cloudinary entries — swap URLs when assets are uploaded
  { id: 13, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/monsoon-bridge.jpg", alt: "Monsoon bridge silhouette", project: "Mysuru Monsoon", year: "2024", category: "street", role: "Photographer", aspect: "tall" },
  { id: 14, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/chai-stall.jpg", alt: "Chai stall at dusk", project: "Mysuru Streets", year: "2024", category: "street", role: "Photographer", aspect: "wide" },
  { id: 15, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/lens-flare-portrait.jpg", alt: "Lens flare portrait on set", project: "Talon BTS", year: "2025", category: "bts", role: "Behind the Scenes", aspect: "square" },
  { id: 16, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/golden-hour-rice.jpg", alt: "Golden hour over rice paddies", project: "Karnataka Diaries", year: "2023", category: "landscapes", role: "Photographer", aspect: "wide" },
  { id: 17, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/actor-closeup.jpg", alt: "Actor closeup between takes", project: "She Asked for Sunflowers", year: "2024", category: "portraits", role: "DOP", aspect: "tall" },
  { id: 18, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/crew-silhouette.jpg", alt: "Crew silhouette at magic hour", project: "Talon BTS", year: "2025", category: "bts", role: "Behind the Scenes", aspect: "wide" },
  { id: 19, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/mysuru-palace-night.jpg", alt: "Mysuru Palace illuminated at night", project: "Karnataka Diaries", year: "2023", category: "landscapes", role: "Photographer", aspect: "wide" },
  { id: 20, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/coffee-steam.jpg", alt: "Coffee steam in morning light", project: "Before The Coffee Gets Cold", year: "2024", category: "film-stills", role: "DOP", aspect: "square" },
  { id: 21, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/rain-window.jpg", alt: "Rain on window with bokeh lights", project: "The Christmas Guest", year: "2023", category: "film-stills", role: "Director", aspect: "tall" },
  { id: 22, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/street-lamp.jpg", alt: "Street lamp in fog", project: "Mysuru Streets", year: "2024", category: "street", role: "Photographer", aspect: "tall" },
  { id: 23, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/director-chair.jpg", alt: "Director's chair on set", project: "Talon BTS", year: "2025", category: "bts", role: "Behind the Scenes", aspect: "square" },
  { id: 24, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/sunset-coast.jpg", alt: "Sunset along the Karnataka coast", project: "Karnataka Diaries", year: "2023", category: "landscapes", role: "Photographer", aspect: "wide" },
  { id: 25, src: "https://res.cloudinary.com/placeholder/image/upload/v1/infinite-frames/photography/couple-candid.jpg", alt: "Candid couple at reception", project: "Wedding Cinema: Talon", year: "2025", category: "portraits", role: "Director", aspect: "tall" },
];

export const FEATURED_PHOTOS: number[] = [1, 2, 4, 3, 6, 8];

/* ─── Reels ──────────────────────────────────────────────────────────────── */

export const REELS: Reel[] = [
  { id: "reel-sunflowers-bts", title: "Sunflowers BTS", description: "Behind the scenes of the sunflower field shoot at golden hour.", category: "bts", poster: "/images/V_motionblur.webp", videoSrc: "/videos/sample_video.mp4", duration: 32, featured: true, year: 2024 },
  { id: "reel-christmas-mood", title: "Christmas Mood Edit", description: "A 45-second mood reel from The Christmas Guest, all practical lights.", category: "narrative", poster: "/images/still_christmas.png", videoSrc: "/videos/sample_video.mp4", duration: 45, featured: true, year: 2023 },
  { id: "reel-coffee-teaser", title: "Before The Coffee Gets Cold — Teaser", description: "The official 30-second teaser cut for social.", category: "narrative", poster: "/images/Before The Coffee Gets Cold.jpeg", videoSrc: "/videos/sample_video.mp4", duration: 30, featured: true, year: 2024 },
  { id: "reel-dot-visual", title: "DOT. Visual Poem", description: "An experimental 60-second visual poem in monochrome.", category: "experimental", poster: "/images/still_dot.png", videoSrc: "/videos/sample_video.mp4", duration: 60, year: 2024 },
  { id: "reel-talon-showreel", title: "Talon 2025 Showreel", description: "Talon Production House highlight reel — the year in frames.", category: "narrative", poster: "/images/Talon_productions_logo.png", videoSrc: "/videos/sample_video.mp4", duration: 58, year: 2025 },
  { id: "reel-wedding-highlights", title: "Wedding Highlights — Coastal", description: "A cinematic wedding film condensed into a 45-second reel.", category: "wedding", poster: "/images/Beach_Couple.webp", videoSrc: "/videos/sample_video.mp4", duration: 45, year: 2025 },
  { id: "reel-sees-kaddi-cut", title: "Sees Kaddi — Behind the Performance", description: "The raw acting process captured in 40 seconds.", category: "bts", poster: "/images/still_sees_kaddi.png", videoSrc: "/videos/sample_video.mp4", duration: 40, year: 2023 },
  { id: "reel-monsoon-mysuru", title: "Monsoon Mysuru", description: "Rain, cobblestones, and the quiet poetry of a monsoon walk.", category: "experimental", poster: "/images/Two_women.webp", videoSrc: "/videos/sample_video.mp4", duration: 35, year: 2024 },
  { id: "reel-golden-hour-bts", title: "Golden Hour — How We Shoot It", description: "A 30-second breakdown of our golden hour lighting setup.", category: "bts", poster: "/images/still_bts.webp", videoSrc: "/videos/sample_video.mp4", duration: 30, year: 2025 },
  { id: "reel-karnataka-timelapse", title: "Karnataka Sunrise Timelapse", description: "Paddy fields at dawn, compressed into 20 breathtaking seconds.", category: "experimental", poster: "/images/Beach_Scenic.webp", videoSrc: "/videos/sample_video.mp4", duration: 20, year: 2023 },
  { id: "reel-sunflower-poem", title: "Sunflowers — A Visual Letter", description: "A 50-second poetic edit from the sunflower fields of rural Karnataka.", category: "narrative", poster: "/images/She asked for Sunflowers.jpeg", videoSrc: "/videos/sample_video.mp4", duration: 50, year: 2024 },
  { id: "reel-wedding-ceremony", title: "Wedding Ceremony — Temple", description: "Traditional ceremony shot with anamorphic lenses, 40-second edit.", category: "wedding", poster: "/images/Beach_Scenic.webp", videoSrc: "/videos/sample_video.mp4", duration: 40, year: 2025 },
];

export const FEATURED_REELS: string[] = ["reel-sunflowers-bts", "reel-christmas-mood", "reel-coffee-teaser"];

/* ─── Navigation ─────────────────────────────────────────────────────────── */

export const NAV_ITEMS = [
  { id: "home", label: "Home", href: "#hero", clip: "/videos/sample_video.mp4" },
  { id: "vault", label: "The Vault", href: "#vault", clip: "/videos/sample_video.mp4" },
  { id: "photography", label: "Photography", href: "/photography", clip: "/videos/sample_video.mp4" },

  { id: "connect", label: "Connect", href: "#connect", clip: "/videos/sample_video.mp4" },
];
