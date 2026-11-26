"""Import real company data for /companies.

  * Interview questions per company, with how often and how recently each was reported, from
    github.com/liquidslr/leetcode-company-wise-problems (LeetCode's company tags, refreshed by its maintainer).
  * Company facts (founded, headquarters, employees, website, logo, a two-sentence summary) from Wikidata
    and Wikipedia.
  * Whether the company has a public Greenhouse or Lever job board, so the page can list open roles live.

Writes lib/data/companyIndex.json (small, bundled), public/data/companies/<id>.json (questions, loaded on
demand) and lib/problems/askedBy.json (which companies ask each of StudyHub's own problems).
Rerun to refresh:  python scripts/import-company-data.py
"""

import csv
import io
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = "liquidslr/leetcode-company-wise-problems"
RAW = f"https://raw.githubusercontent.com/{REPO}/main"
UA = {"User-Agent": "StudyHub-data-import/1.0 (educational project)"}
PERIODS = ["1. Thirty Days", "2. Three Months", "3. Six Months", "4. More Than Six Months"]
MAX_QUESTIONS = 300  # per company, most frequent first; every recently reported one is kept too
MIN_QUESTIONS = 10  # fewer reported questions than this is too little to plan from

# id (matches lib/data/companiesData.ts where a curated workspace exists), repo folder, name, segment,
# Wikipedia title, official careers page
COMPANIES = [
    ("google", "Google", "Google", "Product", "Google", "https://www.google.com/about/careers/applications/"),
    ("microsoft", "Microsoft", "Microsoft", "Product", "Microsoft", "https://careers.microsoft.com/"),
    ("amazon", "Amazon", "Amazon", "Product", "Amazon (company)", "https://www.amazon.jobs/"),
    ("meta", "Meta", "Meta", "Product", "Meta Platforms", "https://www.metacareers.com/"),
    ("apple", "Apple", "Apple", "Product", "Apple Inc.", "https://www.apple.com/careers/"),
    ("adobe", "Adobe", "Adobe", "Product", "Adobe Inc.", "https://careers.adobe.com/"),
    ("oracle", "Oracle", "Oracle", "Product", "Oracle Corporation", "https://careers.oracle.com/"),
    ("salesforce", "Salesforce", "Salesforce", "Product", "Salesforce", "https://careers.salesforce.com/"),
    ("atlassian", "Atlassian", "Atlassian", "Product", "Atlassian", "https://www.atlassian.com/company/careers"),
    ("uber", "Uber", "Uber", "Product", "Uber", "https://www.uber.com/careers/"),
    ("linkedin", "LinkedIn", "LinkedIn", "Product", "LinkedIn", "https://careers.linkedin.com/"),
    ("intuit", "Intuit", "Intuit", "Product", "Intuit", "https://jobs.intuit.com/"),
    ("cisco", "Cisco", "Cisco", "Product", "Cisco", "https://jobs.cisco.com/"),
    ("nvidia", "Nvidia", "Nvidia", "Product", "Nvidia", "https://www.nvidia.com/en-us/about-nvidia/careers/"),
    ("qualcomm", "Qualcomm", "Qualcomm", "Product", "Qualcomm", "https://careers.qualcomm.com/"),
    ("samsung", "Samsung", "Samsung", "Product", "Samsung Electronics", "https://www.samsung.com/in/about-us/careers/"),
    ("walmart", "Walmart Labs", "Walmart Global Tech", "Product", "Walmart", "https://careers.walmart.com/"),
    ("servicenow", "ServiceNow", "ServiceNow", "Product", "ServiceNow", "https://careers.servicenow.com/"),
    ("sap", "SAP", "SAP", "Product", "SAP", "https://jobs.sap.com/"),
    ("nutanix", "Nutanix", "Nutanix", "Product", "Nutanix", "https://www.nutanix.com/company/careers"),
    ("zoho", "Zoho", "Zoho", "Product", "Zoho Corporation", "https://www.zoho.com/careers/"),
    ("sprinklr", "Sprinklr", "Sprinklr", "Product", "Sprinklr", "https://www.sprinklr.com/careers/"),
    ("media-net", "Media.net", "Media.net", "Product", "Media.net", "https://careers.media.net/"),
    ("goldman-sachs", "Goldman Sachs", "Goldman Sachs", "FinTech & Trading", "Goldman Sachs", "https://www.goldmansachs.com/careers/"),
    ("morgan-stanley", "Morgan Stanley", "Morgan Stanley", "FinTech & Trading", "Morgan Stanley", "https://www.morganstanley.com/careers"),
    ("de-shaw", "DE Shaw", "D. E. Shaw", "FinTech & Trading", "D. E. Shaw & Co.", "https://www.deshawindia.com/careers"),
    ("tower-research", "Tower Research Capital", "Tower Research Capital", "FinTech & Trading", "Tower Research Capital", "https://www.tower-research.com/open-positions"),
    ("arcesium", "Arcesium", "Arcesium", "FinTech & Trading", "Arcesium", "https://www.arcesium.com/careers"),
    ("paypal", "PayPal", "PayPal", "FinTech & Trading", "PayPal", "https://careers.pypl.com/"),
    ("visa", "Visa", "Visa", "FinTech & Trading", "Visa Inc.", "https://corporate.visa.com/en/jobs/"),
    ("american-express", "American Express", "American Express", "FinTech & Trading", "American Express", "https://www.americanexpress.com/en-us/careers/"),
    ("bloomberg", "Bloomberg", "Bloomberg", "FinTech & Trading", "Bloomberg L.P.", "https://www.bloomberg.com/company/careers/"),
    ("flipkart", "Flipkart", "Flipkart", "Startup", "Flipkart", "https://www.flipkartcareers.com/"),
    ("phonepe", "PhonePe", "PhonePe", "Startup", "PhonePe", "https://www.phonepe.com/careers/"),
    ("swiggy", "Swiggy", "Swiggy", "Startup", "Swiggy", "https://careers.swiggy.com/"),
    ("zomato", "Zomato", "Zomato", "Startup", "Zomato", "https://www.zomato.com/careers"),
    ("razorpay", "razorpay", "Razorpay", "Startup", "Razorpay", "https://razorpay.com/jobs/"),
    ("meesho", "Meesho", "Meesho", "Startup", "Meesho", "https://www.meesho.io/jobs"),
    ("cred", "CRED", "CRED", "Startup", "CRED (company)", "https://careers.cred.club/"),
    ("paytm", "Paytm", "Paytm", "Startup", "Paytm", "https://paytm.com/careers"),
    ("groww", "Groww", "Groww", "Startup", "Groww", "https://groww.in/careers"),
    ("juspay", "Juspay", "Juspay", "Startup", "Juspay", "https://juspay.io/careers"),
    ("makemytrip", "MakeMyTrip", "MakeMyTrip", "Startup", "MakeMyTrip", "https://careers.makemytrip.com/"),
    ("tcs-prime", "tcs", "TCS", "Service & IT", "Tata Consultancy Services", "https://www.tcs.com/careers"),
    ("infosys", "Infosys", "Infosys", "Service & IT", "Infosys", "https://www.infosys.com/careers/"),
    ("wipro", "Wipro", "Wipro", "Service & IT", "Wipro", "https://careers.wipro.com/"),
    ("accenture", "Accenture", "Accenture", "Service & IT", "Accenture", "https://www.accenture.com/in-en/careers"),
    ("cognizant", "Cognizant", "Cognizant", "Service & IT", "Cognizant", "https://careers.cognizant.com/"),
    ("capgemini", "Capgemini", "Capgemini", "Service & IT", "Capgemini", "https://www.capgemini.com/in-en/careers/"),
    ("hcl", "HCL", "HCLTech", "Service & IT", "HCLTech", "https://www.hcltech.com/careers"),
    ("ibm", "IBM", "IBM", "Service & IT", "IBM", "https://www.ibm.com/careers"),
    ("deloitte", "Deloitte", "Deloitte", "Service & IT", "Deloitte", "https://www.deloitte.com/global/en/careers.html"),
    ("tech-mahindra", "Tech Mahindra", "Tech Mahindra", "Service & IT", "Tech Mahindra", "https://careers.techmahindra.com/"),
    ("thoughtworks", "ThoughtWorks", "Thoughtworks", "Service & IT", "Thoughtworks", "https://www.thoughtworks.com/careers"),
]


