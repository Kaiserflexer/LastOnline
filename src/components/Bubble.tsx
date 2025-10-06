import React from "react";

export default function Bubble({
  from,
  me,
  anim,
  children
}: {
  from?: string;
  me?: boolean;
  anim?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`w-full flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2 my-1 rounded-2xl shadow ${
          me
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-white text-gray-900 rounded-bl-sm"
        } ${anim ?? "fadeIn"}`}
      >
        {from && !me && <div className="text-xs opacity-60 mb-0.5">{from}</div>}
        <div className="leading-relaxed whitespace-pre-wrap">{children}</div>
      </div>
    </div>
  );
}
