import OrbitRewardsCard from "./components/OrbitRewardsCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 border border-purple-400 rounded-full animate-spin-slow"></div>
        <div className="absolute w-64 h-64 border border-blue-400 rounded-full animate-spin-reverse"></div>
        <div className="absolute w-32 h-32 border border-cyan-400 rounded-full animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Orbit Rewards
            </h1>
            <p className="text-purple-200 text-lg">
              Enter the blockchain orbit
            </p>
          </div>

          <OrbitRewardsCard />
        </div>
      </div>
    </div>
  );
}
