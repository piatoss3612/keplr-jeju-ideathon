// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Base64} from "openzeppelin-contracts/contracts/utils/Base64.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

import {DelegationTier, TierUtils} from "./libraries/OrbitUtils.sol";

/**
 * @title OrbitRewardsNFT - Soulbound NFT for Orbit Rewards System
 * @notice ERC721 implementation with soulbound features and dynamic metadata
 * @dev Controlled by OrbitRewards main contract
 */
contract OrbitRewardsNFT is ERC721, Ownable {
    using TierUtils for DelegationTier;
    using TierUtils for uint256;
    using Strings for uint256;

    // ==================== STRUCTS ====================

    struct TokenData {
        DelegationTier tier;
        uint256 amount;
        address tokenOwner;
        bool isSeasonEndNFT;
        uint256 seasonNumber; // 시즌 종료 NFT용
    }

    struct UserScoreData {
        uint256 currentScore;
        uint256 seasonPoints;
        uint256 seasonsCompleted;
        bool isActive;
    }

    // ==================== STATE VARIABLES ====================

    mapping(uint256 => TokenData) public tokenData;
    mapping(address => UserScoreData) public userScores; // 메인 컨트랙트에서 업데이트

    address public orbitRewardsContract; // 메인 컨트랙트 주소

    uint256 private _tokenIdCounter = 1;

    // ==================== EVENTS ====================

    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        DelegationTier tier,
        uint256 amount,
        bool isSeasonEnd
    );

    event UserScoreUpdated(
        address indexed user,
        uint256 currentScore,
        uint256 seasonPoints,
        bool isActive
    );

    // ==================== ERRORS ====================

    error SoulboundToken();
    error OnlyOrbitRewards();
    error TokenNotFound(uint256 tokenId);

    // ==================== MODIFIERS ====================

    modifier onlyOrbitRewards() {
        if (msg.sender != orbitRewardsContract) revert OnlyOrbitRewards();
        _;
    }

    // ==================== CONSTRUCTOR ====================

    constructor(address _owner) ERC721("OrbitRewards", "ORB") Ownable(_owner) {
        orbitRewardsContract = _owner; // 처음에는 deployer가 메인 컨트랙트
    }

    // ==================== SOULBOUND OVERRIDES ====================

    /**
     * @notice Override transfer functions to make NFTs soulbound
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundToken();
        }
        return super._update(to, tokenId, auth);
    }

    // ==================== MAIN FUNCTIONS ====================

    /**
     * @notice 일반 NFT 민팅 (메인 컨트랙트만 호출 가능)
     */
    function mintNFT(
        address to,
        DelegationTier tier,
        uint256 amount
    ) external onlyOrbitRewards returns (uint256 tokenId) {
        tokenId = _tokenIdCounter++;

        _safeMint(to, tokenId);

        tokenData[tokenId] = TokenData({
            tier: tier,
            amount: amount,
            tokenOwner: to,
            isSeasonEndNFT: false,
            seasonNumber: 0
        });

        emit TokenMinted(to, tokenId, tier, amount, false);

        return tokenId;
    }

    /**
     * @notice 시즌 종료 특별 NFT 민팅 (메인 컨트랙트만 호출 가능)
     */
    function mintSeasonEndNFT(
        address to,
        DelegationTier tier,
        uint256 amount,
        uint256 seasonNumber
    ) external onlyOrbitRewards returns (uint256 tokenId) {
        tokenId = _tokenIdCounter++;

        _safeMint(to, tokenId);

        tokenData[tokenId] = TokenData({
            tier: tier,
            amount: amount,
            tokenOwner: to,
            isSeasonEndNFT: true,
            seasonNumber: seasonNumber
        });

        emit TokenMinted(to, tokenId, tier, amount, true);

        return tokenId;
    }

    /**
     * @notice 토큰 메타데이터 업데이트 (메인 컨트랙트만 호출 가능)
     */
    function updateTokenMetadata(
        uint256 tokenId,
        DelegationTier newTier,
        uint256 newAmount
    ) external onlyOrbitRewards {
        if (tokenData[tokenId].tokenOwner == address(0))
            revert TokenNotFound(tokenId);

        tokenData[tokenId].tier = newTier;
        tokenData[tokenId].amount = newAmount;
    }

    /**
     * @notice 사용자 점수 데이터 업데이트 (메인 컨트랙트만 호출 가능)
     */
    function updateUserScore(
        address user,
        uint256 currentScore,
        uint256 seasonPoints,
        uint256 seasonsCompleted,
        bool isActive
    ) external onlyOrbitRewards {
        userScores[user] = UserScoreData({
            currentScore: currentScore,
            seasonPoints: seasonPoints,
            seasonsCompleted: seasonsCompleted,
            isActive: isActive
        });

        emit UserScoreUpdated(user, currentScore, seasonPoints, isActive);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice 토큰 메타데이터 조회
     */
    function getTokenMetadata(
        uint256 tokenId
    )
        external
        view
        returns (
            DelegationTier tier,
            uint256 amount,
            string memory tierName,
            address owner,
            bool isSpecialNFT,
            uint256 seasonNumber
        )
    {
        if (tokenData[tokenId].tokenOwner == address(0))
            revert TokenNotFound(tokenId);

        TokenData memory data = tokenData[tokenId];
        return (
            data.tier,
            data.amount,
            data.tier.getTierName(),
            data.tokenOwner,
            data.isSeasonEndNFT,
            data.seasonNumber
        );
    }

    /**
     * @notice 온체인 SVG 메타데이터 생성
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (tokenData[tokenId].tokenOwner == address(0))
            revert TokenNotFound(tokenId);

        return _buildTokenURI(tokenId);
    }

    // ==================== INTERNAL FUNCTIONS ====================

    /**
     * @notice 토큰 URI 빌드
     */
    function _buildTokenURI(
        uint256 tokenId
    ) internal view returns (string memory) {
        TokenData memory data = tokenData[tokenId];
        UserScoreData memory scoreData = userScores[data.tokenOwner];

        return _buildJsonMetadata(data, scoreData);
    }

    /**
     * @notice JSON 메타데이터 빌드
     */
    function _buildJsonMetadata(
        TokenData memory data,
        UserScoreData memory scoreData
    ) internal pure returns (string memory) {
        string memory name = data.isSeasonEndNFT
            ? string(
                abi.encodePacked(
                    "Season ",
                    data.seasonNumber.toString(),
                    " Champion - ",
                    data.tier.getTierName()
                )
            )
            : string(
                abi.encodePacked("Orbit Rewards - ", data.tier.getTierName())
            );

        string memory description = string(
            abi.encodePacked(
                data.isSeasonEndNFT
                    ? "Special Season End NFT for "
                    : "Soulbound NFT for delegation of ",
                data.amount.toString(),
                " INIT at ",
                data.tier.getTierName(),
                " tier. Score: ",
                scoreData.currentScore.toString(),
                scoreData.isActive ? " (Active)" : " (Inactive)",
                ", Seasons: ",
                scoreData.seasonsCompleted.toString()
            )
        );

        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                name,
                '","description":"',
                description,
                '","image":"data:image/svg+xml;base64,',
                _generateSVG(data, scoreData),
                '","attributes":[',
                _buildAttributes(data, scoreData),
                "]}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }

    /**
     * @notice 속성 빌드
     */
    function _buildAttributes(
        TokenData memory data,
        UserScoreData memory scoreData
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Tier","value":"',
                    data.tier.getTierName(),
                    '"},',
                    '{"trait_type":"Amount","value":',
                    data.amount.toString(),
                    "},",
                    '{"trait_type":"Score","value":',
                    scoreData.currentScore.toString(),
                    "},",
                    '{"trait_type":"Status","value":"',
                    scoreData.isActive ? "Active" : "Inactive",
                    '"},',
                    '{"trait_type":"Type","value":"',
                    data.isSeasonEndNFT ? "Season Champion" : "Standard",
                    '"}'
                )
            );
    }

    /**
     * @notice SVG 생성
     */
    function _generateSVG(
        TokenData memory data,
        UserScoreData memory scoreData
    ) internal pure returns (string memory) {
        (string memory color, string memory emoji) = _getTierStyle(data.tier);

        return
            Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            _buildSVGHeader(color, data.isSeasonEndNFT),
                            _buildSVGBody(data, scoreData, color, emoji),
                            "</svg>"
                        )
                    )
                )
            );
    }

    /**
     * @notice SVG 헤더 빌드
     */
    function _buildSVGHeader(
        string memory color,
        bool isSpecial
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">',
                    "<defs>",
                    '<radialGradient id="bg" cx="50%" cy="50%" r="50%">',
                    '<stop offset="0%" style="stop-color:',
                    color,
                    ";stop-opacity:",
                    isSpecial ? "1.0" : "0.8",
                    '"/>',
                    '<stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1"/>',
                    "</radialGradient>",
                    isSpecial
                        ? '<filter id="specialGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
                        : "",
                    "</defs>",
                    '<rect width="400" height="400" fill="url(#bg)" rx="20"/>',
                    isSpecial
                        ? '<rect width="400" height="400" fill="none" stroke="gold" stroke-width="4" rx="20"/>'
                        : ""
                )
            );
    }

    /**
     * @notice SVG 바디 빌드 - 함수 분리로 stack too deep 해결
     */
    function _buildSVGBody(
        TokenData memory data,
        UserScoreData memory scoreData,
        string memory color,
        string memory emoji
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _buildSVGCircles(color, data.isSeasonEndNFT),
                    _buildSVGTexts(data, scoreData, color, emoji)
                )
            );
    }

    /**
     * @notice SVG 원형 요소들 빌드
     */
    function _buildSVGCircles(
        string memory color,
        bool isSpecial
    ) internal pure returns (string memory) {
        string memory glow = isSpecial ? ' filter="url(#specialGlow)"' : "";

        return
            string(
                abi.encodePacked(
                    '<circle cx="200" cy="120" r="50" fill="',
                    color,
                    '" opacity="0.3"',
                    glow,
                    '"/>',
                    '<circle cx="200" cy="120" r="30" fill="white" opacity="0.9"',
                    glow,
                    '"/>'
                )
            );
    }

    /**
     * @notice SVG 텍스트 요소들 빌드
     */
    function _buildSVGTexts(
        TokenData memory data,
        UserScoreData memory scoreData,
        string memory color,
        string memory emoji
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _buildEmojiAndTierText(data, color, emoji),
                    _buildScoreAndStatusText(scoreData)
                )
            );
    }

    /**
     * @notice 이모지와 티어 텍스트 빌드
     */
    function _buildEmojiAndTierText(
        TokenData memory data,
        string memory color,
        string memory emoji
    ) internal pure returns (string memory) {
        string memory glow = data.isSeasonEndNFT
            ? ' filter="url(#specialGlow)"'
            : "";

        return
            string(
                abi.encodePacked(
                    '<text x="200" y="135" text-anchor="middle" fill="',
                    color,
                    '" font-size="28"',
                    glow,
                    ">",
                    emoji,
                    "</text>",
                    '<text x="200" y="180" text-anchor="middle" fill="white" font-size="16" font-weight="bold">',
                    data.tier.getTierName(),
                    "</text>",
                    '<text x="200" y="210" text-anchor="middle" fill="',
                    color,
                    '" font-size="14">',
                    data.amount.toString(),
                    " INIT</text>"
                )
            );
    }

    /**
     * @notice 점수와 상태 텍스트 빌드
     */
    function _buildScoreAndStatusText(
        UserScoreData memory scoreData
    ) internal pure returns (string memory) {
        string memory statusColor = scoreData.isActive ? "#4CAF50" : "#F44336";

        return
            string(
                abi.encodePacked(
                    '<text x="200" y="250" text-anchor="middle" fill="white" font-size="16">Score: ',
                    scoreData.currentScore.toString(),
                    "</text>",
                    '<circle cx="350" cy="50" r="8" fill="',
                    statusColor,
                    '"/>',
                    '<text x="200" y="320" text-anchor="middle" fill="',
                    statusColor,
                    '" font-size="12">',
                    scoreData.isActive ? "ACTIVE" : "INACTIVE",
                    "</text>",
                    '<text x="200" y="350" text-anchor="middle" fill="white" font-size="10" opacity="0.7">SOULBOUND NFT</text>'
                )
            );
    }

    function _getTierStyle(
        DelegationTier tier
    ) internal pure returns (string memory color, string memory emoji) {
        if (tier == DelegationTier.Galaxy) return ("#9C27B0", unicode"🌌");
        if (tier == DelegationTier.Star) return ("#FF9800", unicode"⭐");
        if (tier == DelegationTier.Comet) return ("#2196F3", unicode"☄️");
        return ("#4CAF50", unicode"🪨");
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @notice 메인 컨트랙트 주소 설정 (owner만 가능)
     */
    function setOrbitRewardsContract(
        address _orbitRewardsContract
    ) external onlyOwner {
        orbitRewardsContract = _orbitRewardsContract;
    }

    /**
     * @notice 현재 토큰 ID 카운터 조회
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
