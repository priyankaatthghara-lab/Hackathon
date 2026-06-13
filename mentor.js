/**
 * AI Mentor Simulation Engine
 * Provides realistic responses with code blocks, complexity tables, and learning notes
 * matching user DSA queries.
 */
const MENTOR_RESPONSES = {
    "welcome": `### Cybernetic DSA Mentor Online
System initialized. Ready to optimize your cognitive database.
Here are some protocols you can execute:
- **"Explain Recursion"** - Understand base cases and the call stack.
- **"How does Dijkstra work?"** - Graph shortest path calculation.
- **"DP vs Memoization"** - Dynamic Programming paradigms.
- **"Reverse a Linked List"** - Pointers optimization.
- **"FAANG Tips"** - Strategy for coding interviews.
*Enter a question in the terminal below or click one of the quick actions.*`,
    "recursion": `### Protocol: Understanding Recursion
Recursion is a method of solving problems where the solution depends on solutions to smaller instances of the same problem. Think of it as a function that calls itself, but with a crucial safety feature: the **Base Case**.
#### 1. Core Structure
Every recursive function requires two main components:
1. **Base Case**: The condition under which the recursion stops (prevents infinite loops & Stack Overflow).
2. **Recursive Step**: The logic that reduces the problem size and calls the function again.
\`\`\`javascript
function factorial(n) {
    // 1. Base Case
    if (n <= 1) return 1;
    
    // 2. Recursive Step
    return n * factorial(n - 1);
}
\`\`\`
#### 2. The Call Stack Visualized
For \`factorial(3)\`:
- \`factorial(3)\` calls \`factorial(2)\`
  - \`factorial(2)\` calls \`factorial(1)\`
    - \`factorial(1)\` hits base case, returns \`1\`
  - \`factorial(2)\` returns \`2 * 1 = 2\`
- \`factorial(3)\` returns \`3 * 2 = 6\`
#### 3. Complexity
| Metric | Recursion (Basic) | Iterative Equivalent |
| :--- | :--- | :--- |
| **Time Complexity** | $O(N)$ | $O(N)$ |
| **Space Complexity**| $O(N)$ (due to Call Stack) | $O(1)$ |
> [!WARNING]
> Always check your recursion depth. If the recursion tree goes too deep, you will run into a **Stack Overflow** error. Use memoization or switch to an iterative approach if memory is constrained.`,
    "dijkstra": `### Protocol: Dijkstra's Shortest Path Algorithm
Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with **non-negative edge weights**.
#### 1. How It Works (Greedy Approach)
1. Initialize distances to all nodes as infinity ($\infty$), and source node as \`0\`.
2. Push the source node into a Priority Queue (Min-Heap) as \`(distance, node)\`.
3. While the Priority Queue is not empty:
   - Extract the node with the minimum distance (let's call it \`U\`).
   - For each neighbor \`V\` of \`U\`:
     - If \`distance[U] + weight(U, V) < distance[V]\`:
       - Update \`distance[V]\` with the new lower value.
       - Push \`(distance[V], V)\` into the Priority Queue.
#### 2. Code Implementation (JavaScript Simulation)
\`\`\`javascript
class Dijkstra {
    findShortestPath(graph, source) {
        let distances = {};
        let pq = new PriorityQueue(); // Min-Heap sorted by distance
        
        for (let node in graph) {
            distances[node] = Infinity;
        }
        distances[source] = 0;
        pq.enqueue(source, 0);
        
        while (!pq.isEmpty()) {
            let { element: currNode, priority: currDist } = pq.dequeue();
            
            for (let neighbor in graph[currNode]) {
                let weight = graph[currNode][neighbor];
                let alt = currDist + weight;
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    pq.enqueue(neighbor, alt);
                }
            }
        }
        return distances;
    }
}
\`\`\`
#### 3. Complexity Guide
- **Time Complexity**: $O((V + E) \log V)$ using a Binary Heap/Priority Queue, where $V$ is vertices and $E$ is edges.
- **Space Complexity**: $O(V)$ to store the distance array and priority queue.
> [!IMPORTANT]
> Dijkstra's algorithm fails when the graph contains **negative edge weights**. In such cases, you must execute the **Bellman-Ford Algorithm** ($O(V \cdot E)$).`,
    "dp": `### Protocol: Dynamic Programming vs Memoization
**Dynamic Programming (DP)** is an algorithmic paradigm that solves a complex problem by breaking it down into subproblems, solving each subproblem once, and storing their solutions to avoid redundant computations.
There are two primary styles of implementing DP:
#### 1. Top-Down Approach (Memoization)
You solve the problem recursively. When you compute a result for a state, you save it in a cache (e.g., hash map or array). Before computing any state, you first look it up in the cache.
\`\`\`javascript
// Fibonacci with Memoization
let memo = {};
function fibMemo(n) {
    if (n <= 1) return n;
    if (memo[n] !== undefined) return memo[n];
    
    memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
    return memo[n];
}
\`\`\`
#### 2. Bottom-Up Approach (Tabulation)
You solve the problem iteratively, usually starting from the base cases and building up to the target state. Results are stored in a table (usually a 1D or 2D array).
\`\`\`javascript
// Fibonacci with Tabulation
function fibTab(n) {
    if (n <= 1) return n;
    let dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
\`\`\`
#### 3. Comparison
| Feature | Top-Down (Memoization) | Bottom-Up (Tabulation) |
| :--- | :--- | :--- |
| **Strategy** | Recursive (Subproblem on demand) | Iterative (Solve all subproblems first) |
| **Stack Space** | Uses Call Stack ($O(N)$) | No stack overhead ($O(1)$ stack space) |
| **Execution** | Can be slower due to recursion overhead | Generally faster, CPU cache friendly |
| **Ease of Design**| Intuitive to derive from recursion | Harder to design state transitions |
> [!TIP]
> Use **Memoization** if you do not need to solve all subproblems to find the final answer. Use **Tabulation** if you need all subproblems solved and want to optimize stack space and execution speed.`,
    "linkedlist": `### Protocol: Reversing a Singly Linked List
Reversing a linked list is a foundational pointer manipulation exercise. The goal is to change the direction of all links in the list so that the head becomes the tail, and the tail becomes the head.
#### 1. Visualizing Pointers
Initially: \`[1] -> [2] -> [3] -> NULL\`
Reversed: \`NULL <- [1] <- [2] <- [3]\`
We need three pointers during traversal:
- \`prev\`: Tracks the node behind current (starts as \`null\`).
- \`curr\`: Tracks the node currently being processed (starts as \`head\`).
- \`next\`: Temporarily stores the forward link before we break it.
#### 2. JavaScript Code
\`\`\`javascript
function reverseList(head) {
    let prev = null;
    let curr = head;
    
    while (curr !== null) {
        let nextTemp = curr.next; // Store forward link
        curr.next = prev;         // Reverse pointer direction
        prev = curr;              // Move prev one step forward
        curr = nextTemp;          // Move curr one step forward
    }
    
    return prev; // New head of reversed list
}
\`\`\`
#### 3. Performance Metrics
- **Time Complexity**: $O(N)$ where $N$ is the number of nodes. We traverse the list exactly once.
- **Space Complexity**: $O(1)$ auxiliary space. We only modify existing pointers in-place.`,
    "faang": `### Neural Dossier: FAANG Interview Tactics
Securing a software role at tier-one tech firms (Meta, Apple, Amazon, Netflix, Google) requires mastering core pattern recognition rather than memorizing individual questions.
#### 1. The Core DSA Arsenal
These subjects account for over 90% of interview assessments:
- **Arrays & Hashing**: Sliding window, Two-pointers, Hash map lookups.
- **Trees & Graphs**: DFS/BFS, Tree traversals, Topological sort.
- **Dynamic Programming**: 1D DP, Grid-based pathing (Tabulation/Memoization).
- **Heaps & Priority Queues**: K-way merge, top K elements.
#### 2. The 5-Step Interview Checklist
1. **Clarify Constraints**: Ask about input bounds, memory limits, and edge cases (null inputs, negatives).
2. **Brainstorm & State Complexity**: Propose a brute-force approach first to establish a baseline, then discuss optimizations before typing.
3. **Dry Run**: Trace your algorithm on a simple input manually on a whiteboard/screen.
4. **Clean Code**: Write modular, readable code using descriptive variable names.
5. **Self-Debug**: Write test cases and walk through them to find bugs before the interviewer points them out.
> [!TIP]
> Practice writing code without syntax-checking assistance (e.g., in a plain text editor). It builds confidence and trains you to avoid minor syntax errors under pressure.`
};
class MentorEngine {
    constructor() {
        this.responses = MENTOR_RESPONSES;
    }
    /**
     * Parse query for keywords and return a detailed response
     */
    getResponse(query) {
        const cleaned = query.toLowerCase().trim();
        // Exact match options
        if (cleaned.includes("recursion") || cleaned.includes("factorial") || cleaned.includes("base case")) {
            return this.responses["recursion"];
        }
        if (cleaned.includes("dijkstra") || cleaned.includes("shortest path") || cleaned.includes("weighted graph")) {
            return this.responses["dijkstra"];
        }
        if (cleaned.includes("dp") || cleaned.includes("dynamic programming") || cleaned.includes("memoization") || cleaned.includes("tabulation") || cleaned.includes("fibonacci")) {
            return this.responses["dp"];
        }
        if (cleaned.includes("linked list") || cleaned.includes("reverse") || cleaned.includes("singly linked")) {
            return this.responses["linkedlist"];
        }
        if (cleaned.includes("faang") || cleaned.includes("interview") || cleaned.includes("google") || cleaned.includes("career")) {
            return this.responses["faang"];
        }
        // Subject-specific keyword fallback structures
        if (cleaned.includes("array") || cleaned.includes("sliding window") || cleaned.includes("two pointer")) {
            return `### Mentor Diagnostic: Array Optimization
Arrays represent contiguous memory blocks. 
Key optimization techniques:
- **Two Pointers**: Used to scan from both ends or run at different speeds. Reduces nested iteration from $O(N^2)$ to $O(N)$.
- **Sliding Window**: Captures subarrays matching a threshold, preventing recalculation of elements. Time complexity $O(N)$.
#### Code Blueprint: Sliding Window (Max Sum Subarray of size K)
\`\`\`javascript
function maxSumSubarray(arr, k) {
    let maxSum = 0, windowSum = 0;
    for (let i = 0; i < arr.length; i++) {
        windowSum += arr[i];
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
            windowSum -= arr[i - (k - 1)]; // slide the window
        }
    }
    return maxSum;
}
\`\`\`
*Would you like to generate a quiz on Arrays to test your understanding? Type **"quiz"** or go to the Quiz Arena.*`;
        }
        if (cleaned.includes("tree") || cleaned.includes("bst") || cleaned.includes("binary search tree") || cleaned.includes("inorder")) {
            return `### Mentor Diagnostic: Hierarchical Structures (Trees)
Trees represent hierarchical nodes. A **Binary Search Tree (BST)** enforces that all nodes in the left subtree are smaller than the parent node, and all nodes in the right subtree are larger.
#### BST Key Operations & Average Time Complexity:
- **Search**: $O(\log N)$
- **Insertion**: $O(\log N)$
- **Deletion**: $O(\log N)$
*Note: In the worst-case (skewed tree), these operations degrade to $O(N)$. To prevent this, self-balancing trees (AVL, Red-Black Trees) are deployed.*
#### Core Traversal Patterns:
- **Inorder**: Left -> Root -> Right (Yields elements in sorted order for a BST).
- **Preorder**: Root -> Left -> Right (Used for copying trees).
- **Postorder**: Left -> Right -> Root (Used for deleting trees).`;
        }
        if (cleaned.includes("graph") || cleaned.includes("bfs") || cleaned.includes("dfs") || cleaned.includes("mst")) {
            return `### Mentor Diagnostic: Graph Node Networks
Graphs model connections between entities (vertices and edges). They can be represented using **Adjacency Lists** (memory efficient: $O(V + E)$) or **Adjacency Matrices** (query efficient: $O(1)$ edge checks).
#### Essential Graph Traversals:
- **Breadth-First Search (BFS)**: Explores level-by-level using a **Queue**. Optimal for finding the shortest path in unweighted graphs.
- **Depth-First Search (DFS)**: Explores deep along each branch using recursion or a **Stack**. Perfect for detecting cycles and topological sorting.
#### Complexity Summary:
| Traversal | Time Complexity | Space Complexity |
| :--- | :--- | :--- |
| **BFS** | $O(V + E)$ | $O(V)$ |
| **DFS** | $O(V + E)$ | $O(V)$ |`;
        }
        // Generic intelligent response generator
        return `### Cybernetic Intelligence Query Analysis
I have scanned my DSA database for \`"${query}"\`. Here is a structural breakdown to assist your learning:
1. **Classify the Subject**: Identify if your question deals with **Linear** structures (Arrays, Linked Lists, Stacks, Queues) or **Non-Linear** networks (Trees, Graphs, Hash Maps).
2. **Review Core Complexity Rules**:
   - Loops mean linear time $O(N)$.
   - Nested loops mean quadratic time $O(N^2)$.
   - Dividing the search space in half (e.g., binary search) indicates logarithmic time $O(\log N)$.
3. **Formulate Code Strategies**:
   - Try to solve a simplified version of the problem first.
   - Use mock variables and trace outputs line-by-line.
> [!TIP]
> You can request an interactive lesson or a quiz. Type **"explain graphs"**, **"explain dynamic programming"**, or go to the **Learning Roadmap** tab to start your personalized learning path!`;
    }
    /**
     * Simulated streaming of response
     */
    streamResponse(text, onUpdate, onComplete, speedMs = 12) {
        let index = 0;
        let currentText = "";
        
        // Split text into words to make streaming feel dynamic and natural
        const tokens = text.split(/(\s+)/);
        
        const intervalId = setInterval(() => {
            if (index < tokens.length) {
                currentText += tokens[index];
                index++;
                onUpdate(currentText);
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete(text);
            }
        }, speedMs);
        return intervalId;
    }
}
// Export as globally accessible instance
window.mentorEngine = new MentorEngine();
