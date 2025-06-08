import OrbitRewardsCard from "../components/tabs/OrbitRewardsCard";
import SpaceBackground from "../components/background/SpaceBackground";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Framer Motion Space Background */}
      <SpaceBackground />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-4xl">
          {/* Enhanced Project Title */}
          <div className="text-center mb-6 lg:mb-10">
            <div className="relative inline-block">
              {/* Animated background elements */}
              <div className="absolute -top-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40 delay-300"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-35 delay-700"></div>

              <h1 className="text-4xl lg:text-6xl font-bold font-orbitron tracking-wider mb-4 relative">
                <span
                  className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent 
                               drop-shadow-lg animate-pulse"
                >
                  ORBIT
                </span>
                <br />
                <span
                  className="bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent 
                               drop-shadow-lg animate-pulse delay-200"
                >
                  REWARDS
                </span>

                {/* Glitch effect overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent 
                               opacity-20 animate-pulse delay-500"
                >
                  ORBIT
                  <br />
                  REWARDS
                </div>
              </h1>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px w-12 lg:w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <p
                className="text-cyan-200/80 text-base lg:text-lg font-orbitron tracking-wide px-4 py-2 
                           bg-black/20 backdrop-blur-sm rounded-full border border-cyan-400/20"
              >
                ENTER THE BLOCKCHAIN ORBIT
              </p>
              <div className="h-px w-12 lg:w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
          </div>

          <OrbitRewardsCard />
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="relative z-10 ">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-4">
              <p className="text-gray-500 text-sm font-orbitron tracking-wide">
                © 2025 ORBITREWARDS
              </p>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
