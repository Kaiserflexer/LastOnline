import React from "react";

export default function Typing({ text }: { text: string }) {
  return (
    <div className="w-full flex justify-start">
      <div className="px-4 py-2 my-1 rounded-2xl bg-white text-gray-500 shadow text-sm italic pulse">
        {text}
      </div>
    </div>
  );
}
