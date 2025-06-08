"use client";

import { useEffect, useState } from "react";

type Tab = "connect" | "dashboard" | "proof";

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

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
      <div className="relative flex bg-black/10 backdrop-blur-md rounded-2xl p-1 border border-pink-400/10">
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
