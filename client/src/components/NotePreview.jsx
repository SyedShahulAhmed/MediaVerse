import { useState } from "react";

export default function NotePreview({ note, title, onOpen }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_WORDS = 40; // you can tweak

  const words = note.trim().split(/\s+/);
  const isLong = words.length > MAX_WORDS;
  const displayText = expanded
    ? note
    : words.slice(0, MAX_WORDS).join(" ") + (isLong ? "..." : "");

  return (
    <div className="group bg-[#121214] border border-transparent hover:border-[#2d2d38]/60 transition rounded-lg px-3 py-2 text-xs text-gray-300 leading-relaxed relative overflow-hidden">
      <p className="break-words whitespace-pre-wrap">{displayText}</p>

      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="mt-1 text-purple-400 hover:text-purple-300 transition text-[11px] font-medium"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
