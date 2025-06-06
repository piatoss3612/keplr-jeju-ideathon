"use client";

import { useState, useEffect, useCallback } from "react";
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window {
    keplr?: KeplrWindow["keplr"];
    getOfflineSigner?: KeplrWindow["getOfflineSigner"];
  }
}

// Initia 메인넷 체인 설정
const INITIA_MAINNET_CHAIN_INFO = {
  rpc: "https://rpc-initia.keplr.app",
  rest: "https://lcd-initia.keplr.app",
  chainId: "interwoven-1",
  chainName: "Initia",
  chainSymbolImageUrl:
    "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/interwoven/chain.png",
  walletUrlForStaking: "https://wallet.keplr.app/chains/initia",
  bip44: {
    coinType: 60,
  },
  bech32Config: {
    bech32PrefixAccAddr: "init",
    bech32PrefixAccPub: "initpub",
    bech32PrefixValAddr: "initvaloper",
    bech32PrefixValPub: "initvaloperpub",
    bech32PrefixConsAddr: "initvalcons",
    bech32PrefixConsPub: "initvalconspub",
  },
  currencies: [
    {
      coinDenom: "INIT",
      coinMinimalDenom: "uinit",
      coinDecimals: 6,
      coinGeckoId: "initia",
      coinImageUrl:
        "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/interwoven/chain.png",
    },
  ],
  stakeCurrency: {
    coinDenom: "INIT",
    coinMinimalDenom: "uinit",
    coinDecimals: 6,
    coinGeckoId: "initia",
    coinImageUrl:
      "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/interwoven/chain.png",
  },
  feeCurrencies: [
    {
      coinDenom: "INIT",
      coinMinimalDenom: "uinit",
      coinDecimals: 6,
      coinGeckoId: "initia",
      coinImageUrl:
        "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/interwoven/chain.png",
      gasPriceStep: {
        low: 0.015,
        average: 0.015,
        high: 0.04,
      },
    },
  ],
  features: [
    "force-enable-evm-ledger",
    "eth-address-gen",
    "eth-key-sign",
    "initia-dynamicfee",
    "eth-secp256k1-initia",
    "evm-ledger-sign-plain-json",
  ],
};

export interface KeplrState {
  isInstalled: boolean;
  isConnected: boolean;
  account: {
    address: string;
    name: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export const useKeplr = () => {
  const [state, setState] = useState<KeplrState>({
    isInstalled: false,
    isConnected: false,
    account: null,
    isLoading: false,
    error: null,
  });

  // Keplr 설치 여부 확인
  const checkKeplrInstallation = useCallback(() => {
    if (typeof window !== "undefined") {
      const isInstalled = !!(window.keplr && window.getOfflineSigner);
      setState((prev) => ({ ...prev, isInstalled }));
      return isInstalled;
    }
    return false;
  }, []);

  // Initia 체인 추가
  const addInitiaChain = useCallback(async () => {
    if (!window.keplr) {
      throw new Error("Keplr is not installed");
    }

    try {
      await window.keplr.experimentalSuggestChain(INITIA_MAINNET_CHAIN_INFO);
    } catch (error) {
      console.error("Failed to add Initia chain:", error);
      throw error;
    }
  }, []);

  // Keplr 연결
  const connect = useCallback(async () => {
    if (!checkKeplrInstallation()) {
      setState((prev) => ({
        ...prev,
        error: "Keplr wallet is not installed",
      }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Initia 체인 추가 시도
      await addInitiaChain();

      // Keplr에 체인 활성화 요청
      await window.keplr!.enable(INITIA_MAINNET_CHAIN_INFO.chainId);

      // 계정 정보 가져오기
      const offlineSigner = window.getOfflineSigner!(
        INITIA_MAINNET_CHAIN_INFO.chainId
      );
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const account = accounts[0];
      const key = await window.keplr!.getKey(INITIA_MAINNET_CHAIN_INFO.chainId);

      setState((prev) => ({
        ...prev,
        isConnected: true,
        account: {
          address: account.address,
          name: key.name,
        },
        isLoading: false,
      }));

      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect to Keplr";
      setState((prev) => ({
        ...prev,
        isConnected: false,
        account: null,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [checkKeplrInstallation, addInitiaChain]);

  // 연결 해제
  const disconnect = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      account: null,
      error: null,
    }));
  }, []);

  // 계정 변경 감지
  useEffect(() => {
    if (!window.keplr) return;

    const handleAccountChange = () => {
      // 계정이 변경되면 다시 연결 시도
      if (state.isConnected) {
        connect();
      }
    };

    window.addEventListener("keplr_keystorechange", handleAccountChange);

    return () => {
      window.removeEventListener("keplr_keystorechange", handleAccountChange);
    };
  }, [state.isConnected, connect]);

  // 초기화
  useEffect(() => {
    checkKeplrInstallation();
  }, [checkKeplrInstallation]);

  return {
    ...state,
    connect,
    disconnect,
    checkKeplrInstallation,
  };
};
