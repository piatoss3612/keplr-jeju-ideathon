"use client";

import { ReactNode } from "react";

interface CyberpunkCardProps {
  children: ReactNode;
}

export default function CyberpunkCard({ children }: CyberpunkCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl border border-pink-400/40 shadow-2xl relative overflow-hidden">
      {/* 사이버펑크 카드 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-2xl"></div>

      {/* 네온 글로우 효과 */}
      <div className="absolute inset-0 rounded-2xl shadow-inner shadow-pink-500/25"></div>

      {/* 추가 사이버펑크 글로우 */}
      <div className="absolute inset-px bg-gradient-to-br from-cyan-500/5 to-pink-500/5 rounded-2xl"></div>

      {/* 컨텐츠 */}
      <div className="p-6 lg:p-8 relative z-10">{children}</div>
    </div>
  );
}
