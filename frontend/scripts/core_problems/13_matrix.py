# Matrix / 2D grids (LeetCode classics, Striver matrix problems).
M = "Matrix"

def rm(r, c, lo=0, hi=9):
    return [rl(c, lo, hi) for _ in range(r)]


Q(M, "transpose-matrix", "Transpose Matrix", "Easy", "transpose(matrix: int[][]) -> int[][]",
  "Return the transpose of matrix: rows become columns.",
  [C([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), C([[1, 2, 3], [4, 5, 6]]), C([[5]]), C(rm(3, 5))], lambda m: [list(r) for r in zip(*m)],
  "result[c][r] = matrix[r][c]; the result is cols x rows.", ["Arrays"])

Q(M, "flip-invert-image", "Flipping an Image", "Easy", "flipAndInvertImage(image: int[][]) -> int[][]",
  "image is binary. Flip each row horizontally, then invert it (0 becomes 1 and 1 becomes 0). Return the result.",
  [C([[1, 1, 0], [1, 0, 1], [0, 0, 0]]), C([[1, 1, 0, 0], [1, 0, 0, 1], [0, 1, 1, 1], [1, 0, 1, 0]]), C([[0]])], lambda m: [[1 - x for x in r[::-1]] for r in m],
  "Two pointers per row: swap and invert in one pass.", ["Two Pointers", "Bit Manipulation"])

Q(M, "reshape-matrix", "Reshape the Matrix", "Easy", "matrixReshape(mat: int[][], r: int, c: int) -> int[][]",
  "Reshape mat into r rows and c columns, filling row by row in the original row-major order. If that's impossible, return mat unchanged.",
  [C([[1, 2], [3, 4]], 1, 4), C([[1, 2], [3, 4]], 2, 4), C([[1, 2, 3, 4]], 2, 2), C([[1], [2], [3], [4], [5], [6]], 3, 2)],
  lambda m, r, c: m if r * c != len(m) * len(m[0]) else (lambda f: [f[i * c:(i + 1) * c] for i in range(r)])([x for row in m for x in row]),
  "Element number k goes to row k / c, column k % c.", ["Arrays"])

Q(M, "toeplitz-matrix", "Toeplitz Matrix", "Easy", "isToeplitzMatrix(matrix: int[][]) -> boolean",
  "Return true if every top-left to bottom-right diagonal has a single repeated value.",
  [C([[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]]), C([[1, 2], [2, 2]]), C([[7]]), C([[1, 2, 3], [4, 1, 2]])],
  lambda m: all(m[r][c] == m[r - 1][c - 1] for r in range(1, len(m)) for c in range(1, len(m[0]))), "Each cell must equal its upper-left neighbour.", ["Arrays"])

Q(M, "lucky-numbers-matrix", "Lucky Numbers in a Matrix", "Easy", "luckyNumbers(matrix: int[][]) -> int[]",
  "Values are distinct. A lucky number is the minimum of its row and the maximum of its column. Return all lucky numbers in increasing order.",
  [C([[3, 7, 8], [9, 11, 13], [15, 16, 17]]), C([[1, 10, 4, 2], [9, 3, 8, 7], [15, 16, 17, 12]]), C([[7, 8], [1, 2]]), C([[3, 6], [7, 1], [5, 2], [4, 8]])],
  lambda m: sorted(set(map(min, m)) & set(map(max, zip(*m)))), "Intersect the set of row minimums with the set of column maximums.", ["Arrays"])

Q(M, "richest-customer-wealth", "Richest Customer Wealth", "Easy", "maximumWealth(accounts: int[][]) -> int",
  "accounts[i][j] is the money customer i has in bank j. Return the wealth of the richest customer.",
  [C([[1, 2, 3], [3, 2, 1]]), C([[1, 5], [7, 3], [3, 5]]), C([[2, 8, 7], [7, 1, 3], [1, 9, 5]]), C(rm(5, 4, 1, 50))], lambda m: max(map(sum, m)),
  "Sum each row; take the maximum.", ["Arrays"])

Q(M, "count-negatives", "Count Negative Numbers in a Sorted Matrix", "Easy", "countNegatives(grid: int[][]) -> int",
  "Rows and columns of grid are sorted in non-increasing order. Return how many values are negative, ideally in O(m + n).",
  [C([[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]]), C([[3, 2], [1, 0]]), C([[-1]]), C([[5, 1, 0], [-5, -5, -5]])],
  lambda m: sum(x < 0 for r in m for x in r), "Staircase from the bottom-left: move right past non-negatives, count the rest of the row, move up.", ["Binary Search"])

Q(M, "cells-with-odd-values", "Cells with Odd Values in a Matrix", "Easy", "oddCells(m: int, n: int, indices: int[][]) -> int",
  "Start with an m x n matrix of zeros. Each [r, c] in indices adds 1 to every cell in row r and every cell in column c. Return how many cells end up odd.",
  [C(2, 3, [[0, 1], [1, 1]]), C(2, 2, [[1, 1], [0, 0]]), C(1, 1, [[0, 0]]), C(3, 4, [[0, 0], [1, 2], [2, 3], [0, 3]])],
  lambda m, n, ix: sum((sum(r == i for i, _ in ix) + sum(c == j for _, j in ix)) % 2 for r in range(m) for c in range(n)),
  "Only the parity of each row and column count matters.", ["Simulation"])

Q(M, "spiral-matrix-ii", "Spiral Matrix II", "Medium", "generateMatrix(n: int) -> int[][]",
  "Return an n x n matrix filled with 1 to n^2 in clockwise spiral order, starting at the top-left.",
  [C(3), C(1), C(2), C(4)], lambda n: _spiral_gen(n), "Walk the four boundaries as in Spiral Order, writing an increasing counter.", ["Simulation"])

Q(M, "island-perimeter", "Island Perimeter", "Easy", "islandPerimeter(grid: int[][]) -> int",
  "grid has exactly one island of 1s (connected up, down, left, right) and no lakes. Return the island's perimeter.",
  [C([[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]]), C([[1]]), C([[1, 0]]), C([[1, 1], [1, 1]])],
  lambda g: sum(4 - sum(1 for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= r + dr < len(g) and 0 <= c + dc < len(g[0]) and g[r + dr][c + dc]) for r in range(len(g)) for c in range(len(g[0])) if g[r][c]),
  "Each land cell adds 4, minus 1 for every land neighbour.", ["Graphs"])

Q(M, "image-smoother", "Image Smoother", "Easy", "imageSmoother(img: int[][]) -> int[][]",
  "Replace each cell by the floor of the average of itself and its up-to-8 neighbours that exist. Return the new image.",
  [C([[1, 1, 1], [1, 0, 1], [1, 1, 1]]), C([[100, 200, 100], [200, 50, 200], [100, 200, 100]]), C([[5]]), C(rm(3, 4, 0, 255))],
  lambda m: [[(lambda v: sum(v) // len(v))([m[i][j] for i in range(r - 1, r + 2) for j in range(c - 1, c + 2) if 0 <= i < len(m) and 0 <= j < len(m[0])]) for c in range(len(m[0]))] for r in range(len(m))],
  "For each cell, loop over the 3 x 3 block clipped to the grid.", ["Arrays"])

Q(M, "matrix-block-sum", "Matrix Block Sum", "Medium", "matrixBlockSum(mat: int[][], k: int) -> int[][]",
  "answer[i][j] is the sum of mat[r][c] for every cell with |r - i| <= k and |c - j| <= k (inside the grid). Return answer.",
  [C([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1), C([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 2), C([[5]], 3), C(rm(4, 5), 1)],
  lambda m, k: [[sum(m[r][c] for r in range(max(0, i - k), min(len(m), i + k + 1)) for c in range(max(0, j - k), min(len(m[0]), j + k + 1))) for j in range(len(m[0]))] for i in range(len(m))],
  "2D prefix sums turn each block into four lookups.", ["Prefix Sum"])

Q(M, "max-hourglass-sum", "Maximum Sum of an Hourglass", "Medium", "maxSum(grid: int[][]) -> int",
  "An hourglass is a 3 x 3 block without its middle-left and middle-right cells. Return the maximum hourglass sum in the grid (at least 3 x 3).",
  [C([[6, 2, 1, 3], [4, 2, 1, 5], [9, 2, 8, 7], [4, 1, 2, 9]]), C([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), C(rm(5, 6, 0, 20))],
  lambda g: max(sum(g[r][c:c + 3]) + g[r + 1][c + 1] + sum(g[r + 2][c:c + 3]) for r in range(len(g) - 2) for c in range(len(g[0]) - 2)),
  "Try every top-left corner; seven cells per hourglass.", ["Arrays"])

Q(M, "diagonal-traverse", "Diagonal Traverse", "Medium", "findDiagonalOrder(mat: int[][]) -> int[]",
  "Return all elements in zigzag diagonal order: up-right along the first diagonal, then down-left along the next, alternating.",
  [C([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), C([[1, 2], [3, 4]]), C([[1, 2, 3, 4]]), C([[1], [2], [3]])],
  lambda m: [x for d in range(len(m) + len(m[0]) - 1) for x in (lambda v: v[::-1] if d % 2 == 0 else v)([m[r][d - r] for r in range(len(m)) if 0 <= d - r < len(m[0])])],
  "Cells on diagonal d have r + c = d; reverse every even diagonal.", ["Simulation"])

Q(M, "rotation-equal", "Determine Whether Matrix Can Be Obtained By Rotation", "Easy", "findRotation(mat: int[][], target: int[][]) -> boolean",
  "Return true if rotating the square matrix mat by some multiple of 90 degrees gives target.",
  [C([[0, 1], [1, 0]], [[1, 0], [0, 1]]), C([[0, 1], [1, 1]], [[1, 0], [0, 1]]), C([[0, 0, 0], [0, 1, 0], [1, 1, 1]], [[1, 1, 1], [0, 1, 0], [0, 0, 0]]), C([[1]], [[1]])],
  lambda m, t: any(reduce(lambda a, _: [list(r) for r in zip(*a[::-1])], range(k), m) == t for k in range(4)), "Rotate up to three times and compare after each.", ["Arrays"])

Q(M, "count-square-submatrices", "Count Square Submatrices with All Ones", "Medium", "countSquares(matrix: int[][]) -> int",
  "matrix is binary. Return how many square submatrices consist entirely of 1s.",
  [C([[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]]), C([[1, 0, 1], [1, 1, 0], [1, 1, 0]]), C([[1]]), C([[rng.randint(0, 1) for _ in range(6)] for _ in range(5)])],
  lambda m: sum(_sq_dp(m)[r][c] for r in range(len(m)) for c in range(len(m[0]))), "dp[r][c] = 1 + min(up, left, up-left) for a 1: it's both the largest square there and how many end there.", ["Dynamic Programming"])

Q(M, "maximal-square", "Maximal Square", "Medium", "maximalSquare(matrix: int[][]) -> int",
  "matrix is binary. Return the area of the largest square containing only 1s.",
  [C([[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]), C([[0, 1], [1, 0]]), C([[0]]), C([[rng.randint(0, 1) for _ in range(6)] for _ in range(6)])],
  lambda m: max(max(r) for r in _sq_dp(m)) ** 2, "Same dp as counting squares; answer is (max dp)^2.", ["Dynamic Programming"])

Q(M, "shift-2d-grid", "Shift 2D Grid", "Easy", "shiftGrid(grid: int[][], k: int) -> int[][]",
  "Shift every element one step to the right k times; the last element of a row moves to the next row's start, and the bottom-right moves to the top-left. Return the grid.",
  [C([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1), C([[3, 8, 1, 9], [19, 7, 2, 5], [4, 6, 11, 10], [12, 0, 21, 13]], 4), C([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 9), C([[1]], 100)],
  lambda g, k: (lambda f, c: [f[i * c:(i + 1) * c] for i in range(len(g))])((lambda f: f[-(k % len(f)):] + f[:-(k % len(f))] if k % len(f) else f)([x for r in g for x in r]), len(g[0])),
  "Flatten conceptually: the element at index i moves to (i + k) % (m * n).", ["Arrays", "Simulation"])

Q(M, "largest-local-values", "Largest Local Values in a Matrix", "Easy", "largestLocal(grid: int[][]) -> int[][]",
  "For an n x n grid, return an (n - 2) x (n - 2) matrix whose [i][j] is the largest value in the 3 x 3 block starting at grid[i][j].",
  [C([[9, 9, 8, 1], [5, 6, 2, 6], [8, 2, 6, 4], [6, 2, 2, 2]]), C([[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 2, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]), C(rm(5, 5, 1, 99))],
  lambda g: [[max(g[r][c] for r in range(i, i + 3) for c in range(j, j + 3)) for j in range(len(g) - 2)] for i in range(len(g) - 2)], "Brute force over each 3 x 3 block is fine at this size.", ["Arrays"])

Q(M, "ones-minus-zeros", "Difference Between Ones and Zeros in Row and Column", "Medium", "onesMinusZeros(grid: int[][]) -> int[][]",
  "grid is binary. diff[i][j] = onesRow_i + onesCol_j - zerosRow_i - zerosCol_j. Return diff.",
  [C([[0, 1, 1], [1, 0, 1], [0, 0, 1]]), C([[1, 1, 1], [1, 1, 1]]), C([[0]]), C([[rng.randint(0, 1) for _ in range(4)] for _ in range(3)])],
  lambda g: [[2 * sum(g[i]) - len(g[0]) + 2 * sum(r[j] for r in g) - len(g) for j in range(len(g[0]))] for i in range(len(g))],
  "Precompute ones per row and per column; zeros are length minus ones.", ["Arrays"])

Q(M, "projection-area", "Projection Area of 3D Shapes", "Easy", "projectionArea(grid: int[][]) -> int",
  "grid[i][j] is a tower of cubes. Return the total area of the shadows seen from the top, the front and the side.",
  [C([[1, 2], [3, 4]]), C([[2]]), C([[1, 0], [0, 2]]), C(rm(3, 3, 0, 5))],
  lambda g: sum(x > 0 for r in g for x in r) + sum(map(max, g)) + sum(map(max, zip(*g))), "Top: non-zero cells. Front: column maxima. Side: row maxima.", ["Math", "Geometry"])

Q(M, "score-after-flipping", "Score After Flipping Matrix", "Medium", "matrixScore(grid: int[][]) -> int",
  "grid is binary. A move flips an entire row or column. Each row is read as a binary number. Return the highest possible sum of these numbers.",
  [C([[0, 0, 1, 1], [1, 0, 1, 0], [1, 1, 0, 0]]), C([[0]]), C([[1, 1], [0, 1]]), C([[rng.randint(0, 1) for _ in range(5)] for _ in range(4)])], lambda g: _flip_score(g),
  "Make every row start with 1, then flip any column where 1s are the minority.", ["Greedy", "Bit Manipulation"])

Q(M, "spiral-matrix-iii", "Spiral Matrix III", "Medium", "spiralMatrixIII(rows: int, cols: int, rStart: int, cStart: int) -> int[][]",
  "Starting at (rStart, cStart) facing east, walk a clockwise spiral that grows outward (it may leave the grid and come back). Return the coordinates of every grid cell in the order you visit them.",
  [C(1, 4, 0, 0), C(5, 6, 1, 4), C(2, 2, 1, 1), C(3, 3, 1, 1)], lambda R, Cc, r, c: _spiral3(R, Cc, r, c),
  "Step lengths go 1, 1, 2, 2, 3, 3, ... turning right after each run; record cells inside the grid.", ["Simulation"])

Q(M, "check-row-col-all-numbers", "Check if Every Row and Column Contains All Numbers", "Easy", "checkValid(matrix: int[][]) -> boolean",
  "An n x n matrix is valid if every row and every column contains all integers 1..n. Return whether it is valid.",
  [C([[1, 2, 3], [3, 1, 2], [2, 3, 1]]), C([[1, 1, 1], [1, 2, 3], [1, 2, 3]]), C([[1]]), C([[2, 2], [1, 1]])],
  lambda m: all(set(r) == set(range(1, len(m) + 1)) for r in m) and all(set(c) == set(range(1, len(m) + 1)) for c in zip(*m)),
  "A set (or boolean array) per row and per column.", ["Hash Set"])


def _spiral_gen(n):
    m = [[0] * n for _ in range(n)]
    r = c = 0
    dr, dc = 0, 1
    for v in range(1, n * n + 1):
        m[r][c] = v
        nr, nc = r + dr, c + dc
        if not (0 <= nr < n and 0 <= nc < n and m[nr][nc] == 0):
            dr, dc = dc, -dr
        r, c = r + dr, c + dc
    return m


def _sq_dp(m):
    dp = [[0] * len(m[0]) for _ in m]
    for r in range(len(m)):
        for c in range(len(m[0])):
            if m[r][c]:
                dp[r][c] = 1 + (min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]) if r and c else 0)
    return dp


def _flip_score(g):
    g = [r[:] if r[0] else [1 - x for x in r] for r in g]
    total = 0
    for c in range(len(g[0])):
        ones = sum(r[c] for r in g)
        total += max(ones, len(g) - ones) << (len(g[0]) - 1 - c)
    return total


def _spiral3(R, Cc, r, c):
    out = [[r, c]]
    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    step, d = 1, 0
    while len(out) < R * Cc:
        for _ in range(2):
            for _ in range(step):
                r, c = r + dirs[d][0], c + dirs[d][1]
                if 0 <= r < R and 0 <= c < Cc:
                    out.append([r, c])
            d = (d + 1) % 4
        step += 1
    return out
