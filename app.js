/**
 * Main Coordinator (app.js)
 * Orchestrates navigation tabs, binds user event actions, synchronizes
 * states, updates headers, renders views, and triggers notifications.
 */
class Application {
    constructor() {
        this.activeTab = "dashboard";
        this.selectedRoadmapNode = null;
        this.init();
    }
    init() {
        // Event binding
        document.addEventListener("DOMContentLoaded", () => {
            this.bindNavigation();
            this.bindDashboardActions();
            this.bindMentorActions();
            this.bindQuizActions();
            this.bindRoadmapActions();
            this.bindSettings();
            
            // Listen for system events
            window.addEventListener("copilotStateUpdated", (e) => this.onStateUpdated(e.detail));
            window.addEventListener("badgeUnlocked", (e) => this.onBadgeUnlocked(e.detail));
            window.addEventListener("leaderboardUpdated", () => this.renderLeaderboard());
            // Initial renders
            this.updateUserProfile();
            this.renderDashboard();
            
            // Welcome message in AI Mentor
            this.renderChatMessages();
        });
    }
    /**
     * Binds navigation tabs
     */
    bindNavigation() {
        const links = document.querySelectorAll(".nav-link");
        links.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.dataset.target;
                this.switchTab(target);
            });
        });
    }
    switchTab(tabId) {
        this.activeTab = tabId;
        
        // Update nav links active class
        document.querySelectorAll(".nav-link").forEach(link => {
            if (link.dataset.target === tabId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
        // Update view containers active class
        document.querySelectorAll(".view-container").forEach(view => {
            if (view.id === `${tabId}-view`) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        // Specific view renders on load
        if (tabId === "dashboard") {
            this.renderDashboard();
        } else if (tabId === "roadmap") {
            this.renderRoadmap();
        } else if (tabId === "leaderboard") {
            this.renderLeaderboard();
        } else if (tabId === "analytics") {
            this.renderAnalytics();
        } else if (tabId === "mentor") {
            this.scrollChatToBottom();
        }
    }
    /**
     * Updates header status indicators
     */
    updateUserProfile() {
        const user = window.stateManager.getUser();
        
        // Text status
        document.getElementById("user-name").textContent = user.name;
        document.getElementById("user-level").textContent = `LVL ${user.level}`;
        document.getElementById("streak-count").textContent = user.streak;
        
        // XP Progress bar
        // Level XP boundary formulas:
        // Current Level threshold = (level - 1)^2 * 100
        // Next Level threshold = level^2 * 100
        const currentLvlXP = Math.pow(user.level - 1, 2) * 100;
        const nextLvlXP = Math.pow(user.level, 2) * 100;
        const levelRange = nextLvlXP - currentLvlXP;
        const userProgressXP = user.xp - currentLvlXP;
        const xpPercentage = Math.min(100, Math.max(0, (userProgressXP / levelRange) * 100));
        document.getElementById("xp-bar-fill").style.width = `${xpPercentage}%`;
        document.getElementById("xp-progress-text").textContent = `${user.xp} / ${nextLvlXP} XP`;
    }
    /**
     * Dashboard View
     */
    renderDashboard() {
        const user = window.stateManager.getUser();
        const history = window.stateManager.getQuizHistory();
        const badges = window.stateManager.getAllBadges();
        
        // Set stats
        document.getElementById("dash-level").textContent = user.level;
        document.getElementById("dash-xp").textContent = user.xp;
        document.getElementById("dash-streak").textContent = `${user.streak} Days`;
        document.getElementById("dash-quizzes").textContent = history.length;
        // Render Badges
        const badgeGrid = document.getElementById("dash-badge-grid");
        badgeGrid.innerHTML = "";
        
        Object.keys(badges).forEach(key => {
            const badge = badges[key];
            const unlocked = user.badges.includes(key);
            const badgeCard = document.createElement("div");
            badgeCard.className = `badge-card ${unlocked ? 'unlocked' : 'locked'}`;
            
            badgeCard.innerHTML = `
                <div class="badge-icon" style="text-shadow: 0 0 10px ${unlocked ? badge.color : 'transparent'};">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
            `;
            badgeGrid.appendChild(badgeCard);
        });
        // Render Streak Grid (Simulated weekly map)
        const streakContainer = document.getElementById("streak-dots");
        streakContainer.innerHTML = "";
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const todayIdx = (new Date().getDay() + 6) % 7; // Mon is 0, Sun is 6
        
        days.forEach((day, idx) => {
            const isActive = idx === todayIdx || (idx < todayIdx && Math.random() > 0.3); // mock past active days
            const dot = document.createElement("div");
            dot.className = `streak-dot ${isActive ? 'active' : ''}`;
            dot.innerHTML = `<span class="day-label">${day[0]}</span>`;
            streakContainer.appendChild(dot);
        });
        // Set goals selection
        const goalSelector = document.getElementById("dash-goal-selector");
        if (goalSelector) {
            goalSelector.value = user.currentGoal;
        }
    }
    bindDashboardActions() {
        // Goal selector change
        const goalSelector = document.getElementById("dash-goal-selector");
        if (goalSelector) {
            goalSelector.addEventListener("change", (e) => {
                window.stateManager.setGoal(e.target.value);
                this.showToast("Learning Goal Updated!");
            });
        }
        // Quick Navigation Buttons
        document.getElementById("dash-btn-roadmap").addEventListener("click", () => this.switchTab("roadmap"));
        document.getElementById("dash-btn-mentor").addEventListener("click", () => this.switchTab("mentor"));
        document.getElementById("dash-btn-quiz").addEventListener("click", () => this.switchTab("quiz"));
    }
    /**
     * AI Mentor View
     */
    renderChatMessages() {
        const chats = window.stateManager.getChatHistory();
        const container = document.getElementById("chat-messages-container");
        container.innerHTML = "";
        chats.forEach(msg => {
            this.appendMessageToDOM(msg.sender, msg.text, false);
        });
        
        this.scrollChatToBottom();
    }
    appendMessageToDOM(sender, text, animate = false) {
        const container = document.getElementById("chat-messages-container");
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-message ${sender}`;
        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = sender === "user" ? "👤" : "🤖";
        const textDiv = document.createElement("div");
        textDiv.className = "chat-text";
        
        msgDiv.appendChild(avatar);
        msgDiv.appendChild(textDiv);
        container.appendChild(msgDiv);
        if (animate && sender === "mentor") {
            // Stream message
            textDiv.classList.add("typing");
            window.mentorEngine.streamResponse(
                text,
                (updatingText) => {
                    textDiv.innerHTML = this.parseSimpleMarkdown(updatingText);
                    this.scrollChatToBottom();
                },
                () => {
                    textDiv.classList.remove("typing");
                    this.scrollChatToBottom();
                }
            );
        } else {
            textDiv.innerHTML = this.parseSimpleMarkdown(text);
        }
    }
    scrollChatToBottom() {
        const container = document.getElementById("chat-messages-container");
        container.scrollTop = container.scrollHeight;
    }
    bindMentorActions() {
        const chatForm = document.getElementById("chat-input-form");
        const chatInput = document.getElementById("chat-input");
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = chatInput.value.trim();
            if (!query) return;
            // Clear input
            chatInput.value = "";
            // Add user message
            this.appendMessageToDOM("user", query, false);
            const xpResult = window.stateManager.addChatMessage("user", query);
            this.scrollChatToBottom();
            // Trigger AI Typing indicator
            setTimeout(() => {
                const responseText = window.mentorEngine.getResponse(query);
                this.appendMessageToDOM("mentor", responseText, true);
                window.stateManager.addChatMessage("mentor", responseText);
                
                if (xpResult && xpResult.leveledUp) {
                    this.triggerLevelUpEffects(xpResult.newLevel);
                }
            }, 500);
        });
        // Quick prompts click bindings
        document.querySelectorAll(".quick-prompt-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                chatInput.value = btn.dataset.prompt;
                chatForm.dispatchEvent(new Event("submit"));
            });
        });
    }
    parseSimpleMarkdown(text) {
        // Simple regex parser for markdown structures to make the responses gorgeous
        let html = text;
        // Escape HTML tags
        html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
        html = html.replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
        // Lists
        html = html.replace(/^\- (.*$)/gim, '<li class="md-li">$1</li>');
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="md-strong">$1</strong>');
        // Inline Code
        html = html.replace(/\`(.*?)\`/g, '<code class="md-code-inline">$1</code>');
        // Fenced Code Blocks (Basic matching)
        html = html.replace(/\`\`\`(javascript|js|cpp|java)?([\s\S]*?)\`\`\`/g, '<pre class="md-code-block"><code>$2</code></pre>');
        // Callouts
        html = html.replace(/^&gt;\s*\[\!NOTE\]([\s\S]*?)$/gim, '<div class="md-callout note">$1</div>');
        html = html.replace(/^&gt;\s*\[\!TIP\]([\s\S]*?)$/gim, '<div class="md-callout tip">$1</div>');
        html = html.replace(/^&gt;\s*\[\!IMPORTANT\]([\s\S]*?)$/gim, '<div class="md-callout important">$1</div>');
        html = html.replace(/^&gt;\s*\[\!WARNING\]([\s\S]*?)$/gim, '<div class="md-callout warning">$1</div>');
        // Tables (Basic markdown table structure)
        const lines = html.split("\n");
        let inTable = false;
        let tableHtml = '<table class="md-table">';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("|") && line.endsWith("|")) {
                if (!inTable) {
                    inTable = true;
                    tableHtml = '<table class="md-table">';
                }
                const cells = line.split("|").slice(1, -1);
                
                // Skip separator rows (e.g. | :--- | :--- |)
                if (cells[0].trim().startsWith(":") || cells[0].trim().startsWith("-")) {
                    continue;
                }
                const tag = (i === 0 || !lines[i-1].trim().startsWith("|")) ? 'th' : 'td';
                tableHtml += '<tr>';
                cells.forEach(cell => {
                    tableHtml += `<${tag}>${cell.trim()}</${tag}>`;
                });
                tableHtml += '</tr>';
                
                lines[i] = ""; // clear processed line
            } else {
                if (inTable) {
                    inTable = false;
                    tableHtml += '</table>';
                    lines[i] = tableHtml + "\n" + lines[i];
                }
            }
        }
        if (inTable) {
            tableHtml += '</table>';
            lines.push(tableHtml);
        }
        
        html = lines.join("\n");
        return html;
    }
    /**
     * Quiz Arena View
     */
    bindQuizActions() {
        const startBtn = document.getElementById("quiz-start-btn");
        
        startBtn.addEventListener("click", () => {
            const topic = document.getElementById("quiz-topic-select").value;
            const difficulty = document.getElementById("quiz-diff-select").value;
            const count = parseInt(document.getElementById("quiz-count-select").value);
            this.launchQuiz(topic, difficulty, count);
        });
        // Nav and Option bindings are handled dynamically during quiz execution
        document.getElementById("quiz-prev-btn").addEventListener("click", () => this.runQuizPrev());
        document.getElementById("quiz-next-btn").addEventListener("click", () => this.runQuizNext());
        document.getElementById("quiz-submit-btn").addEventListener("click", () => this.runQuizSubmit());
        document.getElementById("quiz-results-exit").addEventListener("click", () => {
            document.getElementById("quiz-results-screen").classList.remove("active");
            document.getElementById("quiz-config-screen").classList.add("active");
        });
    }
    launchQuiz(topic, difficulty, count) {
        const session = window.quizArena.startSession(topic, difficulty, count);
        if (!session) {
            this.showToast("Not enough questions available in the database.");
            return;
        }
        // Hide config, show active quiz
        document.getElementById("quiz-config-screen").classList.remove("active");
        document.getElementById("quiz-active-screen").classList.add("active");
        // Set quiz titles
        document.getElementById("active-quiz-topic").textContent = topic;
        document.getElementById("active-quiz-difficulty").textContent = difficulty.toUpperCase();
        
        // Start Timer
        this.startQuizTimer();
        // Render current question
        this.renderQuizQuestion();
    }
    startQuizTimer() {
        const active = window.quizArena.activeQuiz;
        if (!active) return;
        const updateTimerDisplay = () => {
            const min = Math.floor((active.durationSeconds - active.elapsedSeconds) / 60);
            const sec = (active.durationSeconds - active.elapsedSeconds) % 60;
            document.getElementById("active-quiz-timer").textContent = 
                `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        };
        updateTimerDisplay();
        active.timerInterval = setInterval(() => {
            active.elapsedSeconds++;
            updateTimerDisplay();
            if (active.elapsedSeconds >= active.durationSeconds) {
                clearInterval(active.timerInterval);
                this.showToast("Time's up! Submitting quiz.");
                this.runQuizSubmit();
            }
        }, 1000);
    }
    renderQuizQuestion() {
        const active = window.quizArena.activeQuiz;
        if (!active) return;
        const q = window.quizArena.getCurrentQuestion();
        const qIdx = active.currentIndex;
        // Progress indicators
        document.getElementById("quiz-progress-filled").style.width = `${((qIdx + 1) / active.questions.length) * 100}%`;
        document.getElementById("active-quiz-num").textContent = `Question ${qIdx + 1} of ${active.questions.length}`;
        // Question text
        document.getElementById("active-quiz-question-text").textContent = q.question;
        // Render options list
        const optionsList = document.getElementById("active-quiz-options");
        optionsList.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const optBtn = document.createElement("button");
            optBtn.className = `quiz-option-card ${active.answers[qIdx] === idx ? 'selected' : ''}`;
            optBtn.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="option-content">${opt}</span>
            `;
            optBtn.addEventListener("click", () => {
                window.quizArena.selectOption(idx);
                
                // Toggle active option in DOM
                optionsList.querySelectorAll(".quiz-option-card").forEach(c => c.classList.remove("selected"));
                optBtn.classList.add("selected");
            });
            optionsList.appendChild(optBtn);
        });
        // Toggle buttons visibility
        document.getElementById("quiz-prev-btn").style.display = qIdx === 0 ? "none" : "block";
        
        if (qIdx === active.questions.length - 1) {
            document.getElementById("quiz-next-btn").style.display = "none";
            document.getElementById("quiz-submit-btn").style.display = "block";
        } else {
            document.getElementById("quiz-next-btn").style.display = "block";
            document.getElementById("quiz-submit-btn").style.display = "none";
        }
    }
    runQuizNext() {
        if (window.quizArena.nextQuestion()) {
            this.renderQuizQuestion();
        }
    }
    runQuizPrev() {
        if (window.quizArena.prevQuestion()) {
            this.renderQuizQuestion();
        }
    }
    runQuizSubmit() {
        const result = window.quizArena.submitSession();
        if (!result) return;
        // Switch screens
        document.getElementById("quiz-active-screen").classList.remove("active");
        document.getElementById("quiz-results-screen").classList.add("active");
        // Populate summary
        document.getElementById("results-score").textContent = `${result.score} / ${result.total}`;
        document.getElementById("results-xp").textContent = `+${result.xpEarned} XP`;
        
        const accuracy = Math.round((result.score / result.total) * 100);
        document.getElementById("results-accuracy").textContent = `${accuracy}%`;
        
        const timeMin = Math.floor(result.timeSpent / 60);
        const timeSec = result.timeSpent % 60;
        document.getElementById("results-time").textContent = `${timeMin}m ${timeSec}s`;
        // Render question corrections details
        const list = document.getElementById("results-correction-list");
        list.innerHTML = "";
        result.details.forEach((det, idx) => {
            const row = document.createElement("div");
            row.className = `correction-item ${det.isCorrect ? 'correct' : 'incorrect'}`;
            
            row.innerHTML = `
                <h4 class="correction-question">${idx + 1}. ${det.question}</h4>
                <div class="correction-choice">
                    <div>Your answer: <span class="choice-val">${det.userAnswer !== null ? det.options[det.userAnswer] : 'None'}</span></div>
                    <div>Correct answer: <span class="choice-val correct">${det.options[det.correctAnswer]}</span></div>
                </div>
                <div class="correction-explanation">${det.explanation}</div>
            `;
            list.appendChild(row);
        });
        // Trigger level-up modal if checked
        if (result.leveledUp) {
            this.triggerLevelUpEffects(result.newLevel);
        }
    }
    /**
     * Learning Roadmap View
     */
    renderRoadmap() {
        const container = document.getElementById("roadmap-nodes-container");
        const user = window.stateManager.getUser();
        
        window.roadmapManager.renderRoadmap(container, user.currentGoal, (node) => {
            this.openRoadmapNodeDrawer(node);
        });
    }
    bindRoadmapActions() {
        // Close node modal
        document.getElementById("node-drawer-close").addEventListener("click", () => {
            document.getElementById("node-details-drawer").classList.remove("active");
            this.selectedRoadmapNode = null;
        });
        // Discuss node on mentor click
        document.getElementById("drawer-btn-mentor").addEventListener("click", () => {
            if (!this.selectedRoadmapNode) return;
            const query = `Explain ${this.selectedRoadmapNode.title} concepts like ${this.selectedRoadmapNode.concepts.join(', ')}.`;
            
            // Switch tabs
            this.switchTab("mentor");
            
            // Populate chat form and send
            const input = document.getElementById("chat-input");
            input.value = query;
            document.getElementById("chat-input-form").dispatchEvent(new Event("submit"));
            // Close drawer
            document.getElementById("node-details-drawer").classList.remove("active");
        });
        // Start Node Quiz
        document.getElementById("drawer-btn-quiz").addEventListener("click", () => {
            if (!this.selectedRoadmapNode) return;
            
            // Set topic in dropdowns
            document.getElementById("quiz-topic-select").value = this.selectedRoadmapNode.topic;
            document.getElementById("quiz-diff-select").value = this.selectedRoadmapNode.difficulty;
            
            // Switch tabs
            this.switchTab("quiz");
            // Close drawer
            document.getElementById("node-details-drawer").classList.remove("active");
        });
        // Mark Node Complete
        document.getElementById("drawer-btn-complete").addEventListener("click", () => {
            if (!this.selectedRoadmapNode) return;
            
            const user = window.stateManager.getUser();
            const res = window.roadmapManager.completeNode(this.selectedRoadmapNode.id, user.currentGoal);
            
            if (res.success) {
                this.showToast(`Node completed! +50 XP earned.`);
                this.renderRoadmap();
                
                // Re-open/update status drawer
                const nodes = window.roadmapManager.getNodesForGoal(user.currentGoal);
                const updatedNode = nodes.find(n => n.id === this.selectedRoadmapNode.id);
                this.openRoadmapNodeDrawer(updatedNode);
                if (res.leveledUp) {
                    this.triggerLevelUpEffects(res.newLevel);
                }
            }
        });
    }
    openRoadmapNodeDrawer(node) {
        this.selectedRoadmapNode = node;
        const drawer = document.getElementById("node-details-drawer");
        
        document.getElementById("drawer-node-title").textContent = node.title;
        document.getElementById("drawer-node-desc").textContent = node.desc;
        
        // Status updates
        const statusEl = document.getElementById("drawer-node-status");
        statusEl.className = `status-indicator ${node.status}`;
        statusEl.textContent = node.status.replace('_', ' ').toUpperCase();
        // Render concepts
        const conceptsContainer = document.getElementById("drawer-concepts-list");
        conceptsContainer.innerHTML = "";
        node.concepts.forEach(c => {
            const li = document.createElement("li");
            li.textContent = c;
            conceptsContainer.appendChild(li);
        });
        // Render resources
        const resContainer = document.getElementById("drawer-resources-list");
        resContainer.innerHTML = "";
        node.resources.forEach(r => {
            const li = document.createElement("li");
            li.textContent = r;
            resContainer.appendChild(li);
        });
        // Complete Button state
        const completeBtn = document.getElementById("drawer-btn-complete");
        if (node.status === "completed") {
            completeBtn.disabled = true;
            completeBtn.textContent = "Completed";
        } else {
            completeBtn.disabled = false;
            completeBtn.textContent = "Mark as Completed (+50 XP)";
        }
        // Open modal
        drawer.classList.add("active");
    }
    /**
     * Leaderboard View
     */
    renderLeaderboard() {
        const boardTable = document.querySelector("#leaderboard-table tbody");
        if (!boardTable) return;
        
        boardTable.innerHTML = "";
        const players = window.leaderboardSystem.getRankings();
        players.forEach(p => {
            const tr = document.createElement("tr");
            if (p.isUser) tr.className = "currentUserHighlight";
            tr.innerHTML = `
                <td class="rank-cell">${p.rank}</td>
                <td class="avatar-cell">${p.avatar}</td>
                <td class="name-cell">${p.name}</td>
                <td class="badge-cell"><span class="badge-tag" style="border-color:${p.badgeDetails.color}; color:${p.badgeDetails.color}">${p.badgeDetails.icon} ${p.badgeDetails.name}</span></td>
                <td class="level-cell">LVL ${p.level}</td>
                <td class="streak-cell">🔥 ${p.streak}</td>
                <td class="xp-cell">${p.xp} XP</td>
            `;
            boardTable.appendChild(tr);
        });
    }
    /**
     * Analytics View
     */
    renderAnalytics() {
        // Aggregates
        const summary = window.analyticsEngine.getSummary();
        document.getElementById("analytics-total-quizzes").textContent = summary.totalQuizzes;
        document.getElementById("analytics-accuracy").textContent = `${summary.overallAccuracy}%`;
        document.getElementById("analytics-xp-gained").textContent = summary.totalXpEarned;
        // Render charts
        const masteryContainer = document.getElementById("chart-mastery-subject");
        const xpTimelineContainer = document.getElementById("chart-xp-timeline");
        window.analyticsEngine.renderMasteryChart(masteryContainer);
        window.analyticsEngine.renderXPProgressChart(xpTimelineContainer);
        // Weak Topics
        const weakContainer = document.getElementById("analytics-weak-list");
        weakContainer.innerHTML = "";
        const weak = window.analyticsEngine.getWeakTopics();
        if (weak.length === 0 || summary.totalQuizzes === 0) {
            weakContainer.innerHTML = `
                <div class="empty-weak-card">
                    <p>No systemic weakness detected. Standard quizzes must be taken first.</p>
                </div>
            `;
            return;
        }
        weak.forEach(w => {
            const card = document.createElement("div");
            card.className = "weak-topic-card";
            card.innerHTML = `
                <h4 class="weak-topic-title">${w.topic}</h4>
                <p class="weak-topic-reason">${w.reason}</p>
                <div class="weak-topic-recommendation">${w.recommendation}</div>
            `;
            weakContainer.appendChild(card);
        });
    }
    /**
     * State callbacks & level-up effects
     */
    onStateUpdated() {
        this.updateUserProfile();
    }
    onBadgeUnlocked(badge) {
        this.showToast(`🏆 Badge Unlocked: ${badge.name}!`, 5000);
    }
    triggerLevelUpEffects(newLevel) {
        const modal = document.getElementById("level-up-modal");
        document.getElementById("modal-new-level").textContent = newLevel;
        modal.classList.add("active");
        const canvas = document.getElementById("level-up-confetti");
        const ctx = canvas.getContext("2d");
        
        // Resize canvas to window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Confetti physics particle list
        const particles = [];
        const colors = ["#00f0ff", "#8b5cf6", "#ec4899", "#10b981", "#eab308"];
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 100,
                radius: Math.random() * 4 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 10 + 5,
                angle: Math.random() * Math.PI * 2,
                friction: 0.96,
                gravity: 0.2,
                opacity: 1
            });
        }
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            particles.forEach(p => {
                if (p.opacity <= 0) return;
                
                alive = true;
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed + p.gravity;
                p.speed *= p.friction;
                p.opacity -= 0.012;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fill();
            });
            if (alive) {
                requestAnimationFrame(animate);
            }
        };
        animate();
        // Close button binder
        const closeModal = () => {
            modal.classList.remove("active");
            document.getElementById("level-up-modal-close").removeEventListener("click", closeModal);
        };
        document.getElementById("level-up-modal-close").addEventListener("click", closeModal);
    }
    bindSettings() {
        // Handle name changing or reset state
        const resetBtn = document.getElementById("settings-reset-btn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if (confirm("Reset all local states? Your streaks, level, and quizzes will be erased.")) {
                    window.stateManager.resetState();
                    window.location.reload();
                }
            });
        }
    }
    showToast(message, duration = 3500) {
        const toast = document.getElementById("system-toast");
        toast.textContent = message;
        toast.classList.add("active");
        
        setTimeout(() => {
            toast.classList.remove("active");
        }, duration);
    }
}
// Instantiate App globally
window.copilotApp = new Application();
