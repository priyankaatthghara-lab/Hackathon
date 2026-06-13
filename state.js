/**
 * State Manager for DSA Copilot
 * Handles local storage persistence, gamification logic (XP, levels, badges, streaks),
 * and tracks roadmap node completion and quiz histories.
 */
const DEFAULT_STATE = {
    user: {
        name: "Neo Coder",
        level: 1,
        xp: 0,
        streak: 1,
        lastActiveDate: new Date().toDateString(),
        badges: ["initiate"],
        currentGoal: "dsa_fundamentals" // "dsa_fundamentals", "faang_prep", "cp_master"
    },
    quizHistory: [],
    roadmapProgress: {
        // Topic node statuses: 'locked', 'unlocked', 'in_progress', 'completed'
        // Initialize basic nodes as unlocked, others locked
        "arr_basics": "unlocked",
        "arr_ops": "locked",
        "ll_basics": "locked",
        "ll_adv": "locked",
        "tree_basics": "locked",
        "tree_bst": "locked",
        "graph_basics": "locked",
        "graph_traversal": "locked",
        "dp_basics": "locked",
        "dp_knapsack": "locked"
    },
    chatHistory: [
        {
            sender: "mentor",
            text: "Welcome back, student. I am your Neural DSA Mentor. Ask me any conceptual question or let me generate a roadmap for you.",
            timestamp: new Date().toISOString()
        }
    ]
};
const ALL_BADGES = {
    "initiate": { id: "initiate", name: "Cyber Initiate", desc: "Started the DSA Journey", icon: "🚀", color: "#00f0ff" },
    "first_quiz": { id: "first_quiz", name: "Quiz Hacker", desc: "Completed your first quiz", icon: "🧠", color: "#a855f7" },
    "perfect_score": { id: "perfect_score", name: "Perfect Sync", desc: "Scored 100% on a quiz", icon: "🎯", color: "#ec4899" },
    "streak_3": { id: "streak_3", name: "System Overdrive", desc: "Maintained a 3-day streak", icon: "🔥", color: "#f97316" },
    "streak_7": { id: "streak_7", name: "Quantum Fusion", desc: "Maintained a 7-day streak", icon: "⚡", color: "#eab308" },
    "level_5": { id: "level_5", name: "Compiler King", desc: "Reached Level 5", icon: "👑", color: "#3b82f6" },
    "dp_conqueror": { id: "dp_conqueror", name: "Matrix Architect", desc: "Scored 100% on a Hard DP Quiz", icon: "🕸️", color: "#10b981" },
    "graph_conqueror": { id: "graph_conqueror", name: "Net Explorer", desc: "Scored 100% on a Hard Graph Quiz", icon: "📡", color: "#14b8a6" }
};
class StateManager {
    constructor() {
        this.key = "dsa_copilot_state_v1";
        this.state = this.loadState();
        this.updateStreak();
    }
    loadState() {
        const raw = localStorage.getItem(this.key);
        if (!raw) {
            localStorage.setItem(this.key, JSON.stringify(DEFAULT_STATE));
            return JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
        try {
            const parsed = JSON.parse(raw);
            // Merge defaults in case of missing keys
            return {
                ...DEFAULT_STATE,
                ...parsed,
                user: { ...DEFAULT_STATE.user, ...parsed.user },
                roadmapProgress: { ...DEFAULT_STATE.roadmapProgress, ...parsed.roadmapProgress }
            };
        } catch (e) {
            console.error("Failed to parse local storage state. Resetting to default.", e);
            return JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    }
    saveState() {
        localStorage.setItem(this.key, JSON.stringify(this.state));
        // Dispatch custom event to notify other components of state update
        window.dispatchEvent(new CustomEvent("copilotStateUpdated", { detail: this.state }));
    }
    resetState() {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.state.user.lastActiveDate = new Date().toDateString();
        this.saveState();
    }
    getUser() {
        return this.state.user;
    }
    getQuizHistory() {
        return this.state.quizHistory || [];
    }
    getRoadmapProgress() {
        return this.state.roadmapProgress || {};
    }
    getChatHistory() {
        return this.state.chatHistory || [];
    }
    addXP(amount) {
        const user = this.state.user;
        const oldLevel = user.level;
        user.xp += amount;
        
        // XP formula: Level = floor(sqrt(XP / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
        let leveledUp = false;
        
        if (newLevel > oldLevel) {
            user.level = newLevel;
            leveledUp = true;
            if (newLevel >= 5) {
                this.unlockBadge("level_5");
            }
        }
        
        this.saveState();
        return { leveledUp, oldLevel, newLevel, xpAdded: amount };
    }
    updateStreak() {
        const user = this.state.user;
        const today = new Date().toDateString();
        const lastActive = user.lastActiveDate;
        if (today !== lastActive) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            if (lastActive === yesterdayStr) {
                user.streak += 1;
                // Award streak badges
                if (user.streak >= 7) {
                    this.unlockBadge("streak_7");
                } else if (user.streak >= 3) {
                    this.unlockBadge("streak_3");
                }
            } else {
                // Streak broken
                user.streak = 1;
            }
            user.lastActiveDate = today;
            this.saveState();
        }
    }
    unlockBadge(badgeId) {
        const user = this.state.user;
        if (ALL_BADGES[badgeId] && !user.badges.includes(badgeId)) {
            user.badges.push(badgeId);
            this.saveState();
            // Trigger animation or system notification
            window.dispatchEvent(new CustomEvent("badgeUnlocked", { detail: ALL_BADGES[badgeId] }));
            return true;
        }
        return false;
    }
    setGoal(goalId) {
        this.state.user.currentGoal = goalId;
        // Adjust default unlocked nodes depending on the goal
        const progress = this.state.roadmapProgress;
        if (goalId === "faang_prep") {
            progress["arr_basics"] = "unlocked";
            progress["ll_basics"] = "unlocked";
            progress["tree_basics"] = "unlocked";
        } else if (goalId === "cp_master") {
            progress["arr_basics"] = "completed";
            progress["arr_ops"] = "completed";
            progress["ll_basics"] = "completed";
            progress["ll_adv"] = "completed";
            progress["tree_basics"] = "unlocked";
            progress["tree_bst"] = "unlocked";
            progress["graph_basics"] = "unlocked";
            progress["dp_basics"] = "unlocked";
        } else {
            // Reset to default
            this.state.roadmapProgress = { ...DEFAULT_STATE.roadmapProgress };
        }
        this.saveState();
    }
    updateRoadmapProgress(nodeId, status) {
        this.state.roadmapProgress[nodeId] = status;
        this.saveState();
    }
    addQuizRecord(record) {
        // Record format: { topic, difficulty, score, total, date, xpEarned, duration }
        this.state.quizHistory.push(record);
        
        // Level up/XP update
        const xpResult = this.addXP(record.xpEarned);
        
        // Badge checking
        this.unlockBadge("first_quiz");
        if (record.score === record.total) {
            this.unlockBadge("perfect_score");
            if (record.topic.toLowerCase() === "dynamic programming" && record.difficulty === "hard") {
                this.unlockBadge("dp_conqueror");
            }
            if (record.topic.toLowerCase() === "graphs" && record.difficulty === "hard") {
                this.unlockBadge("graph_conqueror");
            }
        }
        
        this.saveState();
        return xpResult;
    }
    addChatMessage(sender, text) {
        this.state.chatHistory.push({
            sender,
            text,
            timestamp: new Date().toISOString()
        });
        
        // Max 50 messages stored
        if (this.state.chatHistory.length > 50) {
            this.state.chatHistory.shift();
        }
        
        // Give small reward (+2 XP) for chatting (max once per message)
        let xpResult = null;
        if (sender === "user") {
            xpResult = this.addXP(2);
        }
        
        this.saveState();
        return xpResult;
    }
    getAllBadges() {
        return ALL_BADGES;
    }
}
// Export as globally accessible instance
window.stateManager = new StateManager();
