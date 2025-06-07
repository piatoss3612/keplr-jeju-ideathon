// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

import {DelegationTier, TierUtils} from "./libraries/OrbitUtils.sol";
import {ValidationUtils} from "./libraries/ValidationUtils.sol";
import {OrbitRewardsNFT} from "./OrbitRewardsNFT.sol";

/**
 * @title OrbitRewards - Delegation Rewards System
 * @notice Time-based loyalty system with 21-day scoring windows, 14-day verification cycles, and seasonal progression
 * @dev Main contract that manages scoring and interacts with separate NFT contract
 */
contract OrbitRewards is FunctionsClient, ConfirmedOwner {
    using ValidationUtils for uint256;
    using ValidationUtils for string;
    using TierUtils for DelegationTier;
    using TierUtils for uint256;

    // ==================== CONSTANTS ====================

    address private constant ROUTER_ADDRESS =
        0xf9B8fc078197181C841c296C876945aaa425B278;
    bytes32 private constant DON_ID =
        0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;

    // Time constants
    uint256 private constant SCORING_WINDOW = 21 days;
    uint256 private constant VERIFICATION_INTERVAL = 14 days;
    uint256 private constant SCORE_GRACE_PERIOD = 7 days;
    uint256 private constant TOTAL_CYCLE =
        VERIFICATION_INTERVAL + SCORE_GRACE_PERIOD;

    // Seasonal rewards constants
    uint256 private constant SEASON_DURATION = 30 days;
    uint256 private constant SEASON_MILESTONE_BONUS = 100;
    uint256 private constant SEASON_COMPLETION_BONUS = 300;

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
        uint256 seasonPoints;
        uint256 seasonMilestones;
        uint256 seasonsCompleted;
    }

    struct SeasonInfo {
        uint256 seasonNumber;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 totalParticipants;
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
        uint256 seasonPoints;
        uint256 seasonMilestones;
        uint256 seasonsCompleted;
    }

    // ==================== STATE VARIABLES ====================

    // Chainlink configuration
    uint64 public subscriptionId;
    uint32 public gasLimit = 300000;
    string public source;

    // NFT contract
    OrbitRewardsNFT public nftContract;

    // Core tracking
    mapping(bytes32 => address) public requestToSender;
    mapping(bytes32 => bool) public isVerificationRequest;

    // Fulfilled request results - 가스 최적화를 위해 결과만 저장
    mapping(bytes32 => bytes) public fulfilledResults;
    mapping(bytes32 => bool) public isRequestFulfilled;

    mapping(address => bool) public hasNFT;
    mapping(address => UserData) public userData;

    // Seasonal system
    SeasonInfo public currentSeason;
    mapping(uint256 => mapping(address => bool)) public seasonRewardClaimed;
    mapping(uint256 => mapping(address => uint256)) public userSeasonPoints;

    // ==================== EVENTS ====================

    event InitialQualificationClaimed(
        address indexed user,
        uint256 indexed tokenId,
        DelegationTier tier,
        uint256 amount
    );

    event LoyaltyVerificationRequested(
        address indexed user,
        bytes32 indexed requestId
    );

    event LoyaltyVerified(
        address indexed user,
        DelegationTier newTier,
        uint256 newAmount,
        uint256 boostPoints,
        uint256 currentScore
    );

    event ScoreCalculated(
        address indexed user,
        uint256 score,
        uint256 seasonalPoints,
        bool isActive
    );

    event ScoreExpired(address indexed user, uint256 expiredScore);

    event SeasonStarted(uint256 indexed seasonNumber, uint256 startTime);
    event SeasonEnded(uint256 indexed seasonNumber, uint256 endTime);
    event SeasonMilestoneReached(
        address indexed user,
        uint256 indexed seasonNumber,
        uint256 milestone,
        uint256 bonus
    );
    event SeasonRewardClaimed(
        address indexed user,
        uint256 indexed seasonNumber,
        uint256 totalPoints,
        uint256 bonus,
        uint256 specialNftId
    );

    // 새로운 이벤트 - 2단계 처리 시스템용
    event RequestProcessed(
        address indexed user,
        bytes32 indexed requestId,
        bool isVerification
    );

    // ==================== ERRORS ====================

    error UnauthorizedClaimant(address expected, address actual);
    error AlreadyHasNFT(address user);
    error NoNFTFound(address user);
    error VerificationTooEarly(uint256 timeRemaining);
    error InvalidClaimantAddress();
    error SeasonNotEnded(uint256 seasonNumber);
    error SeasonRewardAlreadyClaimed(uint256 seasonNumber);
    error NotEligibleForSeasonReward();

    // ==================== CONSTRUCTOR ====================

    constructor(
        uint64 _subscriptionId,
        string memory _source
    ) FunctionsClient(ROUTER_ADDRESS) ConfirmedOwner(msg.sender) {
        subscriptionId = _subscriptionId;
        source = _source;

        // NFT 컨트랙트 배포
        nftContract = new OrbitRewardsNFT(address(this));

        // 첫 번째 시즌 시작
        _startNewSeason();
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

        return requestId;
    }

    /**
     * @notice 기존 사용자의 loyalty 검증 요청 (14일 후부터 가능)
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

        // 14일 간격 체크
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

        emit LoyaltyVerificationRequested(msg.sender, requestId);

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
        if (err.length > 0) return;

        // 가스 절약을 위해 결과만 저장하고 실제 처리는 별도 함수에서
        fulfilledResults[requestId] = response;
        isRequestFulfilled[requestId] = true;

        emit RequestFulfilled(requestId);
    }

    /**
     * @notice fulfilled 된 요청 결과를 처리 (사용자가 직접 호출)
     */
    function processRequest(bytes32 requestId) external {
        require(isRequestFulfilled[requestId], "Request not fulfilled yet");
        require(requestToSender[requestId] == msg.sender, "Not request owner");

        bytes memory response = fulfilledResults[requestId];
        string memory amountString = abi.decode(response, (string));
        uint256 amount = ValidationUtils.validateAndParseAmount(amountString);
        DelegationTier tier = amount.getTierForAmount();

        bool isVerification = isVerificationRequest[requestId];

        if (isVerification) {
            _processLoyaltyVerification(msg.sender, tier, amount);
        } else {
            _mintInitialNFT(msg.sender, tier, amount);
        }

        emit RequestProcessed(msg.sender, requestId, isVerification);
    }

    // ==================== SEASONAL FUNCTIONS ====================

    /**
     * @notice 시즌 종료 보상 수령
     */
    function claimSeasonReward(uint256 seasonNumber) external {
        require(seasonNumber < currentSeason.seasonNumber, "Season not ended");

        if (seasonRewardClaimed[seasonNumber][msg.sender]) {
            revert SeasonRewardAlreadyClaimed(seasonNumber);
        }

        uint256 userPoints = userSeasonPoints[seasonNumber][msg.sender];
        if (userPoints == 0) {
            revert NotEligibleForSeasonReward();
        }

        (uint256 bonus, bool earnedSpecialNFT) = _calculateSeasonReward(
            userPoints
        );

        uint256 specialNftId = 0;
        if (earnedSpecialNFT) {
            UserData storage _user = userData[msg.sender];
            specialNftId = nftContract.mintSeasonEndNFT(
                msg.sender,
                _user.currentTier,
                _user.currentAmount,
                seasonNumber
            );
        }

        UserData storage user = userData[msg.sender];
        user.boostPoints += bonus;
        user.seasonsCompleted++;

        // NFT 컨트랙트의 사용자 점수 업데이트
        _updateNFTUserScore(msg.sender);

        seasonRewardClaimed[seasonNumber][msg.sender] = true;

        emit SeasonRewardClaimed(
            msg.sender,
            seasonNumber,
            userPoints,
            bonus,
            specialNftId
        );
    }

    /**
     * @notice 현재 시즌 정보 조회
     */
    function getCurrentSeasonInfo() external view returns (SeasonInfo memory) {
        return currentSeason;
    }

    /**
     * @notice 사용자 시즌 점수 조회
     */
    function getUserSeasonPoints(
        address user,
        uint256 seasonNumber
    ) external view returns (uint256 points) {
        if (seasonNumber == 0) {
            seasonNumber = currentSeason.seasonNumber;
        }
        return userSeasonPoints[seasonNumber][user];
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice 사용자의 현재 점수 계산 (21일 윈도우 기반)
     */
    function calculateCurrentScore(
        address user
    ) public view returns (uint256 currentScore, bool isActive) {
        if (!hasNFT[user]) return (0, false);

        UserData memory data = userData[user];

        uint256 timeSinceMint = block.timestamp - data.mintTimestamp;
        uint256 timeSinceLastVerification = block.timestamp -
            data.lastVerificationTime;

        bool withinMintWindow = timeSinceMint <= SCORING_WINDOW;
        bool withinVerificationWindow = timeSinceLastVerification <=
            SCORING_WINDOW;

        isActive = withinMintWindow || withinVerificationWindow;

        if (!isActive) {
            return (0, false);
        }

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
        info.seasonPoints = data.seasonPoints;
        info.seasonMilestones = data.seasonMilestones;
        info.seasonsCompleted = data.seasonsCompleted;

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

        bytes memory response = fulfilledResults[requestId];
        string memory amountString = abi.decode(response, (string));
        amount = ValidationUtils.validateAndParseAmount(amountString);
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
        if (claimant != tx.origin) {
            revert UnauthorizedClaimant(claimant, tx.origin);
        }
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

        _updateSeasonPoints(claimant, baseScore);

        if (
            userSeasonPoints[currentSeason.seasonNumber][claimant] == baseScore
        ) {
            currentSeason.totalParticipants++;
        }

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

        (uint256 oldScore, bool wasActive) = calculateCurrentScore(claimant);

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

        uint256 pointsToAdd = 0;
        if (wasActive) {
            if (user.currentScore > oldScore) {
                pointsToAdd = user.currentScore - oldScore;
            }
        } else {
            pointsToAdd = user.currentScore;
        }

        if (pointsToAdd > 0) {
            _updateSeasonPoints(claimant, pointsToAdd);
        }

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
     * @notice 시즌 포인트 업데이트 및 마일스톤 체크
     */
    function _updateSeasonPoints(address user, uint256 points) internal {
        UserData storage userData_ = userData[user];
        uint256 oldSeasonPoints = userData_.seasonPoints;
        userData_.seasonPoints += points;

        userSeasonPoints[currentSeason.seasonNumber][user] = userData_
            .seasonPoints;

        uint256 oldMilestones = oldSeasonPoints / 1000;
        uint256 newMilestones = userData_.seasonPoints / 1000;

        if (newMilestones > oldMilestones) {
            uint256 milestonesAchieved = newMilestones - oldMilestones;
            userData_.seasonMilestones += milestonesAchieved;

            uint256 milestoneBonus = milestonesAchieved *
                SEASON_MILESTONE_BONUS;
            userData_.boostPoints += milestoneBonus;

            emit SeasonMilestoneReached(
                user,
                currentSeason.seasonNumber,
                newMilestones,
                milestoneBonus
            );
        }
    }

    /**
     * @notice NFT 컨트랙트의 사용자 점수 데이터 업데이트
     */
    function _updateNFTUserScore(address user) internal {
        UserData memory data = userData[user];
        (uint256 currentScore, bool isActive) = calculateCurrentScore(user);

        nftContract.updateUserScore(
            user,
            currentScore,
            data.seasonPoints,
            data.seasonsCompleted,
            isActive
        );
    }

    /**
     * @notice 시즌 보상 계산
     */
    function _calculateSeasonReward(
        uint256 userPoints
    ) internal pure returns (uint256 bonus, bool earnedSpecialNFT) {
        if (userPoints >= 5000) {
            bonus = SEASON_COMPLETION_BONUS;
            earnedSpecialNFT = true;
        } else if (userPoints >= 2000) {
            bonus = SEASON_COMPLETION_BONUS / 2;
            earnedSpecialNFT = false;
        } else if (userPoints >= 500) {
            bonus = SEASON_COMPLETION_BONUS / 4;
            earnedSpecialNFT = false;
        } else {
            bonus = 0;
            earnedSpecialNFT = false;
        }
    }

    /**
     * @notice 기본 점수 계산
     */
    function _calculateBaseScore(
        DelegationTier tier,
        uint256 amount
    ) internal pure returns (uint256) {
        uint256 tierMultiplier;
        if (tier == DelegationTier.Galaxy) tierMultiplier = 20;
        else if (tier == DelegationTier.Star) tierMultiplier = 8;
        else if (tier == DelegationTier.Comet) tierMultiplier = 3;
        else tierMultiplier = 1;

        uint256 amountBonus = amount / 1e6;

        return tierMultiplier * 100 + amountBonus;
    }

    /**
     * @notice 티어 상승 시 부스트 포인트 계산
     */
    function _calculateBoostPoints(
        DelegationTier oldTier,
        DelegationTier newTier,
        uint256 amount
    ) internal pure returns (uint256) {
        if (newTier <= oldTier) return 0;

        uint256 tierJump = uint256(newTier) - uint256(oldTier);
        uint256 baseBoost = tierJump * 50;
        uint256 amountBonus = (amount / 1e6) / 10;

        return baseBoost + amountBonus;
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

    function updateChainlinkConfig(
        uint64 _subscriptionId,
        uint32 _gasLimit,
        string calldata _source
    ) external onlyOwner {
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        source = _source;
    }

    /**
     * @notice 새 시즌 시작
     */
    function startNewSeason()
        external
        onlyOwner
        returns (uint256 newSeasonNumber)
    {
        return _startNewSeason();
    }

    /**
     * @notice 시즌 강제 종료
     */
    function endCurrentSeason() external onlyOwner {
        require(currentSeason.active, "Season not active");
        currentSeason.active = false;
        currentSeason.endTime = block.timestamp;

        emit SeasonEnded(currentSeason.seasonNumber, block.timestamp);
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

    /**
     * @notice 시즌 자동 종료 체크 및 처리
     */
    function checkAndEndSeason() external {
        if (currentSeason.active && block.timestamp >= currentSeason.endTime) {
            currentSeason.active = false;
            emit SeasonEnded(currentSeason.seasonNumber, block.timestamp);
        }
    }

    /**
     * @notice 내부 시즌 시작 처리
     */
    function _startNewSeason() internal returns (uint256 newSeasonNumber) {
        if (currentSeason.active) {
            currentSeason.active = false;
            currentSeason.endTime = block.timestamp;
            emit SeasonEnded(currentSeason.seasonNumber, block.timestamp);
        }

        newSeasonNumber = currentSeason.seasonNumber + 1;
        currentSeason = SeasonInfo({
            seasonNumber: newSeasonNumber,
            startTime: block.timestamp,
            endTime: block.timestamp + SEASON_DURATION,
            active: true,
            totalParticipants: 0
        });

        emit SeasonStarted(newSeasonNumber, block.timestamp);

        return newSeasonNumber;
    }
}
