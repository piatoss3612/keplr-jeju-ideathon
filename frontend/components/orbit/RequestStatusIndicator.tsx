"use client";

import React, { useState } from "react";
import { useRequestStatus } from "@/hooks/useRequestStatus";
import { useProcessRequest } from "@/hooks/useProcessRequest";

interface RequestStatusIndicatorProps {
  userAddress?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function RequestStatusIndicator({
  userAddress,
  showTitle = true,
  compact = false,
}: RequestStatusIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    summary: requestSummary,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useRequestStatus(userAddress);

  // Process Request 훅
  const {
    processRequest,
    isLoading: isProcessing,
    transactionHash: processTxHash,
    isSuccess: processSuccess,
    error: processError,
  } = useProcessRequest();

  const handleProcessRequest = async (requestId: string) => {
    console.log("requestId", requestId);

    try {
      await processRequest(requestId);
      // 처리 후 상태 새로고침
      setTimeout(() => {
        refetchRequests();
      }, 3000);
    } catch (error) {
      console.error("Failed to process request:", error);
    }
  };

  if (!userAddress) {
    return null;
  }

  if (compact) {
    // 간단한 상태 표시 + Ready to Process 요청들
    return (
      <div className="space-y-3">
        {requestSummary && (
          <>
            {/* Status Summary */}
            <div className="flex flex-col space-y-2">
              {/* Pending Status */}
              {requestSummary.hasPendingRequests && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                  <span className="font-medium text-yellow-400 text-sm">
                    {requestSummary.pendingRequests.length} request(s) pending
                    Chainlink fulfillment
                  </span>
                </div>
              )}

              {/* Ready to Process Status */}
              {requestSummary.hasReadyToProcessRequests && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                  <span className="font-medium text-orange-400 text-sm">
                    {requestSummary.readyToProcessRequests.length} request(s)
                    ready to process
                  </span>
                </div>
              )}

              {/* All Clear Status */}
              {!requestSummary.hasPendingRequests &&
                !requestSummary.hasReadyToProcessRequests && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="font-medium text-green-400 text-sm">
                      All requests up to date
                    </span>
                  </div>
                )}
            </div>

            {/* Ready to Process Requests in Compact Mode */}
            {requestSummary.hasReadyToProcessRequests && (
              <div className="space-y-2">
                <h4 className="text-orange-300 font-medium text-sm">
                  ⚡ Process These Requests:
                </h4>
                {requestSummary.readyToProcessRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-orange-900/20 border border-orange-400/20 p-2 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-orange-300 text-xs font-mono">
                          ID: {request.internal_id}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleProcessRequest(request.internal_id)
                        }
                        disabled={isProcessing}
                        className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium py-1 px-2 rounded text-xs"
                      >
                        {isProcessing ? "⏳" : "🚀"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Process Status Messages in Compact Mode */}
            {processError && (
              <div className="bg-red-900/20 border border-red-400/30 rounded p-2">
                <p className="text-red-300 text-xs">❌ {processError}</p>
              </div>
            )}

            {processSuccess && processTxHash && (
              <div className="bg-green-900/20 border border-green-400/30 rounded p-2">
                <p className="text-green-300 text-xs">
                  ✅ Processing successful!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // 전체 상태 표시
  return (
    <div className="bg-slate-900/50 border border-green-400/40 rounded-xl p-4 lg:p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-green-300 font-orbitron font-medium text-lg">
            🔄 Request Status Overview
          </h3>
        </div>
      )}

      {isLoadingRequests ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
          <span className="text-green-300 text-sm">
            Loading request status...
          </span>
        </div>
      ) : requestSummary ? (
        <div className="space-y-4">
          {/* 3단계 처리 상태 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-900/30 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-400">
                {requestSummary.totalRequests}
              </div>
              <div className="text-xs text-blue-300">Total Requests</div>
            </div>
            <div className="bg-yellow-900/30 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-yellow-400">
                {requestSummary.pendingRequests?.length || 0}
              </div>
              <div className="text-xs text-yellow-300">🕐 Pending</div>
            </div>
            <div className="bg-orange-900/30 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-orange-400">
                {requestSummary.readyToProcessRequests?.length || 0}
              </div>
              <div className="text-xs text-orange-300">⚡ Ready</div>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-green-400">
                {requestSummary.totalVerified}
              </div>
              <div className="text-xs text-green-300">✅ Verified</div>
            </div>
          </div>

          {/* 처리 단계 설명 */}
          <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-gray-300">
            <p className="mb-1">
              <strong>Request Processing Flow:</strong>
            </p>
            <p>
              🕐 <strong>Pending:</strong> Waiting for Chainlink Functions
              fulfillment
            </p>
            <p>
              ⚡ <strong>Ready:</strong> Fulfilled, click Process button to
              complete
            </p>
            <p>
              ✅ <strong>Verified:</strong> Processing completed successfully
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-col space-y-2">
            {/* Pending Status */}
            {requestSummary.hasPendingRequests && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                <span className="font-medium text-yellow-400">
                  {requestSummary.pendingRequests.length} request(s) pending
                  Chainlink fulfillment
                </span>
              </div>
            )}

            {/* Ready to Process Status */}
            {requestSummary.hasReadyToProcessRequests && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                <span className="font-medium text-orange-400">
                  {requestSummary.readyToProcessRequests.length} request(s)
                  ready to process
                </span>
              </div>
            )}

            {/* All Clear Status */}
            {!requestSummary.hasPendingRequests &&
              !requestSummary.hasReadyToProcessRequests && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="font-medium text-green-400">
                    All requests up to date
                  </span>
                </div>
              )}
          </div>

          {/* Ready to Process Requests - 실제 요청 리스트 */}
          {requestSummary.hasReadyToProcessRequests && (
            <div className="mt-4 bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-orange-300 font-medium flex items-center space-x-2">
                  <span>⚡</span>
                  <span>
                    Ready to Process (
                    {requestSummary.readyToProcessRequests.length})
                  </span>
                </h4>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-orange-400 hover:text-orange-300 text-sm"
                >
                  {isExpanded ? "▼ Hide" : "▶ Show"}
                </button>
              </div>

              {isExpanded && (
                <div className="space-y-3">
                  {requestSummary.readyToProcessRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-orange-900/20 border border-orange-400/20 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-orange-300 text-sm font-mono">
                            Request ID: {request.internal_id}
                          </p>
                          <p className="text-orange-200 text-xs">
                            {new Date(
                              parseInt(request.blockTimestamp) * 1000
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={`https://sepolia.basescan.org/tx/${request.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-300 text-xs underline"
                          >
                            View ↗
                          </a>
                          <button
                            onClick={() =>
                              handleProcessRequest(request.internal_id)
                            }
                            disabled={isProcessing}
                            className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium py-1 px-3 rounded-lg transition-all duration-300 text-xs"
                          >
                            {isProcessing ? "Processing..." : "🚀 Process"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Requests - 실제 대기 중인 요청 리스트 */}
          {requestSummary.hasPendingRequests && (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-yellow-300 font-medium flex items-center space-x-2">
                  <span>🕐</span>
                  <span>
                    Pending Requests ({requestSummary.pendingRequests.length})
                  </span>
                </h4>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  {isExpanded ? "▼ Hide" : "▶ Show"}
                </button>
              </div>

              {isExpanded && (
                <div className="space-y-3">
                  {requestSummary.pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-yellow-900/20 border border-yellow-400/20 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-yellow-300 text-sm font-mono">
                            Request ID: {request.internal_id}
                          </p>
                          <p className="text-yellow-200 text-xs">
                            Waiting for Chainlink fulfillment...
                          </p>
                          <p className="text-yellow-200 text-xs">
                            {new Date(
                              parseInt(request.blockTimestamp) * 1000
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={`https://basescan.org/tx/${request.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300 text-xs underline"
                          >
                            View ↗
                          </a>
                          <div className="text-yellow-400 text-xs px-2 py-1 bg-yellow-400/10 rounded">
                            ⏳ Pending
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Process Status Messages */}
          {processError && (
            <div className="mt-4 bg-red-900/20 border border-red-400/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">❌ Error: {processError}</p>
            </div>
          )}

          {processSuccess && processTxHash && (
            <div className="mt-4 bg-green-900/20 border border-green-400/30 rounded-lg p-3">
              <p className="text-green-300 text-sm">
                ✅ Processing successful!{" "}
                <a
                  href={`https://basescan.org/tx/${processTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-200"
                >
                  View Transaction ↗
                </a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No GraphQL data available</p>
      )}
    </div>
  );
}
