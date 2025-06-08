"use client";

import { useEffect, useState } from "react";

type Tab = "connect" | "dashboard" | "proof";

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  {
    id: "connect" as Tab,
    label: "🔗 Connect",
    icon: "🔗",
    text: "CONNECT",
  },
  {
    id: "dashboard" as Tab,
    label: "🌌 Dashboard",
    icon: "🌌",
    text: "DASHBOARD",
  },
  {
    id: "proof" as Tab,
    label: "⚡ Register",
    icon: "⚡",
    text: "REGISTER",
  },
];

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // 활성 탭에 따라 인디케이터 위치 계산
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const tabWidth = 100 / tabs.length; // 각 탭의 상대적 폭
    setIndicatorStyle({
      left: activeIndex * tabWidth,
      width: tabWidth,
    });
  }, [activeTab]);

  return (
    <div className="flex justify-center mb-0 relative z-20">
      {/* 모바일 Select (sm 미만에서만 표시) */}
      <div className="flex sm:hidden w-full max-w-sm px-4">
        <div className="relative w-full">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as Tab)}
            className="w-full bg-gradient-to-r from-black/20 to-purple-900/20 backdrop-blur-md 
                     rounded-2xl px-6 py-4 border border-pink-400/30 text-white 
                     font-orbitron font-bold text-sm tracking-wider
                     focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50
                     appearance-none cursor-pointer shadow-lg shadow-pink-500/10
                     transition-all duration-300 hover:border-pink-400/50"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(147,51,234,0.2) 50%, rgba(236,72,153,0.15) 100%)",
            }}
          >
            {tabs.map((tab) => (
              <option
                key={tab.id}
                value={tab.id}
                className="bg-slate-900/95 text-white py-2"
              >
                {tab.icon} {tab.text}
              </option>
            ))}
          </select>

          {/* 커스텀 드롭다운 화살표 */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
            <div
              className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-300/20 to-pink-300/20 
                          flex items-center justify-center backdrop-blur-sm"
            >
              <svg
                className="w-3 h-3 text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* 글로우 효과 */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-pink-500/5 
                        opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        </div>
      </div>

      {/* 데스크톱 탭 네비게이션 (sm 이상에서만 표시) */}
      <div className="hidden sm:flex relative bg-black/10 backdrop-blur-md rounded-2xl p-1 border border-pink-400/10">
        {/* 슬라이딩 배경 인디케이터 */}
        <div
          className="absolute top-1 bottom-1 bg-gradient-to-r from-slate-900/70 to-purple-900/70 
                     rounded-xl border border-pink-400/30 shadow-lg shadow-pink-500/15
                     transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}%`,
            width: `${indicatorStyle.width}%`,
          }}
        />

        {/* 슬라이딩 그라데이션 오버레이 */}
        <div
          className="absolute top-1 bottom-1 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 
                     rounded-xl transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}%`,
            width: `${indicatorStyle.width}%`,
          }}
        />

        {/* 슬라이딩 하단 인디케이터 라인 */}
        <div
          className="absolute bottom-1 h-0.5 bg-gradient-to-r from-cyan-400/70 to-pink-400/70 
                     rounded-full transition-all duration-300 ease-out"
          style={{
            left: `calc(${indicatorStyle.left}% + 1.5rem)`,
            width: `calc(${indicatorStyle.width}% - 3rem)`,
          }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 rounded-xl font-orbitron font-bold text-sm tracking-wider
              transition-all duration-300 flex items-center space-x-2 z-10
              ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-pink-300/60 hover:text-pink-200/80"
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Tab };