def get(url: str, tries: int = 3) -> bytes:
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise
            if i == tries - 1:
                raise
        except Exception:
            if i == tries - 1:
                raise
        time.sleep(1.5 * (i + 1))
    raise RuntimeError(url)


def get_json(url: str):
    return json.loads(get(url))


def rows(folder: str, period: str) -> list[dict]:
    url = f"{RAW}/{urllib.parse.quote(folder)}/{urllib.parse.quote(period)}.csv"
    try:
        text = get(url).decode("utf-8")
    except urllib.error.HTTPError:
        return []
    return list(csv.DictReader(io.StringIO(text)))


def slug_of(link: str) -> str:
    m = re.search(r"/problems/([^/?#]+)", link)
    return m.group(1) if m else ""


def questions_for(folder: str) -> tuple[list[dict], int]:
    """Every question reported for a company: difficulty, how often (0-100), most recent period, topics."""
    recent: dict[str, int] = {}
    for i, period in enumerate(PERIODS):
        for r in rows(folder, period):
            recent.setdefault(slug_of(r["Link"]), i)
    out = []
    for r in rows(folder, "5. All"):
        s = slug_of(r["Link"])
        if not s:
            continue
        out.append({
            "t": r["Title"].strip(),
            "s": s,
            "d": r["Difficulty"].strip()[:1].upper(),  # E / M / H
            "f": round(float(r["Frequency"] or 0), 1),
            "r": recent.get(s, 3),  # 0 = last 30 days, 1 = 3 months, 2 = 6 months, 3 = older
            "tp": [t.strip() for t in (r["Topics"] or "").split(",") if t.strip()],
        })
    total = len(out)
    out.sort(key=lambda q: (-q["f"], q["r"]))
    keep = out[:MAX_QUESTIONS] + [q for q in out[MAX_QUESTIONS:] if q["r"] <= 1]
    return keep, total


