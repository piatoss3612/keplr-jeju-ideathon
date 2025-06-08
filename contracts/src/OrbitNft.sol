// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Base64} from "openzeppelin-contracts/contracts/utils/Base64.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

import {DelegationTier, TierUtils} from "./libraries/OrbitUtils.sol";

/**
 * @title OrbitNft - Soulbound NFT for Orbit Chronicle System
 * @notice ERC721 implementation with soulbound features and dynamic metadata
 * @dev Controlled by OrbitRewards main contract
 */
contract OrbitNft is ERC721, Ownable {
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

    address public immutable orbitChronicleContract; // 메인 컨트랙트 주소

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
    error OnlyOrbitChronicle();
    error TokenNotFound(uint256 tokenId);

    // ==================== MODIFIERS ====================

    modifier onlyOrbitChronicle() {
        if (msg.sender != orbitChronicleContract) revert OnlyOrbitChronicle();
        _;
    }

    // ==================== CONSTRUCTOR ====================

    constructor(
        address _owner
    ) ERC721("OrbitChronicle", "ORB") Ownable(_owner) {
        orbitChronicleContract = _owner; // 처음에는 deployer가 메인 컨트랙트
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
    ) external onlyOrbitChronicle returns (uint256 tokenId) {
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
    ) external onlyOrbitChronicle returns (uint256 tokenId) {
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
    ) external onlyOrbitChronicle {
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
    ) external onlyOrbitChronicle {
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
                abi.encodePacked("Orbit Chronicle - ", data.tier.getTierName())
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
        string memory color = _getTierStyle(data.tier);

        return
            Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            _buildSVGHeader(color, data.isSeasonEndNFT),
                            _buildSVGBody(data, scoreData, color),
                            "</svg>"
                        )
                    )
                )
            );
    }

    /**
     * @notice SVG 헤더 빌드 - 향상된 디자인
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
                    _buildAdvancedGradients(color, isSpecial),
                    _buildAdvancedFilters(isSpecial),
                    "</defs>",
                    _buildBackgroundElements(color, isSpecial)
                )
            );
    }

    /**
     * @notice 고급 그라디언트 정의
     */
    function _buildAdvancedGradients(
        string memory color,
        bool isSpecial
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<radialGradient id="bg" cx="50%" cy="30%" r="70%">',
                    '<stop offset="0%" style="stop-color:',
                    color,
                    ";stop-opacity:0.9",
                    '"/>',
                    '<stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:0.8"/>',
                    '<stop offset="100%" style="stop-color:#0d0d1a;stop-opacity:1"/>',
                    "</radialGradient>",
                    '<linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
                    '<stop offset="0%" style="stop-color:',
                    color,
                    ";stop-opacity:0.3",
                    '"/>',
                    '<stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1"/>',
                    "</linearGradient>",
                    isSpecial
                        ? string(
                            abi.encodePacked(
                                '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
                                '<stop offset="0%" style="stop-color:#FFD700"/>',
                                '<stop offset="50%" style="stop-color:#FFA500"/>',
                                '<stop offset="100%" style="stop-color:#FF8C00"/>',
                                "</linearGradient>"
                            )
                        )
                        : ""
                )
            );
    }

    /**
     * @notice 고급 필터 효과
     */
    function _buildAdvancedFilters(
        bool isSpecial
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">',
                    '<feGaussianBlur stdDeviation="3" result="coloredBlur"/>',
                    '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>',
                    "</filter>",
                    '<filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">',
                    '<feGaussianBlur in="SourceGraphic" stdDeviation="3"/>',
                    '<feOffset dx="2" dy="2" result="offset"/>',
                    "</filter>",
                    isSpecial
                        ? string(
                            abi.encodePacked(
                                '<filter id="specialGlow" x="-50%" y="-50%" width="200%" height="200%">',
                                '<feGaussianBlur stdDeviation="5" result="coloredBlur"/>',
                                '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>',
                                "</filter>"
                            )
                        )
                        : ""
                )
            );
    }

    /**
     * @notice 배경 요소들
     */
    function _buildBackgroundElements(
        string memory color,
        bool isSpecial
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<rect width="400" height="400" fill="url(#bg)" rx="24"/>',
                    '<rect x="8" y="8" width="384" height="384" fill="url(#cardGrad)" rx="20" opacity="0.5"/>',
                    isSpecial
                        ? '<rect x="4" y="4" width="392" height="392" fill="none" stroke="url(#goldGrad)" stroke-width="3" rx="22" filter="url(#specialGlow)"/>'
                        : string(
                            abi.encodePacked(
                                '<rect x="6" y="6" width="388" height="388" fill="none" stroke="',
                                color,
                                '" stroke-width="1" rx="20" opacity="0.6"/>'
                            )
                        ),
                    _buildStarField()
                )
            );
    }

    /**
     * @notice 별빛 배경 효과
     */
    function _buildStarField() internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<circle cx="80" cy="80" r="1" fill="white" opacity="0.6"/>',
                    '<circle cx="320" cy="120" r="0.8" fill="white" opacity="0.4"/>',
                    '<circle cx="150" cy="300" r="1.2" fill="white" opacity="0.7"/>',
                    '<circle cx="350" cy="280" r="0.6" fill="white" opacity="0.5"/>',
                    '<circle cx="60" cy="250" r="1" fill="white" opacity="0.6"/>',
                    '<circle cx="300" cy="60" r="0.8" fill="white" opacity="0.4"/>'
                )
            );
    }

    /**
     * @notice SVG 바디 빌드 - 함수 분리로 stack too deep 해결
     */
    function _buildSVGBody(
        TokenData memory data,
        UserScoreData memory scoreData,
        string memory color
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _buildSVGCircles(color, data.isSeasonEndNFT),
                    _buildSVGTexts(data, scoreData, color)
                )
            );
    }

    /**
     * @notice SVG 원형 요소들 빌드 - 개선된 디자인
     */
    function _buildSVGCircles(
        string memory color,
        bool isSpecial
    ) internal pure returns (string memory) {
        string memory glow = isSpecial
            ? ' filter="url(#specialGlow)"'
            : ' filter="url(#glow)"';

        return
            string(
                abi.encodePacked(
                    _buildMainOrb(color, glow),
                    _buildOrbitRings(color),
                    _buildCenterIcon(color, isSpecial)
                )
            );
    }

    /**
     * @notice 메인 오브 구체
     */
    function _buildMainOrb(
        string memory color,
        string memory glow
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<circle cx="200" cy="140" r="65" fill="',
                    color,
                    '" opacity="0.2"',
                    glow,
                    "/>",
                    '<circle cx="200" cy="140" r="50" fill="',
                    color,
                    '" opacity="0.4"',
                    glow,
                    "/>",
                    '<circle cx="200" cy="140" r="35" fill="white" opacity="0.9"',
                    glow,
                    "/>",
                    '<circle cx="200" cy="140" r="25" fill="',
                    color,
                    '" opacity="0.8"',
                    glow,
                    "/>"
                )
            );
    }

    /**
     * @notice 궤도 링들
     */
    function _buildOrbitRings(
        string memory color
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<circle cx="200" cy="140" r="80" fill="none" stroke="',
                    color,
                    '" stroke-width="1" opacity="0.3" stroke-dasharray="5,5"/>',
                    '<circle cx="200" cy="140" r="95" fill="none" stroke="white" stroke-width="0.5" opacity="0.2" stroke-dasharray="3,7"/>'
                )
            );
    }

    /**
     * @notice 중앙 아이콘 영역
     */
    function _buildCenterIcon(
        string memory color,
        bool isSpecial
    ) internal pure returns (string memory) {
        string memory iconGlow = isSpecial ? ' filter="url(#specialGlow)"' : "";

        return
            string(
                abi.encodePacked(
                    '<circle cx="200" cy="140" r="18" fill="rgba(255,255,255,0.1)" stroke="',
                    color,
                    '" stroke-width="2"',
                    iconGlow,
                    "/>"
                )
            );
    }

    /**
     * @notice SVG 텍스트 요소들 빌드
     */
    function _buildSVGTexts(
        TokenData memory data,
        UserScoreData memory scoreData,
        string memory color
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _buildTierText(data, color),
                    _buildScoreAndStatusText(scoreData)
                )
            );
    }

    /**
     * @notice 티어 텍스트 빌드 - 개선된 타이포그래피
     */
    function _buildTierText(
        TokenData memory data,
        string memory color
    ) internal pure returns (string memory) {
        string memory glow = data.isSeasonEndNFT
            ? ' filter="url(#specialGlow)"'
            : ' filter="url(#glow)"';

        return
            string(
                abi.encodePacked(
                    _buildCustomIconGraphic(color, glow, data.tier),
                    '<text x="200" y="195" text-anchor="middle" fill="white" font-size="20" font-weight="bold" letter-spacing="2px">',
                    data.tier.getTierName(),
                    "</text>",
                    '<text x="200" y="220" text-anchor="middle" fill="',
                    color,
                    '" font-size="14" opacity="0.9">',
                    data.amount.toString(),
                    " INIT</text>",
                    _buildTierBadge(data.tier, color)
                )
            );
    }

    /**
     * @notice 티어 배지 생성
     */
    function _buildTierBadge(
        DelegationTier tier,
        string memory color
    ) internal pure returns (string memory) {
        uint256 tierLevel = uint256(tier) + 1;

        return
            string(
                abi.encodePacked(
                    '<rect x="170" y="230" width="60" height="20" rx="10" fill="',
                    color,
                    '" opacity="0.3"/>',
                    '<text x="200" y="243" text-anchor="middle" fill="white" font-size="10" font-weight="bold">TIER ',
                    tierLevel.toString(),
                    "</text>"
                )
            );
    }

    /**
     * @notice 점수와 상태 표시 - 현대적 디자인
     */
    function _buildScoreAndStatusText(
        UserScoreData memory scoreData
    ) internal pure returns (string memory) {
        string memory statusColor = scoreData.isActive ? "#00E676" : "#FF5722";
        string memory statusBg = scoreData.isActive ? "#1B5E20" : "#BF360C";

        return
            string(
                abi.encodePacked(
                    _buildScoreCard(scoreData.currentScore),
                    _buildStatusIndicator(
                        scoreData.isActive,
                        statusColor,
                        statusBg
                    ),
                    _buildFooterElements()
                )
            );
    }

    /**
     * @notice 점수 카드
     */
    function _buildScoreCard(
        uint256 score
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<rect x="120" y="265" width="160" height="35" rx="17" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>',
                    '<text x="200" y="280" text-anchor="middle" fill="white" font-size="12" opacity="0.8">SCORE</text>',
                    '<text x="200" y="295" text-anchor="middle" fill="white" font-size="18" font-weight="bold">',
                    score.toString(),
                    "</text>"
                )
            );
    }

    /**
     * @notice 상태 표시기
     */
    function _buildStatusIndicator(
        bool isActive,
        string memory statusColor,
        string memory statusBg
    ) internal pure returns (string memory) {
        string memory statusText = isActive ? "ACTIVE" : "INACTIVE";

        return
            string(
                abi.encodePacked(
                    '<rect x="150" y="315" width="100" height="25" rx="12" fill="',
                    statusBg,
                    '" opacity="0.8"/>',
                    '<circle cx="170" cy="327" r="4" fill="',
                    statusColor,
                    '" filter="url(#glow)"/>',
                    '<text x="200" y="332" text-anchor="middle" fill="',
                    statusColor,
                    '" font-size="11" font-weight="bold">',
                    statusText,
                    "</text>"
                )
            );
    }

    /**
     * @notice 하단 요소들
     */
    function _buildFooterElements() internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<line x1="80" y1="360" x2="320" y2="360" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>',
                    '<text x="200" y="380" text-anchor="middle" fill="white" font-size="9" opacity="0.6" letter-spacing="1px">SOULBOUND NFT</text>',
                    '<text x="200" y="395" text-anchor="middle" fill="white" font-size="8" opacity="0.4">ORBIT CHRONICLE</text>'
                )
            );
    }

    /**
     * @notice 티어별 커스텀 아이콘 그래픽 생성 (IPFS 지원)
     */
    function _buildCustomIconGraphic(
        string memory color,
        string memory glow,
        DelegationTier tier
    ) internal pure returns (string memory) {
        // IPFS 링크 사용 시 (향후 업그레이드 가능)
        string memory ipfsHash = _getTierIPFSHash(tier);

        if (bytes(ipfsHash).length > 0) {
            return
                string(
                    abi.encodePacked(
                        // 클립 패스로 둥근 테두리 정의
                        '<defs><clipPath id="roundedClip"><circle cx="200" cy="140" r="30"/></clipPath></defs>',
                        // IPFS 이미지 (둥근 클립 적용, z-index 높임)
                        '<image href="https://ipfs.io/ipfs/',
                        ipfsHash,
                        '" x="170" y="110" width="60" height="60" clip-path="url(#roundedClip)" filter="url(#specialGlow)"/>',
                        // 둥근 테두리 추가
                        '<circle cx="200" cy="140" r="30" fill="none" stroke="',
                        color,
                        '" stroke-width="3" opacity="0.8"/>',
                        // 대체 그래픽 (IPFS 실패 시, z-index 뒤쪽)
                        '<circle cx="200" cy="140" r="18" fill="rgba(255,255,255,0.1)" stroke="',
                        color,
                        '" stroke-width="2" opacity="0.3"/>'
                    )
                );
        }

        // 기본 온체인 그래픽
        return
            string(
                abi.encodePacked(
                    '<g transform="translate(170,110)">',
                    "<defs>",
                    '<radialGradient id="customGrad" cx="50%" cy="30%" r="70%">',
                    '<stop offset="0%" style="stop-color:',
                    color,
                    ';stop-opacity:0.8"/>',
                    '<stop offset="100%" style="stop-color:',
                    _getDarkerColor(tier),
                    ';stop-opacity:1"/>',
                    "</radialGradient>",
                    "</defs>",
                    _buildTierSpecificShape(tier, glow),
                    "</g>"
                )
            );
    }

    /**
     * @notice 티어별 IPFS 해시 반환 - 실제 CID 적용!
     */
    function _getTierIPFSHash(
        DelegationTier tier
    ) internal pure returns (string memory) {
        // Galaxy 티어에 실제 IPFS 이미지 사용
        if (tier == DelegationTier.Galaxy) {
            return
                "bafkreigcz7at4vvsb27zzl4njmplthcdzn5vgtblv4akne2mr3aarsarqy";
        }
        // 다른 티어들은 온체인 그래픽 사용
        return "";
    }

    /**
     * @notice 티어별 전용 모양 생성
     */
    function _buildTierSpecificShape(
        DelegationTier tier,
        string memory glow
    ) internal pure returns (string memory) {
        if (tier == DelegationTier.Galaxy) {
            return
                string(
                    abi.encodePacked(
                        '<path fill="url(#customGrad)"',
                        glow,
                        ' d="M30,5 C40,8 50,18 55,30 C55,35 50,45 40,50 C30,55 20,50 10,45 C5,35 5,25 10,15 C20,8 25,5 30,5 Z"/>',
                        '<circle cx="30" cy="30" r="12" fill="rgba(255,255,255,0.4)"/>',
                        '<circle cx="30" cy="30" r="6" fill="rgba(255,255,255,0.7)"/>',
                        '<path fill="rgba(255,255,255,0.3)" d="M15,20 Q30,10 45,20 Q40,30 30,25 Q20,30 15,20"/>',
                        '<path fill="rgba(255,255,255,0.2)" d="M15,40 Q30,50 45,40 Q40,35 30,38 Q20,35 15,40"/>'
                    )
                );
        } else if (tier == DelegationTier.Star) {
            return
                string(
                    abi.encodePacked(
                        '<path fill="url(#customGrad)"',
                        glow,
                        ' d="M30,8 L35,20 L48,20 L38,28 L42,42 L30,35 L18,42 L22,28 L12,20 L25,20 Z"/>',
                        '<circle cx="30" cy="28" r="8" fill="rgba(255,255,255,0.5)"/>',
                        '<circle cx="30" cy="28" r="4" fill="rgba(255,255,255,0.8)"/>'
                    )
                );
        } else if (tier == DelegationTier.Comet) {
            return
                string(
                    abi.encodePacked(
                        '<ellipse cx="30" cy="30" rx="25" ry="15" fill="url(#customGrad)"',
                        glow,
                        "/>",
                        '<circle cx="35" cy="30" r="10" fill="rgba(255,255,255,0.4)"/>',
                        '<circle cx="35" cy="30" r="5" fill="rgba(255,255,255,0.7)"/>',
                        '<path fill="rgba(255,255,255,0.3)" d="M10,25 Q20,20 30,25 Q25,30 20,28 Q15,30 10,25"/>'
                    )
                );
        } else {
            return
                string(
                    abi.encodePacked(
                        '<rect x="15" y="15" width="30" height="30" rx="8" fill="url(#customGrad)"',
                        glow,
                        "/>",
                        '<circle cx="30" cy="30" r="8" fill="rgba(255,255,255,0.4)"/>',
                        '<circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.6)"/>'
                    )
                );
        }
    }

    /**
     * @notice 티어별 어두운 색상 반환
     */
    function _getDarkerColor(
        DelegationTier tier
    ) internal pure returns (string memory) {
        if (tier == DelegationTier.Galaxy) return "#4A148C";
        if (tier == DelegationTier.Star) return "#FF8F00";
        if (tier == DelegationTier.Comet) return "#01579B";
        return "#1B5E20";
    }

    function _getTierStyle(
        DelegationTier tier
    ) internal pure returns (string memory color) {
        if (tier == DelegationTier.Galaxy) return ("#8A2BE2"); // 더 진한 보라색
        if (tier == DelegationTier.Star) return ("#FFD700"); // 골든 컬러
        if (tier == DelegationTier.Comet) return ("#00BFFF"); // 더 밝은 블루
        return ("#32CD32"); // 더 밝은 그린
    }

    /**
     * @notice 현재 토큰 ID 카운터 조회
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
