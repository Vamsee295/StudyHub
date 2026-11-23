import { Course } from './types';
import { withTheory } from './utils';
import { dsaBasicsTheory } from './dsa-theory-basics';
import { dsaLinearTheory } from './dsa-theory-linear';
import { dsaNonlinearTheory } from './dsa-theory-nonlinear';
import { dsaParadigmsTheory } from './dsa-theory-paradigms';
import { dsaFundamentalsLessons, arrayLessons } from './dsa-content-basics';
import { stringLessons, linkedListLessons, stackLessons, queueLessons } from './dsa-content-linear';
import { hashingLessons, treeLessons, heapLessons, graphLessons } from './dsa-content-nonlinear';
import { recursionBacktrackingLessons, dynamicProgrammingLessons } from './dsa-content-paradigms';

const rawDsaCourse: Course = {
  id: "course-dsa",
  slug: "dsa",
  title: "Data Structures & Algorithms",
  description: "The core of software engineering interviews. Master arrays, trees, graphs, and dynamic programming.",
  category: "Placement",
  icon: "Binary",
  displayOrder: 4,
  modules: [
    {
      id: "dsa-mod-1",
      slug: "dsa-fundamentals",
      title: "DSA Fundamentals",
      description: "Big-O notation, time and space complexity, and algorithmic thinking.",
      difficulty: "Beginner",
      estimatedMinutes: dsaFundamentalsLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: dsaFundamentalsLessons
    },
    {
      id: "dsa-mod-2",
      slug: "arrays",
      title: "Arrays",
      description: "1D/2D arrays, sliding window, and two-pointer techniques.",
      difficulty: "Intermediate",
      estimatedMinutes: 155,
      lessons: [
        {
          id: "two-sum-lesson",
          slug: "two-sum-lesson",
          title: "Two Sum Problem: Finding Pairs That Equal a Target",
          description: "Master the classic Two Sum problem and learn hash map-based optimization techniques.",
          estimatedMinutes: 25,
          content: {
            sections: [
              {
                type: "text",
                title: "Learning Objectives",
                content: "After completing this lesson, you will be able to:\n\n1. Explain the Two Sum problem and its variations\n2. Implement a brute force solution and analyze its inefficiency\n3. Optimize the solution using hash maps for O(n) time complexity\n4. Handle edge cases like duplicates, negative numbers, and large inputs\n5. Explain when to use the Two Sum pattern in real-world scenarios\n6. Solve common interview variations of the Two Sum problem"
              },
              {
                type: "prerequisites",
                links: [
                  {
                    title: "DSA Fundamentals",
                    slug: "dsa-fundamentals"
                  },
                  {
                    title: "Arrays Basics",
                    slug: "arrays"
                  }
                ]
              },
              {
                type: "text",
                title: "What Is the Two Sum Problem?",
                content: "The Two Sum problem is a classic coding interview question that asks:\n\n\"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\"\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\n- Input: nums = [2, 7, 11, 15], target = 9\n- Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)\n\nDespite its simple statement, this problem teaches important concepts about:\n- Time-space tradeoffs\n- Using hash maps for efficient lookups\n- Handling edge cases in array indices vs values\n- Writing clean, efficient code under constraints"
              },
              {
                type: "think",
                title: "Think About It: Real-World Analogies",
                question: "Can you think of real-world scenarios where you need to find two items that combine to reach a specific total?",
                answerReveal: "Many real-world problems reduce to Two Sum:\n\n1. **Financial Transactions**: Find two expense amounts that sum to a reimbursement total\n2. **Chemistry**: Find two chemicals whose molecular weights sum to a target compound weight\n3. **Inventory Management**: Find two items whose combined weight matches a shipping constraint\n4. **Game Development**: Find two power-ups whose combined strength equals a required threshold\n5. **Architecture**: Find two material lengths that sum to a required beam length\n\nThe key insight is recognizing when you need to find complementary pairs that sum to a specific value."
              },
              {
                type: "text",
                title: "Brute Force Approach: O(n²) Time",
                content: "The most straightforward solution checks every possible pair:\n\n1. For each element at index i\n2.   For each element at index j (where j > i)\n3.     Check if nums[i] + nums[j] == target\n4.     If yes, return [i, j]\n\nThis approach examines all n*(n-1)/2 possible pairs.",
                code: "public int[] twoSumBruteForce(int[] nums, int target) {\n    for (int i = 0; i < nums.length; i++) {\n        for (int j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] == target) {\n                return new int[]{i, j};\n            }\n        }\n    }\n    throw new IllegalArgumentException(\"No two sum solution\");\n}"
              },
              {
                type: "dryRun",
                title: "Execution Trace: Brute Force on [2,7,11,15], target=9",
                iterations: [
                  {
                    "step": 1,
                    "variables": {
                      "i": "0 (nums[i]=2)",
                      "j": "1 (nums[j]=7)",
                      "sum": "2 + 7 = 9",
                      "found": "YES"
                    },
                    "description": "First outer loop (i=0), first inner loop (j=1): 2+7=9 ✓"
                  }
                ]
              },
              {
                type: "text",
                title: "Why Brute Force Is Insufficient",
                content: "While the brute force solution works, it has significant limitations:\n\n**Time Complexity**: O(n²) - becomes very slow with large arrays\n- n = 1,000 → ~500,000 operations\n- n = 10,000 → ~50,000,000 operations\n- n = 100,000 → ~5,000,000,000 operations\n\n**Interview Implications**:\n- Most companies expect better than O(n²) for this problem\n- O(n²) solutions often fail on larger test cases\n- Demonstrates lack of optimization thinking\n\nThe key insight for optimization is: \"For each number, I need to find its complement (target - number).\" If I can look up complements quickly, I can solve this in linear time."
              },
              {
                type: "text",
                title: "Optimized Approach: Hash Map (O(n) Time)",
                content: "The optimized solution uses a hash map to store numbers we've seen so far, allowing O(1) lookup for complements:\n\n1. Create an empty hash map to store {number → index}\n2. Iterate through the array once:\n   a. For current number num at index i:\n   b. Calculate complement = target - num\n   c. If complement exists in hash map, return [map[complement], i]\n   d. Otherwise, store num in hash map with its index\n3. If no solution found, throw an exception\n\nThis works because when we see num, we check if we've already seen its complement.",
                code: "public int[] twoSumOptimized(int[] nums, int target) {\n    Map<Integer, Integer> numToIndex = new HashMap<>();\n    \n    for (int i = 0; i < nums.length; i++) {\n        int num = nums[i];\n        int complement = target - num;\n        \n        if (numToIndex.containsKey(complement)) {\n            return new int[]{numToIndex.get(complement), i};\n        }\n        \n        numToIndex.put(num, i);\n    }\n    \n    throw new IllegalArgumentException(\"No two sum solution\");\n}"
              },
              {
                type: "dryRun",
                title: "Execution Trace: Hash Map on [2,7,11,15], target=9",
                iterations: [
                  {
                    "step": 1,
                    "variables": {
                      "i": "0",
                      "num": "2",
                      "complement": "9-2=7",
                      "map": "{}",
                      "foundInMap": "false",
                      "action": "Store 2→0"
                    },
                    "description": "First iteration: looking for 7, not found, store 2 at index 0"
                  },
                  {
                    "step": 2,
                    "variables": {
                      "i": "1",
                      "num": "7",
                      "complement": "9-7=2",
                      "map": "{2→0}",
                      "foundInMap": "true",
                      "action": "Return [0,1]"
                    },
                    "description": "Second iteration: looking for 2, found at index 0, return [0,1]"
                  }
                ]
              },
              {
                type: "code",
                title: "Complete Solution with Edge Case Handling",
                code: "public int[] twoSum(int[] nums, int target) {\n    // Handle null or too-small arrays\n    if (nums == null || nums.length < 2) {\n        throw new IllegalArgumentException(\"Array must have at least two elements\");\n    }\n    \n    Map<Integer, Integer> numToIndex = new HashMap<>();\n    \n    for (int i = 0; i < nums.length; i++) {\n        int num = nums[i];\n        int complement = target - num;\n        \n        // Check if we've seen the complement\n        if (numToIndex.containsKey(complement)) {\n            return new int[]{numToIndex.get(complement), i};\n        }\n        \n        // Store current number for future lookups\n        // Only store if not already present (handles duplicates correctly)\n        if (!numToIndex.containsKey(num)) {\n            numToIndex.put(num, i);\n        }\n    }\n    \n    throw new IllegalArgumentException(\"No two sum solution exists\");\n}"
              },
              {
                type: "warning",
                title: "Common Mistakes and Edge Cases",
                items: [
                  "Using the same element twice: checking if complement == num without ensuring different indices\n      Solution: Check map before adding current element, or verify indices are different\n\n      Overwriting indices in hash map with duplicates: [3,3], target=6 should return [0,1]\n      Solution: Only store first occurrence, or check before overwriting\n\n      Not handling negative numbers: [-1, -2, -3], target=-3 should work fine\n      Solution: Hash maps handle negatives naturally - no special code needed\n\n      Integer overflow: Very large numbers could cause target-num to overflow\n      Solution: In Java, integer overflow wraps around - but problem constraints usually prevent this\n\n      Returning values instead of indices: Problem asks for indices, not the numbers themselves\n      Solution: Always return indices as specified\n\n      Empty or single-element arrays: Should throw exception or return empty per problem constraints\n      Solution: Validate input upfront"
                ]
              },
              {
                type: "text",
                title: "When to Use the Two Sum Pattern",
                content: "The Two Sum pattern appears whenever you need to find two items that combine to reach a specific target. Common variations:\n\n1. **Two Sum Variants**:\n   - Two Sum II: Input array is sorted (use two pointers)\n   - Two Sum III: Design data structure for streaming numbers\n   - Three Sum: Find three numbers that sum to target\n   - Four Sum: Find four numbers that sum to target\n\n2. **Applications**:\n   - **Financial**: Finding transaction pairs that sum to a specific amount\n   - **Data Analysis**: Finding complementary measurements\n   - **Computer Graphics**: Finding texture coordinates or vertex pairs\n   - **Bioinformatics**: Finding base pairs or amino acid combinations\n   - **Caching**: Finding cache entries that together meet a size requirement\n\n3. **Interview Signals**:\n   - Any problem mentioning \"pair\", \"two numbers\", \"sum to target\"\n   - Problems about finding relationships between two elements\n   - Optimization problems where brute force would be O(n²)\n\nWhen you see these patterns, think: \"Can I use a hash map to look up complements in O(1) time?\""
              },
              {
                type: "table",
                title: "Comparison: Brute Force vs Hash Map Approach",
                headers: ["Aspect", "Brute Force (O(n²))", "Hash Map (O(n))"],
                rows: [
                  ["Time Complexity", "O(n²)", "O(n)"],
                  ["Space Complexity", "O(1)", "O(n)"],
                  ["Best Case", "O(1) - first pair matches", "O(n) - still need to build map"],
                  ["Average Case", "O(n²)", "O(n)"],
                  ["Worst Case", "O(n²)", "O(n)"],
                  ["When to Use", "Only for very small arrays (n < 100)", "Almost always preferred"],
                  ["Interview Expectation", "Usually insufficient", "Expected solution"],
                  ["Handles Duplicates", "Yes, naturally", "Yes, with proper implementation"],
                  ["Requires Sorted Input", "No", "No (works on unsorted arrays)"]
                ]
              },
              {
                type: "text",
                title: "Handling Duplicates Correctly",
                content: "Duplicate values require special attention:\n\nExample: nums = [3, 3], target = 6 should return [0, 1]\n\n**Incorrect approach**:\n```\nif (map.containsKey(complement)) {\n    return [map.get(complement), i];\n}\nmap.put(num, i); // This overwrites the first 3's index!\n```\n\nOn second iteration (i=1, num=3):\n- complement = 3\n- map currently has {3→0} from first iteration\n- map.containsKey(3) is true\n- Returns [0, 1] ✓\n\nActually, this works correctly because we CHECK the map BEFORE adding the current element!\n\nThe key is: **always check for complement before adding current number to map**.\n\nThis ensures:\n1. We don't use the same element twice\n2. With duplicates like [3,3], we find the pair correctly\n3. We preserve the earliest index for each number (doesn't matter for this problem)"
              },
              {
                type: "interviewTraps",
                title: "Interview Questions & Common Traps",
                traps: [
                  {
                    "question": "What is the time complexity of the Two Sum solution?",
                    "trap": "Just saying \"O(n)\" without explaining why",
                    "solution": "O(n) time complexity because:\n- We iterate through the array exactly once: O(n)\n- Each hash map operation (containsKey, get, put) is O(1) average case\n- Total: O(n) × O(1) = O(n)\n\nSpace complexity is O(n) because in the worst case, we might store every element in the hash map before finding the solution."
                  },
                  {
                    "question": "How would you handle the case where there are multiple valid pairs?",
                    "trap": "Saying you'd return all pairs or getting confused about requirements",
                    "solution": "The classic Two Sum problem states: \"You may assume that each input would have exactly one solution.\"\n\nIf the interviewer asks about multiple pairs:\n1. Clarify the requirements: Do they want all pairs, just one pair, or the \"best\" pair?\n2. For all pairs: Continue iteration after finding a pair (don't return early)\n3. For counting pairs: Use a counter instead of returning indices\n4. For variations like \"closest to target\": Track minimum difference during iteration\n\nAlways clarify requirements before solving variations."
                  },
                  {
                    "question": "What if the array is already sorted? Can we do better?",
                    "trap": "Saying hash map is still best or missing the two-pointer optimization",
                    "solution": "If the array is sorted, we can use the two-pointer technique for O(n) time and O(1) space:\n\n1. Initialize left pointer at start, right pointer at end\n2. While left < right:\n   a. Calculate sum = nums[left] + nums[right]\n   b. If sum == target: return [left, right]\n   c. If sum < target: increment left (need larger sum)\n   d. If sum > target: decrement right (need smaller sum)\n\nThis achieves O(n) time with O(1) space - better than hash map's O(n) space!\n\nTwo Sum II on LeetCode specifically tests this variation."
                  },
                  {
                    "question": "How does this relate to hash map usage in real systems?",
                    "trap": "Giving a generic answer about hash maps being useful",
                    "solution": "The Two Sum pattern teaches practical hash map applications:\n\n1. **Caching Systems**: Find cache entries that together meet size/memory constraints\n2. **Database Queries**: Find complementary values in large datasets\n3. **Networking**: Find packet pairs that sum to specific sequence numbers\n4. **Trading Systems**: Find complementary buy/sell orders\n5. **Bioinformatics**: Find base pairs that sum to specific molecular weights\n\nKey insight: Hash maps excel when you need to answer \"Have I seen X before?\" or \"What index did I see value Y at?\" questions - exactly what Two Sum requires."
                  }
                ]
              },
              {
                "type": "practice",
                "title": "Practice Problems",
                "problems": [
                  {
                    "id": "twosum-practice-1",
                    "title": "Two Sum II - Input Array Sorted",
                    "difficulty": "Easy"
                  },
                  {
                    "id": "twosum-practice-2",
                    "title": "Three Sum",
                    "difficulty": "Medium"
                  },
                  {
                    "id": "twosum-practice-3",
                    "title": "Four Sum",
                    "difficulty": "Medium"
                  },
                  {
                    "id": "twosum-practice-4",
                    "title": "Two Sum III - Data Structure Design",
                    "difficulty": "Hard"
                  }
                ]
              },
              {
                "type": "takeaways",
                "title": "Key Takeaways",
                "items": [
                  "Two Sum teaches the power of hash maps for O(n) lookup problems",
                  "Always check for complement BEFORE adding current element to avoid self-pairing",
                  "Brute force O(n²) is usually insufficient for interview expectations",
                  "Hash map solution: O(n) time, O(n) space - optimal for unsorted arrays",
                  "If array is sorted, two-pointer technique gives O(n) time, O(1) space",
                  "The pattern extends to Three Sum, Four Sum, and other k-sum problems",
                  "Always validate input and clarify requirements (single vs multiple solutions)",
                  "Look for Two Sum patterns in real-world problems involving complementary pairs"
                ]
              },
              {
                "type": "list",
                title: "Revision Checklist",
                items: [
                  "[ ] I can explain the Two Sum problem and why it's important in interviews",
                  "[ ] I can implement the brute force solution and explain its inefficiency",
                  "[ ] I can implement the optimized hash map solution with proper edge case handling",
                  "[ ] I can explain when to use hash map vs two-pointer approach",
                  "[ ] I can handle duplicates correctly in Two Sum solutions",
                  "[ ] I can solve common variations like Two Sum II (sorted array)",
                  "[ ] I can explain the time and space complexity of different approaches",
                  "[ ] I can identify real-world applications of the Two Sum pattern"
                ]
              },
              {
                "type": "text",
                title: "Next Topic: Sliding Window Technique",
                content: "Now that you've mastered the Two Sum problem and hash map optimization, the next technique to learn is the sliding window. This powerful pattern is useful for subarray/substring problems where you need to find contiguous sequences that meet certain criteria.\n\nIn the sliding window section, you'll learn:\n- How sliding window reduces time complexity from O(n²) to O(n)\n- When to use sliding window vs other techniques\n- Classic problems: maximum subarray, longest substring without repeating characters\n- How to handle variable-size windows\n- Common variations and interview problems"
              }
            ]
          }
        },
        ...arrayLessons
      ]
    },
    {
      id: "dsa-mod-3",
      slug: "strings",
      title: "Strings",
      description: "String manipulation, pattern matching, and anagrams.",
      difficulty: "Intermediate",
      estimatedMinutes: stringLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: stringLessons
    },
    {
      id: "dsa-mod-4",
      slug: "linked-list",
      title: "Linked List",
      description: "Singly, doubly, and circular linked lists implementations and problems.",
      difficulty: "Intermediate",
      estimatedMinutes: linkedListLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: linkedListLessons
    },
    {
      id: "dsa-mod-5",
      slug: "stack",
      title: "Stack",
      description: "LIFO principle, valid parentheses, and monotonic stacks.",
      difficulty: "Intermediate",
      estimatedMinutes: stackLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: stackLessons
    },
    {
      id: "dsa-mod-6",
      slug: "queue",
      title: "Queue",
      description: "FIFO principle, standard queues, and circular queues.",
      difficulty: "Intermediate",
      estimatedMinutes: queueLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: queueLessons
    },
    {
      id: "dsa-mod-7",
      slug: "hashing",
      title: "Hashing",
      description: "Hash maps, hash sets, and solving problems in O(1) time.",
      difficulty: "Intermediate",
      estimatedMinutes: hashingLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: hashingLessons
    },
    {
      id: "dsa-mod-8",
      slug: "trees",
      title: "Trees",
      description: "Binary Trees, BSTs, traversals (inorder, preorder, postorder), and views.",
      difficulty: "Advanced",
      estimatedMinutes: treeLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: treeLessons
    },
    {
      id: "dsa-mod-9",
      slug: "heaps",
      title: "Heaps / Priority Queues",
      description: "Min-heap, max-heap, and the Top-K pattern.",
      difficulty: "Advanced",
      estimatedMinutes: heapLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: heapLessons
    },
    {
      id: "dsa-mod-10",
      slug: "graphs",
      title: "Graphs",
      description: "BFS, DFS, topological sort, and shortest path algorithms.",
      difficulty: "Advanced",
      estimatedMinutes: graphLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: graphLessons
    },
    {
      id: "dsa-mod-11",
      slug: "recursion-and-backtracking",
      title: "Recursion & Backtracking",
      description: "Solving problems by breaking them down into smaller subproblems.",
      difficulty: "Advanced",
      estimatedMinutes: recursionBacktrackingLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: recursionBacktrackingLessons
    },
    {
      id: "dsa-mod-12",
      slug: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Memoization, tabulation, knapsack, and LCS patterns.",
      difficulty: "Advanced",
      estimatedMinutes: dynamicProgrammingLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
      lessons: dynamicProgrammingLessons
    }
  ]
};

const dsaTheory = { ...dsaBasicsTheory, ...dsaLinearTheory, ...dsaNonlinearTheory, ...dsaParadigmsTheory };

export const dsaCourse: Course = {
  ...rawDsaCourse,
  modules: rawDsaCourse.modules.map((m) => ({ ...m, lessons: withTheory(m.lessons, dsaTheory) })),
};
