// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {DelegationTier, TierUtils} from "./libraries/OrbitUtils.sol";
import {ValidationUtils} from "./libraries/ValidationUtils.sol";
import {OrbitNft} from "./OrbitNft.sol";

/**
 * @title OrbitRewards - Delegation Rewards System
 * @notice Dynamic short-term rewards with 7-day scoring windows, 3-day verification cycles, and immediate benefits
 * @dev Main contract that manages immediate rewards and interacts with separate NFT contract
 */
contract OrbitChronicle is FunctionsClient, ConfirmedOwner, Pausable {
    using ValidationUtils for uint256;
    using ValidationUtils for string;
    using TierUtils for DelegationTier;
    using TierUtils for uint256;

    // ==================== CONSTANTS ====================

    address private constant ROUTER_ADDRESS =
        0xf9B8fc078197181C841c296C876945aaa425B278;
    bytes32 private constant DON_ID =
        0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;

    // Time constants - Short-term focus for immediate benefits
    uint256 private constant SCORING_WINDOW = 7 days; // Shorter scoring window
    uint256 private constant VERIFICATION_INTERVAL = 3 days; // Frequent verification (3-7 days)
    uint256 private constant SCORE_GRACE_PERIOD = 2 days; // Quick grace period
    uint256 private constant TOTAL_CYCLE =
        VERIFICATION_INTERVAL + SCORE_GRACE_PERIOD;

    // 시즌 관련 상수 제거

    // ==================== STRUCTS ====================

    struct UserData {
        uint256 nftTokenId;
        uint256 mintTimestamp;
        uint256 lastVerificationTime;
        uint256 currentScore;
        uint256 boostPoints;
        DelegationTier currentTier;
        uint256 currentAmount;
        uint256 verificationCount;
        bool isActive;
    }

    struct UserStatusInfo {
        bool hasUserNFT;
        uint256 tokenId;
        DelegationTier tier;
        uint256 amount;
        uint256 currentScore;
        uint256 boostPoints;
        bool scoreActive;
        uint256 nextVerificationTime;
        uint256 verificationCount;
    }

    // ==================== STATE VARIABLES ====================

    // Chainlink configuration
    uint64 public subscriptionId;
    uint32 public gasLimit = 300000; // Chainlink Functions 최대 제한: 300,000
    string public source;

    // NFT contract
    OrbitNft public nftContract;

    // Core tracking
    mapping(bytes32 => address) public requestToSender;
    mapping(bytes32 => bool) public isVerificationRequest;

    // Fulfilled request results - 가스 최적화를 위해 결과만 저장
    mapping(bytes32 => bytes) public fulfilledResults;
    mapping(bytes32 => bool) public isRequestFulfilled;

    mapping(address => bool) public hasNFT;
    mapping(address => UserData) public userData;

    // ==================== EVENTS ====================

    event InitialQualificationClaimed(
        address indexed user,
        uint256 indexed tokenId,
        DelegationTier tier,
        uint256 amount
    );

    event LoyaltyVerified(
        address indexed user,
        DelegationTier newTier,
        uint256 newAmount,
        uint256 boostPoints,
        uint256 currentScore
    );

    event ScoreCalculated(address indexed user, uint256 score, bool isActive);

    event ScoreExpired(address indexed user, uint256 expiredScore);

    // 새로운 이벤트 - 2단계 처리 시스템용
    event RequestProcessed(
        address indexed user,
        bytes32 indexed requestId,
        bool isVerification
    );

    // 사용자별 요청 추적을 위한 새로운 이벤트
    event UserRequestSent(
        address indexed user,
        bytes32 indexed requestId,
        bool isVerification
    );

    // Chainlink Functions 설정 관련 이벤트
    event ChainlinkConfigUpdated(
        uint64 subscriptionId,
        uint32 gasLimit,
        string source
    );

    event SubscriptionIdUpdated(uint64 newSubscriptionId);
    event GasLimitUpdated(uint32 newGasLimit);
    event SourceCodeUpdated(string newSource);

    // ==================== ERRORS ====================

    error UnauthorizedClaimant(address expected, address actual);
    error AlreadyHasNFT(address user);
    error NoNFTFound(address user);
    error VerificationTooEarly(uint256 timeRemaining);
    error InvalidClaimantAddress();

    // ==================== CONSTRUCTOR ====================

    constructor(
        uint64 _subscriptionId,
        string memory _source
    ) FunctionsClient(ROUTER_ADDRESS) ConfirmedOwner(msg.sender) {
        subscriptionId = _subscriptionId;
        source = _source;

        // NFT 컨트랙트 배포
        nftContract = new OrbitNft(address(this));
    }

    // ==================== MAIN FUNCTIONS ====================

    /**
     * @notice 최초 위임 티어 검증 및 NFT 민팅 요청
     */
    function requestDelegationTier(
        string calldata bech32Address
    ) external returns (bytes32 requestId) {
        bech32Address.validateBech32Address();
        require(bytes(source).length > 0, "Source code not set");

        if (hasNFT[msg.sender]) {
            revert AlreadyHasNFT(msg.sender);
        }

        string[] memory args = new string[](2);
        args[0] = bech32Address;
        args[1] = _addressToString(msg.sender);

        FunctionsRequest.Request memory req;
        FunctionsRequest.initializeRequestForInlineJavaScript(req, source);
        FunctionsRequest.setArgs(req, args);

        requestId = _sendRequest(
            FunctionsRequest.encodeCBOR(req),
            subscriptionId,
            gasLimit,
            DON_ID
        );

        requestToSender[requestId] = msg.sender;
        isVerificationRequest[requestId] = false;

        emit UserRequestSent(msg.sender, requestId, false);

        return requestId;
    }

    /**
     * @notice 기존 사용자의 loyalty 검증 요청 (3일 후부터 가능) - 빈번한 검증으로 즉시 혜택
     */
    function requestLoyaltyVerification(
        string calldata bech32Address
    ) external returns (bytes32 requestId) {
        bech32Address.validateBech32Address();
        require(bytes(source).length > 0, "Source code not set");

        if (!hasNFT[msg.sender]) {
            revert NoNFTFound(msg.sender);
        }

        UserData storage user = userData[msg.sender];

        // 3일 간격 체크 - 빈번한 검증으로 즉시 혜택 제공
        if (
            block.timestamp < user.lastVerificationTime + VERIFICATION_INTERVAL
        ) {
            uint256 timeRemaining = (user.lastVerificationTime +
                VERIFICATION_INTERVAL) - block.timestamp;
            revert VerificationTooEarly(timeRemaining);
        }

        string[] memory args = new string[](2);
        args[0] = bech32Address;
        args[1] = _addressToString(msg.sender);

        FunctionsRequest.Request memory req;
        FunctionsRequest.initializeRequestForInlineJavaScript(req, source);
        FunctionsRequest.setArgs(req, args);

        requestId = _sendRequest(
            FunctionsRequest.encodeCBOR(req),
            subscriptionId,
            gasLimit,
            DON_ID
        );

        requestToSender[requestId] = msg.sender;
        isVerificationRequest[requestId] = true;

        emit UserRequestSent(msg.sender, requestId, true);

        return requestId;
    }

    /**
     * @notice Chainlink Functions 응답 처리 - 가스 절약을 위해 결과만 저장
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        isRequestFulfilled[requestId] = true;
        if (err.length > 0) return;

        // NOTE: gas limit 때문에 가공이 어려움
        fulfilledResults[requestId] = response;
    }

    /**
     * @notice fulfilled 된 요청 결과를 처리 (사용자가 직접 호출)
     */
    function processRequest(bytes32 requestId) external {
        require(isRequestFulfilled[requestId], "Request not fulfilled yet");
        require(requestToSender[requestId] == msg.sender, "Not request owner");

        uint256 amount = ValidationUtils.validateAndParseAmount(
            string(fulfilledResults[requestId])
        );
        DelegationTier tier = amount.getTierForAmount();

        bool isVerification = isVerificationRequest[requestId];

        if (isVerification) {
            _processLoyaltyVerification(msg.sender, tier, amount);
        } else {
            _mintInitialNFT(msg.sender, tier, amount);
        }

        emit RequestProcessed(msg.sender, requestId, isVerification);
    }

    // 시즌 관련 함수들 제거

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice 사용자의 현재 점수 계산 (7일 윈도우 기반) - 단기 활성화로 즉시 혜택
     */
    function calculateCurrentScore(
        address user
    ) public view returns (uint256 currentScore, bool isActive) {
        if (!hasNFT[user]) return (0, false);

        UserData memory data = userData[user];

        uint256 timeSinceMint = block.timestamp - data.mintTimestamp;
        uint256 timeSinceLastVerification = block.timestamp -
            data.lastVerificationTime;

        // 7일 윈도우로 더 빈번한 활성화 촉진
        bool withinMintWindow = timeSinceMint <= SCORING_WINDOW;
        bool withinVerificationWindow = timeSinceLastVerification <=
            SCORING_WINDOW;

        isActive = withinMintWindow || withinVerificationWindow;

        if (!isActive) {
            return (0, false);
        }

        // 현재 상태 기반 즉시 점수 계산
        uint256 baseScore = _calculateBaseScore(
            data.currentTier,
            data.currentAmount
        );
        currentScore = baseScore + data.boostPoints;

        return (currentScore, isActive);
    }

    /**
     * @notice 사용자 상태 조회
     */
    function getUserStatus(
        address user
    ) external view returns (UserStatusInfo memory info) {
        info.hasUserNFT = hasNFT[user];
        if (!info.hasUserNFT) {
            return info;
        }

        UserData memory data = userData[user];
        (uint256 score, bool active) = calculateCurrentScore(user);

        info.tokenId = data.nftTokenId;
        info.tier = data.currentTier;
        info.amount = data.currentAmount;
        info.currentScore = score;
        info.boostPoints = data.boostPoints;
        info.scoreActive = active;
        info.nextVerificationTime =
            data.lastVerificationTime +
            VERIFICATION_INTERVAL;
        info.verificationCount = data.verificationCount;

        return info;
    }

    /**
     * @notice NFT 컨트랙트 주소 조회
     */
    function getNFTContract() external view returns (address) {
        return address(nftContract);
    }

    /**
     * @notice 특정 요청이 fulfill되었지만 아직 처리되지 않았는지 확인
     */
    function isRequestReadyToProcess(
        bytes32 requestId
    ) external view returns (bool) {
        return
            isRequestFulfilled[requestId] &&
            requestToSender[requestId] != address(0);
    }

    /**
     * @notice 특정 요청의 결과 미리보기 (처리하지 않고 결과만 확인)
     */
    function previewRequestResult(
        bytes32 requestId
    )
        external
        view
        returns (uint256 amount, DelegationTier tier, bool isVerification)
    {
        require(isRequestFulfilled[requestId], "Request not fulfilled yet");
        require(requestToSender[requestId] == msg.sender, "Not request owner");

        amount = ValidationUtils.validateAndParseAmount(
            string(fulfilledResults[requestId])
        );
        tier = amount.getTierForAmount();
        isVerification = isVerificationRequest[requestId];
    }

    // ==================== INTERNAL FUNCTIONS ====================

    /**
     * @notice 최초 NFT 민팅 처리
     */
    function _mintInitialNFT(
        address claimant,
        DelegationTier tier,
        uint256 amount
    ) internal {
        if (claimant == address(0)) revert InvalidClaimantAddress();
        if (hasNFT[claimant]) revert AlreadyHasNFT(claimant);

        // NFT 민팅
        uint256 tokenId = nftContract.mintNFT(claimant, tier, amount);

        // 상태 업데이트
        hasNFT[claimant] = true;

        UserData storage user = userData[claimant];
        user.nftTokenId = tokenId;
        user.mintTimestamp = block.timestamp;
        user.lastVerificationTime = block.timestamp;
        user.currentTier = tier;
        user.currentAmount = amount;
        user.verificationCount = 1;
        user.isActive = true;

        uint256 baseScore = _calculateBaseScore(tier, amount);
        user.currentScore = baseScore;

        // NFT 컨트랙트의 사용자 점수 업데이트
        _updateNFTUserScore(claimant);

        emit InitialQualificationClaimed(claimant, tokenId, tier, amount);
    }

    /**
     * @notice 기존 사용자의 loyalty 검증 처리
     */
    function _processLoyaltyVerification(
        address claimant,
        DelegationTier newTier,
        uint256 newAmount
    ) internal {
        UserData storage user = userData[claimant];

        DelegationTier oldTier = user.currentTier;
        user.currentTier = newTier;
        user.currentAmount = newAmount;
        user.lastVerificationTime = block.timestamp;
        user.verificationCount++;

        // NFT 메타데이터 업데이트
        nftContract.updateTokenMetadata(user.nftTokenId, newTier, newAmount);

        uint256 boostPoints = 0;
        if (newTier > oldTier) {
            boostPoints = _calculateBoostPoints(oldTier, newTier, newAmount);
            user.boostPoints += boostPoints;
        }

        uint256 baseScore = _calculateBaseScore(newTier, newAmount);
        user.currentScore = baseScore + user.boostPoints;
        user.isActive = true;

        // NFT 컨트랙트의 사용자 점수 업데이트
        _updateNFTUserScore(claimant);

        emit LoyaltyVerified(
            claimant,
            newTier,
            newAmount,
            boostPoints,
            user.currentScore
        );
    }

    /**
     * @notice NFT 컨트랙트의 사용자 점수 데이터 업데이트
     */
    function _updateNFTUserScore(address user) internal {
        (uint256 currentScore, bool isActive) = calculateCurrentScore(user);

        nftContract.updateUserScore(
            user,
            currentScore,
            0, // seasonPoints 제거
            0, // seasonsCompleted 제거
            isActive
        );
    }

    /**
     * @notice 기본 점수 계산 - 현재 상태 기반, 즉시 혜택 제공
     */
    function _calculateBaseScore(
        DelegationTier tier,
        uint256 amount
    ) internal pure returns (uint256) {
        // 현재 티어 기반 즉시 포인트 (누적 아닌 현재 상태)
        uint256 tierPoints;
        if (tier == DelegationTier.Galaxy)
            tierPoints = 1000; // 높은 즉시 포인트
        else if (tier == DelegationTier.Star) tierPoints = 500;
        else if (tier == DelegationTier.Comet) tierPoints = 200;
        else tierPoints = 100;

        // 위임량 보너스 (현재 상태 기반)
        uint256 amountBonus = (amount / 1e6) * 10; // 더 높은 보너스

        return tierPoints + amountBonus;
    }

    /**
     * @notice 티어 상승 시 즉시 보너스 포인트 계산 - 빠른 만족감 제공
     */
    function _calculateBoostPoints(
        DelegationTier oldTier,
        DelegationTier newTier,
        uint256 amount
    ) internal pure returns (uint256) {
        if (newTier <= oldTier) return 0;

        // 더 큰 즉시 보너스로 성취감 증대
        uint256 tierJump = uint256(newTier) - uint256(oldTier);
        uint256 baseBoost = tierJump * 200; // 4배 증가된 보너스
        uint256 amountBonus = (amount / 1e6) * 5; // 더 높은 위임량 보너스

        return baseBoost + amountBonus;
    }

    /**
     * @notice 주간 혜택 자격 확인 - 즉시 혜택 시스템
     * @param user 사용자 주소
     * @return isEligible 주간 혜택 자격 여부
     * @return currentWeek 현재 주차
     * @return tierLevel 현재 티어 레벨
     */
    function getWeeklyBenefitStatus(
        address user
    )
        external
        view
        returns (bool isEligible, uint256 currentWeek, uint256 tierLevel)
    {
        if (!hasNFT[user]) return (false, 0, 0);

        (uint256 currentScore, bool isActive) = calculateCurrentScore(user);
        if (!isActive) return (false, 0, 0);

        UserData memory data = userData[user];

        // 현재 주차 계산 (epoch 기준)
        currentWeek = block.timestamp / (7 days);

        // 티어 레벨 (Galaxy=4, Star=3, Comet=2, Asteroid=1)
        tierLevel = uint256(data.currentTier) + 1;

        // 검증 활성 상태라면 주간 혜택 자격 있음
        isEligible = isActive && currentScore > 0;

        return (isEligible, currentWeek, tierLevel);
    }

    /**
     * @notice 즉시 보상 포인트 계산 - 현재 상태 기반
     * @param user 사용자 주소
     * @return instantReward 즉시 보상 포인트
     * @return multiplier 티어 배수
     */
    function calculateInstantReward(
        address user
    ) external view returns (uint256 instantReward, uint256 multiplier) {
        if (!hasNFT[user]) return (0, 0);

        (uint256 currentScore, bool isActive) = calculateCurrentScore(user);
        if (!isActive) return (0, 0);

        UserData memory data = userData[user];

        // 티어별 배수 (더 높은 즉시 보상)
        if (data.currentTier == DelegationTier.Galaxy) multiplier = 5;
        else if (data.currentTier == DelegationTier.Star) multiplier = 3;
        else if (data.currentTier == DelegationTier.Comet) multiplier = 2;
        else multiplier = 1;

        // 현재 점수의 일정 비율을 즉시 보상으로 제공
        instantReward = (currentScore * multiplier) / 10;

        return (instantReward, multiplier);
    }

    /**
     * @notice 주소를 hex 문자열로 변환
     */
    function _addressToString(
        address addr
    ) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    // ==================== ADMIN FUNCTIONS ====================

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateChainlinkConfig(
        uint64 _subscriptionId,
        uint32 _gasLimit,
        string calldata _source
    ) external onlyOwner {
        require(_gasLimit <= 300000, "Gas limit exceeds maximum allowed");
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        source = _source;

        emit ChainlinkConfigUpdated(_subscriptionId, _gasLimit, _source);
    }

    /**
     * @notice 구독 ID만 업데이트
     */
    function updateSubscriptionId(uint64 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
        emit SubscriptionIdUpdated(_subscriptionId);
    }

    /**
     * @notice 가스 제한만 업데이트
     */
    function updateGasLimit(uint32 _gasLimit) external onlyOwner {
        require(_gasLimit <= 300000, "Gas limit exceeds maximum allowed");
        gasLimit = _gasLimit;
        emit GasLimitUpdated(_gasLimit);
    }

    /**
     * @notice 소스 코드만 업데이트
     */
    function updateSource(string calldata _source) external onlyOwner {
        require(bytes(_source).length > 0, "Source code cannot be empty");
        source = _source;
        emit SourceCodeUpdated(_source);
    }

    /**
     * @notice Chainlink Functions 설정 조회
     */
    function getChainlinkConfig()
        external
        view
        returns (
            uint64 _subscriptionId,
            uint32 _gasLimit,
            string memory _source
        )
    {
        return (subscriptionId, gasLimit, source);
    }

    /**
     * @notice 점수 만료 처리
     */
    function processExpiredScores(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            if (!hasNFT[user]) continue;

            (uint256 currentScore, bool isActive) = calculateCurrentScore(user);
            UserData storage data = userData[user];

            if (!isActive && data.isActive) {
                data.isActive = false;
                data.boostPoints = 0;
                emit ScoreExpired(user, data.currentScore);
            }

            data.currentScore = currentScore;

            // NFT 컨트랙트 업데이트
            _updateNFTUserScore(user);
        }
    }
}
