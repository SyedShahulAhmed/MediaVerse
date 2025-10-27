// ✅ src/data/platforms.js
const PLATFORMS = [
  { name: "Netflix", logo: "/assets/platforms/netflix.svg" },
  { name: "Amazon Prime", logo: "/assets/platforms/primevideo.svg" },
  { name: "Jio Hotstar", logo: "/assets/platforms/jio.svg" },
  { name: "HBO Max", logo: "/assets/platforms/hbo.svg" },
  { name: "Crunchyroll", logo: "/assets/platforms/crunchyroll.svg" },
  { name: "YouTube", logo: "/assets/platforms/youtube.svg" },
  { name: "Movie Theatre", logo: "/assets/platforms/asciinema.svg" },
  { name: "Apple TV", logo: "/assets/platforms/appletv.svg" },
  { name: "Hulu", logo: "/assets/platforms/hulu.svg" },
  { name: "PlayStation", logo: "/assets/platforms/playstation.svg" },
  { name: "Xbox", logo: "/assets/platforms/xbox.svg" },
  { name: "PC", logo: "/assets/platforms/windows.svg" },
  { name: "Switch", logo: "/assets/platforms/nintendoswitch.svg" },
  { name: "Kindle", logo: "/assets/platforms/amazon.svg" },
  { name: "Audible", logo: "/assets/platforms/audible.svg" },
  { name: "Other", logo: "/assets/platforms/internetarchive.svg" },
];

export default PLATFORMS;

// 🎨 Also export a map for quick lookup (used in Dashboard)
export const PLATFORM_LOGOS = Object.fromEntries(
  PLATFORMS.map((p) => [p.name, p.logo])
);