def wiki_facts(titles: list[str]) -> dict[str, dict]:
    """Two-sentence summary and Wikidata facts per Wikipedia title."""
    facts: dict[str, dict] = {}
    qids: dict[str, str] = {}
    for i in range(0, len(titles), 20):  # extracts allow 20 intro pages per request
        batch = titles[i : i + 20]
        q = urllib.parse.urlencode({
            "action": "query", "format": "json", "redirects": 1, "prop": "pageprops|extracts",
            "ppprop": "wikibase_item", "exintro": 1, "explaintext": 1, "exsentences": 2, "exlimit": 20,
            "titles": "|".join(batch),
        })
        d = get_json(f"https://en.wikipedia.org/w/api.php?{q}")["query"]
        back = {n["to"]: n["from"] for n in d.get("normalized", []) + d.get("redirects", [])}
        for p in d["pages"].values():
            if "missing" in p:
                continue
            title = p.get("title", "")
            while title in back:
                title = back[title]
            summary = re.sub(r"\s*\([^()]*(?:pronounced|listen|/)[^()]*\)", "", p.get("extract", ""))  # IPA leftovers
            facts[title] = {"summary": re.sub(r"\s+", " ", summary).strip(), "wikipedia": "https://en.wikipedia.org/wiki/" + urllib.parse.quote(p.get("title", "").replace(" ", "_"))}
            if p.get("pageprops", {}).get("wikibase_item"):
                qids[title] = p["pageprops"]["wikibase_item"]

    ents: dict = {}
    ids = list(qids.values())
    for i in range(0, len(ids), 50):
        q = urllib.parse.urlencode({"action": "wbgetentities", "format": "json", "props": "claims", "ids": "|".join(ids[i : i + 50])})
        ents.update(get_json(f"https://www.wikidata.org/w/api.php?{q}")["entities"])

    def claims(e, p):
        cs = [c for c in e.get("claims", {}).get(p, []) if c["mainsnak"].get("datavalue")]
        pref = [c for c in cs if c["rank"] == "preferred"]
        return pref or [c for c in cs if c["rank"] != "deprecated"]

    def latest(cs):  # the claim with the newest "point in time" qualifier
        def when(c):
            q = c.get("qualifiers", {}).get("P585", [{}])[0].get("datavalue", {}).get("value", {}).get("time", "")
            return q
        return max(cs, key=when) if cs else None

    hq_ids = set()
    for title, qid in qids.items():
        e = ents.get(qid, {})
        f = facts[title]
        f["qid"] = qid
        if c := claims(e, "P571"):
            f["founded"] = c[0]["mainsnak"]["datavalue"]["value"]["time"][1:5]
        if c := claims(e, "P159"):
            f["hqId"] = c[0]["mainsnak"]["datavalue"]["value"]["id"]
            hq_ids.add(f["hqId"])
        if c := latest(claims(e, "P1128")):
            f["employees"] = int(float(c["mainsnak"]["datavalue"]["value"]["amount"]))
            when = c.get("qualifiers", {}).get("P585", [{}])[0].get("datavalue", {}).get("value", {}).get("time", "")
            if when:
                f["employeesYear"] = when[1:5]
        if c := claims(e, "P856"):
            f["website"] = c[0]["mainsnak"]["datavalue"]["value"]
        # some companies' "logo" claim is a photo of an office; keep only real logo files
        logos = [c["mainsnak"]["datavalue"]["value"] for c in claims(e, "P154")]
        if logo := next((x for x in logos if x.lower().endswith(".svg") or "logo" in x.lower()), None):
            f["logo"] = logo

    labels = {}
    hq = list(hq_ids)
    for i in range(0, len(hq), 50):
        q = urllib.parse.urlencode({"action": "wbgetentities", "format": "json", "props": "labels", "languages": "en", "ids": "|".join(hq[i : i + 50])})
        for k, v in get_json(f"https://www.wikidata.org/w/api.php?{q}")["entities"].items():
            labels[k] = v.get("labels", {}).get("en", {}).get("value", "")
    for f in facts.values():
        if "hqId" in f:
            f["hq"] = labels.get(f.pop("hqId"), "")
    return facts


