export const featuredProblem = {
  difficulty: "Medium",
  title: "Two Sum & 3-Sum Optimal Pointer Technique",
  seenAt: ["Amazon", "Microsoft", "TCS Digital (2026)"],
  statement:
    "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and nums[i] + nums[j] + nums[k] == 0.",
  example: {
    input: "nums = [-1, 0, 1, 2, -1, -4]",
    output: "[[-1,-1,2],[-1,0,1]]",
    explanation: "The solution set must not contain duplicate triplets.",
  },
  hints: [
    {
      label: "Hint: how do you avoid duplicate triplets in O(1) extra space?",
      body: "Sort the array first, then skip past equal adjacent values as your two pointers advance: while (left < right && nums[left] === nums[left+1]) left++;",
    },
    {
      label: "Complexity & interview checklist",
      body: "Time: O(n²) — an O(n) outer loop with an O(n) two-pointer scan; sorting's O(n log n) is dominated. Space: O(1) to O(log n) depending on the sort implementation.",
    },
  ],
  code: `class Solution {
  public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] == nums[i - 1]) continue;
      int l = i + 1, r = nums.length - 1;
      while (l < r) {
        int sum = nums[i] + nums[l] + nums[r];
        if (sum == 0) {
          res.add(Arrays.asList(nums[i], nums[l], nums[r]));
          while (l < r && nums[l] == nums[l + 1]) l++;
          while (l < r && nums[r] == nums[r - 1]) r--;
          l++; r--;
        } else if (sum < 0) l++;
        else r--;
      }
    }
    return res;
  }
}`,
  runtime: "Runtime: 31 ms (beats 93.4%)",
  memory: "Memory: 48.9 MB",
};
