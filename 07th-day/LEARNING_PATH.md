# Learning Path: Eulerian Paths and Graph Theory (Day 7 - Seven Bridges of Königsberg)

## Problem Summary
Determine if it's possible to cross each bridge in a network exactly once, and if not, find the minimum number of additional bridge crossings needed to traverse all bridges.

---

## Table of Contents
- [Problem Summary](#problem-summary)
- [Historical Context](#historical-context)
- [Learning Path: From Basic to Advanced](#learning-path-from-basic-to-advanced)
  - [Phase 1: Foundation Concepts (Prerequisites)](#phase-1-foundation-concepts-prerequisites)
    - [1.1 Basic Data Structures](#11-basic-data-structures)
    - [1.2 File I/O in Java](#12-file-io-in-java)
    - [1.3 Understanding Graphs](#13-understanding-graphs)
  - [Phase 2: Intermediate Concepts](#phase-2-intermediate-concepts)
    - [2.1 Graph Representations](#21-graph-representations)
    - [2.2 Graph Degree Concepts](#22-graph-degree-concepts)
    - [2.3 Multigraphs (Multiple Edges)](#23-multigraphs-multiple-edges)
  - [Phase 3: Advanced Concepts](#phase-3-advanced-concepts)
    - [3.1 Eulerian Paths and Circuits](#31-eulerian-paths-and-circuits)
    - [3.2 Euler's Theorem](#32-eulers-theorem)
    - [3.3 The Chinese Postman Problem](#33-the-chinese-postman-problem)
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

## Historical Context

### The Seven Bridges of Königsberg (1736)

The city of Königsberg (now Kaliningrad, Russia) had seven bridges connecting four land masses. The question: **Can you walk a path that crosses each bridge exactly once?**

Leonhard Euler proved it was **impossible** and in doing so, founded **graph theory** as a mathematical discipline.

**Euler's Insight:**
- The specific layout doesn't matter
- What matters is: how many bridges connect to each land mass
- If a land mass has an odd number of bridges, you can't enter and leave without using a bridge twice

This problem is the foundation of our Day 7 challenge!

---

## Learning Path: From Basic to Advanced

### Phase 1: Foundation Concepts (Prerequisites)

#### 1.1 Basic Data Structures

**What you need to know:**
- HashMap / Dictionary
- Counting occurrences
- Key-value pairs
- getOrDefault() method

**Practice:**
```java
import java.util.*;

// Count how many times each word appears
Map<String, Integer> wordCount = new HashMap<>();

wordCount.put("apple", wordCount.getOrDefault("apple", 0) + 1);
wordCount.put("banana", wordCount.getOrDefault("banana", 0) + 1);
wordCount.put("apple", wordCount.getOrDefault("apple", 0) + 1);

System.out.println(wordCount.get("apple"));  // Output: 2
System.out.println(wordCount.get("banana")); // Output: 1
```

**Why it matters:** We need to count how many bridges connect to each landmass.

---

#### 1.2 File I/O in Java

**What you need to know:**
- BufferedReader and FileReader
- Reading line by line
- Parsing CSV (comma-separated values)
- String.split() method
- String.trim() to remove whitespace

**Practice:**
```java
import java.io.*;

try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        line = line.trim();  // Remove leading/trailing whitespace

        if (line.isEmpty()) {
            continue;  // Skip empty lines
        }

        // Parse comma-separated values
        String[] parts = line.split(",");
        String first = parts[0].trim();
        String second = parts[1].trim();

        System.out.println("Bridge: " + first + " <-> " + second);
    }
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}
```

**Why it matters:** Bridge connections are stored in a text file we need to read.

---

#### 1.3 Understanding Graphs

**What you need to know:**
- What is a graph?
- Vertices (nodes) vs Edges (connections)
- Undirected graphs (bidirectional)
- Real-world examples: social networks, maps, networks

**Conceptual understanding:**
```
Graph representation of bridges:

Landmasses (vertices): A, B, C, D
Bridges (edges): A-B, A-C, B-C, B-D, C-D

Visual:
    A --- B
     \   / \
      \ /   D
       C ---/
```

**Key terms:**
- **Vertex/Node**: A point (landmass in our problem)
- **Edge**: A connection between two vertices (bridge in our problem)
- **Undirected**: Connection works both ways (you can cross a bridge in either direction)

**Why it matters:** The bridge problem is fundamentally a graph problem.

---

### Phase 2: Intermediate Concepts

#### 2.1 Graph Representations

**What you need to know:**
- Adjacency List
- Adjacency Matrix
- Edge List
- When to use each representation

**Different representations:**

**1. Edge List** (What we use in this problem!)
```java
// Simple list of connections
List<String[]> edges = new ArrayList<>();
edges.add(new String[]{"A", "B"});
edges.add(new String[]{"B", "C"});
edges.add(new String[]{"A", "C"});
```

**2. Adjacency List** (Common for graph algorithms)
```java
// Each vertex maps to its neighbors
Map<String, Set<String>> graph = new HashMap<>();
graph.put("A", new HashSet<>(Arrays.asList("B", "C")));
graph.put("B", new HashSet<>(Arrays.asList("A", "C")));
graph.put("C", new HashSet<>(Arrays.asList("A", "B")));
```

**3. Degree Count** (Best for this problem!)
```java
// Count how many edges connect to each vertex
Map<String, Integer> degree = new HashMap<>();
degree.put("A", 2);  // A connects to B and C
degree.put("B", 2);  // B connects to A and C
degree.put("C", 2);  // C connects to A and B
```

**Why degree count is best for Eulerian paths:**
- We only need to know if degree is odd or even
- Don't need to know which vertices are connected
- Simpler and more efficient

---

#### 2.2 Graph Degree Concepts

**What you need to know:**
- **Degree**: Number of edges connected to a vertex
- **Odd degree**: Degree is an odd number (1, 3, 5, 7...)
- **Even degree**: Degree is an even number (0, 2, 4, 6...)
- **Handshaking Lemma**: Sum of all degrees = 2 × number of edges

**Calculating degree:**
```java
// For undirected graph, each edge contributes to TWO vertices
Map<String, Integer> degree = new HashMap<>();

// Process edge: A-B
degree.put("A", degree.getOrDefault("A", 0) + 1);  // A's degree increases
degree.put("B", degree.getOrDefault("B", 0) + 1);  // B's degree increases

// Process edge: A-C
degree.put("A", degree.getOrDefault("A", 0) + 1);  // A's degree increases again
degree.put("C", degree.getOrDefault("C", 0) + 1);  // C's degree increases

// Result: A has degree 2, B has degree 1, C has degree 1
```

**Handshaking Lemma Example:**
```
Vertices: A(degree 3), B(degree 2), C(degree 1)
Sum of degrees: 3 + 2 + 1 = 6
Number of edges: 6 / 2 = 3 edges

This makes sense! The sum is always even because each edge is counted twice.
```

**Why it matters:** Eulerian paths depend entirely on vertex degrees!

---

#### 2.3 Multigraphs (Multiple Edges)

**What you need to know:**
- **Simple graph**: At most one edge between any two vertices
- **Multigraph**: Can have multiple edges between the same two vertices
- **This problem uses multigraphs!**

**Critical difference:**

**Simple Graph (WRONG for this problem):**
```java
// Using Set - only counts unique neighbors
Map<String, Set<String>> graph = new HashMap<>();
graph.get("A").add("B");  // A-B edge 1
graph.get("A").add("B");  // A-B edge 2 (IGNORED! Set doesn't allow duplicates)

// A's degree appears to be 1, but should be 2!
```

**Multigraph (CORRECT for this problem):**
```java
// Count each edge separately
Map<String, Integer> degree = new HashMap<>();
degree.put("A", degree.getOrDefault("A", 0) + 1);  // A-B edge 1
degree.put("A", degree.getOrDefault("A", 0) + 1);  // A-B edge 2 (COUNTED!)

// A's degree is correctly 2
```

**Real-world example:**
```
Two islands connected by two separate bridges:
Island A <===bridge1===> Island B
Island A <===bridge2===> Island B

A has degree 2 (not 1!)
B has degree 2 (not 1!)
```

**Why it matters:** The problem explicitly states "Two landmasses can be connected by more than one bridge; count those bridges separately."

**Common mistake:** Using Set instead of counting occurrences, which loses duplicate edges!

---

### Phase 3: Advanced Concepts

#### 3.1 Eulerian Paths and Circuits

**What you need to know:**
- **Eulerian Path**: A path that uses every edge exactly once
- **Eulerian Circuit**: An Eulerian path that starts and ends at the same vertex
- Not all graphs have Eulerian paths!

**Definitions:**

**Eulerian Circuit Example:**
```
Graph:    A --- B
          |     |
          D --- C

Path: A → B → C → D → A
Uses all 4 edges exactly once, returns to start
This is an Eulerian CIRCUIT
```

**Eulerian Path Example:**
```
Graph:    A --- B --- C
          |           |
          D ----------+

Path: A → D → C → B → A (wait, this doesn't work!)
Path: D → A → B → C (uses all edges exactly once!)
This is an Eulerian PATH (not circuit - doesn't return to start)
```

**No Eulerian Path Example:**
```
Graph:    A --- B
          |\   /|
          | \ / |
          |  X  |
          | / \ |
          |/   \|
          C --- D

Cannot traverse all edges exactly once - impossible!
```

**Key insight:** Whether an Eulerian path exists depends ONLY on vertex degrees!

---

#### 3.2 Euler's Theorem

**What you need to know:**
- The mathematical conditions for Eulerian paths
- How to count odd-degree vertices
- The difference between path and circuit

**Euler's Theorem (The Solution!):**

For a **connected undirected graph**:

| Odd-degree vertices | Eulerian Path? | Eulerian Circuit? | Explanation |
|---------------------|----------------|-------------------|-------------|
| 0 | ✅ Yes | ✅ Yes | Can start anywhere, return to start |
| 2 | ✅ Yes | ❌ No | Must start at one odd vertex, end at the other |
| 4+ | ❌ No | ❌ No | Impossible to traverse all edges exactly once |

**Why this works:**

**Case 1: Zero odd vertices (all even)**
```
Every vertex has even degree
When you enter a vertex, you can always leave
You'll eventually return to where you started
Result: Eulerian Circuit exists
```

**Case 2: Exactly two odd vertices**
```
Start at one odd vertex
Every other vertex has even degree (can enter/leave evenly)
You'll end at the other odd vertex
Result: Eulerian Path exists (but not circuit)
```

**Case 3: More than two odd vertices**
```
You have multiple "dead ends" where you get stuck
Can't visit all edges exactly once
Result: No Eulerian Path
```

**Mathematical proof sketch:**
- When you visit a vertex during a path, you use 2 edges (enter + exit)
- Only the start and end vertices can have "unpaired" edges
- All other vertices must have even degree (pairs of in/out edges)
- Therefore: at most 2 vertices can have odd degree

**Implementation:**
```java
int oddCount = 0;
for (int degree : degreeMap.values()) {
    if (degree % 2 == 1) {
        oddCount++;
    }
}

if (oddCount == 0 || oddCount == 2) {
    System.out.println("Eulerian path exists!");
    return 0;  // Can cross each bridge exactly once
} else {
    System.out.println("No Eulerian path - need extra crossings");
    // Continue to calculate minimum...
}
```

---

#### 3.3 The Chinese Postman Problem

**What you need to know:**
- When Eulerian path doesn't exist, how to find minimum extra edges
- Pairing odd-degree vertices
- The formula: `(oddCount / 2) - 1`

**The Problem:**
You're a mail carrier who must walk every street (edge) at least once and return home. What's the shortest route?

- If Eulerian circuit exists: walk each street exactly once
- If not: some streets must be walked twice (or more)

**Our variant:** We want to cross each bridge at least once. If we can't do it exactly once, what's the minimum number of extra crossings?

**Solution Strategy:**

**Step 1: Understand the issue**
```
If we have 4 odd-degree vertices: A, B, C, D
We can't traverse all edges exactly once
We need to "fix" the graph by making it Eulerian
```

**Step 2: Pair up odd vertices**
```
Goal: Reduce odd vertices to 2 (or 0)

If we add a path from A to B, both become even (degree +2)
If we add a path from C to D, both become even (degree +2)

Now we have 0 odd vertices → Eulerian circuit exists!
```

**Step 3: Calculate minimum additions**
```
4 odd vertices → need to pair them up → 2 pairs
6 odd vertices → need to pair them up → 3 pairs
8 odd vertices → need to pair them up → 4 pairs

Pattern: oddCount / 2 pairs needed
```

**Step 4: But we want a PATH, not a CIRCUIT**
```
Eulerian PATH needs exactly 2 odd vertices
Eulerian CIRCUIT needs exactly 0 odd vertices

If we have 4 odd vertices:
- We could reduce to 0 (need 2 pairs)
- OR reduce to 2 (need 1 pair) ← This is sufficient!

If we have 6 odd vertices:
- We could reduce to 0 (need 3 pairs)
- OR reduce to 2 (need 2 pairs) ← This is sufficient!

Pattern: (oddCount / 2) - 1 extra paths needed
```

**The Formula Explained:**

```java
int extraCrossings = (oddCount / 2) - 1;
```

**Why this works:**
1. We have `oddCount` vertices with odd degree
2. We need exactly 2 odd vertices for Eulerian path
3. Each pair we connect reduces odd vertices by 2
4. To go from `oddCount` to 2: need `(oddCount - 2) / 2` pairs
5. Simplifies to: `(oddCount / 2) - 1`

**Example with numbers:**
```
6 odd vertices
Goal: reduce to 2
Calculation: (6 / 2) - 1 = 3 - 1 = 2 extra paths needed

Pair 1: Connect odd vertices A and B (A and B become even)
Pair 2: Connect odd vertices C and D (C and D become even)
Remaining: E and F still odd (perfect! exactly 2 odd vertices)

Result: Eulerian path now exists from E to F
```

**Important note:** We assume the graph is connected. If it's not, the problem becomes more complex.

---

### Phase 4: Problem-Solving Strategy

#### 4.1 Problem Recognition

**Questions to ask yourself:**

1. **Is this a graph problem?**
   - Are there "things" (vertices) connected by "relationships" (edges)?
   - Yes → It's a graph problem

2. **What are the vertices and edges?**
   - Vertices: Landmasses
   - Edges: Bridges

3. **Is it directed or undirected?**
   - Can you cross a bridge in both directions? → Undirected
   - Can you only go one way? → Directed
   - This problem: Undirected

4. **Can there be multiple edges?**
   - Can two landmasses be connected by multiple bridges? → Yes (multigraph)

5. **What's the actual question?**
   - "Can you traverse each edge exactly once?" → Eulerian path question!

**Recognition checklist:**
- ✅ Graph with vertices and edges
- ✅ Undirected (bidirectional)
- ✅ Asking about traversing all edges
- ✅ "Exactly once" → Eulerian path problem
- ✅ "Minimum extra crossings" → Chinese Postman variant

**Conclusion:** This is a classic Eulerian path problem with the Chinese Postman extension.

---

#### 4.2 Common Variations

**What if the problem changes slightly?**

| Variation | How to solve |
|-----------|--------------|
| **Must return to start** | Need Eulerian circuit (0 odd vertices), formula: `oddCount / 2` |
| **Directed graph** | Different rules: check in-degree vs out-degree |
| **Weighted edges** | Need Chinese Postman with shortest paths (use Dijkstra) |
| **Multiple components** | Solve each component separately, add edges to connect |
| **Specific start point** | Check if start has odd degree; affects answer |
| **Count total path length** | Sum of all edge weights + repeated edge weights |

**Example variations:**

**Variation 1: Must start and end at same place**
```java
// Need Eulerian CIRCUIT instead of PATH
if (oddCount == 0) {
    return 0;
} else {
    // All odd vertices must be paired
    return oddCount / 2;
}
```

**Variation 2: Weighted edges (real distances)**
```java
// Need to find shortest paths between odd-degree vertices
// Use Floyd-Warshall or Dijkstra to find shortest paths
// Match odd vertices optimally (minimum weight matching)
// This is much more complex!
```

**Variation 3: Directed graph (one-way streets)**
```java
// Check in-degree and out-degree for each vertex
// Eulerian path exists if:
//   - at most one vertex has (out-degree - in-degree) = 1
//   - at most one vertex has (in-degree - out-degree) = 1
//   - all other vertices have in-degree = out-degree
```

---

## Practice Progression

### Beginner Level

**Goal:** Understand basic graph concepts and counting

1. **Count word frequencies**
   - Read a file and count how many times each word appears
   - Use HashMap to store counts

2. **Parse CSV files**
   - Read a file with comma-separated values
   - Split each line and process the parts

3. **Build a simple graph**
   - Given a list of friendships, build an adjacency list
   - Example: "Alice,Bob" means Alice and Bob are friends

4. **Calculate vertex degrees**
   - Given an edge list, count the degree of each vertex
   - Print vertices with odd degree

### Intermediate Level

**Goal:** Understand Euler's theorem and apply it

1. **Detect Eulerian paths**
   - Given a graph, determine if an Eulerian path exists
   - Count odd-degree vertices and apply the rule

2. **Find the odd vertices**
   - Write code to identify all vertices with odd degree
   - Test with various graphs

3. **Handle multigraphs**
   - Create graphs where two vertices can have multiple edges
   - Make sure your degree counting works correctly

4. **Calculate minimum extra edges**
   - Implement the formula: `(oddCount / 2) - 1`
   - Test with different values of oddCount

### Advanced Level

**Goal:** Solve variations and optimize

1. **Implement Chinese Postman**
   - Full solution for weighted graphs
   - Find shortest paths between odd vertices
   - Implement minimum weight matching

2. **Handle disconnected graphs**
   - Detect connected components
   - Solve each component separately
   - Add edges to connect components

3. **Construct actual Eulerian path**
   - Not just count, but actually build the path
   - Use Hierholzer's algorithm

4. **Optimize for large graphs**
   - Handle millions of edges
   - Use efficient data structures
   - Parallel processing where applicable

---

## Key Insights for This Problem

### 1. **The Location Doesn't Matter - Only Degrees**

This is Euler's revolutionary insight!

```
These two graphs are DIFFERENT visually:

Graph 1:           Graph 2:
  A---B              A   B
  |\ /|              |\ /|
  | X |              | X |
  |/ \|              |/ \|
  C---D              C   D

But they have the SAME degree sequence:
A: degree 3, B: degree 3, C: degree 3, D: degree 3

Therefore: Same answer to Eulerian path question!
```

**Lesson:** You don't need to visualize the graph. Just count degrees!

---

### 2. **Multigraphs Are Tricky**

**Wrong approach:**
```java
// Using Set - counts unique neighbors only
Set<String> neighborsOfA = new HashSet<>();
neighborsOfA.add("B");  // A-B bridge 1
neighborsOfA.add("B");  // A-B bridge 2 (LOST! Set ignores duplicates)
int degree = neighborsOfA.size();  // Returns 1, should be 2!
```

**Correct approach:**
```java
// Count every edge
int degreeOfA = 0;
degreeOfA++;  // A-B bridge 1
degreeOfA++;  // A-B bridge 2
// degreeOfA is correctly 2
```

**Lesson:** For this problem, count edges, not unique neighbors!

---

### 3. **Handshaking Lemma Validation**

**Use this to verify your solution:**

```java
int totalDegree = degreeMap.values().stream().sum();
int edgeCount = totalDegree / 2;

System.out.println("Total edges: " + edgeCount);
// Should match the number of lines in the input file!
```

If it doesn't match, you made a mistake!

**Why:** Each edge contributes 2 to the total degree (one for each endpoint)

---

### 4. **The Formula is Beautiful**

```
oddCount = 0  → answer = 0 (Eulerian circuit)
oddCount = 2  → answer = 0 (Eulerian path)
oddCount = 4  → answer = 1 (need 1 extra edge)
oddCount = 6  → answer = 2 (need 2 extra edges)
oddCount = 8  → answer = 3 (need 3 extra edges)
oddCount = n  → answer = (n/2) - 1
```

**Pattern recognition:** The answer grows linearly with odd vertex count!

---

### 5. **Connected Graph Assumption**

This problem assumes the graph is connected (you can reach any landmass from any other).

If the graph has multiple components:
```
Component 1: A---B---C
Component 2: D---E

You can't walk from A to D without teleporting!
```

The formula would need modification for disconnected graphs.

---

## Resources to Study

### Graph Theory Fundamentals
- **Book**: "Introduction to Graph Theory" by Richard Trudeau (beginner-friendly)
- **Video**: 3Blue1Brown - Graph Theory overview
- **Interactive**: VisuAlgo - Graph Traversal visualizations

### Eulerian Paths
- **Article**: "The Seven Bridges of Königsberg" - Wikipedia
- **Video**: Numberphile - Euler's Solution
- **Practice**: Create your own bridge puzzles on paper

### Chinese Postman Problem
- **Article**: Brilliant.org - Chinese Postman Problem
- **Video**: MIT OpenCourseWare - Graph Algorithms
- **Paper**: Original problem by Guan Meigu (1962)

### Java Programming
- **HashMap**: Oracle Java Documentation
- **File I/O**: Java BufferedReader tutorial
- **Streams**: Java 8 Streams guide

### Practice Problems
- **HackerRank**: Graph Theory section
- **LeetCode**:
  - #332 Reconstruct Itinerary (Eulerian path)
  - #753 Cracking the Safe (De Bruijn sequence)
- **Codeforces**: Graph problems tagged "Eulerian path"

---

## Estimated Study Time

### Complete Beginner (No graph theory background)
**Total: 2-3 weeks**

- **Week 1**: Basic graphs, vertices, edges, degree
  - Day 1-2: What is a graph? Graph representations
  - Day 3-4: Vertex degree, odd vs even
  - Day 5-7: Practice counting degrees, build simple graphs

- **Week 2**: Eulerian paths and Euler's theorem
  - Day 1-3: Learn Eulerian path conditions
  - Day 4-5: Understand why the theorem works
  - Day 6-7: Practice identifying Eulerian paths

- **Week 3**: Implementation and Chinese Postman
  - Day 1-3: Code the solution
  - Day 4-5: Handle edge cases and multigraphs
  - Day 6-7: Learn Chinese Postman extension

### Intermediate (Some programming, no graph theory)
**Total: 1 week**

- **Days 1-2**: Graph basics and degree concepts
- **Days 3-4**: Eulerian paths and Euler's theorem
- **Days 5-6**: Implement solution
- **Day 7**: Practice variations

### Advanced (Familiar with basic algorithms)
**Total: 2-3 days**

- **Day 1**: Review Eulerian paths, understand problem
- **Day 2**: Implement and test solution
- **Day 3**: Explore advanced variations

---

## Success Checklist

Before attempting this problem, you should be able to:

**Basic Skills:**
- [ ] Read and parse CSV files in Java
- [ ] Use HashMap to count occurrences
- [ ] Iterate through Map entries
- [ ] Use getOrDefault() method

**Graph Theory:**
- [ ] Define: vertex, edge, degree
- [ ] Explain what a graph is
- [ ] Understand directed vs undirected
- [ ] Know what a multigraph is
- [ ] Calculate vertex degree from edge list

**Eulerian Paths:**
- [ ] State Euler's theorem
- [ ] Identify when Eulerian path exists (0 or 2 odd vertices)
- [ ] Explain why the theorem works
- [ ] Distinguish Eulerian path from circuit

**Problem Solving:**
- [ ] Count odd-degree vertices
- [ ] Apply the formula: `(oddCount / 2) - 1`
- [ ] Verify using Handshaking Lemma
- [ ] Handle edge cases (empty graph, 0 odd vertices)

**Common Mistakes to Avoid:**
- [ ] Using Set instead of counting (loses duplicate edges!)
- [ ] Forgetting to increment both vertices for each edge
- [ ] Using wrong formula (forgetting the -1)
- [ ] Not handling the cases where oddCount = 0 or 2

---

## Final Tips

### 1. Start Simple

Test your solution on tiny examples first:

```
Example 1: Two islands, one bridge
Input:
A,B

Expected degree: A=1, B=1
Odd vertices: 2
Answer: 0 (Eulerian path exists)
```

```
Example 2: Triangle with all edges
Input:
A,B
B,C
C,A

Expected degree: A=2, B=2, C=2
Odd vertices: 0
Answer: 0 (Eulerian circuit exists)
```

```
Example 3: Four islands in square
Input:
A,B
B,C
C,D
D,A
A,C

Expected degree: A=3, B=2, C=3, D=2
Odd vertices: 2
Answer: 0 (Eulerian path exists from A to C)
```

### 2. Verify with Handshaking Lemma

Always check: `sum of all degrees = 2 × number of edges`

```java
int sumDegrees = degreeMap.values().stream().mapToInt(Integer::intValue).sum();
int edgeCount = sumDegrees / 2;
System.out.println("Edges counted: " + edgeCount);
// Should match number of lines in file!
```

### 3. Print Debug Information

```java
System.out.println("Degree map: " + degreeMap);
System.out.println("Odd degree vertices: " + oddCount);
System.out.println("Formula: (" + oddCount + " / 2) - 1 = " + result);
```

### 4. Watch for Off-By-One Errors

The formula has a `-1` in it. Make sure you understand why!

### 5. Remember Multigraphs

Two vertices can have multiple edges. Don't use Set!

### 6. Draw It Out

Even though the solution doesn't need the graph structure, **draw small examples** to build intuition:

```
Can you trace a path crossing each edge exactly once?

  A---B        Try different starting points!
  |\ /|        Does it matter where you start?
  | X |        Which vertices have odd degree?
  |/ \|
  C---D
```

### 7. Read the History

Understanding Euler's original problem gives great insight. It's not just about solving the code - it's about understanding a 300-year-old mathematical breakthrough!

### 8. Edge Cases

- Empty file (no bridges)
- Single landmass (0 edges)
- Disconnected graph (multiple islands groups)
- Very large graphs (700+ edges)

---

## Conclusion

The Seven Bridges of Königsberg problem is more than just a coding challenge - it's a window into how mathematics can reveal deep truths about structure and connectivity.

**Euler's genius** was recognizing that complex spatial problems can be reduced to simple counting. You don't need to know *where* the bridges are, just *how many* connect to each place.

**Your journey:**
1. Start with basic graph concepts
2. Understand vertex degree
3. Learn Euler's theorem
4. Apply the formula
5. Appreciate the elegance!

This is one of the most beautiful problems in computer science because the solution is so simple once you see it the right way. That's the power of graph theory!

Good luck on your learning journey! 🌉

---

**Fun fact:** The original Königsberg bridge layout was destroyed in World War II, but the mathematical problem lives on forever!