# StudyHub's practice topics (and the SQL course) → the LeetCode topic tags that belong to them
DEMAND_TOPICS = {
    "Arrays": ["Array"],
    "Strings": ["String"],
    "Hashing": ["Hash Table"],
    "Two Pointers": ["Two Pointers"],
    "Sliding Window": ["Sliding Window"],
    "Prefix Sum": ["Prefix Sum"],
    "Sorting": ["Sorting"],
    "Binary Search": ["Binary Search"],
    "Recursion": ["Recursion", "Memoization"],
    "Stack & Queue": ["Stack", "Queue", "Monotonic Stack"],
    "Linked List": ["Linked List", "Doubly-Linked List"],
    "Matrix": ["Matrix"],
    "Bit Manipulation": ["Bit Manipulation"],
    "Greedy": ["Greedy"],
    "Trees": ["Tree", "Binary Tree", "Binary Search Tree", "Trie"],
    "Heap": ["Heap (Priority Queue)"],
    "Backtracking": ["Backtracking"],
    "Graphs": ["Graph Theory", "Breadth-First Search", "Union-Find", "Topological Sort", "Shortest Path"],
    "Dynamic Programming": ["Dynamic Programming"],
    "SQL": ["Database"],
}


def demand(index: list[dict]) -> dict:
    """How much each topic is asked: share of all reported questions, and which companies ask it most."""
    total = 0
    out = {k: {"q": 0, "by": {}} for k in DEMAND_TOPICS}
    for ci, c in enumerate(index):
        qs = json.loads((ROOT / "public" / "data" / "companies" / f"{c['id']}.json").read_text(encoding="utf-8"))["questions"]
        total += len(qs)
        for q in qs:
            for k, tags in DEMAND_TOPICS.items():
                if any(t in q["tp"] for t in tags):
                    out[k]["q"] += 1
                    out[k]["by"][ci] = out[k]["by"].get(ci, 0) + 1
    return {
        "total": total,
        "topics": {k: {"q": v["q"], "by": sorted(([ci, n] for ci, n in v["by"].items()), key=lambda x: -x[1])} for k, v in out.items()},
    }


