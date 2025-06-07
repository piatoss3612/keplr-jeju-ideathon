"use client";

type Tab = "connect" | "dashboard" | "proof";

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs = [
    {
      id: "connect" as Tab,
      label: "🔗 Connect",
      clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
    },
    {
      id: "dashboard" as Tab,
      label: "🌌 Dashboard",
      clipPath: "polygon(10% 0, 90% 0, 90% 100%, 10% 100%)",
    },
    {
      id: "proof" as Tab,
      label: "⚡ Generate Proof",
      clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
    },
  ];

  return (
    <div className="flex justify-center mb-0 relative z-20">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 relative border-t border-l border-r backdrop-blur-xl ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-slate-900/95 to-purple-900/95 text-white border-pink-400/40 shadow-lg"
                : "bg-slate-900/60 text-pink-300 hover:text-white hover:bg-slate-800/80 border-pink-400/20"
            }`}
            style={{
              clipPath: activeTab === tab.id ? "none" : tab.clipPath,
            }}
          >
            <span className="relative z-10 font-orbitron">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-t-xl"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Tab };
