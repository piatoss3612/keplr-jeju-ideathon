// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/**
 * @title ISeasonalSystem
 * @notice Interface for seasonal tracking and rewards system
 * @dev Handles seasonal competitions and leaderboards
 */
interface ISeasonalSystem {
    // ==================== STRUCTS ====================

    /// @notice Season information
    struct SeasonInfo {
        uint256 seasonNumber;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 totalParticipants;
        uint256 totalPoints;
    }

    /// @notice Player ranking information
    struct PlayerRanking {
        address player;
        uint256 points;
        uint256 rank;
        uint256 tier;
    }

    // ==================== EVENTS ====================

    event SeasonStarted(uint256 indexed seasonNumber, uint256 startTime);
    event SeasonEnded(uint256 indexed seasonNumber, uint256 endTime);
    event SeasonalPointsUpdated(address indexed player, uint256 points, uint256 seasonNumber);
    event LeaderboardUpdated(uint256 indexed seasonNumber, address indexed player, uint256 rank);

    // ==================== CUSTOM ERRORS ====================

    error SeasonNotActive();
    error SeasonAlreadyEnded();
    error InvalidSeasonNumber();

    // ==================== FUNCTIONS ====================

    /**
     * @notice Start a new season
     * @return seasonNumber The new season number
     */
    function startNewSeason() external returns (uint256 seasonNumber);

    /**
     * @notice End the current season
     */
    function endCurrentSeason() external;

    /**
     * @notice Update seasonal points for a player
     * @param player The player address
     * @param points Points to add
     */
    function updateSeasonalPoints(address player, uint256 points) external;

    /**
     * @notice Get current season information
     * @return info Current season info
     */
    function getCurrentSeason() external view returns (SeasonInfo memory info);

    /**
     * @notice Get player's seasonal points
     * @param player The player address
     * @param seasonNumber The season number (0 for current)
     * @return points The player's points
     */
    function getSeasonalPoints(address player, uint256 seasonNumber) external view returns (uint256 points);

    /**
     * @notice Get top players for a season
     * @param seasonNumber The season number (0 for current)
     * @param limit Maximum number of players to return
     * @return rankings Array of player rankings
     */
    function getTopPlayers(uint256 seasonNumber, uint256 limit)
        external
        view
        returns (PlayerRanking[] memory rankings);

    /**
     * @notice Get player's rank in a season
     * @param player The player address
     * @param seasonNumber The season number (0 for current)
     * @return rank The player's rank (1-based)
     */
    function getPlayerRank(address player, uint256 seasonNumber) external view returns (uint256 rank);
}
