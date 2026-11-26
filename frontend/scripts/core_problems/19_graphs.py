# Graphs (Striver graph series, NeetCode graphs). Graphs come as n plus an edge list unless stated.
GR = "Graphs"
UND = "Vertices are 0..n-1; edges lists undirected edges [u, v]."


def _adj(n, edges, directed=False):
    a = [[] for _ in range(n)]
    for e in edges:
        a[e[0]].append(e[1])
        if not directed:
            a[e[1]].append(e[0])
    return [sorted(x) for x in a]


def _dijkstra(n, edges, src, directed=False):
    g = defaultdict(list)
    for u, v, w in edges:
        g[u].append((v, w))
        if not directed:
            g[v].append((u, w))
    dist = [None] * n
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if dist[u] is not None:
            continue
        dist[u] = d
        for v, w in g[u]:
            if dist[v] is None:
                heapq.heappush(pq, (d + w, v))
    return [-1 if d is None else d for d in dist]


E1 = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]]

Q(GR, "bfs-traversal", "BFS of a Graph", "Easy", "bfs(n: int, edges: int[][]) -> int[]",
  ["Return the breadth-first order of vertices reachable from 0, visiting each vertex's neighbours in increasing order.", UND],
  [C(5, E1), C(4, [[0, 1], [0, 2], [0, 3]]), C(1, []), C(6, [[0, 5], [5, 4], [0, 1], [1, 2]])], lambda n, e: _bfs(n, e),
  "Queue plus a visited array; mark a vertex when you enqueue it.", ["BFS", "Queue"])

Q(GR, "dfs-traversal", "DFS of a Graph", "Easy", "dfs(n: int, edges: int[][]) -> int[]",
  ["Return the recursive depth-first order of vertices reachable from 0, visiting neighbours in increasing order.", UND],
  [C(5, E1), C(4, [[0, 1], [0, 2], [0, 3]]), C(1, []), C(6, [[0, 5], [5, 4], [0, 1], [1, 2]])], lambda n, e: _dfs(n, e),
  "Recurse into each unvisited neighbour before moving to the next one.", ["DFS"])

Q(GR, "connected-components", "Number of Connected Components", "Medium", "countComponents(n: int, edges: int[][]) -> int",
  ["Return the number of connected components.", UND],
  [C(5, [[0, 1], [1, 2], [3, 4]]), C(5, [[0, 1], [1, 2], [2, 3], [3, 4]]), C(3, []), C(6, [[0, 1], [2, 3], [4, 5], [1, 2]])], lambda n, e: _components(n, e),
  "DFS/BFS from each unvisited vertex, or union-find.", ["DFS", "Union Find"])

Q(GR, "cycle-undirected", "Detect Cycle in an Undirected Graph", "Medium", "hasCycle(n: int, edges: int[][]) -> boolean",
  ["Return true if the undirected graph contains a cycle.", UND],
  [C(4, [[0, 1], [1, 2], [2, 0], [2, 3]]), C(4, [[0, 1], [1, 2], [2, 3]]), C(1, []), C(5, [[0, 1], [2, 3], [3, 4], [4, 2]])], lambda n, e: _und_cycle(n, e),
  "DFS remembering the parent: reaching a visited vertex that isn't the parent means a cycle. Or union-find.", ["DFS", "Union Find"])

Q(GR, "cycle-directed", "Detect Cycle in a Directed Graph", "Medium", "hasCycle(n: int, edges: int[][]) -> boolean",
  "Vertices are 0..n-1; edges lists directed edges [u, v] meaning u -> v. Return true if the graph has a cycle.",
  [C(4, [[0, 1], [1, 2], [2, 3], [3, 1]]), C(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), C(1, [[0, 0]]), C(3, [])], lambda n, e: _dir_cycle(n, e),
  "DFS with a recursion-stack flag, or Kahn's algorithm (a cycle leaves vertices unprocessed).", ["DFS", "Topological Sort"])

Q(GR, "topological-sort", "Topological Sort", "Medium", "topoSort(n: int, edges: int[][]) -> int[]",
  "edges are directed [u, v] (u must come before v) and the graph is acyclic. Return the topological order that, at each step, takes the smallest available vertex.",
  [C(6, [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]), C(4, [[3, 0], [1, 0], [2, 0]]), C(3, []), C(5, [[0, 1], [1, 2], [3, 2], [2, 4]])], lambda n, e: _kahn(n, e),
  "Kahn's algorithm with a min-heap instead of a queue.", ["Topological Sort", "BFS", "Heap"])

