# Learning Path: Shortest Path Algorithms (Day 9 - Nine Cat Lives)

## Problem Summary
Find the minimum cost path through a 20×20 grid from top-left to bottom-right, where each cell has a hazard level (0-3) that costs lives when traversed.

---

## Table of Contents
- [Problem Summary](#problem-summary)
- [Learning Path: From Basic to Advanced](#learning-path-from-basic-to-advanced)
  - [Phase 1: Foundation Concepts (Prerequisites)](#phase-1-foundation-concepts-prerequisites)
    - [1.1 Basic Data Structures](#11-basic-data-structures)
    - [1.2 File I/O in Java](#12-file-io-in-java)
    - [1.3 Basic Graph Concepts](#13-basic-graph-concepts)
  - [Phase 2: Intermediate Concepts](#phase-2-intermediate-concepts)
    - [2.1 Priority Queue / Heap](#21-priority-queue--heap)
    - [2.2 Greedy Algorithms](#22-greedy-algorithms)
    - [2.3 Dynamic Programming Basics](#23-dynamic-programming-basics)
  - [Phase 3: Advanced Concepts](#phase-3-advanced-concepts)
    - [3.1 Breadth-First Search (BFS)](#31-breadth-first-search-bfs)
    - [3.2 Dijkstra's Algorithm (THE SOLUTION)](#32-dijkstras-algorithm-the-solution)
    - [3.3 Alternative: A* Algorithm (Optional Advanced)](#33-alternative-a-algorithm-optional-advanced)
  - [Phase 4: Problem-Solving Strategy](#phase-4-problem-solving-strategy)
    - [4.1 Problem Recognition](#41-problem-recognition)
    - [4.2 Common Variations](#42-common-variations)
- [Practice Progression](#practice-progression)
  - [Beginner Level](#beginner-level)
  - [Intermediate Level](#intermediate-level)
  - [Advanced Level](#advanced-level)
- [Key Insights for This Problem](#key-insights-for-this-problem)
- [Resources to Study](#resources-to-study)
- [Estimated Study Time](#estimated-study-time)
- [Success Checklist](#success-checklist)
- [Final Tips](#final-tips)

---

## Learning Path: From Basic to Advanced

### Phase 1: Foundation Concepts (Prerequisites)

#### 1.1 Basic Data Structures
**What you need to know:**
- Arrays and 2D Arrays (grids/matrices)
- ArrayList and dynamic arrays
- Understanding of indexing: `grid[row][col]`

**Practice:**
```java
// Create a 2D array
int[][] grid = new int[20][20];

// Access elements
int value = grid[0][0];

// Iterate through a grid
for (int i = 0; i < grid.length; i++) {
    for (int j = 0; j < grid[0].length; j++) {
        System.out.println(grid[i][j]);
    }
}
```

**Why it matters:** The problem uses a 20×20 grid that we must navigate.

---

#### 1.2 File I/O in Java
**What you need to know:**
- BufferedReader and FileReader
- Reading line by line
- Parsing CSV (comma-separated values)
- Exception handling (try-catch)

**Practice:**
```java
import java.io.*;

// Read a file line by line
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        // Parse comma-separated values
        String[] parts = line.split(",");
        // Convert to integers
        int value = Integer.parseInt(parts[0]);
    }
}
```

**Why it matters:** We need to read the grid data from a text file.

---

#### 1.3 Basic Graph Concepts
**What you need to know:**
- What is a graph? (nodes/vertices and edges)
- Grid as a graph: each cell is a node, adjacent cells are connected
- Neighbors: up, down, left, right (4-directional movement)
- Weighted graphs: edges have costs (hazard levels)

**Conceptual understanding:**
```
In a grid, cell (1,1) has up to 4 neighbors:
- Up:    (0,1)
- Down:  (2,1)
- Left:  (1,0)
- Right: (1,2)
```

**Why it matters:** This problem is fundamentally a graph problem disguised as a grid.

---

### Phase 2: Intermediate Concepts

#### 2.1 Priority Queue / Heap
**What you need to know:**
- What is a heap? (Complete binary tree with heap property)
- Min-heap: parent is smaller than children
- PriorityQueue in Java (default is min-heap)
- Comparable interface for custom objects
- Time complexity: O(log n) for insert/remove

**Practice:**
```java
import java.util.*;

class Cell implements Comparable<Cell> {
    int cost;

    Cell(int cost) {
        this.cost = cost;
    }

    @Override
    public int compareTo(Cell other) {
        return Integer.compare(this.cost, other.cost);
    }
}

PriorityQueue<Cell> pq = new PriorityQueue<>();
pq.offer(new Cell(5));
pq.offer(new Cell(1));
pq.offer(new Cell(3));

Cell lowest = pq.poll(); // Returns Cell with cost 1
```

**Why it matters:** Dijkstra's algorithm requires always exploring the lowest-cost cell first.

---

#### 2.2 Greedy Algorithms
**What you need to know:**
- Greedy choice: make locally optimal choice at each step
- Not all greedy algorithms work (counterexamples)
- When greedy is optimal vs when it fails

**Example where greedy fails:**
```
Start: A → B (cost 1) → C (cost 1) → End (cost 1) = Total: 3
       A → End (cost 10) = Total: 10

Greedy picks A→B, but A→End might be better in some cases!
```

**Why it matters:** Understanding when simple greedy works vs when we need Dijkstra.

---

#### 2.3 Dynamic Programming Basics
**What you need to know:**
- Memoization: storing results to avoid recomputation
- Optimal substructure: optimal solution contains optimal sub-solutions
- Tracking minimum/maximum values in a table

**Practice:**
```java
// Track minimum cost to reach each cell
int[][] minCost = new int[rows][cols];
Arrays.fill(minCost[i], Integer.MAX_VALUE);

// Update if we find a better path
if (newCost < minCost[row][col]) {
    minCost[row][col] = newCost;
}
```

**Why it matters:** We track the minimum cost to reach each cell.

---

### Phase 3: Advanced Concepts

#### 3.1 Breadth-First Search (BFS)
**What you need to know:**
- Explore level by level using a queue
- Finds shortest path in unweighted graphs
- All nodes at distance `d` before nodes at distance `d+1`

**Code pattern:**
```java
Queue<Cell> queue = new LinkedList<>();
queue.offer(start);

while (!queue.isEmpty()) {
    Cell current = queue.poll();

    for (Cell neighbor : getNeighbors(current)) {
        if (!visited[neighbor.row][neighbor.col]) {
            queue.offer(neighbor);
            visited[neighbor.row][neighbor.col] = true;
        }
    }
}
```

**Limitation:** BFS finds shortest path by number of steps, NOT by cost.

**Why it matters:** Understanding why BFS alone won't work for weighted graphs.

---

#### 3.2 Dijkstra's Algorithm (THE SOLUTION)
**What you need to know:**
- Finds shortest path in weighted graphs with non-negative weights
- Uses priority queue to always explore lowest-cost node first
- Greedy + optimal substructure = guaranteed optimal solution
- Time complexity: O((V + E) log V) with binary heap

**Algorithm steps:**
1. Initialize: Set all distances to infinity, except start = 0
2. Add start to priority queue
3. While queue not empty:
   - Remove minimum cost cell from queue
   - If already visited with lower cost, skip
   - For each neighbor:
     - Calculate new cost = current cost + edge weight
     - If new cost < previously known cost:
       - Update minimum cost
       - Add neighbor to queue
4. Return cost to destination

**Full implementation (simplified):**
```java
public static int dijkstra(int[][] grid) {
    PriorityQueue<Cell> pq = new PriorityQueue<>();
    int[][] minCost = new int[rows][cols];
    Arrays.fill(minCost, Integer.MAX_VALUE);

    minCost[0][0] = grid[0][0];
    pq.offer(new Cell(0, 0, grid[0][0]));

    int[][] directions = {{-1,0}, {1,0}, {0,-1}, {0,1}};

    while (!pq.isEmpty()) {
        Cell current = pq.poll();

        if (current.cost > minCost[current.row][current.col]) continue;
        if (current.row == rows-1 && current.col == cols-1) return current.cost;

        for (int[] dir : directions) {
            int newRow = current.row + dir[0];
            int newCol = current.col + dir[1];

            if (isValid(newRow, newCol)) {
                int newCost = current.cost + grid[newRow][newCol];
                if (newCost < minCost[newRow][newCol]) {
                    minCost[newRow][newCol] = newCost;
                    pq.offer(new Cell(newRow, newCol, newCost));
                }
            }
        }
    }
    return minCost[rows-1][cols-1];
}
```

**Why Dijkstra works here:**
- Non-negative weights (hazards are 0-3)
- Need minimum cost path, not shortest path by steps
- Greedy property holds: processing lowest cost first guarantees optimality

---

#### 3.3 Alternative: A* Algorithm (Optional Advanced)
**What you need to know:**
- Extension of Dijkstra with heuristic function
- f(n) = g(n) + h(n)
  - g(n) = actual cost from start to n
  - h(n) = estimated cost from n to goal (heuristic)
- Faster than Dijkstra if good heuristic exists
- For grid: Manhattan distance is common heuristic

**When to use:**
- When you have a single target (like this problem)
- When a good heuristic exists
- When performance matters

**For this problem:** Manhattan distance = `|currentRow - 19| + |currentCol - 19|`

---

### Phase 4: Problem-Solving Strategy

#### 4.1 Problem Recognition
**Questions to ask:**
- Is this a graph problem? → Yes (grid is a graph)
- Do edges have weights? → Yes (hazard levels)
- Need shortest path or minimum cost? → Minimum cost
- Are weights non-negative? → Yes (0-3)
- **Conclusion:** Use Dijkstra's algorithm

#### 4.2 Common Variations
**What if...**
- Weights could be negative? → Use Bellman-Ford
- Only need unweighted shortest path? → Use BFS
- Need all pairs shortest paths? → Use Floyd-Warshall
- Can move diagonally (8 directions)? → Modify directions array
- Grid is 3D? → Add third dimension to Cell class

---

## Practice Progression

### Beginner Level
1. Print a 2D grid
2. Find a specific value in a grid
3. Count neighbors of a cell
4. Implement BFS on a grid (unweighted)

### Intermediate Level
1. Implement a PriorityQueue with custom comparator
2. Find path in unweighted grid using BFS
3. Understand why BFS fails for weighted graphs
4. Implement dynamic programming grid problems (e.g., minimum path sum)

### Advanced Level
1. Implement Dijkstra's algorithm from scratch
2. Solve variations: different start/end, multiple targets
3. Optimize with A* heuristic
4. Handle edge cases: unreachable cells, multiple paths

---

## Key Insights for This Problem

1. **Grid → Graph transformation:**
   - Each cell = node
   - Adjacent cells = edges
   - Hazard level = edge weight

2. **Why not DFS or BFS?**
   - DFS: Doesn't guarantee shortest/minimum path
   - BFS: Only works for unweighted (treats all edges equal)

3. **Why Dijkstra works:**
   - Explores cheapest paths first
   - Non-negative weights guarantee no cheaper path later
   - Optimal substructure: optimal path contains optimal sub-paths

4. **Critical optimization:**
   - Skip if already found better path: `if (cost > minCost[row][col]) continue;`
   - Early exit when destination reached

---

## Resources to Study

### Data Structures
- Java PriorityQueue documentation
- Implementing Comparable interface
- 2D array manipulation

### Algorithms
- Dijkstra's algorithm (multiple sources: YouTube, VisuAlgo, GeeksforGeeks)
- Graph representations
- BFS vs Dijkstra comparison

### Practice Problems
- LeetCode:
  - #1631 Path With Minimum Effort
  - #743 Network Delay Time
  - #787 Cheapest Flights Within K Stops
  - #62 Unique Paths (DP warmup)
- HackerRank: Dijkstra's shortest path problems

---

## Estimated Study Time

- **Complete beginner:** 2-3 weeks
  - Week 1: Data structures (arrays, queues, priority queues)
  - Week 2: Graph basics, BFS/DFS
  - Week 3: Dijkstra's algorithm

- **Some programming experience:** 1 week
  - Days 1-2: Review graphs and BFS
  - Days 3-4: Learn priority queue and Dijkstra
  - Days 5-7: Practice implementations

- **Familiar with algorithms:** 2-3 days
  - Day 1: Review Dijkstra, understand problem
  - Day 2: Implement and test
  - Day 3: Optimize and handle edge cases

---

## Success Checklist

Before attempting this problem, you should be able to:

- [ ] Create and manipulate 2D arrays
- [ ] Read and parse CSV files in Java
- [ ] Implement a Comparable interface
- [ ] Use PriorityQueue in Java
- [ ] Explain what a graph is
- [ ] Describe how grids map to graphs
- [ ] Implement BFS on a grid
- [ ] Explain when Dijkstra is needed vs BFS
- [ ] Trace through Dijkstra's algorithm by hand on small example
- [ ] Understand time and space complexity

---

## Final Tips

1. **Start small:** Test on a 3×3 or 5×5 grid first
2. **Visualize:** Draw the grid and trace algorithm step-by-step
3. **Debug:** Print the minCost array at each step
4. **Verify:** Check that priority queue always returns minimum
5. **Edge cases:** What if start = end? What if all hazards are 0?

Good luck with your learning journey!
