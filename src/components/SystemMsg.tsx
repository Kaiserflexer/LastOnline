import React from "react";

export default function SystemMsg({ text }: { text: string }) {
  return (
    <div className="w-full flex justify-center my-2 fadeIn">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl
                      bg-blue-900/30 border border-blue-500/40
                      text-blue-200 text-sm italic"
      >
        <span className="text-blue-400">⚙️</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