def job_board(cid: str, folder: str, name: str):
    """A public Greenhouse or Lever board with open roles that is really this company's, or None.
    Boards are matched by slug, so the board's own name (Greenhouse) or its postings (Lever) must name the company:
    "tcs" on Greenhouse is a care provider, and "linkedin" on Lever holds only test postings."""
    slugs = dict.fromkeys(re.sub(r"[^a-z0-9]", "", s.lower()) for s in (cid, folder, name))
    key = name.lower().split()[0]
    for s in slugs:
        try:
            board = get_json(f"https://boards-api.greenhouse.io/v1/boards/{s}")
            if key in board.get("name", "").lower() and get_json(f"https://boards-api.greenhouse.io/v1/boards/{s}/jobs").get("jobs"):
                return {"type": "greenhouse", "slug": s}
        except Exception:
            pass
        try:
            d = get_json(f"https://api.lever.co/v0/postings/{s}?mode=json")
            named = sum(1 for j in d if key in (j.get("text", "") + j.get("descriptionPlain", "") + j.get("additionalPlain", "")).lower()) if isinstance(d, list) else 0
            if named >= max(1, len(d) // 4):
                return {"type": "lever", "slug": s}
        except Exception:
            pass
    return None


def write_asked_by(index: list[dict]):
    """For each StudyHub problem (matched by title), the companies that ask it: [company index, frequency, recency]."""
    path = ROOT / "lib" / "problems" / "askedBy.json"
    if not path.exists():  # the registry imports this file, so it must exist before we read the registry
        path.write_text('{"companies":[],"problems":{}}', encoding="utf-8")
    dump = "import { problems } from './lib/problems/problemRegistry'; console.log(JSON.stringify(Object.values(problems).map((p) => [p.id, p.title])))"
    out = subprocess.run(f'npx tsx -e "{dump}"', cwd=ROOT, shell=True, capture_output=True, text=True, encoding="utf-8", check=True).stdout
    norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())
    ours = {norm(t): pid for pid, t in json.loads(out)}
    asked: dict[str, list] = {}
    for ci, c in enumerate(index):
        for q in json.loads((ROOT / "public" / "data" / "companies" / f"{c['id']}.json").read_text(encoding="utf-8"))["questions"]:
            if (pid := ours.get(norm(q["t"]))) is not None:
                asked.setdefault(pid, []).append([ci, round(q["f"]), q["r"]])
    for v in asked.values():
        v.sort(key=lambda x: -x[1])
    path.write_text(json.dumps({"companies": [[c["id"], c["name"]] for c in index], "problems": asked}, separators=(",", ":")), encoding="utf-8")
    print(f"{len(asked)} of {len(ours)} StudyHub problems are asked by at least one company")


def main():
    as_of = get_json(f"https://api.github.com/repos/{REPO}")["pushed_at"][:10]
    facts = wiki_facts([c[4] for c in COMPANIES])
    out_dir = ROOT / "public" / "data" / "companies"
    out_dir.mkdir(parents=True, exist_ok=True)
    index = []
    for cid, folder, name, segment, wiki, careers in COMPANIES:
        qs, total = questions_for(folder)
        if total < MIN_QUESTIONS:
            print(f"  ! skipped {name}: only {total} questions reported", file=sys.stderr)
            continue
        topics: dict[str, int] = {}
        for q in qs:
            for t in q["tp"]:
                topics[t] = topics.get(t, 0) + 1
        diff = {k: sum(1 for q in qs if q["d"] == k) for k in "EMH"}
        f = facts.get(wiki, {})
        index.append({
            "id": cid,
            "name": name,
            "segment": segment,
            "careers": careers,
            "jobs": job_board(cid, folder, name),
            "facts": {k: f[k] for k in ("summary", "wikipedia", "founded", "hq", "employees", "employeesYear", "website", "logo") if f.get(k)},
            "counts": {
                "total": total,
                "easy": diff["E"], "medium": diff["M"], "hard": diff["H"],
                "d30": sum(1 for q in qs if q["r"] == 0),
                "d90": sum(1 for q in qs if q["r"] <= 1),
            },
            "topTopics": [t for t, _ in sorted(topics.items(), key=lambda kv: -kv[1])[:6]],
        })
        (out_dir / f"{cid}.json").write_text(json.dumps({"id": cid, "asOf": as_of, "questions": qs}, separators=(",", ":")), encoding="utf-8")
        print(f"{name:24} {total:5} reported, {len(qs):4} kept, jobs={index[-1]['jobs']}, facts={sorted(index[-1]['facts'])}")
    write_asked_by(index)
    (ROOT / "lib" / "data" / "companyIndex.json").write_text(
        json.dumps({"asOf": as_of, "source": f"https://github.com/{REPO}", "companies": index, "demand": demand(index)}, indent=1, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\n{len(index)} companies, questions as of {as_of}")


if __name__ == "__main__":
    main()
