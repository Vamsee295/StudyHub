with open(r'x:\Project-Buildings\StudyHub\frontend\lib\data\dsaCatalog_new.ts', 'r', encoding='utf-8') as f:
    content = f.read()

stages = '''export const DSA_STAGES = [
  "ARRAYS",
  "STRINGS",
  "HASHMAP / HASHSET",
  "TWO POINTERS",
  "SLIDING WINDOW",
  "PREFIX SUM",
  "SORTING",
  "BINARY SEARCH",
  "LINKED LIST",
  "STACK",
  "QUEUE / DEQUE",
  "RECURSION",
  "BINARY TREE",
  "BINARY SEARCH TREE",
  "HEAP / PRIORITY QUEUE",
  "GREEDY",
  "GRAPH BFS / DFS",
  "TOPOLOGICAL SORT",
  "SHORTEST PATH",
  "UNION FIND",
  "DYNAMIC PROGRAMMING",
  "BIT MANIPULATION",
  "MATRIX",
  "INTERVALS",
  "TRIE",
  "SEGMENT TREE",
  "BACKTRACKING",
];'''

content = content.replace('export const dsaCatalog', stages + '\n\nexport const dsaCatalog')

with open(r'x:\Project-Buildings\StudyHub\frontend\lib\data\dsaCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(content)
