import { FunctionSignature, TestCase } from "../execution/executionTypes";
import { dsaCatalog } from "../data/dsaCatalog";

export interface ProblemDefinition {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  companies?: string[];
  acceptance?: string;
  description: string[];
  objective?: string;
  constraints: string[];
  hint?: string;
  starterCode?: Record<string, string>;
  functionSignature: FunctionSignature;
  visibleTests: TestCase[];
  hiddenTests: TestCase[];
}

export function generateStarterCode(sig: FunctionSignature, language: string = "java"): string {
  if (language === "python") {
    const params = sig.parameters.map((p) => p.name).join(", ");
    return `class ${sig.className}:\n    def ${sig.methodName}(self, ${params}):\n        # Write your solution here\n        pass\n`;
  }
  if (language === "cpp") {
    const typeMapping: Record<string, string> = {
      "int": "int",
      "int[]": "vector<int>&",
      "string": "string",
      "boolean": "bool",
    };
    const returnType = typeMapping[sig.returnType] || sig.returnType;
    const params = sig.parameters.map((p) => `${typeMapping[p.type] || p.type} ${p.name}`).join(", ");
    return `class ${sig.className} {\npublic:\n    ${returnType} ${sig.methodName}(${params}) {\n        // Write your solution here\n        \n    }\n};`;
  }
  
  // default to Java
  const params = sig.parameters.map((p) => `${p.type} ${p.name}`).join(", ");
  return `class ${sig.className} {
    public ${sig.returnType} ${sig.methodName}(${params}) {
        // Write your solution here
        
    }
}`;
}

