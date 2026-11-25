"""Import beginner problems from exercism/problem-specifications (MIT) into StudyHub.

Usage:
  git clone --depth 1 https://github.com/exercism/problem-specifications <src>
  python frontend/scripts/import-exercism.py <src>          # writes the JSON outputs
  python frontend/scripts/import-exercism.py <src> --probe  # list every importable exercise

Writes:
  frontend/lib/problems/ladder.json        (problem definitions the UI renders)
  backend/data/ladder_hidden_tests.json    (hidden tests the /execution/submit route appends)

Only exercises whose tests fit the execution harness types are imported
(int, double, boolean, String, int[], String[], int[][]). Cases that expect an error are dropped.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# slug -> (difficulty, topics, hint). Order here is the ladder order.
# Hints are ours; descriptions and tests come from exercism.
LADDER = {
    "leap": ("Easy", ["Math", "Conditionals"], "Check the most specific rule first: divisible by 400, then 100, then 4."),
    "reverse-string": ("Easy", ["Strings", "Two Pointers"], "Walk from the last character to the first, or swap ends inward."),
    "raindrops": ("Easy", ["Math", "Strings"], "Append a sound for each factor; if nothing was added, return the number."),
    "difference-of-squares": ("Easy", ["Math", "Loops"], "Two loops work. There are also closed formulas: n(n+1)/2 and n(n+1)(2n+1)/6."),
    "grains": ("Easy", ["Math", "Bit Manipulation"], "Square n holds 2^(n-1) grains."),
    "armstrong-numbers": ("Easy", ["Math", "Loops"], "Count the digits first, then sum each digit raised to that count."),
    "collatz-conjecture": ("Easy", ["Math", "Loops"], "Loop until n is 1, counting steps: halve if even, else 3n+1."),
    "hamming": ("Easy", ["Strings"], "Compare characters at the same index and count mismatches."),
    "pangram": ("Easy", ["Strings", "Hash Set"], "Track which of the 26 letters you have seen, ignoring case."),
    "isogram": ("Easy", ["Strings", "Hash Set"], "Skip spaces and hyphens; any repeated letter (case-insensitive) fails."),
    "isbn-verifier": ("Easy", ["Strings", "Math"], "Strip hyphens, check the length is 10, and allow X only as the last digit."),
    "acronym": ("Easy", ["Strings"], "Split on spaces and hyphens, then take the first letter of each word."),
    "bob": ("Easy", ["Strings", "Conditionals"], "Trim first. Decide 'is question' and 'is yelling' separately, then combine."),
    "perfect-numbers": ("Easy", ["Math", "Loops"], "Sum the divisors below n (loop to sqrt(n) for speed) and compare with n."),
    "square-root": ("Easy", ["Math", "Binary Search"], "Binary search on the answer between 1 and n."),
    "sum-of-multiples": ("Easy", ["Math", "Hash Set"], "Collect every multiple below the limit in a set so duplicates count once."),
    "darts": ("Easy", ["Math", "Geometry"], "Distance from centre is sqrt(x*x + y*y); compare against radii 1, 5 and 10."),
    "triangle": ("Easy", ["Math", "Conditionals"], "First check it is a valid triangle (all sides > 0, triangle inequality)."),
    "eliuds-eggs": ("Easy", ["Bit Manipulation"], "Count the 1 bits: test n & 1, then shift right."),
    "rotational-cipher": ("Easy", ["Strings", "Math"], "Shift letters with (c - 'a' + key) % 26; leave other characters alone."),
    "atbash-cipher": ("Easy", ["Strings"], "Map a->z, b->y; keep digits; group output in fives when encoding."),
    "luhn": ("Easy", ["Strings", "Math"], "From the right, double every second digit and subtract 9 if over 9."),
    "scrabble-score": ("Easy", ["Strings", "Hash Map"], "Map each letter to its value and add them up."),
    "rna-transcription": ("Easy", ["Strings", "Hash Map"], "Replace each nucleotide: G->C, C->G, T->A, A->U."),
    "binary-search": ("Easy", ["Arrays", "Binary Search"], "Keep low and high; mid = low + (high - low) / 2."),
    "nth-prime": ("Easy", ["Math", "Loops"], "Test candidates for primality by trial division up to sqrt."),
    "prime-factors": ("Easy", ["Math", "Loops"], "Divide by 2, then 3, 5, ... while the factor divides n."),
    "sieve": ("Medium", ["Math", "Arrays"], "Mark multiples of each prime as composite, starting from p*p."),
    "series": ("Easy", ["Strings", "Sliding Window"], "Take every substring of the given length, left to right."),
    "largest-series-product": ("Medium", ["Strings", "Sliding Window"], "Slide a window of the given span and track the max product."),
    "anagram": ("Easy", ["Strings", "Sorting"], "Two words are anagrams if their sorted lowercase letters match (and they differ)."),
    "matching-brackets": ("Easy", ["Stack", "Strings"], "Push opening brackets; on a closing one, the top must be its partner."),
    "pascals-triangle": ("Easy", ["Arrays", "Dynamic Programming"], "Each inner value is the sum of the two values above it."),
    "spiral-matrix": ("Medium", ["Matrix", "Simulation"], "Keep four boundaries and walk right, down, left, up, shrinking them."),
    "matrix": ("Easy", ["Matrix", "Strings"], "Split the string into rows by newline, then into numbers by spaces."),
    "all-your-base": ("Medium", ["Math", "Arrays"], "Convert to a plain integer first, then repeatedly divide by the output base."),
    "roman-numerals": ("Easy", ["Math", "Greedy"], "Greedily subtract the largest value (1000, 900, 500, 400, ...) that fits."),
    "say": ("Medium", ["Strings", "Recursion"], "Handle 0-99, then hundreds, then recurse in groups of thousands."),
    "run-length-encoding": ("Medium", ["Strings"], "Count runs of the same character; a count of 1 is written without the number."),
    "crypto-square": ("Medium", ["Strings", "Matrix"], "Normalise, pick columns c = ceil(sqrt(n)), then read the grid column by column."),
    "proverb": ("Easy", ["Strings", "Arrays"], "Pair each word with the next one, then add the final line."),
    "resistor-color": ("Easy", ["Arrays"], "The colour's index in the list is its value."),
    "resistor-color-duo": ("Easy", ["Arrays", "Math"], "First colour is the tens digit, second is the ones digit."),
    "secret-handshake": ("Easy", ["Bit Manipulation"], "Test each of the low 5 bits; bit 16 reverses the list."),
    "house": ("Easy", ["Strings", "Recursion"], "Each verse adds one more clause to the front of the previous one."),
    "twelve-days": ("Easy", ["Strings"], "Build each verse from the gifts list, counting down."),
    "food-chain": ("Medium", ["Strings"], "Most verses share a pattern; handle the spider and the last verse specially."),
    "beer-song": ("Easy", ["Strings", "Loops"], "Special-case 2, 1 and 0 bottles."),
    "diamond": ("Easy", ["Strings", "Matrix"], "Row i has the letter at positions mid-i and mid+i."),
    "kindergarten-garden": ("Easy", ["Strings", "Arrays"], "Each child owns two columns in both rows, in alphabetical order."),
    "high-scores": ("Easy", ["Arrays", "Sorting"], "Sort a copy descending for the top three."),
    "change": ("Medium", ["Dynamic Programming"], "dp[x] = fewest coins for amount x; build it up from 0."),
    "book-store": ("Hard", ["Greedy", "Dynamic Programming"], "Greedy grouping fails on two 5-groups vs 4+4; adjust for that case."),
    "minesweeper": ("Medium", ["Matrix"], "For each empty cell count mines in the 8 neighbours."),
    "transpose": ("Medium", ["Matrix", "Strings"], "Pad rows on the left as needed; trailing spaces are trimmed carefully."),
    "phone-number": ("Easy", ["Strings"], "Keep digits, drop a leading 1, then validate area and exchange codes."),
    "wordy": ("Medium", ["Strings", "Parsing"], "Tokenise, then evaluate left to right; reject unknown words."),
    "yacht": ("Medium", ["Hash Map", "Conditionals"], "Count how often each face appears, then score by category."),
    "protein-translation": ("Easy", ["Strings", "Hash Map"], "Read three letters at a time and stop at a STOP codon."),
    "pig-latin": ("Medium", ["Strings"], "Find where the first vowel sound starts; watch out for 'qu', 'xr', 'yt' and 'y'."),
    "ocr-numbers": ("Hard", ["Strings", "Matrix"], "Each digit is a 3x4 block; slice the grid and look each block up."),
    "allergies": ("Easy", ["Bit Manipulation"], "Each allergen is one bit of the score."),
    "space-age": ("Easy", ["Math"], "Divide seconds by an Earth year (31557600 s), then by the planet's orbital period. Round to two decimal places."),
    "gigasecond": ("Medium", ["Strings", "Dates"], "Parse the ISO date-time (a date alone means midnight), add 10^9 seconds, and format as yyyy-MM-ddTHH:mm:ss."),
    "pythagorean-triplet": ("Medium", ["Math"], "Loop a < b, derive c = N - a - b, and test a^2 + b^2 = c^2."),
    "sublist": ("Medium", ["Arrays"], "Check equality first, then whether one list appears contiguously in the other."),
    "rail-fence-cipher": ("Medium", ["Strings", "Simulation"], "Simulate the zig-zag to know which rail each position belongs to."),
    "variable-length-quantity": ("Hard", ["Bit Manipulation"], "Split into 7-bit groups; set the high bit on all but the last."),
    "binary": ("Easy", ["Math", "Strings"], "Multiply the running total by 2 and add each digit."),
    "line-up": ("Easy", ["Strings", "Math"], "11, 12, 13 take 'th'; otherwise the last digit picks st/nd/rd/th."),
    "game-of-life": ("Medium", ["Matrix", "Simulation"], "Count live neighbours from the old grid; write results to a new grid."),
    "flower-field": ("Medium", ["Matrix", "Strings"], "For every blank cell, count flowers in the 8 neighbours; leave 0 as a space."),
    "rectangles": ("Hard", ["Matrix", "Strings"], "Pick two '+' corners on one row, then look for matching corners below with unbroken edges."),
    "tournament": ("Medium", ["Strings", "Hash Map", "Sorting"], "Tally W/D/L per team, then sort by points desc and name asc."),
    "bottle-song": ("Easy", ["Strings", "Loops"], "Spell the numbers and special-case 'one green bottle'."),
}

SIMPLE_TYPES = ("int", "double", "boolean", "String", "int[]", "String[]", "int[][]")


def infer(v):
    if isinstance(v, bool):
        return "boolean"
    if isinstance(v, int):
        return "int" if -2**31 <= v < 2**31 else None
    if isinstance(v, float):
        return "double"
    if isinstance(v, str):
        return "String"
    if isinstance(v, list):
        if all(isinstance(x, bool) for x in v) and v:
            return None
        if all(isinstance(x, int) and not isinstance(x, bool) and -2**31 <= x < 2**31 for x in v):
            return "int[]"
        if all(isinstance(x, str) for x in v):
            return "String[]"
        if all(isinstance(r, list) and all(isinstance(x, int) and not isinstance(x, bool) for x in r) for r in v):
            return "int[][]"
    return None


def merge(a, b):
    """Empty lists infer as int[]; let a concrete sibling type win."""
    if b is None:
        return "BAD"  # value has no harness type
    if a is None or a == b:
        return b
    if {a, b} <= {"int[]", "String[]", "int[][]"}:
        return b if a == "int[]" else a
    if {a, b} == {"int", "double"}:
        return "double"
    return "BAD"


def flatten(cases):
    for c in cases:
        if "cases" in c:
            yield from flatten(c["cases"])
        else:
            yield c


def superseded(cases):
    return {c["reimplements"] for c in cases if "reimplements" in c}


def camel(s):
    return re.sub(r"[-_ ]([a-zA-Z0-9])", lambda m: m.group(1).upper(), s)


def ident(name):
    name = camel(name)
    renames = {"string": "text", "strings": "lines", "list": "items", "input": "data", "str": "text"}
    if name in renames:
        return renames[name]
    return name + "_" if name in {"class", "int", "char", "default", "new", "case", "from", "lambda", "len", "max", "min"} else name


def analyse(slug, src):
    p = src / "exercises" / slug / "canonical-data.json"
    if not p.exists():
        return None, "no canonical data"
    data = json.loads(p.read_text(encoding="utf-8"))
    cases = list(flatten(data["cases"]))
    gone = superseded(cases)
    cases = [c for c in cases if c.get("uuid") not in gone]
    cases = [c for c in cases if not (isinstance(c.get("expected"), dict) and "error" in c["expected"])]
    if not cases:
        return None, "no cases"
    prop = Counter(c["property"] for c in cases).most_common(1)[0][0]
    cases = [c for c in cases if c["property"] == prop]
    # Drop single cases whose values the harness can't express (e.g. numbers beyond int, objects).
    # ponytail: non-ASCII cases dropped; the Docker harness stdout isn't reliably UTF-8.
    cases = [c for c in cases
             if infer(c["expected"]) and all(infer(v) for v in c["input"].values())
             and (json.dumps(c["input"]) + json.dumps(c["expected"])).isascii()
             and "\\u" not in json.dumps(c["input"]) + json.dumps(c["expected"])]
    if not cases:
        return None, "no typeable cases"
    keys = list(cases[0]["input"].keys())
    if any(list(c["input"].keys()) != keys for c in cases):
        return None, "input keys vary"
    ptypes = {}
    for k in keys:
        t = None
        for c in cases:
            t = merge(t, infer(c["input"][k]))
        ptypes[k] = t
    rtype = None
    for c in cases:
        rtype = merge(rtype, infer(c["expected"]))
    bad = [k for k, t in ptypes.items() if t not in SIMPLE_TYPES]
    if bad or rtype not in SIMPLE_TYPES:
        return None, f"types {ptypes} -> {rtype}"
    if len(cases) < 3:
        return None, "fewer than 3 cases"
    return (prop, keys, ptypes, rtype, cases), None


def description(slug, src):
    d = src / "exercises" / slug
    main = d / "instructions.md"
    if not main.exists():
        main = d / "description.md"
    text = main.read_text(encoding="utf-8")
    intro = d / "introduction.md"
    if intro.exists():
        text = intro.read_text(encoding="utf-8") + "\n\n" + text
    meta = (d / "metadata.toml").read_text(encoding="utf-8")
    title = re.search(r'^title\s*=\s*"(.*)"', meta, re.M)
    # Drop headings, images and link-reference lines; keep paragraphs and list items.
    paras = []
    for block in re.split(r"\n\s*\n", text):
        block = block.strip()
        if not block or block.startswith("#") or block.startswith("![") or re.match(r"^\[[^\]]+\]:", block):
            continue
        if block.startswith("~~~~") or block.startswith("```"):
            # Fenced example: drop the fence and its language tag.
            first, _, rest = block.strip("`~").partition("\n")
            paras.append((rest if re.fullmatch(r"\w*", first) else first + "\n" + rest).strip("\n`~"))
            continue
        block = re.sub(r"\[([^\]]+)\]\[[^\]]*\]", r"\1", block)
        block = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", block)
        paras.append(re.sub(r"\s*\n\s*(?![-*\d])", " ", block))
    return (title.group(1) if title else slug.replace("-", " ").title()), paras


def build(src):
    out, hidden, skipped = {}, {}, []
    n = 0
    for slug, (diff, topics, hint) in LADDER.items():
        res, why = analyse(slug, src)
        if not res:
            skipped.append(f"{slug}: {why}")
            continue
        prop, keys, ptypes, rtype, cases = res
        n += 1
        title, paras = description(slug, src)
        params = [{"name": ident(k), "type": ptypes[k]} for k in keys]
        tests = [{"id": f"case-{i+1}", "input": {ident(k): c["input"][k] for k in keys},
                  "expectedOutput": c["expected"], "label": c.get("description", "")}
                 for i, c in enumerate(cases)]
        # First three are shown; the rest are hidden and only run on Submit.
        visible, rest = tests[:3], tests[3:]
        for i, t in enumerate(rest):
            t["id"] = f"hidden-{i+1}"
        pid = f"ex-{slug}"
        out[pid] = {
            "id": pid, "slug": slug, "title": title, "difficulty": diff, "topics": topics,
            "ladder": n, "description": paras, "constraints": [],
            "hint": hint,
            "objective": f"Write {rtype} {ident(prop)}({', '.join(p['type'] + ' ' + p['name'] for p in params)}). The tests call only this method.",
            "source": {"name": "exercism/problem-specifications", "license": "MIT",
                       "url": f"https://github.com/exercism/problem-specifications/tree/main/exercises/{slug}"},
            "functionSignature": {"language": "java", "className": "Solution", "methodName": ident(prop),
                                  "returnType": rtype, "parameters": params},
            # Hidden tests live only in the backend file, so the client bundle stays small.
            "visibleTests": visible, "hiddenTests": [], "hiddenCount": len(rest),
        }
        hidden[pid] = rest
    return out, hidden, skipped


def main():
    src = Path(sys.argv[1])
    if "--probe" in sys.argv:
        for d in sorted((src / "exercises").iterdir()):
            res, why = analyse(d.name, src)
            tag = "OK " if res else "-- "
            print(tag + d.name + ("" if res else f"  ({why})") + ("  [in ladder]" if d.name in LADDER else ""))
        return
    out, hidden, skipped = build(src)
    (ROOT / "frontend/lib/problems/ladder.json").write_text(json.dumps(out, ensure_ascii=False) + "\n", encoding="utf-8")
    (ROOT / "backend/data/ladder_hidden_tests.json").write_text(json.dumps(hidden, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"imported {len(out)} problems")
    for s in skipped:
        print("skipped", s)


if __name__ == "__main__":
    main()