Q(GR, "course-schedule-ii", "Course Schedule II", "Medium", "findOrder(numCourses: int, prerequisites: int[][]) -> int[]",
  "prerequisites[i] = [a, b] means take b before a. Return an order to take all courses, choosing the smallest available course at each step, or an empty array if impossible.",
  [C(2, [[1, 0]]), C(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), C(1, []), C(2, [[0, 1], [1, 0]])], lambda n, p: _kahn(n, [[b, a] for a, b in p]),
  "Kahn's algorithm (smallest first); if fewer than numCourses are output, there's a cycle.", ["Topological Sort", "BFS"])

Q(GR, "is-bipartite", "Is Graph Bipartite?", "Medium", "isBipartite(graph: int[][]) -> boolean",
  "graph[u] lists the neighbours of u (undirected). Return true if the vertices can be split into two groups with every edge going between the groups.",
  [C([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]), C([[1, 3], [0, 2], [1, 3], [0, 2]]), C([[]]), C([[1], [0], [3], [2]])], lambda g: _bipartite(g),
  "BFS/DFS colouring each component with two colours; a clash means not bipartite.", ["BFS", "DFS"])

Q(GR, "surrounded-regions", "Surrounded Regions", "Medium", "solve(board: String[]) -> String[]",
  "board has 'X' and 'O'. Capture every region of 'O' that is not connected to the border by flipping it to 'X'. Return the board.",
  [C(["XXXX", "XOOX", "XXOX", "XOXX"]), C(["X"]), C(["OOO", "OXO", "OOO"]), C(["XOXX", "OXOX", "XOXO", "OXOX"])], lambda b: _surround(b),
  "Mark every 'O' reachable from the border; flip all other 'O's.", ["DFS", "Matrix"])