export const problems: Record<string, ProblemDefinition> = {
  "1": {
    id: "1",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    companies: ["Amazon", "Google", "Meta", "Apple", "Microsoft"],
    acceptance: "52.8%",
    description: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      "You can return the answer in any order."
    ],
    objective: "You must solve this with O(n) runtime complexity using a Hash Map.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hint: "A brute force approach checks all pairs in O(n^2). Can you use a hash map to look up if the complement (target - nums[i]) has already been seen in O(1) time?",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "twoSum",
      returnType: "int[]",
      parameters: [
        { name: "nums", type: "int[]" },
        { name: "target", type: "int" }
      ]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1]
      },
      {
        id: "case-2",
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2]
      },
      {
        id: "case-3",
        input: { nums: [3, 3], target: 6 },
        expectedOutput: [0, 1]
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums: [1, 5, 8, 3], target: 8 },
        expectedOutput: [1, 3]
      },
      {
        id: "hidden-2",
        input: { nums: [3, 2, 3], target: 6 },
        expectedOutput: [0, 2]
      }
    ]
  },

  "2": {
    id: "2",
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math", "Recursion"],
    companies: ["Amazon", "Microsoft", "Meta", "Google"],
    acceptance: "41.2%",
    description: [
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
      "Add the two numbers and return the sum as a linked list.",
      "You may assume the two numbers do not contain any leading zero, except the number 0 itself."
    ],
    objective: "Traverse both lists simultaneously, maintaining a carry variable, in O(max(m, n)) time.",
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    hint: "Simulate column-by-column elementary addition from right to left, keeping track of the carry at each step.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "addTwoNumbers",
      returnType: "ListNode",
      parameters: [
        { name: "l1", type: "ListNode" },
        { name: "l2", type: "ListNode" }
      ]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { l1: [2, 4, 3], l2: [5, 6, 4] },
        expectedOutput: [7, 0, 8]
      },
      {
        id: "case-2",
        input: { l1: [0], l2: [0] },
        expectedOutput: [0]
      },
      {
        id: "case-3",
        input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] },
        expectedOutput: [8, 9, 9, 9, 0, 0, 0, 1]
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { l1: [2, 4, 9], l2: [5, 6, 4] },
        expectedOutput: [7, 0, 4, 1]
      }
    ]
  },

  "3": {
    id: "3",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["Sliding Window", "Hash Table", "String"],
    companies: ["Amazon", "Google", "Bloomberg", "Apple", "Microsoft"],
    acceptance: "34.5%",
    description: [
      "Given a string s, find the length of the longest substring without repeating characters."
    ],
    objective: "Implement an O(n) sliding window approach keeping track of the last seen index of each character.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    hint: "Use a sliding window with two pointers (left and right). Use a map or array of size 128 to track the most recent index of each character.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "lengthOfLongestSubstring",
      returnType: "int",
      parameters: [{ name: "s", type: "String" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { s: "abcabcbb" },
        expectedOutput: 3
      },
      {
        id: "case-2",
        input: { s: "bbbbb" },
        expectedOutput: 1
      },
      {
        id: "case-3",
        input: { s: "pwwkew" },
        expectedOutput: 3
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { s: "" },
        expectedOutput: 0
      },
      {
        id: "hidden-2",
        input: { s: "au" },
        expectedOutput: 2
      }
    ]
  },

  "4": {
    id: "4",
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Binary Search", "Divide & Conquer", "Arrays"],
    companies: ["Google", "Microsoft", "Amazon", "Goldman Sachs"],
    acceptance: "38.1%",
    description: [
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      "The overall run time complexity should be O(log (m+n))."
    ],
    objective: "You must achieve O(log(min(m, n))) runtime complexity using binary search on array partitions.",
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    hint: "Perform binary search on the smaller array to partition both arrays such that all elements on the left side are <= all elements on the right side.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "findMedianSortedArrays",
      returnType: "double",
      parameters: [
        { name: "nums1", type: "int[]" },
        { name: "nums2", type: "int[]" }
      ]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums1: [1, 3], nums2: [2] },
        expectedOutput: 2.0
      },
      {
        id: "case-2",
        input: { nums1: [1, 2], nums2: [3, 4] },
        expectedOutput: 2.5
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums1: [0, 0], nums2: [0, 0] },
        expectedOutput: 0.0
      },
      {
        id: "hidden-2",
        input: { nums1: [], nums2: [1] },
        expectedOutput: 1.0
      }
    ]
  },

  "15": {
    id: "15",
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    companies: ["Amazon", "Apple", "Meta", "Google"],
    acceptance: "33.4%",
    description: [
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      "Notice that the solution set must not contain duplicate triplets."
    ],
    objective: "Sort the array and use a two-pointer approach for each element to achieve O(n^2) runtime.",
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    hint: "Sort the array first. Iterate through the array with index i, and use two pointers (left and right) to find pairs that sum to -nums[i]. Skip duplicate elements.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "threeSum",
      returnType: "int[][]",
      parameters: [{ name: "nums", type: "int[]" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [-1, 0, 1, 2, -1, -4] },
        expectedOutput: [[-1, -1, 2], [-1, 0, 1]]
      },
      {
        id: "case-2",
        input: { nums: [0, 1, 1] },
        expectedOutput: []
      },
      {
        id: "case-3",
        input: { nums: [0, 0, 0] },
        expectedOutput: [[0, 0, 0]]
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums: [-2, 0, 1, 1, 2] },
        expectedOutput: [[-2, 0, 2], [-2, 1, 1]]
      }
    ]
  },

  "20": {
    id: "20",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    companies: ["Amazon", "Microsoft", "TCS", "Google", "Meta"],
    acceptance: "40.8%",
    description: [
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      "An input string is valid if: Open brackets must be closed by the same type of brackets, open brackets must be closed in the correct order, and every close bracket has a corresponding open bracket of the same type."
    ],
    objective: "You must solve this with O(n) runtime complexity and O(n) space using a Stack.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    hint: "Use a Stack. Push opening brackets onto the stack. When encountering a closing bracket, check if the top of the stack has the matching opening bracket.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "isValid",
      returnType: "boolean",
      parameters: [{ name: "s", type: "String" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { s: "()" },
        expectedOutput: true
      },
      {
        id: "case-2",
        input: { s: "()[]{}" },
        expectedOutput: true
      },
      {
        id: "case-3",
        input: { s: "(]" },
        expectedOutput: false
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { s: "([])" },
        expectedOutput: true
      },
      {
        id: "hidden-2",
        input: { s: "([)]" },
        expectedOutput: false
      }
    ]
  },

  "21": {
    id: "21",
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    companies: ["Amazon", "Google", "Microsoft", "Apple"],
    acceptance: "63.2%",
    description: [
      "You are given the heads of two sorted linked lists list1 and list2.",
      "Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.",
      "Return the head of the merged linked list."
    ],
    objective: "Merge two sorted lists in O(n + m) time using a dummy head node.",
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    hint: "Create a dummy node and attach the smaller node between list1 and list2 at each step, advancing the respective pointer.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "mergeTwoLists",
      returnType: "ListNode",
      parameters: [
        { name: "list1", type: "ListNode" },
        { name: "list2", type: "ListNode" }
      ]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { list1: [1, 2, 4], list2: [1, 3, 4] },
        expectedOutput: [1, 1, 2, 3, 4, 4]
      },
      {
        id: "case-2",
        input: { list1: [], list2: [] },
        expectedOutput: []
      },
      {
        id: "case-3",
        input: { list1: [], list2: [0] },
        expectedOutput: [0]
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { list1: [2], list2: [1] },
        expectedOutput: [1, 2]
      }
    ]
  },

  "26": {
    id: "26",
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    topics: ["Arrays", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Google"],
    acceptance: "54.2%",
    description: [
      "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.",
      "Consider the number of unique elements of nums to be k. To get accepted, you need to return k."
    ],
    objective: "Modify the array in-place with O(1) extra memory using a two-pointer technique.",
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-100 <= nums[i] <= 100",
      "nums is sorted in non-decreasing order."
    ],
    hint: "Use two pointers: one slow pointer i tracking the position of unique elements, and a fast pointer j scanning through the array.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "removeDuplicates",
      returnType: "int",
      parameters: [{ name: "nums", type: "int[]" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [1, 1, 2] },
        expectedOutput: 2
      },
      {
        id: "case-2",
        input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] },
        expectedOutput: 5
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums: [1] },
        expectedOutput: 1
      },
      {
        id: "hidden-2",
        input: { nums: [1, 2, 3] },
        expectedOutput: 3
      }
    ]
  },

  "33": {
    id: "33",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topics: ["Arrays", "Binary Search"],
    companies: ["Amazon", "Google", "Microsoft"],
    acceptance: "39.8%",
    description: [
      "There is an integer array nums sorted in ascending order (with distinct values).",
      "Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]].",
      "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums."
    ],
    objective: "You must write an algorithm with O(log n) runtime complexity.",
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4"
    ],
    hint: "When you split a rotated sorted array in half, at least one half is always strictly monotonically sorted — use that to determine which side target could be in.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "search",
      returnType: "int",
      parameters: [
        { name: "nums", type: "int[]" },
        { name: "target", type: "int" }
      ]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 },
        expectedOutput: 4
      },
      {
        id: "case-2",
        input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 },
        expectedOutput: -1
      },
      {
        id: "case-3",
        input: { nums: [1], target: 0 },
        expectedOutput: -1
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums: [1, 3], target: 3 },
        expectedOutput: 1
      },
      {
        id: "hidden-2",
        input: { nums: [5, 1, 3], target: 5 },
        expectedOutput: 0
      }
    ]
  },

  "53": {
    id: "53",
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topics: ["Arrays", "Divide and Conquer", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Apple", "Microsoft"],
    acceptance: "50.4%",
    description: [
      "Given an integer array nums, find the subarray with the largest sum, and return its sum."
    ],
    objective: "Implement Kadane's Algorithm to find the maximum subarray sum in O(n) time.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    hint: "Maintain currentSum = max(nums[i], currentSum + nums[i]) and update maxSum.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "maxSubArray",
      returnType: "int",
      parameters: [{ name: "nums", type: "int[]" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        expectedOutput: 6
      },
      {
        id: "case-2",
        input: { nums: [1] },
        expectedOutput: 1
      },
      {
        id: "case-3",
        input: { nums: [5, 4, -1, 7, 8] },
        expectedOutput: 23
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums: [-1, -2, -3] },
        expectedOutput: -1
      }
    ]
  },

  "121": {
    id: "121",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Arrays", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Meta", "Goldman Sachs"],
    acceptance: "54.1%",
    description: [
      "You are given an array prices where prices[i] is the price of a given stock on the ith day.",
      "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
      "Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0."
    ],
    objective: "Track minimum price seen so far in a single pass to achieve O(n) time and O(1) space.",
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    hint: "Maintain minPrice seen so far, and at each step calculate profit = prices[i] - minPrice, updating maxProfit.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "maxProfit",
      returnType: "int",
      parameters: [{ name: "prices", type: "int[]" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { prices: [7, 1, 5, 3, 6, 4] },
        expectedOutput: 5
      },
      {
        id: "case-2",
        input: { prices: [7, 6, 4, 3, 1] },
        expectedOutput: 0
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { prices: [2, 4, 1] },
        expectedOutput: 2
      },
      {
        id: "hidden-2",
        input: { prices: [1, 2] },
        expectedOutput: 1
      }
    ]
  },

  "704": {
    id: "704",
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topics: ["Arrays", "Binary Search"],
    companies: ["Amazon", "Apple", "Google", "Microsoft"],
    acceptance: "56.8%",
    description: [
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
      "You must write an algorithm with O(log n) runtime complexity."
    ],
    objective: "Implement classic binary search with O(log n) time complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    hint: "Maintain left and right pointers. Calculate mid = left + (right - left) / 2 to prevent integer overflow.",
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName: "search",
      returnType: "int",
      parameters: [
        { name: "nums", type: "int[]" },
        { name: "target", type: "int" }
      ]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
        expectedOutput: 4
      },
      {
        id: "case-2",
        input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 },
        expectedOutput: -1
      }
    ],
    hiddenTests: [
      {
        id: "hidden-1",
        input: { nums: [5], target: 5 },
        expectedOutput: 0
      },
      {
        id: "hidden-2",
        input: { nums: [2, 5], target: 5 },
        expectedOutput: 1
      }
    ]
  }
};

