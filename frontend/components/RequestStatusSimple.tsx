import React from "react";
import { useRequestStatusSimple } from "@/hooks/useRequestStatusSimple";

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
      <div className="grid grid-cols-3 gap-4 mb-4">
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
        <div className="bg-green-900/30 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-400">
            {stats.verifiedCount}
          </div>
          <div className="text-xs text-green-300">Verified</div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="space-y-2">
        {stats.pendingCount > 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-yellow-400 text-sm">
              {stats.pendingCount} request(s) pending verification
            </span>
          </div>
        )}

        {stats.readyToProcessCount > 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
            <span className="text-orange-400 text-sm">
              {stats.readyToProcessCount} request(s) ready to process
            </span>
          </div>
        )}

        {stats.pendingCount === 0 &&
          stats.readyToProcessCount === 0 &&
          stats.totalRequests > 0 && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-green-400 text-sm">
                All requests completed
              </span>
            </div>
          )}

        {stats.totalRequests === 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-gray-400 text-sm">No requests yet</span>
          </div>
        )}
      </div>

      {/* Processing Flow Explanation */}
      {stats.totalRequests > 0 && (
        <div className="mt-4 pt-3 border-t border-blue-400/20">
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              <strong>Flow:</strong> Request → Pending → Verified
            </p>
            <p>
              <strong>Pending:</strong> Waiting for Chainlink fulfillment
            </p>
            <p>
              <strong>Ready:</strong> Fulfilled, click Process button to
              complete
            </p>
            <p>
              <strong>Verified:</strong> User processed successfully
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
