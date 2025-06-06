"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";

export default function ReownWalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">지갑 연결됨</p>
          <p className="text-xs text-green-600 font-mono break-all">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => open({ view: "Account" })}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            계정
          </button>
          <button
            onClick={() => open({ view: "Networks" })}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            네트워크
          </button>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            연결 해제
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm font-medium text-yellow-800 mb-3">
        지갑을 연결하여 시작하세요
      </p>
      <div className="space-y-2">
        <button
          onClick={() => open()}
          className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          지갑 연결
        </button>
        <p className="text-xs text-gray-600 text-center">
          600개 이상의 지갑 지원 • 이메일/소셜 로그인 • 온램프 기능
        </p>
      </div>
    </div>
  );
}
