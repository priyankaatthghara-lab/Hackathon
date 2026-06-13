/**
 * Personalized Learning Roadmap Engine
 * Manages learning pathways (nodes), unlocks nodes, and renders them dynamically
 * with detailed concept guides and integration buttons.
 */
const ROADMAP_DATA = {
    "dsa_fundamentals": [
        {
            id: "arr_basics",
            title: "Array Foundations",
            topic: "Arrays",
            difficulty: "easy",
            desc: "Master linear memory structures, indices, and O(1) random access operations.",
            concepts: ["Contiguous Memory", "Indices & Addressing", "Array Traversal", "Insertion & Deletion"],
            resources: ["Text: Big-O Time Complexities in Arrays", "Interactive: Visualizing Array Address Math"],
            nextNodes: ["arr_ops", "ll_basics"]
        },
        {
            id: "arr_ops",
            title: "Array Transformations",
            topic: "Arrays",
            difficulty: "medium",
            desc: "Learn advanced search structures: Two Pointers, sliding window, and linear sorting.",
            concepts: ["Two Pointers", "Sliding Window", "Kadane's Algorithm", "Binary Search"],
            resources: ["Guide: Sliding Window Templates", "Cheat-sheet: Two Pointer Patterns"],
            nextNodes: ["tree_basics"]
        },
        {
            id: "ll_basics",
            title: "Linked Lists Basics",
            topic: "Linked Lists",
            difficulty: "easy",
            desc: "Learn node references, memory mapping, and head/tail element modifications.",
            concepts: ["Node References", "Singly Linked List", "O(1) Head Modification", "List Traversal"],
            resources: ["Tutorial: Visualizing Nodes vs Contiguous Arrays", "Syntax: Implementing a Node in JS"],
            nextNodes: ["ll_adv"]
        },
        {
            id: "ll_adv",
            title: "Pointer Mastery",
            topic: "Linked Lists",
            difficulty: "medium",
            desc: "Manipulate forward/backward linkages. Solve loops, merging, and reorder puzzles.",
            concepts: ["List Reversal", "Floyd's Loop Detection", "Doubly Linked Lists", "Merge Sort on Lists"],
            resources: ["Guide: Standard Pointer Reversing Patterns", "Tutorial: Fast and Slow Pointers"],
            nextNodes: ["tree_basics"]
        },
        {
            id: "tree_basics",
            title: "Tree Hierarchies",
            topic: "Trees",
            difficulty: "easy",
            desc: "Transition from linear structures to hierarchies. Understand roots, leaves, and parent nodes.",
            concepts: ["Binary Tree Structures", "Inorder/Preorder/Postorder Traversals", "Depth-First Search (DFS)", "Breadth-First Search (BFS)"],
            resources: ["Visual: Recursive Tree Walks", "Guide: Using Call Stacks for Traversal"],
            nextNodes: ["tree_bst", "graph_basics"]
        },
        {
            id: "tree_bst",
            title: "Binary Search Trees",
            topic: "Trees",
            difficulty: "medium",
            desc: "Enforce sorting inside structures. Maintain sorted datasets dynamically.",
            concepts: ["BST Invariants", "Insertion & Deletion", "Level-order traversals", "BST Searching"],
            resources: ["Guide: Balancing Trees (AVL Rotations)", "Exercise: Finding LCA in BST"],
            nextNodes: ["dp_basics"]
        },
        {
            id: "graph_basics",
            title: "Graph Networks",
            topic: "Graphs",
            difficulty: "medium",
            desc: "Map nodes with connections. Use Adjacency Lists and Matrix grids.",
            concepts: ["Adjacency Matrix & Lists", "Graph Traversals (BFS & DFS)", "Cycle Detection", "Topological Sort"],
            resources: ["Visual: Graph Representation Differences", "Template: BFS vs DFS Codebases"],
            nextNodes: ["graph_traversal"]
        },
        {
            id: "graph_traversal",
            title: "Shortest Paths",
            topic: "Graphs",
            difficulty: "hard",
            desc: "Calculate pathways through weighted graphs using greedy and dynamic solvers.",
            concepts: ["Dijkstra's Greedy Pathing", "Bellman-Ford Cycles", "Minimum Spanning Tree (Kruskal/Prim)", "Union-Find (DSU)"],
            resources: ["Visual Guide: Dijkstra Heap Tracking", "Cheat-sheet: Prim's algorithm"],
            nextNodes: ["dp_basics"]
        },
        {
            id: "dp_basics",
            title: "Dynamic Programming Foundations",
            topic: "Dynamic Programming",
            difficulty: "medium",
            desc: "Learn core subproblem overlapping logic. Map recursion trees into memo tables.",
            concepts: ["Overlapping Subproblems", "Optimal Substructure", "Memoization (Top-down)", "Tabulation (Bottom-up)"],
            resources: ["Guide: How to Identify DP Questions", "Code: Bottom-up Grid Setup"],
            nextNodes: ["dp_knapsack"]
        },
        {
            id: "dp_knapsack",
            title: "Advanced Matrix DP",
            topic: "Dynamic Programming",
            difficulty: "hard",
            desc: "Architect multidimensional states. Build Knapsack grids and sequence matchers.",
            concepts: ["0/1 Knapsack Grid", "Longest Common Subsequence", "Matrix Chain Multiplication", "Held-Karp TSP"],
            resources: ["Tutorial: 0/1 Knapsack Space Optimization", "Guide: Range DP Matrix Paths"],
            nextNodes: []
        }
    ],
    "faang_prep": [
        // Faster pathway starting with medium topics
        {
            id: "arr_ops",
            title: "Two Pointers & Sliding Window",
            topic: "Arrays",
            difficulty: "medium",
            desc: "Master linear array manipulations used in 70% of FAANG array questions.",
            concepts: ["Two Pointers", "Sliding Window", "Kadane's Algorithm"],
            resources: ["Guide: Sliding Window Templates", "LeetCode List: Top 10 Window Problems"],
            nextNodes: ["ll_adv", "tree_bst"]
        },
        {
            id: "ll_adv",
            title: "Linked List Reversal & Fast-Slow Pointers",
            topic: "Linked Lists",
            difficulty: "medium",
            desc: "Solve pointers puzzles, node switches, and list groupings.",
            concepts: ["In-place list reversal", "Cycle detection", "Intersections"],
            resources: ["Guide: Pointer Swaps Visualized"],
            nextNodes: ["tree_bst"]
        },
        {
            id: "tree_bst",
            title: "Tree DFS & BFS",
            topic: "Trees",
            difficulty: "medium",
            desc: "Master depth-first and level-order traversal patterns.",
            concepts: ["DFS Traversals", "BFS Level Order", "Lowest Common Ancestor"],
            resources: ["Visual: Call Stack in DFS"],
            nextNodes: ["graph_traversal", "dp_basics"]
        },
        {
            id: "graph_traversal",
            title: "Shortest Paths (Dijkstra)",
            topic: "Graphs",
            difficulty: "hard",
            desc: "Learn Dijkstra and topological sort.",
            concepts: ["Dijkstra's Algorithm", "Topological Sort", "Cycle Detection"],
            resources: ["Visual Guide: Dijkstra Heap Tracking"],
            nextNodes: ["dp_knapsack"]
        },
        {
            id: "dp_basics",
            title: "DP Decision Trees",
            topic: "Dynamic Programming",
            difficulty: "medium",
            desc: "Recognize state transitions in sequence and grid problems.",
            concepts: ["Memoization", "Tabulation", "State transition equation"],
            resources: ["Guide: DP State Frameworks"],
            nextNodes: ["dp_knapsack"]
        },
        {
            id: "dp_knapsack",
            title: "Multidimensional DP Matrix",
            topic: "Dynamic Programming",
            difficulty: "hard",
            desc: "Construct complex 2D DP grids.",
            concepts: ["0/1 Knapsack", "LCS", "Edit Distance"],
            resources: ["Tutorial: 0/1 Knapsack Space Optimization"],
            nextNodes: []
        }
    ],
    "cp_master": [
        // Hard-centric pathways
        {
            id: "tree_bst",
            title: "Segment Trees & Balanced Trees",
            topic: "Trees",
            difficulty: "hard",
            desc: "Build self-balancing structures and range query range update helpers.",
            concepts: ["AVL Rotations", "Segment Trees", "Lazy Propagation"],
            resources: ["Visual: Segment Tree construction"],
            nextNodes: ["graph_traversal", "dp_knapsack"]
        },
        {
            id: "graph_traversal",
            title: "SCC, DSU, & Flows",
            topic: "Graphs",
            difficulty: "hard",
            desc: "Compute strongly connected networks, minimum trees, and disjoint unions.",
            concepts: ["Tarjan's SCC", "Kruskal with DSU", "Union-Find Path Compression"],
            resources: ["Visual Guide: Tarjan's Single Pass DFS"],
            nextNodes: ["dp_knapsack"]
        },
        {
            id: "dp_knapsack",
            title: "Bitmask & Digit DP",
            topic: "Dynamic Programming",
            difficulty: "hard",
            desc: "Solve Traveling Salesperson and digit frequency puzzles using bitwise state caching.",
            concepts: ["Bitmask DP (Held-Karp)", "Digit DP", "Interval DP"],
            resources: ["Tutorial: Bitwise operations in DP states"],
            nextNodes: []
        }
    ]
};
class RoadmapManager {
    constructor() {
        this.roadmaps = ROADMAP_DATA;
    }
    getNodesForGoal(goalId) {
        const nodes = this.roadmaps[goalId] || this.roadmaps["dsa_fundamentals"];
        const progress = window.stateManager.getRoadmapProgress();
        // Map node state
        return nodes.map((node, index) => {
            let status = progress[node.id] || "locked";
            
            // If node status is locked, check if previous nodes have been completed
            if (status === "locked") {
                // If it's the first node, it should be unlocked by default
                if (index === 0) {
                    status = "unlocked";
                    window.stateManager.updateRoadmapProgress(node.id, "unlocked");
                } else {
                    // Check if any node that links to this node is completed
                    const dependencies = nodes.filter(n => n.nextNodes.includes(node.id));
                    if (dependencies.length > 0 && dependencies.every(dep => progress[dep.id] === "completed")) {
                        status = "unlocked";
                        window.stateManager.updateRoadmapProgress(node.id, "unlocked");
                    }
                }
            }
            return { ...node, status };
        });
    }
    startNode(nodeId) {
        const progress = window.stateManager.getRoadmapProgress();
        if (progress[nodeId] === "unlocked") {
            window.stateManager.updateRoadmapProgress(nodeId, "in_progress");
            return true;
        }
        return false;
    }
    completeNode(nodeId, goalId) {
        const progress = window.stateManager.getRoadmapProgress();
        if (progress[nodeId] === "in_progress" || progress[nodeId] === "unlocked") {
            window.stateManager.updateRoadmapProgress(nodeId, "completed");
            
            // Award XP (+50 XP for completing a node)
            const xpResult = window.stateManager.addXP(50);
            
            // Trigger unlocks for subsequent nodes in this goal
            const nodes = this.roadmaps[goalId] || this.roadmaps["dsa_fundamentals"];
            const currNode = nodes.find(n => n.id === nodeId);
            
            if (currNode && currNode.nextNodes) {
                currNode.nextNodes.forEach(nxt => {
                    if (!progress[nxt] || progress[nxt] === "locked") {
                        window.stateManager.updateRoadmapProgress(nxt, "unlocked");
                    }
                });
            }
            return { success: true, ...xpResult };
        }
        return { success: false };
    }
    renderRoadmap(containerEl, goalId, onNodeClick) {
        containerEl.innerHTML = "";
        const nodes = this.getNodesForGoal(goalId);
        // Grid-based futuristic pathway list
        const listWrapper = document.createElement("div");
        listWrapper.className = "roadmap-list";
        nodes.forEach((node, idx) => {
            const card = document.createElement("div");
            card.className = `roadmap-card ${node.status}`;
            card.dataset.id = node.id;
            
            let statusIcon = "🔒";
            if (node.status === "unlocked") statusIcon = "🔓";
            if (node.status === "in_progress") statusIcon = "⚡";
            if (node.status === "completed") statusIcon = "✅";
            card.innerHTML = `
                <div class="roadmap-card-header">
                    <span class="roadmap-status-icon">${statusIcon}</span>
                    <span class="roadmap-badge difficulty-${node.difficulty}">${node.difficulty.toUpperCase()}</span>
                </div>
                <h4 class="roadmap-title">${node.title}</h4>
                <p class="roadmap-desc">${node.desc}</p>
                <div class="roadmap-footer">
                    <span class="roadmap-topic">${node.topic}</span>
                    <button class="roadmap-action-btn">${node.status === 'completed' ? 'Review' : (node.status === 'in_progress' ? 'Resume' : 'Unlock')}</button>
                </div>
            `;
            // Node connectors in CSS/SVG
            card.addEventListener("click", () => {
                if (node.status !== "locked") {
                    onNodeClick(node);
                }
            });
            listWrapper.appendChild(card);
        });
        containerEl.appendChild(listWrapper);
    }
}
// Export as globally accessible instance
window.roadmapManager = new RoadmapManager();
