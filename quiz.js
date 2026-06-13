/**
 * Quiz Arena and Question Bank
 * Contains 50+ hand-crafted DSA questions and manages quiz execution,
 * timers, and results evaluation.
 */
const QUESTION_BANK = [
    // === ARRAYS ===
    {
        id: "arr_1",
        topic: "Arrays",
        difficulty: "easy",
        question: "What is the time complexity to access an element in a standard array given its index?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctOption: 0,
        explanation: "Array elements are stored in contiguous memory locations. Using the base address and the index, the address of any element can be computed in O(1) time."
    },
    {
        id: "arr_2",
        topic: "Arrays",
        difficulty: "easy",
        question: "Which of the following array operations has a worst-case time complexity of O(N)?",
        options: ["Appending an element (with capacity)", "Accessing an element via index", "Inserting an element at the beginning", "Updating an element at an index"],
        correctOption: 2,
        explanation: "Inserting an element at the beginning of an array requires shifting all other N elements one position to the right, taking O(N) time."
    },
    {
        id: "arr_3",
        topic: "Arrays",
        difficulty: "easy",
        question: "What is the primary benefit of using a dynamic array (like ArrayList in Java or vector in C++) over a static array?",
        options: ["Constant-time insertion at any index", "Automatic resizing when capacity is reached", "Lower memory consumption", "Guaranteed sorting of elements"],
        correctOption: 1,
        explanation: "Dynamic arrays automatically allocate a larger block of memory and copy elements over when the original capacity is exhausted."
    },
    {
        id: "arr_4",
        topic: "Arrays",
        difficulty: "medium",
        question: "What is the worst-case space complexity of the Kadane's Algorithm for finding the maximum subarray sum?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correctOption: 0,
        explanation: "Kadane's algorithm only requires a few variables to track the current maximum and global maximum sums, resulting in O(1) auxiliary space."
    },
    {
        id: "arr_5",
        topic: "Arrays",
        difficulty: "medium",
        question: "Given a sorted array, which technique is most optimal to find two elements that sum to a target value?",
        options: ["Breadth-First Search", "Sliding Window", "Two Pointers (start and end)", "Binary Search on every element"],
        correctOption: 2,
        explanation: "The Two Pointers approach moves pointers from the left and right ends towards the middle based on the current sum, running in O(N) time and O(1) space."
    },
    {
        id: "arr_6",
        topic: "Arrays",
        difficulty: "medium",
        question: "What is the time complexity of the binary search algorithm on a sorted array of size N?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctOption: 1,
        explanation: "Binary search divides the search space in half at each step, resulting in a logarithmic time complexity of O(log N)."
    },
    {
        id: "arr_7",
        topic: "Arrays",
        difficulty: "medium",
        question: "In a sliding window algorithm, what happens to the window size when the right pointer increments and the left pointer stays stationary?",
        options: ["It decreases", "It increases", "It remains constant", "It doubles"],
        correctOption: 1,
        explanation: "Incrementing the right pointer expands the window boundary forward, increasing the overall window size."
    },
    {
        id: "arr_8",
        topic: "Arrays",
        difficulty: "hard",
        question: "Which of the following array sorting algorithms has a worst-case time complexity of O(N log N) and is stable?",
        options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Selection Sort"],
        correctOption: 2,
        explanation: "Merge Sort guarantees O(N log N) operations in the worst case and preserves the relative order of equal elements (stable), unlike standard Quick Sort."
    },
    {
        id: "arr_9",
        topic: "Arrays",
        difficulty: "hard",
        question: "What is the time complexity of the optimal algorithm to find the majority element (appears > N/2 times) in an unsorted array of size N?",
        options: ["O(N log N)", "O(N)", "O(N^2)", "O(1)"],
        correctOption: 1,
        explanation: "Boyer-Moore Majority Voting Algorithm finds the majority element in a single pass O(N) time and O(1) auxiliary space."
    },
    {
        id: "arr_10",
        topic: "Arrays",
        difficulty: "hard",
        question: "Given an array of size N representing heights of blocks, what is the time complexity of the optimal solution for the 'Trapping Rain Water' problem?",
        options: ["O(N^2)", "O(N log N)", "O(N)", "O(2^N)"],
        correctOption: 2,
        explanation: "The optimal solution uses two pointers or monotonic stacks to calculate trapped water in a single pass, which is O(N) time."
    },
    // === LINKED LISTS ===
    {
        id: "ll_1",
        topic: "Linked Lists",
        difficulty: "easy",
        question: "What is the primary disadvantage of a singly linked list compared to a standard array?",
        options: ["No dynamic resizing", "O(N) search and access time", "Higher overhead for inserting at the head", "Elements must be contiguous in memory"],
        correctOption: 1,
        explanation: "Linked lists do not support random access; finding an element at index K requires traversing from the head, which is O(K) or O(N) in the worst case."
    },
    {
        id: "ll_2",
        topic: "Linked Lists",
        difficulty: "easy",
        question: "Which operation on a singly linked list can be performed in O(1) time if we only have a pointer to the head node?",
        options: ["Deleting the tail node", "Inserting a node at the beginning", "Finding the middle node", "Reversing the entire list"],
        correctOption: 1,
        explanation: "Inserting a node at the head only requires updating the new node's next pointer to point to the current head, taking O(1) time."
    },
    {
        id: "ll_3",
        topic: "Linked Lists",
        difficulty: "easy",
        question: "In a doubly linked list, each node contains how many pointer fields?",
        options: ["1", "2", "3", "None"],
        correctOption: 1,
        explanation: "Each node in a doubly linked list contains two pointers: one pointing to the next node and one pointing to the previous node."
    },
    {
        id: "ll_4",
        topic: "Linked Lists",
        difficulty: "medium",
        question: "Which algorithm is commonly used to detect a cycle in a linked list using two pointers?",
        options: ["Kadane's Algorithm", "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)", "Kruskal's Algorithm", "Binary Search Pointer"],
        correctOption: 1,
        explanation: "Floyd's algorithm uses a slow pointer (moves 1 step) and a fast pointer (moves 2 steps). If there is a cycle, the pointers will eventually meet."
    },
    {
        id: "ll_5",
        topic: "Linked Lists",
        difficulty: "medium",
        question: "What is the time complexity to find the middle of a linked list of size N in a single pass?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correctOption: 2,
        explanation: "By using two pointers (slow and fast), when the fast pointer reaches the end, the slow pointer will be at the middle, traversing the list in O(N) time."
    },
    {
        id: "ll_6",
        topic: "Linked Lists",
        difficulty: "medium",
        question: "If we delete a node in a singly linked list given only a pointer to that node (not the head), what is the time complexity?",
        options: ["O(1)", "O(N)", "O(log N)", "Cannot be done"],
        correctOption: 0,
        explanation: "You copy the value of the next node into the current node, and bypass the next node (curr.next = curr.next.next). This works in O(1) time (assuming it's not the tail node)."
    },
    {
        id: "ll_7",
        topic: "Linked Lists",
        difficulty: "medium",
        question: "What is the space complexity to reverse a linked list iteratively?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correctOption: 0,
        explanation: "The iterative method only modifies the existing node pointers in-place, requiring a constant amount of memory O(1)."
    },
    {
        id: "ll_8",
        topic: "Linked Lists",
        difficulty: "hard",
        question: "What is the time complexity of the optimal algorithm to merge K sorted linked lists of average size N?",
        options: ["O(K * N)", "O(N * log K)", "O(K * log N)", "O(N^2)"],
        correctOption: 1,
        explanation: "Using a Min-Heap (Priority Queue) containing the heads of all K lists, we extract the minimum element and insert the next element from that list, taking O(N * log K) operations."
    },
    {
        id: "ll_9",
        topic: "Linked Lists",
        difficulty: "hard",
        question: "Which of the following is correct when reversing a linked list in groups of size K?",
        options: ["Requires O(N) extra space", "Can be done iteratively in O(N) time and O(1) space", "Requires O(K^2) pointer manipulations", "It is impossible for non-multiples of K"],
        correctOption: 1,
        explanation: "Reversing nodes in blocks of size K can be achieved iteratively with pointers, requiring O(N) total traversal time and O(1) additional memory."
    },
    {
        id: "ll_10",
        topic: "Linked Lists",
        difficulty: "hard",
        question: "What is the time complexity of sorting a linked list using Merge Sort?",
        options: ["O(N^2)", "O(N log N)", "O(N)", "O(N^(1.5))"],
        correctOption: 1,
        explanation: "Merge Sort is highly suitable for linked lists because splitting does not require random access and merging is simple, resulting in O(N log N) time and O(log N) stack recursion space."
    },
    // === TREES ===
    {
        id: "tree_1",
        topic: "Trees",
        difficulty: "easy",
        question: "What is the maximum number of children a node can have in a Binary Tree?",
        options: ["1", "2", "3", "Unlimited"],
        correctOption: 1,
        explanation: "By definition, a binary tree node can have at most two child nodes (commonly named left child and right child)."
    },
    {
        id: "tree_2",
        topic: "Trees",
        difficulty: "easy",
        question: "Which tree traversal visits nodes in the order: Left Subtree, Root, Right Subtree?",
        options: ["Preorder", "Inorder", "Postorder", "Level Order"],
        correctOption: 1,
        explanation: "Inorder traversal recursively visits the left child, processes the current root node, and then recursively visits the right child."
    },
    {
        id: "tree_3",
        topic: "Trees",
        difficulty: "easy",
        question: "What is the traversal order of a Binary Search Tree (BST) that outputs the values in sorted ascending order?",
        options: ["Preorder", "Postorder", "Inorder", "Breadth-First"],
        correctOption: 2,
        explanation: "An inorder traversal of a BST visits nodes in increasing order because the left child (< root) is visited first, then the root, then the right child (> root)."
    },
    {
        id: "tree_4",
        topic: "Trees",
        difficulty: "medium",
        question: "What is the height of a balanced binary tree containing N nodes?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctOption: 1,
        explanation: "In a balanced binary tree, the height is logarithmic relative to the number of nodes, meaning the height is bounded by O(log N)."
    },
    {
        id: "tree_5",
        topic: "Trees",
        difficulty: "medium",
        question: "In a Binary Search Tree, what is the worst-case time complexity of inserting a node?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctOption: 2,
        explanation: "In the worst case (a skewed tree, e.g., elements inserted in sorted order), the tree behaves like a linked list, requiring O(N) operations."
    },
    {
        id: "tree_6",
        topic: "Trees",
        difficulty: "medium",
        question: "Which data structure is typically used to implement Breadth-First Search (Level Order Traversal) on a Tree?",
        options: ["Stack", "Queue", "Min-Heap", "Linked List"],
        correctOption: 1,
        explanation: "Level order traversal processes nodes layer by layer, requiring a FIFO Queue to track the discovered child nodes."
    },
    {
        id: "tree_7",
        topic: "Trees",
        difficulty: "medium",
        question: "What is the time complexity to find the Lowest Common Ancestor (LCA) of two nodes in a Binary Search Tree?",
        options: ["O(1)", "O(log N) average", "O(N log N)", "O(H^2) where H is height"],
        correctOption: 1,
        explanation: "In a BST, we can navigate left or right starting from the root by comparing values, running in average O(log N) time (or O(H) where H is tree height)."
    },
    {
        id: "tree_8",
        topic: "Trees",
        difficulty: "hard",
        question: "What is the maximum balance factor allowed for any node in an AVL Tree?",
        options: ["0", "1", "2", "3"],
        correctOption: 1,
        explanation: "In an AVL tree, the balance factor (difference between left and right subtree heights) must be -1, 0, or 1. A factor of 2 or -2 triggers a rebalancing rotation."
    },
    {
        id: "tree_9",
        topic: "Trees",
        difficulty: "hard",
        question: "What is the time complexity of constructing a Binary Tree from its Inorder and Preorder traversals?",
        options: ["O(N log N)", "O(N^2) brute force, or O(N) with Hash Map lookup", "O(N^3)", "O(log N)"],
        correctOption: 1,
        explanation: "A recursive construction takes O(N^2) if searching for root in inorder array, which can be optimized to O(N) by storing index mappings in a hash table."
    },
    {
        id: "tree_10",
        topic: "Trees",
        difficulty: "hard",
        question: "In a Red-Black Tree, what is the maximum ratio of the longest path from root to leaf to the shortest path?",
        options: ["1.5", "2", "3", "None (no limit)"],
        correctOption: 1,
        explanation: "By property, no path in a Red-Black tree is more than twice as long as any other path, ensuring it remains balanced."
    },
    // === GRAPHS ===
    {
        id: "graph_1",
        topic: "Graphs",
        difficulty: "easy",
        question: "What is the space complexity of storing a graph with V vertices and E edges using an Adjacency Matrix?",
        options: ["O(V + E)", "O(V^2)", "O(E^2)", "O(V * E)"],
        correctOption: 1,
        explanation: "An adjacency matrix is a 2D array of size V x V, meaning it always consumes O(V^2) memory space regardless of the number of edges."
    },
    {
        id: "graph_2",
        topic: "Graphs",
        difficulty: "easy",
        question: "Which representation is most space-efficient for a sparse graph (graph with few edges)?",
        options: ["Adjacency Matrix", "Adjacency List", "Edge List Matrix", "Incidence Matrix"],
        correctOption: 1,
        explanation: "An adjacency list only stores existing edges, consuming O(V + E) space, which is highly efficient for sparse graphs."
    },
    {
        id: "graph_3",
        topic: "Graphs",
        difficulty: "easy",
        question: "Which algorithm traversal uses a Queue to explore all nodes at the current distance layer before moving deeper?",
        options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Kruskal's Algorithm", "Binary Traversal"],
        correctOption: 1,
        explanation: "BFS explores nodes layer by layer (level order), which is implemented using a Queue (FIFO) data structure."
    },
    {
        id: "graph_4",
        topic: "Graphs",
        difficulty: "medium",
        question: "What is the time complexity of Breadth-First Search (BFS) on a graph represented as an adjacency list?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V^2)"],
        correctOption: 2,
        explanation: "BFS visits each vertex once and checks all its outgoing edges, leading to a time complexity of O(V + E)."
    },
    {
        id: "graph_5",
        topic: "Graphs",
        difficulty: "medium",
        question: "Which of the following algorithm techniques is used to find a Topological Sort of a Directed Acyclic Graph (DAG)?",
        options: ["BFS (Kahn's Algorithm) or DFS", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Floyd-Warshall Algorithm"],
        correctOption: 0,
        explanation: "Topological sorting can be computed using Kahn's BFS (in-degree reduction) or by recording post-order traversal in a DFS."
    },
    {
        id: "graph_6",
        topic: "Graphs",
        difficulty: "medium",
        question: "What is the time complexity of Dijkstra's Algorithm using a Min-Heap/Priority Queue?",
        options: ["O(V^2)", "O((V + E) log V)", "O(V * E)", "O(E^2)"],
        correctOption: 1,
        explanation: "Extracting min node and updating distances take logarithmic heap operations, giving a total runtime of O((V + E) log V)."
    },
    {
        id: "graph_7",
        topic: "Graphs",
        difficulty: "medium",
        question: "Which algorithm finds the shortest path in a graph containing negative edge weights, provided there are no negative weight cycles?",
        options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Prim's Algorithm", "Kruskal's Algorithm"],
        correctOption: 1,
        explanation: "Bellman-Ford relaxes all edges V-1 times, correctly handling negative weights and detecting negative cycles, unlike Dijkstra's."
    },
    {
        id: "graph_8",
        topic: "Graphs",
        difficulty: "hard",
        question: "What is the time complexity of the Floyd-Warshall all-pairs shortest path algorithm?",
        options: ["O(V^2 log V)", "O(V * E)", "O(V^3)", "O(2^V)"],
        correctOption: 2,
        explanation: "Floyd-Warshall is a dynamic programming algorithm that uses three nested loops over the V vertices, running in O(V^3) time."
    },
    {
        id: "graph_9",
        topic: "Graphs",
        difficulty: "hard",
        question: "Which data structure is essential for implementing Kruskal's algorithm efficiently to find a Minimum Spanning Tree?",
        options: ["Min-Heap", "Disjoint Set Union (DSU / Union-Find)", "Red-Black Tree", "Segment Tree"],
        correctOption: 1,
        explanation: "Kruskal's algorithm sorts edges and inserts them if they don't form a cycle. A DSU performs cycle checking and merge operations in near O(1) time."
    },
    {
        id: "graph_10",
        topic: "Graphs",
        difficulty: "hard",
        question: "How does Tarjan's algorithm find Strongly Connected Components (SCCs) in a directed graph?",
        options: ["Using two passes of DFS (Kosaraju's style)", "Using a single DFS pass tracking discovery and low-link values", "By repeatedly running BFS from all vertices", "Using dynamic programming tables"],
        correctOption: 1,
        explanation: "Tarjan's SCC algorithm identifies components during a single DFS traversal using a stack and tracking the lowest node reachable from each vertex."
    },
    // === DYNAMIC PROGRAMMING ===
    {
        id: "dp_1",
        topic: "Dynamic Programming",
        difficulty: "easy",
        question: "What is the main difference between Dynamic Programming (DP) and Divide and Conquer?",
        options: ["DP uses recursion while Divide and Conquer does not", "DP is only for sorting while Divide and Conquer is for searching", "DP involves overlapping subproblems while Divide and Conquer has independent subproblems", "DP always requires O(N^2) space"],
        correctOption: 2,
        explanation: "Dynamic programming caches solutions to overlapping subproblems to avoid redundant work. Divide and Conquer divides the problem into disjoint (non-overlapping) subproblems."
    },
    {
        id: "dp_2",
        topic: "Dynamic Programming",
        difficulty: "easy",
        question: "What is the term used to describe the top-down approach of Dynamic Programming where we cache recursive outputs?",
        options: ["Tabulation", "Memoization", "Backtracking", "Iteration"],
        correctOption: 1,
        explanation: "Memoization is the top-down strategy that stores function results in a table/hashmap based on the input parameters."
    },
    {
        id: "dp_3",
        topic: "Dynamic Programming",
        difficulty: "easy",
        question: "What is the time complexity to compute the N-th Fibonacci number using a simple tabulating bottom-up array?",
        options: ["O(2^N)", "O(N^2)", "O(N)", "O(log N)"],
        correctOption: 2,
        explanation: "By computing terms sequentially from 2 to N (using dp[i] = dp[i-1] + dp[i-2]), we run in linear O(N) time."
    },
    {
        id: "dp_4",
        topic: "Dynamic Programming",
        difficulty: "medium",
        question: "In the 0/1 Knapsack Problem with N items and maximum weight capacity W, what is the size of the DP table?",
        options: ["N x N", "W x W", "(N + 1) x (W + 1)", "2^N"],
        correctOption: 2,
        explanation: "The state is defined by two variables: the item index (0 to N) and the current weight limit (0 to W), requiring a grid of size (N+1) x (W+1)."
    },
    {
        id: "dp_5",
        topic: "Dynamic Programming",
        difficulty: "medium",
        question: "What is the time complexity of the Longest Common Subsequence (LCS) of two strings of lengths M and N using DP?",
        options: ["O(M + N)", "O(M * N)", "O(2^(M+N))", "O(log(M*N))"],
        correctOption: 1,
        explanation: "The LCS subproblem state is defined by the suffixes/prefixes of both strings, yielding a 2D table of size M x N with constant time transitions, resulting in O(M * N) complexity."
    },
    {
        id: "dp_6",
        topic: "Dynamic Programming",
        difficulty: "medium",
        question: "What is the recursive relation for the coin change problem (finding the minimum coins to make amount V using coin denominations C)?",
        options: ["dp[i] = dp[i-1] + V", "dp[i] = min(dp[i], dp[i - C[j]] + 1) for all j", "dp[i] = max(dp[i - 1], dp[i - V])", "dp[i] = dp[i/2] + 1"],
        correctOption: 1,
        explanation: "To find the minimum coins for amount i, we take the minimum of using one coin C[j] (cost of 1) plus the remainder amount (i - C[j])."
    },
    {
        id: "dp_7",
        topic: "Dynamic Programming",
        difficulty: "medium",
        question: "What is the space complexity of the optimal bottom-up solution for the climbing stairs problem (N steps, can take 1 or 2 steps)?",
        options: ["O(N)", "O(1)", "O(log N)", "O(N^2)"],
        correctOption: 1,
        explanation: "Climbing stairs is equivalent to Fibonacci. Since we only need the last two steps to compute the current one, we can store them in two variables, reducing space to O(1)."
    },
    {
        id: "dp_8",
        topic: "Dynamic Programming",
        difficulty: "hard",
        question: "What is the time complexity of the Matrix Chain Multiplication problem on N matrices using Dynamic Programming?",
        options: ["O(N log N)", "O(N^2)", "O(N^3)", "O(2^N)"],
        correctOption: 2,
        explanation: "The standard DP solution calculates intervals of size 1 to N, requiring three nested loops (interval size, start index, split point), resulting in O(N^3) time complexity."
    },
    {
        id: "dp_9",
        topic: "Dynamic Programming",
        difficulty: "hard",
        question: "Which technique can be used to optimize the 1D DP table memory space in Knapsack-like problems?",
        options: ["Traversing the inner loop backwards", "Doubling the array capacity", "Using a hash table instead of an array", "Dividing weight by 2"],
        correctOption: 0,
        explanation: "By traversing weights from W down to weight[i], we ensure that we only use values from the previous item's row, preventing reusing the same item (which would solve Unbounded Knapsack)."
    },
    {
        id: "dp_10",
        topic: "Dynamic Programming",
        difficulty: "hard",
        question: "In the traveling salesperson problem (TSP) solved using dynamic programming (Held-Karp algorithm), what is the optimal time complexity?",
        options: ["O(N!)", "O(N^2 * 2^N)", "O(V^3)", "O(2^N)"],
        correctOption: 1,
        explanation: "Held-Karp uses state representation of (visited set, current city), which has 2^N * N states. Transitions take O(N) operations, leading to O(N^2 * 2^N) time, which is much better than brute-force O(N!)."
    }
];
class QuizArena {
    constructor() {
        this.questions = QUESTION_BANK;
        this.activeQuiz = null;
    }
    /**
     * Get randomized questions by topic and difficulty
     */
    generateQuiz(topic, difficulty, count = 5) {
        // Filter by topic and difficulty
        let filtered = this.questions.filter(q => 
            q.topic.toLowerCase() === topic.toLowerCase() && 
            q.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
        // Fallback: If not enough questions, filter by topic only
        if (filtered.length < count) {
            filtered = this.questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
        }
        // Shuffle and slice
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    /**
     * Start a quiz session
     */
    startSession(topic, difficulty, count = 5) {
        const quizQuestions = this.generateQuiz(topic, difficulty, count);
        if (quizQuestions.length === 0) {
            return null;
        }
        this.activeQuiz = {
            topic,
            difficulty,
            questions: quizQuestions,
            currentIndex: 0,
            answers: Array(quizQuestions.length).fill(null),
            score: 0,
            durationSeconds: count * 60, // 60 seconds per question
            elapsedSeconds: 0,
            timerInterval: null,
            isCompleted: false
        };
        return this.activeQuiz;
    }
    selectOption(optionIndex) {
        if (!this.activeQuiz || this.activeQuiz.isCompleted) return;
        const index = this.activeQuiz.currentIndex;
        this.activeQuiz.answers[index] = optionIndex;
    }
    nextQuestion() {
        if (!this.activeQuiz || this.activeQuiz.isCompleted) return false;
        if (this.activeQuiz.currentIndex < this.activeQuiz.questions.length - 1) {
            this.activeQuiz.currentIndex++;
            return true;
        }
        return false;
    }
    prevQuestion() {
        if (!this.activeQuiz || this.activeQuiz.isCompleted) return false;
        if (this.activeQuiz.currentIndex > 0) {
            this.activeQuiz.currentIndex--;
            return true;
        }
        return false;
    }
    getCurrentQuestion() {
        if (!this.activeQuiz) return null;
        return this.activeQuiz.questions[this.activeQuiz.currentIndex];
    }
    /**
     * Calculate score and complete session
     */
    submitSession() {
        if (!this.activeQuiz || this.activeQuiz.isCompleted) return null;
        
        clearInterval(this.activeQuiz.timerInterval);
        this.activeQuiz.isCompleted = true;
        let score = 0;
        const details = this.activeQuiz.questions.map((q, idx) => {
            const userAnswer = this.activeQuiz.answers[idx];
            const isCorrect = userAnswer === q.correctOption;
            if (isCorrect) score++;
            return {
                question: q.question,
                options: q.options,
                userAnswer,
                correctAnswer: q.correctOption,
                isCorrect,
                explanation: q.explanation
            };
        });
        this.activeQuiz.score = score;
        // Base XP: +15 XP per correct answer
        // Bonus XP: +50 XP for perfect score
        // Difficulty multiplier: Easy (1x), Medium (1.5x), Hard (2x)
        const baseXP = score * 15;
        const perfectBonus = (score === this.activeQuiz.questions.length) ? 50 : 0;
        
        let multiplier = 1;
        if (this.activeQuiz.difficulty.toLowerCase() === "medium") multiplier = 1.5;
        if (this.activeQuiz.difficulty.toLowerCase() === "hard") multiplier = 2.0;
        const totalXpEarned = Math.round((baseXP + perfectBonus) * multiplier);
        const record = {
            topic: this.activeQuiz.topic,
            difficulty: this.activeQuiz.difficulty,
            score,
            total: this.activeQuiz.questions.length,
            date: new Date().toLocaleDateString(),
            xpEarned: totalXpEarned,
            duration: this.activeQuiz.elapsedSeconds
        };
        // Write to global state
        const xpResult = window.stateManager.addQuizRecord(record);
        return {
            topic: this.activeQuiz.topic,
            difficulty: this.activeQuiz.difficulty,
            score,
            total: this.activeQuiz.questions.length,
            xpEarned: totalXpEarned,
            details,
            timeSpent: this.activeQuiz.elapsedSeconds,
            leveledUp: xpResult.leveledUp,
            oldLevel: xpResult.oldLevel,
            newLevel: xpResult.newLevel
        };
    }
}
// Export as globally accessible instance
window.quizArena = new QuizArena();
