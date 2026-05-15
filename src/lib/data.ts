import type { Project, Service, JournalPost } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "sunflowers",
    title: "She Asked for Sunflowers",
    role: "Director · DOP · Editor · Actor",
    poster: "/images/image_tester_1.png",
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
    poster: "/images/image_tester_1.png",
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
    poster: "/images/image_tester_1.png",
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
    poster: "/images/image_tester_1.png",
    video: null,
    badges: [],
    year: 2024,
    category: "narrative",
    description:
      "A single frame. A single feeling. DOT. is Pratham's most experimental short — a visual poem about existence stripped down to its most elemental form.",
  },
  {
    id: "wedding",
    title: "Talon Wedding Films",
    role: "Lead Cinematographer",
    poster: "/images/image_tester_1.png",
    video: "/videos/sample_video.mp4",
    badges: ["Wedding Cinema"],
    year: 2024,
    category: "wedding",
    description:
      "Real emotions. Real people. Real forever. Talon Production House turns Karnataka's most important days into lifelong visual poetry. Every wedding is a film. Every frame, a feeling.",
  },
  {
    id: "sees-kaddi",
    title: "Sees Kaddi",
    role: "Actor",
    poster: "/images/image_tester_1.png",
    video: "/videos/sample_video.mp4",
    badges: ["Acting Reel"],
    year: 2023,
    category: "acting",
    description:
      "Stepping in front of the lens for the first time. Pratham's acting debut — a deeply personal performance that proved the director understands his actors because he has been one.",
  },
];

export const SERVICES: Service[] = [
  {
    id: "wedding",
    title: "Wedding Cinematography & Photography",
    description:
      "Your real emotions, your biggest day, transformed into lifelong visual poetry. Talon captures every glance, every tear, every burst of laughter — with cinematic precision and a deeply personal touch.",
    color: "#D4AF77",
    icon: "heart",
    videoLoop: "/videos/sample_video.mp4",
  },
  {
    id: "narrative",
    title: "Narrative Shorts & Indie Kannada Films",
    description:
      "Emotionally raw stories that chase feelings, not formulas. From concept to final grade — Pratham brings the full weight of a festival-selected filmmaker to every project.",
    color: "#7ED4D4",
    icon: "film",
    videoLoop: "/videos/sample_video.mp4",
  },
  {
    id: "commercial",
    title: "Commercial & Brand Films",
    description:
      "Visual stories that make brands unforgettable. Cinematic storytelling applied to your product — because great brands deserve more than ads. They deserve films.",
    color: "#FF5E5E",
    icon: "star",
    videoLoop: "/videos/sample_video.mp4",
  },
  {
    id: "dop",
    title: "DOP · Editing · Color Grading",
    description:
      "Hire the eye. LV Prasad-trained, Phalke-selected. Full post-production pipeline — from set to screen — with obsessive cinematic precision and that signature Kannada golden-hour warmth.",
    color: "#F5F0E8",
    icon: "aperture",
    videoLoop: "/videos/sample_video.mp4",
  },
];

export const ABOUT_FRAMES = [
  {
    year: "2006",
    title: "Born in Mysuru",
    description: "Under golden-hour Karnataka skies, in the shadow of a palace. Pratham Raje Urs draws first breath.",
    image: "/images/image_tester_1.png",
  },
  {
    year: "2016 · Age 10",
    title: "First Frame",
    description: "A smartphone. A sunlit lane. The first time light was trapped in a frame. Nothing was ever the same.",
    image: "/images/image_tester_1.png",
    hasVideo: true,
  },
  {
    year: "2023–24",
    title: "LV Prasad · Chennai",
    description: "Trained at the legendary LV Prasad College of Cinematography. Learning the grammar of light.",
    image: "/images/image_tester_1.png",
  },
  {
    year: "2023",
    title: "Sees Kaddi · Actor",
    description: "The director steps in front of the lens. Understanding the actor's vulnerability from the inside.",
    image: "/images/image_tester_1.png",
  },
  {
    year: "2024",
    title: "Talon Production House",
    description: "Founded in Bengaluru. A home for Kannada stories that dare to feel something.",
    image: "/images/image_tester_1.png",
  },
  {
    year: "Now",
    title: "Still Chasing Feelings",
    description: "Every frame. Every film. Every wedding day. Still chasing that one perfect feeling.",
    image: "/images/image_tester_1.png",
  },
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: "sunflowers-diary",
    title: "Location Diary: Finding the Field",
    date: "2024-03-15",
    category: "Making Of",
    excerpt: "Drove three hours from Mysuru before we found the right sunflowers. The light at 4pm was exactly what the script needed.",
    image: "/images/image_tester_1.png",
    video: "/videos/sample_video.mp4",
    readTime: "4 min read",
  },
  {
    id: "christmas-phalke",
    title: "The Night We Got The Call from Dada Saheb Phalke",
    date: "2023-12-20",
    category: "Festival",
    excerpt: "We were editing at 2am when the email arrived. I read it four times before I believed it.",
    image: "/images/image_tester_1.png",
    readTime: "6 min read",
  },
  {
    id: "wedding-emotion",
    title: "Why I Shoot Weddings Like I Shoot Shorts",
    date: "2024-05-10",
    category: "Philosophy",
    excerpt: "The same eye that finds the feeling in a character study finds it in a first dance. Emotion doesn't know genre.",
    image: "/images/image_tester_1.png",
    readTime: "5 min read",
  },
  {
    id: "talon-founding",
    title: "Why I Started Talon in Bengaluru",
    date: "2024-01-08",
    category: "Story",
    excerpt: "Not because it made business sense. Because Kannada stories deserve to be told with cinematic ambition.",
    image: "/images/image_tester_1.png",
    readTime: "7 min read",
  },
];

export const NAV_ITEMS = [
  { id: "home", label: "Home", href: "#hero", clip: "/videos/sample_video.mp4" },
  { id: "about", label: "About", href: "#about", clip: "/videos/sample_video.mp4" },
  { id: "vault", label: "The Vault", href: "#vault", clip: "/videos/sample_video.mp4" },
  { id: "services", label: "Services", href: "#services", clip: "/videos/sample_video.mp4" },
  { id: "photography", label: "Photography", href: "#photography", clip: "/videos/sample_video.mp4" },
  { id: "journal", label: "Journal", href: "#journal", clip: "/videos/sample_video.mp4" },
  { id: "connect", label: "Connect", href: "#connect", clip: "/videos/sample_video.mp4" },
];

