/**
 * Diagnostic Analytics Engine
 * Computes performance ratios from quiz histories, isolates weaknesses,
 * and renders inline dynamic SVGs representing learning curves.
 */
class AnalyticsEngine {
    constructor() {}
    /**
     * Parse quiz history and returns topic statistics
     */
    getTopicStats() {
        const history = window.stateManager.getQuizHistory();
        const stats = {
            "Arrays": { correct: 0, total: 0, count: 0 },
            "Linked Lists": { correct: 0, total: 0, count: 0 },
            "Trees": { correct: 0, total: 0, count: 0 },
            "Graphs": { correct: 0, total: 0, count: 0 },
            "Dynamic Programming": { correct: 0, total: 0, count: 0 }
        };
        history.forEach(quiz => {
            const topic = quiz.topic;
            if (stats[topic]) {
                stats[topic].correct += quiz.score;
                stats[topic].total += quiz.total;
                stats[topic].count += 1;
            }
        });
        // Compute percentages
        const result = {};
        for (let topic in stats) {
            const item = stats[topic];
            result[topic] = {
                correct: item.correct,
                total: item.total,
                quizzesTaken: item.count,
                accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
            };
        }
        return result;
    }
    /**
     * Isolate topics where accuracy < 60%
     */
    getWeakTopics() {
        const stats = this.getTopicStats();
        const weak = [];
        for (let topic in stats) {
            const item = stats[topic];
            if (item.quizzesTaken > 0 && item.accuracy < 60) {
                weak.push({
                    topic,
                    accuracy: item.accuracy,
                    reason: `Low accuracy (${item.accuracy}%) over ${item.quizzesTaken} test sessions.`,
                    recommendation: `Revise ${topic} nodes in your Roadmap and consult the AI Mentor.`
                });
            } else if (item.quizzesTaken === 0) {
                weak.push({
                    topic,
                    accuracy: 0,
                    reason: `Untested subject.`,
                    recommendation: `Initiate a custom practice quiz on ${topic} to benchmark performance.`
                });
            }
        }
        return weak;
    }
    /**
     * Get aggregate metrics
     */
    getSummary() {
        const history = window.stateManager.getQuizHistory();
        const totalQuizzes = history.length;
        
        let totalQuestions = 0;
        let totalCorrect = 0;
        let totalXpEarned = 0;
        let totalDuration = 0;
        history.forEach(q => {
            totalQuestions += q.total;
            totalCorrect += q.score;
            totalXpEarned += q.xpEarned;
            totalDuration += q.duration;
        });
        const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        return {
            totalQuizzes,
            totalQuestions,
            totalCorrect,
            totalXpEarned,
            totalDuration,
            overallAccuracy
        };
    }
    /**
     * Renders a custom SVG bar chart showing topic mastery
     */
    renderMasteryChart(containerEl) {
        containerEl.innerHTML = "";
        const stats = this.getTopicStats();
        const topics = Object.keys(stats);
        const width = containerEl.clientWidth || 400;
        const barHeight = 30;
        const gap = 20;
        const height = (barHeight + gap) * topics.length + 40;
        // Build SVG string
        let svg = `
            <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="background:transparent; font-family:inherit;">
                <defs>
                    <linearGradient id="bar-gradient-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#8b5cf6" />
                        <stop offset="100%" stop-color="#00f0ff" />
                    </linearGradient>
                    <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                        <drop-shadow dx="0" dy="0" stdDeviation="4" flood-color="#00f0ff" flood-opacity="0.5"/>
                    </filter>
                </defs>
        `;
        topics.forEach((topic, idx) => {
            const item = stats[topic];
            const acc = item.accuracy;
            const y = idx * (barHeight + gap) + 20;
            const maxBarWidth = width - 180; // Margin for label and percentage
            const filledWidth = maxBarWidth * (acc / 100);
            // Draw label
            svg += `
                <text x="10" y="${y + 18}" fill="#a1a1aa" font-size="13" font-weight="500">${topic}</text>
            `;
            // Draw background track
            svg += `
                <rect x="130" y="${y}" width="${maxBarWidth}" height="${barHeight}" rx="6" fill="#1e293b" opacity="0.6"/>
            `;
            // Draw filled accuracy bar
            if (acc > 0) {
                svg += `
                    <rect x="130" y="${y}" width="${filledWidth}" height="${barHeight}" rx="6" fill="url(#bar-gradient-cyan)" filter="url(#glow)"/>
                `;
            }
            // Draw percentage text
            svg += `
                <text x="${width - 40}" y="${y + 18}" fill="${acc >= 80 ? '#10b981' : (acc >= 60 ? '#f59e0b' : '#ef4444')}" font-size="13" font-weight="bold">${acc}%</text>
            `;
        });
        svg += `</svg>`;
        containerEl.innerHTML = svg;
    }
    /**
     * Renders a line graph tracking cumulative XP from Quizzes
     */
    renderXPProgressChart(containerEl) {
        containerEl.innerHTML = "";
        const history = window.stateManager.getQuizHistory();
        if (history.length === 0) {
            containerEl.innerHTML = `
                <div class="empty-chart-fallback">
                    <p>No telemetry recorded. Complete quizzes to unlock XP timelines.</p>
                </div>
            `;
            return;
        }
        const width = containerEl.clientWidth || 450;
        const height = 220;
        const padding = 40;
        // Calculate cumulative points
        let cumulative = 0;
        const points = history.map((quiz, idx) => {
            cumulative += quiz.xpEarned;
            return { x: idx, y: cumulative };
        });
        // Pad with 0 starting value
        points.unshift({ x: -1, y: 0 });
        const minX = -1;
        const maxX = points.length - 2;
        const minY = 0;
        const maxY = Math.max(...points.map(p => p.y)) * 1.15; // 15% ceiling padding
        const getSvgX = (x) => padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
        const getSvgY = (y) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);
        // Build path points
        let pathD = "";
        points.forEach((p, idx) => {
            const sx = getSvgX(p.x);
            const sy = getSvgY(p.y);
            if (idx === 0) {
                pathD += `M ${sx} ${sy}`;
            } else {
                pathD += ` L ${sx} ${sy}`;
            }
        });
        let svg = `
            <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="background:transparent; font-family:inherit;">
                <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.8" />
                        <stop offset="100%" stop-color="#ec4899" stop-opacity="0.2" />
                    </linearGradient>
                </defs>
        `;
        // Draw grid lines
        const gridLines = 3;
        for (let i = 0; i <= gridLines; i++) {
            const gy = height - padding - (i / gridLines) * (height - 2 * padding);
            const val = Math.round(minY + (i / gridLines) * (maxY - minY));
            svg += `
                <line x1="${padding}" y1="${gy}" x2="${width - padding}" y2="${gy}" stroke="#334155" opacity="0.3" stroke-dasharray="4,4"/>
                <text x="${padding - 10}" y="${gy + 4}" fill="#64748b" font-size="10" text-anchor="end">${val}</text>
            `;
        }
        // Draw continuous fill gradient under line
        let fillD = pathD + ` L ${getSvgX(points[points.length - 1].x)} ${height - padding} L ${getSvgX(points[0].x)} ${height - padding} Z`;
        svg += `<path d="${fillD}" fill="url(#fill-grad)" opacity="0.1"/>`;
        // Draw line path
        svg += `
            <path d="${pathD}" fill="none" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        `;
        // Draw nodes/points
        points.forEach((p, idx) => {
            if (idx === 0) return; // Skip starting coordinate
            const sx = getSvgX(p.x);
            const sy = getSvgY(p.y);
            svg += `
                <circle cx="${sx}" cy="${sy}" r="5" fill="#070a13" stroke="#00f0ff" stroke-width="2"/>
                <circle cx="${sx}" cy="${sy}" r="2" fill="#00f0ff"/>
            `;
        });
        // X-axis label
        svg += `
            <text x="${width / 2}" y="${height - 10}" fill="#64748b" font-size="11" text-anchor="middle">Quizzes Completed (Timeline)</text>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#334155"/>
        `;
        svg += `</svg>`;
        containerEl.innerHTML = svg;
    }
}
// Export as globally accessible instance
window.analyticsEngine = new AnalyticsEngine();