export const getProblem = (id: string): ProblemDefinition | null => {
  if (problems[id]) {
    return problems[id];
  }

  // Lookup in dsaCatalog
  const numId = Number(id);
  const catalogItem = dsaCatalog.find(
    (p) => p.id === numId || p.leetcodeNumber === numId
  );

  if (!catalogItem) {
    return null;
  }

  // Generate slug
  const slug = catalogItem.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const methodName = slug.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());

  const diffCap = (catalogItem.difficulty.charAt(0).toUpperCase() +
    catalogItem.difficulty.slice(1).toLowerCase()) as "Easy" | "Medium" | "Hard";

  return {
    id: String(catalogItem.id),
    slug,
    title: catalogItem.title,
    difficulty: diffCap,
    topics: catalogItem.tags || [catalogItem.primaryTopic],
    companies: ["Amazon", "Google", "Microsoft"],
    acceptance: "48.2%",
    description: [
      catalogItem.whyThisProblem,
      `Solve the ${catalogItem.title} problem using optimal ${catalogItem.primaryTopic} algorithms.`
    ],
    objective: `Expected Time: ${catalogItem.timeComplexity}, Space: ${catalogItem.spaceComplexity}.`,
    constraints: [
      `Target time complexity: ${catalogItem.timeComplexity}`,
      `Target space complexity: ${catalogItem.spaceComplexity}`
    ],
    hint: catalogItem.patternHint,
    functionSignature: {
      language: "java",
      className: "Solution",
      methodName,
      returnType: "int",
      parameters: [{ name: "nums", type: "int[]" }]
    },
    visibleTests: [
      {
        id: "case-1",
        input: { nums: [1, 2, 3] },
        expectedOutput: 0
      }
    ],
    hiddenTests: []
  };
};
