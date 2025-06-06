import OrbitRewardsCard from "./components/OrbitRewardsCard";
import SpaceBackground from "./components/SpaceBackground";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Framer Motion Space Background */}
      <SpaceBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Orbit Rewards
            </h1>
            <p className="text-cyan-200 text-lg">Enter the blockchain orbit</p>
          </div>

          <OrbitRewardsCard />
        </div>
      </div>
    </div>
  );
}
