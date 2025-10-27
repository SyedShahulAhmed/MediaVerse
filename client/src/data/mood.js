// ✅ src/data/moods.js
const MOODS = [
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "inspiring", label: "Inspiring" },
  { value: "dark", label: "Dark" },
  { value: "thrilling", label: "Thrilling" },
  { value: "wholesome", label: "Wholesome" },
  { value: "romantic", label: "Romantic" },
  { value: "nostalgic", label: "Nostalgic" },
  { value: "funny", label: "Funny" },
  { value: "mysterious", label: "Mysterious" },
  { value: "epic", label: "Epic" },
  { value: "motivational", label: "Motivational" },
  { value: "chill", label: "Chill" },
  { value: "emotional", label: "Emotional" },
  { value: "dramatic", label: "Dramatic" },
  { value: "adventurous", label: "Adventurous" },
  { value: "suspenseful", label: "Suspenseful" },
  { value: "scary", label: "Scary" },
  { value: "relaxing", label: "Relaxing" },
  { value: "mind-blowing", label: "Mind-blowing" },
  { value: "other", label: "Other" },
];

export default MOODS;

// 🧠 Optional mood map for Dashboard tags (no emojis)
export const moodMap = Object.fromEntries(MOODS.map((m) => [m.value, ""]));
