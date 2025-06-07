import React from "react";

interface NFTDisplayProps {
  svgImage?: string;
  tierName: string;
  tokenId: bigint;
  className?: string;
}

export default function NFTDisplay({
  svgImage,
  tierName,
  tokenId,
  className = "",
}: NFTDisplayProps) {
  if (!svgImage) {
    // SVG가 없을 때 기본 플레이스홀더
    return (
      <div
        className={`bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🎫</div>
          <div className="text-purple-300 text-sm font-medium">
            {tierName} NFT #{tokenId.toString()}
          </div>
          <div className="text-purple-200 text-xs">Loading image...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`nft-display relative bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-400/30 rounded-xl overflow-hidden ${className}`}
    >
      {/* SVG 이미지 */}
      <div
        className="w-full h-full flex items-center justify-center p-2"
        dangerouslySetInnerHTML={{ __html: svgImage }}
        style={{
          minHeight: "250px",
        }}
      />

      {/* Global SVG 스타일링 */}
      <style jsx global>{`
        .nft-display svg {
          max-width: 100% !important;
          max-height: 100% !important;
          width: auto !important;
          height: auto !important;
        }
      `}</style>

      {/* 오버레이 정보 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="text-white text-sm font-medium">
          {tierName} NFT #{tokenId.toString()}
        </div>
      </div>
    </div>
  );
}
