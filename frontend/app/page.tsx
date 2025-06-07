import OrbitRewardsCard from "../components/tabs/OrbitRewardsCard";
import SpaceBackground from "../components/background/SpaceBackground";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Framer Motion Space Background */}
      <SpaceBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold font-orbitron bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
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