Q(GR, "number-of-enclaves", "Number of Enclaves", "Medium", "numEnclaves(grid: int[][]) -> int",
  "grid has 1 (land) and 0 (sea). Return how many land cells can't walk off the grid's edge.",
  [C([[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]), C([[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]), C([[1]]), C([[rng.randint(0, 1) for _ in range(6)] for _ in range(5)])],
  lambda g: _enclaves(g), "Flood fill from all border land cells, then count land left.", ["DFS", "BFS", "Matrix"])

Q(GR, "01-matrix", "01 Matrix", "Medium", "updateMatrix(mat: int[][]) -> int[][]",
  "mat is binary with at least one 0. Return the distance from each cell to its nearest 0 (moving up/down/left/right).",
  [C([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), C([[0, 0, 0], [0, 1, 0], [1, 1, 1]]), C([[0]]), C([[1, 1, 1], [1, 1, 1], [1, 1, 0]])], lambda m: _dist0(m),
  "Multi-source BFS from every 0.", ["BFS", "Matrix"])

Q(GR, "word-ladder", "Word Ladder", "Hard", "ladderLength(beginWord: String, endWord: String, wordList: String[]) -> int",
  "Change one letter at a time; every intermediate word must be in wordList. Return the number of words in the shortest sequence from beginWord to endWord, or 0 if impossible.",
  [C("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]), C("hit", "cog", ["hot", "dot", "dog", "lot", "log"]), C("a", "c", ["a", "b", "c"]), C("hot", "dog", ["hot", "dog"])], lambda b, e, w: _ladder(b, e, w),
  "BFS over words, trying every letter at every position.", ["BFS", "Hash Set", "Strings"])

Q(GR, "shortest-path-unweighted", "Shortest Path in an Undirected Graph", "Medium", "shortestPath(n: int, edges: int[][], src: int) -> int[]",
  ["Every edge has length 1. Return the shortest distance from src to every vertex, or -1 if unreachable.", UND],
  [C(9, [[0, 1], [0, 3], [3, 4], [4, 5], [5, 6], [1, 2], [2, 6], [6, 7], [7, 8], [6, 8]], 0), C(4, [[0, 1]], 1), C(1, [], 0), C(5, E1, 4)],
  lambda n, e, s: _dijkstra(n, [[u, v, 1] for u, v in e], s), "Plain BFS gives shortest paths when all edges weigh 1.", ["BFS"])

Q(GR, "dijkstra", "Dijkstra's Shortest Paths", "Medium", "dijkstra(n: int, edges: int[][], src: int) -> int[]",
  "edges are undirected [u, v, w] with non-negative weights. Return the shortest distance from src to every vertex, or -1 if unreachable.",
  [C(3, [[0, 1, 1], [1, 2, 3], [0, 2, 6]], 2), C(2, [[0, 1, 9]], 0), C(3, [[0, 1, 4]], 0), C(5, [[0, 1, 2], [0, 2, 4], [1, 2, 1], [1, 3, 7], [2, 4, 3], [3, 4, 1]], 0)],
  lambda n, e, s: _dijkstra(n, e, s), "Min-heap of (distance, vertex); skip stale entries.", ["Heap", "Shortest Path"])

Q(GR, "network-delay-time", "Network Delay Time", "Medium", "networkDelayTime(times: int[][], n: int, k: int) -> int",
  "Nodes are 1..n; times[i] = [u, v, w] is a directed edge taking w time. A signal starts at k. Return the time for all nodes to receive it, or -1 if some never do.",
  [C([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), C([[1, 2, 1]], 2, 1), C([[1, 2, 1]], 2, 2), C([[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1)],
  lambda t, n, k: (lambda d: -1 if -1 in d else max(d))(_dijkstra(n + 1, t, k, directed=True)[1:]), "Dijkstra from k; the answer is the largest distance.", ["Heap", "Shortest Path"])

Q(GR, "cheapest-flights-k-stops", "Cheapest Flights Within K Stops", "Medium", "findCheapestPrice(n: int, flights: int[][], src: int, dst: int, k: int) -> int",
  "flights[i] = [from, to, price] (directed). Return the cheapest price from src to dst with at most k stops, or -1.",
  [C(4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1), C(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1), C(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0), C(2, [[1, 0, 5]], 0, 1, 3)],
  lambda n, f, s, d, k: _bellman_k(n, f, s, d, k), "Bellman-Ford limited to k + 1 rounds, copying the distance array each round.", ["Shortest Path", "BFS", "Dynamic Programming"])

Q(GR, "path-minimum-effort", "Path With Minimum Effort", "Medium", "minimumEffortPath(heights: int[][]) -> int",
  "Walk from the top-left to the bottom-right (up/down/left/right). A path's effort is its largest absolute height difference between consecutive cells. Return the minimum effort.",
  [C([[1, 2, 2], [3, 8, 2], [5, 3, 5]]), C([[1, 2, 3], [3, 8, 4], [5, 3, 5]]), C([[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]), C([[7]])],
  lambda h: _effort(h), "Dijkstra where a path's cost is the max edge on it.", ["Heap", "Binary Search", "Matrix"])

Q(GR, "shortest-path-binary-matrix", "Shortest Path in Binary Matrix", "Medium", "shortestPathBinaryMatrix(grid: int[][]) -> int",
  "Return the number of cells on the shortest path of 0s from the top-left to the bottom-right, moving in 8 directions, or -1 if there is none.",
  [C([[0, 1], [1, 0]]), C([[0, 0, 0], [1, 1, 0], [1, 1, 0]]), C([[1, 0, 0], [1, 1, 0], [1, 1, 0]]), C([[0]])], lambda g: _bin_path(g),
  "BFS with 8 neighbours; the start and end must be 0.", ["BFS", "Matrix"])

Q(GR, "bellman-ford", "Bellman-Ford", "Medium", "bellmanFord(n: int, edges: int[][], src: int) -> int[]",
  "edges are directed [u, v, w]; weights may be negative. Return shortest distances from src (use 100000000 for unreachable). If a negative cycle is reachable from src, return [-1].",
  [C(3, [[0, 1, 5], [1, 0, 3], [1, 2, -1], [2, 0, 1]], 2), C(2, [[0, 1, 9]], 0), C(3, [[0, 1, 1], [1, 2, -3], [2, 0, 1]], 0), C(4, [[0, 1, 4], [0, 2, 5], [1, 2, -3], [2, 3, 4]], 0)],
  lambda n, e, s: _bellman(n, e, s), "Relax every edge n - 1 times; one more successful relaxation means a negative cycle.", ["Shortest Path", "Dynamic Programming"])

Q(GR, "floyd-warshall", "Floyd-Warshall", "Medium", "shortestDistance(matrix: int[][]) -> int[][]",
  "matrix[i][j] is the weight of the directed edge i -> j, or -1 if there is no edge (matrix[i][i] = 0). Return the matrix of shortest distances, keeping -1 where j is unreachable from i.",
  [C([[0, 1, 43], [1, 0, 6], [-1, -1, 0]]), C([[0, 25], [-1, 0]]), C([[0]]), C([[0, 3, -1, 7], [8, 0, 2, -1], [5, -1, 0, 1], [2, -1, -1, 0]])], lambda m: _floyd(m),
  "For every k, i, j: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).", ["Shortest Path", "Dynamic Programming", "Matrix"])

Q(GR, "minimum-spanning-tree", "Minimum Spanning Tree", "Medium", "spanningTree(n: int, edges: int[][]) -> int",
  "edges are undirected [u, v, w]; the graph is connected. Return the total weight of a minimum spanning tree.",
  [C(3, [[0, 1, 5], [1, 2, 3], [0, 2, 1]]), C(2, [[0, 1, 5]]), C(5, [[0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], [1, 4, 5], [2, 4, 7], [3, 4, 9]]), C(1, [])], lambda n, e: _kruskal(n, e),
  "Kruskal: sort edges, add each that joins two different union-find sets. Or Prim with a heap.", ["Union Find", "Heap", "Greedy"])

Q(GR, "redundant-connection", "Redundant Connection", "Medium", "findRedundantConnection(edges: int[][]) -> int[]",
  "A tree on nodes 1..n had one extra edge added. Return the edge that can be removed to leave a tree; if several work, return the one that appears last in edges.",
  [C([[1, 2], [1, 3], [2, 3]]), C([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]), C([[1, 2], [2, 3], [1, 3], [3, 4]]), C([[3, 4], [1, 2], [2, 4], [3, 5], [2, 5]])], lambda e: _redundant(e),
  "Union-find: the first edge whose endpoints are already connected is the answer.", ["Union Find"])

Q(GR, "make-network-connected", "Number of Operations to Make Network Connected", "Medium", "makeConnected(n: int, connections: int[][]) -> int",
  "Computers 0..n-1 are joined by cables. You may move a cable between any two computers. Return the fewest moves to connect every computer, or -1 if there aren't enough cables.",
  [C(4, [[0, 1], [0, 2], [1, 2]]), C(6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]), C(6, [[0, 1], [0, 2], [0, 3], [1, 2]]), C(1, [])], lambda n, c: -1 if len(c) < n - 1 else _components(n, c) - 1,
  "You need n - 1 cables; with enough, the answer is (components - 1).", ["Union Find", "DFS"])

Q(GR, "eventual-safe-states", "Find Eventual Safe States", "Medium", "eventualSafeNodes(graph: int[][]) -> int[]",
  "graph[i] lists directed edges from i. A node is safe if every path from it ends at a terminal node (one with no outgoing edges). Return the safe nodes in increasing order.",
  [C([[1, 2], [2, 3], [5], [0], [5], [], []]), C([[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]), C([[]]), C([[0]])], lambda g: _safe(g),
  "Reverse the edges and run Kahn's algorithm from terminal nodes, or DFS with three colours.", ["Topological Sort", "DFS"])

Q(GR, "strongly-connected-components", "Strongly Connected Components (Kosaraju)", "Hard", "countSCC(n: int, edges: int[][]) -> int",
  "edges are directed [u, v]. Return the number of strongly connected components.",
  [C(5, [[1, 0], [0, 2], [2, 1], [0, 3], [3, 4]]), C(3, [[0, 1], [1, 2]]), C(3, [[0, 1], [1, 2], [2, 0]]), C(1, [])], lambda n, e: _scc(n, e),
  "Kosaraju: order by DFS finish time, reverse the graph, DFS in reverse finish order counting trees.", ["DFS"])

Q(GR, "critical-connections", "Critical Connections in a Network (Bridges)", "Hard", "criticalConnections(n: int, connections: int[][]) -> int[][]",
  ["Return every bridge (an edge whose removal disconnects the graph) as [a, b] with a < b, sorted.", UND],
  [C(4, [[0, 1], [1, 2], [2, 0], [1, 3]]), C(2, [[0, 1]]), C(5, [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]]), C(4, [[0, 1], [1, 2], [2, 3], [3, 0]])], lambda n, c: _bridges(n, c),
  "Tarjan: track discovery time and low-link; edge (u, v) is a bridge when low[v] > disc[u].", ["DFS"])

Q(GR, "find-town-judge", "Find the Town Judge", "Easy", "findJudge(n: int, trust: int[][]) -> int",
  "People are 1..n; trust[i] = [a, b] means a trusts b. The judge trusts nobody and is trusted by everyone else. Return the judge's label, or -1.",
  [C(2, [[1, 2]]), C(3, [[1, 3], [2, 3]]), C(3, [[1, 3], [2, 3], [3, 1]]), C(1, [])],
  lambda n, t: next((p for p in range(1, n + 1) if sum(b == p for a, b in t) == n - 1 and not any(a == p for a, b in t)), -1),
  "Track in-degree minus out-degree; the judge has exactly n - 1.", ["Hash Map"])

Q(GR, "find-star-center", "Find Center of Star Graph", "Easy", "findCenter(edges: int[][]) -> int",
  "The undirected star graph has one centre connected to every other node. Return the centre.",
  [C([[1, 2], [2, 3], [4, 2]]), C([[1, 2], [5, 1], [1, 3], [1, 4]]), C([[3, 1], [1, 2]])], lambda e: ({e[0][0], e[0][1]} & {e[1][0], e[1][1]}).pop(),
  "The centre appears in the first two edges.")


def _bfs(n, e):
    a, seen, out, q = _adj(n, e), {0}, [], deque([0])
    while q:
        u = q.popleft()
        out.append(u)
        for v in a[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)
    return out


def _dfs(n, e):
    a, seen, out = _adj(n, e), set(), []

    def go(u):
        seen.add(u)
        out.append(u)
        for v in a[u]:
            if v not in seen:
                go(v)

    go(0)
    return out


def _components(n, e):
    p = list(range(n))

    def f(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x

    for u, v in e:
        p[f(u)] = f(v)
    return len({f(i) for i in range(n)})


def _und_cycle(n, e):
    p = list(range(n))

    def f(x):
        while p[x] != x:
            x = p[x]
        return x

    for u, v in e:
        a, b = f(u), f(v)
        if a == b:
            return True
        p[a] = b
    return False


def _dir_cycle(n, e):
    return len(_kahn(n, e)) < n


def _kahn(n, e):
    a, indeg = _adj(n, e, directed=True), [0] * n
    for u, v in e:
        indeg[v] += 1
    h = [i for i in range(n) if indeg[i] == 0]
    heapq.heapify(h)
    out = []
    while h:
        u = heapq.heappop(h)
        out.append(u)
        for v in a[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(h, v)
    return out if len(out) == n else []  # a cycle leaves vertices unprocessed


def _bipartite(g):
    col = [-1] * len(g)
    for s in range(len(g)):
        if col[s] != -1:
            continue
        col[s], q = 0, deque([s])
        while q:
            u = q.popleft()
            for v in g[u]:
                if col[v] == -1:
                    col[v] = 1 - col[u]
                    q.append(v)
                elif col[v] == col[u]:
                    return False
    return True


def _surround(b):
    g = [list(r) for r in b]
    R, Cc = len(g), len(g[0])
    st = [(r, c) for r in range(R) for c in range(Cc) if (r in (0, R - 1) or c in (0, Cc - 1)) and g[r][c] == "O"]
    while st:
        r, c = st.pop()
        if 0 <= r < R and 0 <= c < Cc and g[r][c] == "O":
            g[r][c] = "#"
            st += [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]
    return ["".join("O" if x == "#" else "X" for x in row) for row in g]


def _enclaves(g):
    g = [r[:] for r in g]
    R, Cc = len(g), len(g[0])
    st = [(r, c) for r in range(R) for c in range(Cc) if r in (0, R - 1) or c in (0, Cc - 1)]
    while st:
        r, c = st.pop()
        if 0 <= r < R and 0 <= c < Cc and g[r][c] == 1:
            g[r][c] = 0
            st += [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]
    return sum(map(sum, g))


def _dist0(m):
    R, Cc = len(m), len(m[0])
    d = [[-1] * Cc for _ in range(R)]
    q = deque()
    for r in range(R):
        for c in range(Cc):
            if m[r][c] == 0:
                d[r][c] = 0
                q.append((r, c))
    while q:
        r, c = q.popleft()
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < R and 0 <= nc < Cc and d[nr][nc] == -1:
                d[nr][nc] = d[r][c] + 1
                q.append((nr, nc))
    return d


def _ladder(b, e, words):
    ws = set(words)
    if e not in ws:
        return 0
    q, seen = deque([(b, 1)]), {b}
    while q:
        w, d = q.popleft()
        if w == e:
            return d
        for i in range(len(w)):
            for ch in "abcdefghijklmnopqrstuvwxyz":
                nw = w[:i] + ch + w[i + 1:]
                if nw in ws and nw not in seen:
                    seen.add(nw)
                    q.append((nw, d + 1))
    return 0


def _bellman_k(n, f, s, d, k):
    INF = float("inf")
    dist = [INF] * n
    dist[s] = 0
    for _ in range(k + 1):
        nd = dist[:]
        for u, v, w in f:
            if dist[u] + w < nd[v]:
                nd[v] = dist[u] + w
        dist = nd
    return -1 if dist[d] == INF else dist[d]


def _effort(h):
    R, Cc = len(h), len(h[0])
    best = [[float("inf")] * Cc for _ in range(R)]
    best[0][0], pq = 0, [(0, 0, 0)]
    while pq:
        e, r, c = heapq.heappop(pq)
        if (r, c) == (R - 1, Cc - 1):
            return e
        if e > best[r][c]:
            continue
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < R and 0 <= nc < Cc:
                ne = max(e, abs(h[nr][nc] - h[r][c]))
                if ne < best[nr][nc]:
                    best[nr][nc] = ne
                    heapq.heappush(pq, (ne, nr, nc))
    return 0


def _bin_path(g):
    n = len(g)
    if g[0][0] or g[n - 1][n - 1]:
        return -1
    q, seen = deque([(0, 0, 1)]), {(0, 0)}
    while q:
        r, c, d = q.popleft()
        if (r, c) == (n - 1, n - 1):
            return d
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and not g[nr][nc] and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    q.append((nr, nc, d + 1))
    return -1


def _bellman(n, e, s):
    INF = 10**8
    d = [INF] * n
    d[s] = 0
    for _ in range(n - 1):
        for u, v, w in e:
            if d[u] != INF and d[u] + w < d[v]:
                d[v] = d[u] + w
    for u, v, w in e:
        if d[u] != INF and d[u] + w < d[v]:
            return [-1]
    return d


def _floyd(m):
    n = len(m)
    INF = float("inf")
    d = [[INF if x == -1 else x for x in r] for r in m]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return [[-1 if x == INF else x for x in r] for r in d]


def _kruskal(n, e):
    p = list(range(n))

    def f(x):
        while p[x] != x:
            x = p[x]
        return x

    total = 0
    for u, v, w in sorted(e, key=lambda x: x[2]):
        a, b = f(u), f(v)
        if a != b:
            p[a] = b
            total += w
    return total


def _redundant(e):
    p = list(range(len(e) + 1))

    def f(x):
        while p[x] != x:
            x = p[x]
        return x

    for u, v in e:
        a, b = f(u), f(v)
        if a == b:
            return [u, v]
        p[a] = b
    return []


def _safe(g):
    n = len(g)
    state = [0] * n  # 0 unvisited, 1 visiting, 2 safe

    def ok(u):
        if state[u]:
            return state[u] == 2
        state[u] = 1
        if all(ok(v) for v in g[u]):
            state[u] = 2
            return True
        return False

    return [u for u in range(n) if ok(u)]


def _scc(n, e):
    a, ra = _adj(n, e, True), _adj(n, [[v, u] for u, v in e], True)
    seen, order = set(), []

    def d1(u):
        seen.add(u)
        for v in a[u]:
            if v not in seen:
                d1(v)
        order.append(u)

    for u in range(n):
        if u not in seen:
            d1(u)
    seen.clear()
    count = 0

    def d2(u):
        seen.add(u)
        for v in ra[u]:
            if v not in seen:
                d2(v)

    for u in reversed(order):
        if u not in seen:
            d2(u)
            count += 1
    return count


def _bridges(n, c):
    a, disc, low, out, t = _adj(n, c), [-1] * n, [0] * n, [], [0]

    def go(u, parent):
        disc[u] = low[u] = t[0]
        t[0] += 1
        for v in a[u]:
            if v == parent:
                continue
            if disc[v] == -1:
                go(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    out.append(sorted([u, v]))
            else:
                low[u] = min(low[u], disc[v])

    for u in range(n):
        if disc[u] == -1:
            go(u, -1)
    return sorted(out)
