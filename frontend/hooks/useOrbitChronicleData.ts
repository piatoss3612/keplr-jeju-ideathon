import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { OrbitChronicleAbi, OrbitNftAbi } from "@/utils/abis";
import { OrbitChronicleAddress, OrbitNftAddress } from "@/utils/constants";

export interface UserOrbitData {
  // NFT 관련
  hasNFT: boolean;
  tokenId: bigint;
  tokenURI?: string;
  svgImage?: string;

  // 티어 관련
  tier: number;
  tierName: string;
  amount: bigint;

  // 점수 관련
  currentScore: bigint;
  boostPoints: bigint;
  scoreActive: boolean;

  // 시간 관련
  nextVerificationTime: bigint;
  verificationCount: bigint;

  // 새로운 혜택 시스템
  weeklyBenefits: {
    isEligible: boolean;
    currentWeek: bigint;
    tierLevel: bigint;
  };
  instantReward: {
    reward: bigint;
    multiplier: bigint;
  };

  // 상태
  timeUntilNextVerification: number; // seconds
  isVerificationAvailable: boolean;
  isLoading: boolean;
  error?: string;
}

const TIER_NAMES = ["Asteroid", "Comet", "Star", "Galaxy"];

// tokenURI에서 SVG 이미지 추출하는 함수
function extractSVGFromTokenURI(tokenURI: string): string | undefined {
  try {
    // data:application/json;base64, 형태의 tokenURI를 파싱
    if (tokenURI.startsWith("data:application/json;base64,")) {
      const base64Data = tokenURI.replace("data:application/json;base64,", "");
      const jsonString = atob(base64Data);
      const metadata = JSON.parse(jsonString);

      // image 필드에서 SVG 추출
      if (
        metadata.image &&
        metadata.image.startsWith("data:image/svg+xml;base64,")
      ) {
        const svgBase64 = metadata.image.replace(
          "data:image/svg+xml;base64,",
          ""
        );
        return atob(svgBase64);
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error parsing tokenURI:", error);
    return undefined;
  }
}

// 전역 refetch 트리거 - Provider에서 사용할 수 있도록
let globalRefetchTrigger: (() => void) | null = null;

export function triggerOrbitDataRefresh() {
  if (globalRefetchTrigger) {
    globalRefetchTrigger();
  }
}

// 상위 훅: 모든 readContract 관리
function useOrbitChronicleContracts() {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState<bigint>(BigInt(0));
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // 글로벌 refetch 트리거 설정
  useEffect(() => {
    globalRefetchTrigger = () => {
      setRefreshCounter((prev) => prev + 1);
    };
    return () => {
      globalRefetchTrigger = null;
    };
  }, []);

  // 사용자 상태 정보 가져오기
  const {
    data: userStatus,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchUserStatus,
  } = useReadContract({
    address: OrbitChronicleAddress,
    abi: OrbitChronicleAbi,
    functionName: "getUserStatus",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // NFT tokenURI 가져오기 (tokenId가 있을 때만)
  const { data: tokenURI, refetch: refetchTokenURI } = useReadContract({
    address: OrbitNftAddress,
    abi: OrbitNftAbi,
    functionName: "tokenURI",
    args: tokenId > BigInt(0) ? [tokenId] : undefined,
    query: {
      enabled: hasNFT && tokenId > BigInt(0),
    },
  });

  // 주간 혜택 상태 가져오기
  const { data: weeklyBenefitsData, refetch: refetchWeeklyBenefits } =
    useReadContract({
      address: OrbitChronicleAddress,
      abi: OrbitChronicleAbi,
      functionName: "getWeeklyBenefitStatus",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address && hasNFT,
      },
    });

  // 즉시 보상 계산
  const { data: instantRewardData, refetch: refetchInstantReward } =
    useReadContract({
      address: OrbitChronicleAddress,
      abi: OrbitChronicleAbi,
      functionName: "calculateInstantReward",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address && hasNFT,
      },
    });

  // refreshCounter가 변경될 때마다 모든 데이터 refetch
  useEffect(() => {
    if (refreshCounter > 0 && address) {
      const refetchAll = async () => {
        await Promise.all([
          refetchUserStatus(),
          refetchTokenURI(),
          refetchWeeklyBenefits(),
          refetchInstantReward(),
        ]);
      };

      // 트랜잭션 완료 후 약간의 지연을 둠
      const timer = setTimeout(refetchAll, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    refreshCounter,
    address,
    refetchUserStatus,
    refetchTokenURI,
    refetchWeeklyBenefits,
    refetchInstantReward,
  ]);

  return {
    userStatus,
    statusLoading,
    statusError,
    tokenURI,
    weeklyBenefitsData,
    instantRewardData,
    refetchUserStatus,
    refetchTokenURI,
    refetchWeeklyBenefits,
    refetchInstantReward,
    setTokenId,
    setHasNFT,
  };
}

export function useOrbitChronicleData() {
  const { address } = useAccount();
  const [data, setData] = useState<UserOrbitData>({
    hasNFT: false,
    tokenId: BigInt(0),
    tier: 0,
    tierName: "Asteroid",
    amount: BigInt(0),
    currentScore: BigInt(0),
    boostPoints: BigInt(0),
    scoreActive: false,
    nextVerificationTime: BigInt(0),
    verificationCount: BigInt(0),
    weeklyBenefits: {
      isEligible: false,
      currentWeek: BigInt(0),
      tierLevel: BigInt(0),
    },
    instantReward: {
      reward: BigInt(0),
      multiplier: BigInt(0),
    },
    timeUntilNextVerification: 0,
    isVerificationAvailable: false,
    isLoading: true,
  });

  const {
    userStatus,
    statusLoading,
    statusError,
    tokenURI,
    weeklyBenefitsData,
    instantRewardData,
    setTokenId,
    setHasNFT,
  } = useOrbitChronicleContracts();

  useEffect(() => {
    if (!address) {
      setData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    if (statusLoading) {
      setData((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    if (statusError) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: statusError.message,
      }));
      return;
    }

    if (!userStatus) {
      setData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // userStatus는 struct 반환이므로 속성으로 접근
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = userStatus as any;

    const hasUserNFT = Boolean(status.hasUserNFT || false);
    const tokenId = BigInt(String(status.tokenId || 0));
    const tier = Number(status.tier || 0);
    const amount = BigInt(String(status.amount || 0));
    const currentScore = BigInt(String(status.currentScore || 0));
    const boostPoints = BigInt(String(status.boostPoints || 0));
    const scoreActive = Boolean(status.scoreActive || false);
    const nextVerificationTime = BigInt(
      String(status.nextVerificationTime || 0)
    );
    const verificationCount = BigInt(String(status.verificationCount || 0));

    // 상위 훅의 상태 업데이트
    setTokenId(tokenId);
    setHasNFT(hasUserNFT);

    const now = Math.floor(Date.now() / 1000);
    const nextVerificationTimeNumber = Number(nextVerificationTime);
    const timeUntilNext = Math.max(0, nextVerificationTimeNumber - now);
    const isAvailable = timeUntilNext === 0 && hasUserNFT;

    const tierName = TIER_NAMES[tier] || "Asteroid";

    // tokenURI에서 SVG 추출
    let svgImage: string | undefined;
    if (tokenURI && typeof tokenURI === "string") {
      svgImage = extractSVGFromTokenURI(tokenURI);
    }

    // 주간 혜택 데이터 파싱
    let weeklyBenefits = {
      isEligible: false,
      currentWeek: BigInt(0),
      tierLevel: BigInt(0),
    };
    if (weeklyBenefitsData && Array.isArray(weeklyBenefitsData)) {
      const [isEligible, currentWeek, tierLevel] = weeklyBenefitsData;
      weeklyBenefits = {
        isEligible: Boolean(isEligible),
        currentWeek: BigInt(String(currentWeek || 0)),
        tierLevel: BigInt(String(tierLevel || 0)),
      };
    }

    // 즉시 보상 데이터 파싱
    let instantReward = {
      reward: BigInt(0),
      multiplier: BigInt(0),
    };
    if (instantRewardData && Array.isArray(instantRewardData)) {
      const [reward, multiplier] = instantRewardData;
      instantReward = {
        reward: BigInt(String(reward || 0)),
        multiplier: BigInt(String(multiplier || 0)),
      };
    }

    setData({
      hasNFT: hasUserNFT,
      tokenId,
      tokenURI: tokenURI as string,
      svgImage,
      tier,
      tierName,
      amount,
      currentScore,
      boostPoints,
      scoreActive,
      nextVerificationTime,
      verificationCount,
      weeklyBenefits,
      instantReward,
      timeUntilNextVerification: timeUntilNext,
      isVerificationAvailable: isAvailable,
      isLoading: false,
    });
  }, [
    address,
    userStatus,
    statusLoading,
    statusError,
    tokenURI,
    weeklyBenefitsData,
    instantRewardData,
    setTokenId,
    setHasNFT,
  ]);

  return data;
}

// 별도 refetch 훅 - 상위 훅 사용
export function useOrbitChronicleRefetch() {
  const { address } = useAccount();

  const {
    refetchUserStatus,
    refetchTokenURI,
    refetchWeeklyBenefits,
    refetchInstantReward,
  } = useOrbitChronicleContracts();

  const refetchAll = useCallback(async () => {
    if (!address) return;

    await Promise.all([
      refetchUserStatus(),
      refetchTokenURI(),
      refetchWeeklyBenefits(),
      refetchInstantReward(),
    ]);
  }, [
    address,
    refetchUserStatus,
    refetchTokenURI,
    refetchWeeklyBenefits,
    refetchInstantReward,
  ]);

  return { refetchAll };
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Available now";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatAmount(amount: bigint): string {
  // INIT는 6 decimals
  const initAmount = Number(amount) / 1e6;
  return `${initAmount.toLocaleString()} INIT`;
}

export function getTierColor(tier: number): string {
  const colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];
  return colors[tier] || colors[0];
}

export function getTierEmoji(tier: number): string {
  const emojis = ["🪨", "☄️", "⭐", "🌌"];
  return emojis[tier] || emojis[0];
}
