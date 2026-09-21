import re
import ast
import json

with open(r'x:\Project-Buildings\StudyHub\frontend\lib\data\dsaCatalog.ts', 'r', encoding='utf-8') as f:
    content = f.read()

problems = []
# Using regex to extract fields
pattern = r'\{\s*id:\s*(\d+),\s*title:\s*"([^"]+)",\s*difficulty:\s*"([^"]+)",\s*primaryTopic:\s*"([^"]+)",\s*tags:\s*(\[[^\]]+\]),\s*leetcodeUrl:\s*"([^"]+)",\s*timeComplexity:\s*"([^"]+)",\s*spaceComplexity:\s*"([^"]+)",\s*patternHint:\s*"([^"]+)",\s*description:\s*"([^"]+)"\s*\}'
for match in re.finditer(pattern, content):
    p = {
        'id': int(match.group(1)),
        'title': match.group(2),
        'difficulty': match.group(3),
        'primaryTopic': match.group(4),
        'tags': ast.literal_eval(match.group(5)),
        'leetcodeUrl': match.group(6),
        'timeComplexity': match.group(7),
        'spaceComplexity': match.group(8),
        'patternHint': match.group(9),
        'description': match.group(10)
    }
    problems.append(p)

print(f'Parsed {len(problems)} problems.')

unique_problems = {}
# To preserve the overall roadmap sequence, we iterate through the duplicated list.
# The first time we see a problem, it gets its canonical primaryTopic and order.
topic_orders = {}

for p in problems:
    pid = p['id']
    topic = p['primaryTopic']
    
    if pid not in unique_problems:
        if topic not in topic_orders:
            topic_orders[topic] = 1
        
        # New canonical problem
        canon = p.copy()
        canon['order'] = topic_orders[topic]
        canon['category'] = "Data Structures & Algorithms"
        canon['leetcodeNumber'] = pid
        canon['skills'] = [f"{topic} Core", "Time/Space Trade-offs", "Edge Case Handling", "Optimal Complexity"]
        canon['whyThisProblem'] = canon['description']
        canon['nextProblemIds'] = []
        canon['tags'] = set(canon['tags'])
        
        unique_problems[pid] = canon
        topic_orders[topic] += 1
    else:
        # It's a duplicate entry (meaning the problem appears in another topic too)
        unique_problems[pid]['tags'].update(p['tags'])
        unique_problems[pid]['tags'].add(topic)

print(f'Unique canonical problems: {len(unique_problems)}')

# Now build nextProblemIds.
# For each primaryTopic, we want the sequence of problem IDs.
topic_sequence = {}
for pid, p in unique_problems.items():
    topic = p['primaryTopic']
    if topic not in topic_sequence:
        topic_sequence[topic] = []
    topic_sequence[topic].append((p['order'], pid))

for topic, seq in topic_sequence.items():
    seq.sort(key=lambda x: x[0])
    for i in range(len(seq) - 1):
        curr_pid = seq[i][1]
        next_pid = seq[i+1][1]
        unique_problems[curr_pid]['nextProblemIds'].append(next_pid)

# Sort all by primary topic then order
sorted_problems = sorted(unique_problems.values(), key=lambda p: (p['primaryTopic'], p['order']))

with open(r'x:\Project-Buildings\StudyHub\frontend\lib\data\dsaCatalog_new.ts', 'w', encoding='utf-8') as out:
    out.write("""export interface DsaProblem {
  id: number;
  leetcodeNumber: number;
  order: number;
  title: string;
  category: string;
  primaryTopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  leetcodeUrl: string;
  whyThisProblem: string;
  skills: string[];
  timeComplexity: string;
  spaceComplexity: string;
  patternHint: string;
  tags: string[];
  nextProblemIds: number[];
}

export const dsaCatalog: DsaProblem[] = [\n""")
    for p in sorted_problems:
        p['tags'] = list(p['tags'])
        # formatting the output manually
        out.write("  {\n")
        out.write(f"    id: {p['id']},\n")
        out.write(f"    leetcodeNumber: {p['leetcodeNumber']},\n")
        out.write(f"    order: {p['order']},\n")
        out.write(f"    title: {json.dumps(p['title'])},\n")
        out.write(f"    category: {json.dumps(p['category'])},\n")
        out.write(f"    primaryTopic: {json.dumps(p['primaryTopic'])},\n")
        out.write(f"    difficulty: {json.dumps(p['difficulty'])},\n")
        out.write(f"    leetcodeUrl: {json.dumps(p['leetcodeUrl'])},\n")
        out.write(f"    whyThisProblem: {json.dumps(p['whyThisProblem'])},\n")
        out.write(f"    skills: {json.dumps(p['skills'])},\n")
        out.write(f"    timeComplexity: {json.dumps(p['timeComplexity'])},\n")
        out.write(f"    spaceComplexity: {json.dumps(p['spaceComplexity'])},\n")
        out.write(f"    patternHint: {json.dumps(p['patternHint'])},\n")
        out.write(f"    tags: {json.dumps(p['tags'])},\n")
        out.write(f"    nextProblemIds: {json.dumps(p['nextProblemIds'])}\n")
        out.write("  },\n")
    out.write("];\n")

print("Generated new dsaCatalog_new.ts")
