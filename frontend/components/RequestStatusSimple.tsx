import React, { useEffect } from "react";
import { useRequestStatusSimple } from "@/hooks/useRequestStatusSimple";
import { useProcessRequest } from "@/hooks/useProcessRequest";
import { useOrbitChronicleRefetch } from "@/hooks/useOrbitChronicleData";

interface RequestStatusSimpleProps {
  userAddress?: string;
  className?: string;
}

export default function RequestStatusSimple({
  userAddress,
  className = "",
}: RequestStatusSimpleProps) {
  const { stats, isLoading, error, refetch, isRefetching } =
    useRequestStatusSimple(userAddress);

  const {
    processRequest,
    isLoading: isProcessing,
    isSuccess: isProcessSuccess,
    error: processError,
    reset: resetProcessRequest,
  } = useProcessRequest();

  // 전체 OrbitChronicle 데이터 refetch
  const { refetchAll } = useOrbitChronicleRefetch();

  // processRequest 성공 후 3초 딜레이로 상태 갱신
  useEffect(() => {
    if (isProcessSuccess) {
      const timer = setTimeout(async () => {
        // RequestStatus 데이터와 전체 OrbitChronicle 데이터 모두 갱신
        await Promise.all([refetch(), refetchAll()]);
        resetProcessRequest(); // 성공 상태 리셋
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isProcessSuccess, refetch, refetchAll, resetProcessRequest]);

  const handleProcessRequest = async (requestId: string) => {
    try {
      await processRequest(requestId);
    } catch (error) {
      console.error("Failed to process request:", error);
    }
  };

  if (!userAddress || isLoading) {
    return (
      <div
        className={`bg-slate-900/50 border border-blue-400/40 rounded-xl p-4 ${className}`}
      >
        <h3 className="text-blue-300 font-orbitron font-medium text-lg mb-4">
          📊 Request Status
        </h3>
        <div className="flex items-center space-x-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <span className="text-blue-300 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-slate-900/50 border border-red-400/40 rounded-xl p-4 ${className}`}
      >
        <h3 className="text-red-300 font-orbitron font-medium text-lg mb-4">
          📊 Request Status
        </h3>
        <p className="text-red-300 text-sm">Unable to load data</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900/50 border border-blue-400/40 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-blue-300 font-orbitron font-medium text-lg">
          📊 Request Status
        </h3>
        <button
          onClick={refetch}
          disabled={isRefetching}
          className="group relative px-4 py-2 bg-blue-900/30 
                     hover:bg-blue-800/40 disabled:bg-gray-600/20
                     border border-blue-400/40 hover:border-blue-400/60 
                     disabled:border-gray-500/40 rounded-lg 
                     text-blue-300 hover:text-blue-200 disabled:text-gray-400 
                     text-sm font-semibold transition-all duration-300
                     disabled:cursor-not-allowed
                     shadow-lg hover:shadow-blue-400/20 hover:shadow-xl
                     transform hover:scale-105 disabled:hover:scale-100
                     backdrop-blur-sm"
        >
          {isRefetching && (
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
              <div
                className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full 
                              shadow-lg shadow-blue-400/50"
              ></div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span
              className={`text-base transition-transform duration-300 ${
                isRefetching ? "animate-spin" : "group-hover:rotate-180"
              }`}
            >
              🔄
            </span>
            <span className="font-orbitron">Refresh</span>
          </div>
          {/* Hover glow effect */}
          <div
            className="absolute inset-0 rounded-lg bg-blue-400/0 
                          group-hover:bg-blue-400/10 
                          transition-all duration-300 pointer-events-none"
          ></div>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-900/30 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-400">
            {stats.totalRequests}
          </div>
          <div className="text-xs text-blue-300">Total</div>
        </div>
        <div className="bg-yellow-900/30 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-400">
            {stats.pendingCount}
          </div>
          <div className="text-xs text-yellow-300">Pending</div>
        </div>
        <div className="bg-orange-900/30 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-orange-400">
            {stats.readyToProcessCount}
          </div>
          <div className="text-xs text-orange-300">Ready</div>
        </div>
        <div className="bg-green-900/30 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-400">
            {stats.verifiedCount}
          </div>
          <div className="text-xs text-green-300">Verified</div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mb-4">
        {stats.totalRequests === 0 && (
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm py-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span>No requests yet</span>
          </div>
        )}

        {stats.pendingCount === 0 &&
          stats.readyToProcessCount === 0 &&
          stats.totalRequests > 0 && (
            <div className="flex items-center justify-center space-x-2 text-green-400 text-sm py-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>All requests completed</span>
            </div>
          )}
      </div>

      {/* Process Status Display */}
      {processError && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
          <div className="text-red-300 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            Process failed: {processError}
          </div>
        </div>
      )}

      {isProcessSuccess && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
          <div className="text-green-300 text-sm flex items-center">
            <span className="mr-2">✅</span>
            Process successful! Status will update in 3 seconds...
          </div>
        </div>
      )}

      {/* Ready to Process Requests */}
      {stats.readyToProcessRequests.length > 0 && (
        <div className="mt-4 pt-3 border-t border-green-400/20">
          <h4 className="text-green-300 font-orbitron font-bold text-sm mb-3 flex items-center">
            <span className="mr-2 animate-pulse">⚡</span>
            READY TO PROCESS ({stats.readyToProcessRequests.length})
          </h4>
          <div className="space-y-3">
            {stats.readyToProcessRequests.map((request) => (
              <div
                key={request.id}
                className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 
                          hover:bg-green-900/30 hover:border-green-400/50 
                          transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-green-300 font-mono text-xs">
                      {request.requestId.slice(0, 12)}...
                      {request.requestId.slice(-10)}
                    </div>
                    <div className="text-green-200/70 text-xs font-medium mt-1">
                      {request.isVerification
                        ? "🔄 Verification"
                        : "🚀 Initial Registration"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleProcessRequest(request.requestId)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-lg font-orbitron font-bold text-xs
                              transition-all duration-200 border
                              ${
                                isProcessing
                                  ? "bg-gray-700/60 border-gray-600/60 text-gray-400 cursor-not-allowed"
                                  : "bg-green-600/80 hover:bg-green-500/90 border-green-400/60 hover:border-green-300/80 text-white hover:shadow-lg hover:shadow-green-400/30"
                              }`}
                  >
                    <div className="flex items-center space-x-2">
                      {isProcessing ? (
                        <>
                          <div className="animate-spin w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                          <span>PROCESSING</span>
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          <span>PROCESS</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Flow */}
      {stats.totalRequests > 0 && (
        <div className="mt-4 pt-2 border-t border-blue-400/20">
          <div className="text-xs text-gray-500 text-center">
            Request → Pending → Ready → Verified
          </div>
        </div>
      )}
    </div>
  );
}
