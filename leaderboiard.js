/**
 * Competitive Leaderboard System
 * Exposes a ranking board populated with demo users and merges the current user's state.
 * Simulates real-time multiplayer updates to enhance competitive gamification.
 */
const DEMO_USERS = [
    { id: "demo_1", name: "DijkstraDemon", level: 6, xp: 3650, streak: 14, avatar: "👾", badge: "graph_conqueror" },
    { id: "demo_2", name: "AlgoQueen", level: 5, xp: 2800, streak: 8, avatar: "👑", badge: "dp_conqueror" },
    { id: "demo_3", name: "BinaryBoss", level: 4, xp: 2100, streak: 6, avatar: "🦾", badge: "perfect_score" },
    { id: "demo_4", name: "StackOverflowed", level: 3, xp: 1450, streak: 3, avatar: "💥", badge: "streak_3" },
    { id: "demo_5", name: "CodeKnight", level: 2, xp: 850, streak: 4, avatar: "🛡️", badge: "first_quiz" }
];
class LeaderboardSystem {
    constructor() {
        this.key = "dsa_copilot_leaderboard_v1";
        this.board = this.loadBoard();
        this.startLiveSimulation();
    }
    loadBoard() {
        const raw = localStorage.getItem(this.key);
        if (!raw) {
            localStorage.setItem(this.key, JSON.stringify(DEMO_USERS));
            return [...DEMO_USERS];
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("Failed to parse leaderboard from storage. Reverting to default.", e);
            return [...DEMO_USERS];
        }
    }
    saveBoard() {
        localStorage.setItem(this.key, JSON.stringify(this.board));
        // Dispatch custom update event
        window.dispatchEvent(new CustomEvent("leaderboardUpdated", { detail: this.getRankings() }));
    }
    /**
     * Merge the user's live profile, sort by XP, and calculate rankings
     */
    getRankings() {
        const userState = window.stateManager.getUser();
        const activeBadges = window.stateManager.getAllBadges();
        
        // Find best user badge
        let bestBadge = "initiate";
        if (userState.badges.length > 0) {
            bestBadge = userState.badges[userState.badges.length - 1];
        }
        const currentUserObj = {
            id: "current_user",
            name: `${userState.name} (You)`,
            level: userState.level,
            xp: userState.xp,
            streak: userState.streak,
            avatar: "👤",
            badge: bestBadge,
            isUser: true
        };
        // Combine and sort
        const combined = [...this.board, currentUserObj];
        combined.sort((a, b) => b.xp - a.xp);
        // Assign ranks
        return combined.map((player, idx) => ({
            ...player,
            rank: idx + 1,
            badgeDetails: activeBadges[player.badge] || { icon: "🏆", color: "#00f0ff" }
        }));
    }
    /**
     * Periodically updates random demo users' XP to simulate real-time competition
     */
    simulateActivity() {
        // Pick random index
        const idx = Math.floor(Math.random() * this.board.length);
        const player = this.board[idx];
        // XP increments: +15, +30, +50
        const increments = [15, 30, 50];
        const gain = increments[Math.floor(Math.random() * increments.length)];
        player.xp += gain;
        // Recalculate level
        const newLevel = Math.floor(Math.sqrt(player.xp / 100)) + 1;
        if (newLevel > player.level) {
            player.level = newLevel;
        }
        // 20% chance to increment streak
        if (Math.random() < 0.2) {
            player.streak += 1;
        }
        this.saveBoard();
    }
    startLiveSimulation() {
        // Run simulator every 45 seconds to keep dashboard lively
        setInterval(() => {
            this.simulateActivity();
        }, 45000);
    }
}
// Export as globally accessible instance
window.leaderboardSystem = new LeaderboardSystem();
