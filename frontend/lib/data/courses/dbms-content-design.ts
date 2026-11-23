// DBMS Modules 4-5: Relational Algebra & Calculus, Normalization
import { CourseLesson } from './types';

export const relationalAlgebraLessons: CourseLesson[] = [
  {
    id: "basic-relational-algebra",
    slug: "basic-relational-algebra",
    title: "Basic Operators: Select, Project, Rename, Set Operations, Cartesian Product",
    description: "The six fundamental operators every query is built from, with SQL equivalents.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Why Learn Relational Algebra?",
          content: "Relational algebra is the mathematical language behind SQL. The DBMS turns every SQL query into an algebra expression tree and then rearranges that tree to run faster (query optimization). GATE asks algebra questions directly, and understanding it makes complex SQL much easier to reason about.\n\nEvery operator takes one or two relations as input and produces a relation as output, so operators can be chained."
        },
        {
          type: "table",
          title: "The Fundamental Operators",
          headers: ["Operator", "Symbol", "What it does", "SQL equivalent"],
          rows: [
            ["Selection", "σ condition (R)", "Keeps rows that satisfy a condition", "`WHERE`"],
            ["Projection", "π columns (R)", "Keeps chosen columns and removes duplicate rows", "`SELECT DISTINCT col1, col2`"],
            ["Rename", "ρ newName (R)", "Renames a relation or its attributes", "`AS`"],
            ["Union", "R ∪ S", "Rows in R or S (duplicates removed)", "`UNION`"],
            ["Set difference", "R − S", "Rows in R but not in S", "`EXCEPT` / `MINUS`"],
            ["Cartesian product", "R × S", "Every row of R paired with every row of S", "`FROM R, S` / `CROSS JOIN`"]
          ]
        },
        {
          type: "text",
          title: "Derived Operators",
          content: "Intersection, joins and division can all be written using the six basic operators:\nR ∩ S = R − (R − S)\nR ⋈θ S = σθ (R × S)\nThey exist as separate operators because they are convenient and the DBMS can run them more efficiently."
        },
        {
          type: "code",
          title: "Translating Between Algebra and SQL",
          language: "sql",
          code: "-- Names of CSE students with CGPA above 8\n-- π name ( σ branch='CSE' ∧ cgpa>8 (STUDENT) )\nSELECT DISTINCT name\nFROM student\nWHERE branch = 'CSE' AND cgpa > 8;\n\n-- Roll numbers enrolled in DBMS but not in OS\n-- π roll_no(σ course='DBMS'(ENROLL)) − π roll_no(σ course='OS'(ENROLL))\nSELECT roll_no FROM enroll WHERE course = 'DBMS'\nEXCEPT\nSELECT roll_no FROM enroll WHERE course = 'OS';",
          explanation: "Projection removes duplicates in algebra, which is why the SQL needs `DISTINCT` to match it exactly."
        },
        {
          type: "list",
          title: "Rules You Must Remember",
          items: [
            "**Union compatibility**: ∪, ∩ and − need both relations to have the same number of attributes with matching domains.",
            "**Cardinality of R × S** = |R| × |S| rows, and degree = degree(R) + degree(S) columns.",
            "**σ is commutative**: σp(σq(R)) = σq(σp(R)) = σp∧q(R).",
            "**π cascades**: only the outermost projection matters, provided the inner projections keep its columns."
          ]
        },
        {
          type: "quickCheck",
          question: "R has 10 tuples and 3 attributes; S has 5 tuples and 4 attributes. R × S has:",
          options: ["15 tuples, 7 attributes", "50 tuples, 7 attributes", "50 tuples, 12 attributes", "15 tuples, 12 attributes"],
          answer: 1,
          explanation: "Rows multiply (10 × 5 = 50) and columns add (3 + 4 = 7)."
        },
        {
          type: "takeaways",
          items: [
            "Six fundamental operators: σ, π, ρ, ∪, −, ×. Everything else is derived from them.",
            "σ filters rows (WHERE); π picks columns and removes duplicates (SELECT DISTINCT).",
            "× multiplies row counts and adds column counts."
          ]
        }
      ]
    }
  },
  {
    id: "joins-and-division",
    slug: "joins-and-division",
    title: "Joins and the Division Operator",
    description: "Theta, equi, natural and outer joins in algebra, plus division for 'for all' queries.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Join Types",
          headers: ["Join", "Notation", "Meaning"],
          rows: [
            ["Theta join", "R ⋈θ S", "σθ(R × S) for any condition θ (<, >, =, ...)"],
            ["Equi join", "R ⋈ R.a=S.b S", "Theta join where θ uses only equality"],
            ["Natural join", "R ⋈ S", "Equi join on all attributes with the same name, keeping one copy of each"],
            ["Left outer join", "R ⟕ S", "All of R; missing S values become NULL"],
            ["Right outer join", "R ⟖ S", "All of S; missing R values become NULL"],
            ["Full outer join", "R ⟗ S", "All rows of both sides"],
            ["Semi join", "R ⋉ S", "Rows of R that have at least one match in S (only R's columns)"]
          ]
        },
        {
          type: "warning",
          title: "Natural Join Pitfall",
          items: [
            "Natural join matches every column that shares a name. If both tables have an unrelated column called `name` or `updated_at`, the join silently matches on it too.",
            "If two relations share no column names, a natural join becomes a Cartesian product.",
            "In SQL, prefer explicit `JOIN ... ON` over `NATURAL JOIN` in production code."
          ]
        },
        {
          type: "text",
          title: "Division: The 'For All' Operator",
          content: "Use division when a question says 'for all' or 'every'.\n\nR(A, B) ÷ S(B) returns every value a in A such that, for every b in S, the pair (a, b) is in R.\n\nExample: ENROLL(roll_no, course) ÷ CORE(course) gives students enrolled in every core course.\n\nDivision is not fundamental. It can be written as:\nπA(R) − πA( (πA(R) × S) − R )\nIn words: all candidates, minus those missing at least one required course."
        },
        {
          type: "code",
          title: "Division in SQL (double NOT EXISTS)",
          language: "sql",
          code: "-- Students enrolled in every core course\nSELECT s.roll_no\nFROM student s\nWHERE NOT EXISTS (\n  SELECT c.course FROM core c\n  WHERE NOT EXISTS (\n    SELECT 1 FROM enroll e\n    WHERE e.roll_no = s.roll_no AND e.course = c.course\n  )\n);\n\n-- Equivalent counting approach\nSELECT roll_no\nFROM enroll\nWHERE course IN (SELECT course FROM core)\nGROUP BY roll_no\nHAVING COUNT(DISTINCT course) = (SELECT COUNT(*) FROM core);",
          explanation: "Read the first query as: 'there is no core course that this student is not enrolled in'."
        },
        {
          type: "think",
          question: "R(A,B) has 6 tuples and S(B) has 2 tuples. What is the maximum number of tuples R ÷ S can return?",
          answerReveal: "3. Each result value of A needs one R tuple for each of the 2 values in S, so at most floor(6 / 2) = 3 values of A qualify."
        },
        {
          type: "quickCheck",
          question: "Which operator answers 'Find suppliers who supply ALL parts'?",
          options: ["Natural join", "Union", "Division", "Projection"],
          answer: 2,
          explanation: "'All' / 'every' questions are division: SUPPLIES(sid, pid) ÷ PARTS(pid)."
        },
        {
          type: "takeaways",
          items: [
            "Natural join = equi join on all same-named columns, keeping one copy of each.",
            "Outer joins keep unmatched rows and fill the gaps with NULL.",
            "'For all' → division → double NOT EXISTS or GROUP BY ... HAVING COUNT in SQL."
          ]
        }
      ]
    }
  },
  {
    id: "relational-calculus",
    slug: "relational-calculus",
    title: "Tuple & Domain Relational Calculus",
    description: "The declarative counterpart of relational algebra, safe expressions and relational completeness.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Algebra vs Calculus",
          content: "Relational algebra is procedural: you describe the steps (select, then project, then join).\nRelational calculus is declarative: you describe what the answer must satisfy, and not how to compute it. SQL is mostly based on tuple relational calculus."
        },
        {
          type: "table",
          title: "TRC vs DRC",
          headers: ["", "Tuple Relational Calculus (TRC)", "Domain Relational Calculus (DRC)"],
          rows: [
            ["Variables range over", "Whole tuples", "Individual attribute values"],
            ["Form", "{ t | P(t) }", "{ <x1, x2, ...> | P(x1, x2, ...) }"],
            ["Example: CSE students", "{ t | t ∈ STUDENT ∧ t.branch = 'CSE' }", "{ <r, n, b> | <r, n, b> ∈ STUDENT ∧ b = 'CSE' }"],
            ["Inspired", "SQL", "QBE (Query By Example)"]
          ]
        },
        {
          type: "text",
          title: "Quantifiers",
          content: "∃ (there exists) and ∀ (for all) appear inside the predicate.\n\nStudents enrolled in some course:\n{ t | t ∈ STUDENT ∧ ∃e (e ∈ ENROLL ∧ e.roll_no = t.roll_no) }\n\n∀ is the calculus version of division, and it maps to NOT EXISTS ... NOT EXISTS in SQL."
        },
        {
          type: "text",
          title: "Safe Expressions",
          content: "{ t | ¬(t ∈ STUDENT) } means 'every tuple that is not a student'. That is an infinite set, so it cannot be computed. Such expressions are called unsafe.\n\nA safe expression only produces values that appear in the database (its active domain). Safe TRC, safe DRC and relational algebra all have exactly the same expressive power. Any query language that can express all of them is called relationally complete. SQL is relationally complete, and with aggregation and recursion it can do even more."
        },
        {
          type: "quickCheck",
          question: "Which statement is true?",
          options: ["Relational algebra is more powerful than safe TRC", "Safe TRC, safe DRC and relational algebra are equally expressive", "DRC can express queries that algebra cannot", "TRC is procedural"],
          answer: 1,
          explanation: "Codd's theorem: relational algebra and safe relational calculus have the same expressive power."
        },
        {
          type: "takeaways",
          items: [
            "Algebra = procedural (how); calculus = declarative (what).",
            "TRC variables are tuples; DRC variables are attribute values.",
            "Unsafe expressions describe infinite results; only safe ones are allowed."
          ]
        }
      ]
    }
  }
];

export const normalizationLessons: CourseLesson[] = [
  {
    id: "anomalies-and-redundancy",
    slug: "anomalies-and-redundancy",
    title: "Why Normalize? Redundancy and Anomalies",
    description: "Insertion, deletion and update anomalies shown on one badly designed table.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "The Problem",
          content: "Normalization is the process of splitting a table into smaller, well-structured tables so that each fact is stored exactly once. It removes redundancy and the anomalies that redundancy causes."
        },
        {
          type: "table",
          title: "A Badly Designed Table: STUDENT_COURSE",
          headers: ["roll_no", "name", "course_id", "course_name", "instructor", "instructor_phone"],
          rows: [
            ["101", "Ravi", "CS301", "DBMS", "Dr. Rao", "98400 11111"],
            ["101", "Ravi", "CS302", "OS", "Dr. Iyer", "98400 22222"],
            ["102", "Meena", "CS301", "DBMS", "Dr. Rao", "98400 11111"],
            ["103", "Arjun", "CS301", "DBMS", "Dr. Rao", "98400 11111"]
          ]
        },
        {
          type: "table",
          title: "The Three Anomalies",
          headers: ["Anomaly", "What goes wrong in the table above"],
          rows: [
            ["Update anomaly", "Dr. Rao's phone changes. It must be updated in 3 rows; miss one and the data contradicts itself."],
            ["Insertion anomaly", "A new course CS303 has no students yet. It can't be added without inventing a fake student, because roll_no is part of the key."],
            ["Deletion anomaly", "Delete the only OS enrollment (Ravi, CS302) and you also lose the fact that Dr. Iyer teaches OS."]
          ]
        },
        {
          type: "text",
          title: "The Fix",
          content: "Split by 'what the data is about':\nSTUDENT(roll_no, name)\nCOURSE(course_id, course_name, instructor)\nINSTRUCTOR(instructor, instructor_phone)\nENROLLMENT(roll_no, course_id)\n\nNow each fact (a phone number, a course title) lives in one place. Joins bring the full picture back when you need it."
        },
        {
          type: "think",
          question: "Is normalization always good? When would you deliberately denormalize?",
          answerReveal: "For read-heavy workloads where joins are too expensive: analytics warehouses (star schemas), cached counters (likes_count), or precomputed reporting tables. You accept redundancy in exchange for speed, and keep it consistent with triggers, jobs or application logic."
        },
        {
          type: "quickCheck",
          question: "You cannot record a new department until at least one employee joins it. This is a(n):",
          options: ["Update anomaly", "Insertion anomaly", "Deletion anomaly", "Referential anomaly"],
          answer: 1,
          explanation: "Being unable to store one fact without another unrelated fact is an insertion anomaly."
        },
        {
          type: "takeaways",
          items: [
            "Redundancy causes update, insertion and deletion anomalies.",
            "Normalization stores each fact once by decomposing tables.",
            "Denormalization is a deliberate performance trade-off, not a design error."
          ]
        }
      ]
    }
  },
  {
    id: "functional-dependencies",
    slug: "functional-dependencies",
    title: "Functional Dependencies, Closure and Finding Candidate Keys",
    description: "Armstrong's axioms, attribute closure, and the step-by-step method for finding all candidate keys.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A functional dependency (FD) X → Y means: whenever two rows agree on X, they must also agree on Y. 'X determines Y.'\n\nExamples: roll_no → name (one roll number has one name). course_id → instructor.\nNot an FD: name → roll_no (two students can share a name).\n\nTrivial FD: Y ⊆ X, for example {roll_no, name} → name. It always holds.\nNon-trivial FD: Y is not a subset of X."
        },
        {
          type: "table",
          title: "Armstrong's Axioms (and derived rules)",
          headers: ["Rule", "Statement"],
          rows: [
            ["Reflexivity", "If Y ⊆ X then X → Y"],
            ["Augmentation", "If X → Y then XZ → YZ"],
            ["Transitivity", "If X → Y and Y → Z then X → Z"],
            ["Union (derived)", "If X → Y and X → Z then X → YZ"],
            ["Decomposition (derived)", "If X → YZ then X → Y and X → Z"],
            ["Pseudo-transitivity (derived)", "If X → Y and WY → Z then WX → Z"]
          ]
        },
        {
          type: "text",
          title: "Attribute Closure X+",
          content: "X+ is the set of all attributes that X determines. Algorithm:\n1. Start with result = X.\n2. For each FD A → B, if A ⊆ result, add B to result.\n3. Repeat until nothing changes.\n\nIf X+ contains every attribute of R, X is a super key. If, in addition, no proper subset of X is a super key, X is a candidate key."
        },
        {
          type: "dryRun",
          title: "Worked Example: R(A, B, C, D, E), F = { A → B, B → C, CD → E }",
          iterations: [
            { step: "1", variables: { "Never on any RHS": "A, D" }, description: "Attributes that never appear on the right side of an FD can't be derived, so they must be in every candidate key. Start with {A, D}." },
            { step: "2", variables: { "result": "{A, D}" }, description: "Compute (AD)+. Start with AD." },
            { step: "3", variables: { "result": "{A, D, B}" }, description: "A → B applies (A is in result)." },
            { step: "4", variables: { "result": "{A, D, B, C}" }, description: "B → C applies." },
            { step: "5", variables: { "result": "{A, B, C, D, E}" }, description: "CD → E applies. Every attribute is reached." },
            { step: "6", variables: { "Candidate keys": "{AD} only" }, description: "AD is a super key, and every key must contain both A and D, so AD is the one and only candidate key." }
          ]
        },
        {
          type: "list",
          title: "Shortcut for Finding Candidate Keys",
          items: [
            "Attributes **only on the left side** (or in no FD at all) must be in every key.",
            "Attributes **only on the right side** are never in any key.",
            "Attributes on **both sides** may or may not be in a key: try adding them one at a time to the 'must' set and compute closures.",
            "If the 'must' set's closure already covers R, it is the only candidate key."
          ]
        },
        {
          type: "think",
          question: "R(A, B, C) with F = { A → B, B → C, C → A }. Find all candidate keys.",
          answerReveal: "Every attribute appears on both sides, so test each one: A+ = {A, B, C}, B+ = {B, C, A}, C+ = {C, A, B}. All three are candidate keys: {A}, {B} and {C}."
        },
        {
          type: "text",
          title: "Minimal Cover (Canonical Cover)",
          content: "A minimal cover is the smallest equivalent set of FDs. Steps:\n1. Split right sides so each FD has a single attribute on the right.\n2. Remove extraneous left-side attributes (in AB → C, drop A if B+ already contains C).\n3. Remove redundant FDs (drop A → C if it can be derived from the others).\nMinimal covers are used when building 3NF decompositions."
        },
        {
          type: "quickCheck",
          question: "R(P, Q, R, S) with F = { P → Q, Q → R }. Which is the candidate key?",
          options: ["{P}", "{PS}", "{PQ}", "{QS}"],
          answer: 1,
          explanation: "P and S never appear on a right side, so both are required. (PS)+ = {P, S, Q, R} = all attributes, so PS is the only candidate key."
        },
        {
          type: "takeaways",
          items: [
            "X → Y: equal X values force equal Y values.",
            "Use attribute closure to test super keys; minimality makes a super key a candidate key.",
            "Attributes never on a right side are in every candidate key."
          ]
        }
      ]
    }
  },
  {
    id: "normal-forms-1nf-2nf-3nf",
    slug: "normal-forms-1nf-2nf-3nf",
    title: "1NF, 2NF and 3NF with Worked Examples",
    description: "Atomic values, partial dependencies and transitive dependencies, explained and removed step by step.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Two Terms You Need First",
          content: "Prime attribute: an attribute that is part of some candidate key.\nNon-prime attribute: an attribute that is not part of any candidate key.\n\nThe normal forms are about which attributes are allowed to determine non-prime attributes."
        },
        {
          type: "table",
          title: "The Normal Forms at a Glance",
          headers: ["Normal form", "Rule", "What it removes"],
          rows: [
            ["1NF", "Every column holds atomic (single) values; no repeating groups", "Multi-valued cells, lists in one column"],
            ["2NF", "1NF + no non-prime attribute depends on only part of a candidate key", "Partial dependencies"],
            ["3NF", "2NF + no non-prime attribute depends on another non-prime attribute", "Transitive dependencies"],
            ["BCNF", "For every non-trivial FD X → Y, X is a super key", "All anomalies caused by FDs"]
          ]
        },
        {
          type: "text",
          title: "1NF: Atomic Values",
          content: "Violation: STUDENT(roll_no, name, phones) with the row (101, 'Ravi', '98400..., 97100...').\nFix: move phones to STUDENT_PHONE(roll_no, phone), with one row per phone number."
        },
        {
          type: "text",
          title: "2NF: Remove Partial Dependencies",
          content: "Only matters when a candidate key is composite.\n\nENROLLMENT(roll_no, course_id, student_name, course_name, grade)\nKey: {roll_no, course_id}\nFDs: roll_no → student_name, course_id → course_name, {roll_no, course_id} → grade\n\nstudent_name depends on only part of the key (roll_no). That is a partial dependency, so the table is not in 2NF.\n\nDecompose:\nSTUDENT(roll_no, student_name)\nCOURSE(course_id, course_name)\nENROLLMENT(roll_no, course_id, grade)"
        },
        {
          type: "text",
          title: "3NF: Remove Transitive Dependencies",
          content: "EMPLOYEE(emp_id, name, dept_id, dept_name)\nFDs: emp_id → dept_id, dept_id → dept_name\n\ndept_name depends on emp_id only through dept_id (emp_id → dept_id → dept_name). dept_id is non-prime, so this is a transitive dependency and the table is not in 3NF.\n\nDecompose:\nEMPLOYEE(emp_id, name, dept_id)\nDEPARTMENT(dept_id, dept_name)\n\nFormal 3NF test: for every non-trivial FD X → A, either X is a super key, or A is a prime attribute."
        },
        {
          type: "dryRun",
          title: "Identify the Highest Normal Form: R(A, B, C, D), F = { AB → C, C → D }",
          iterations: [
            { step: 1, variables: { "Candidate key": "AB", "Prime": "A, B", "Non-prime": "C, D" }, description: "(AB)+ = {A, B, C, D}. A and B never appear on a right side, so AB is the only key." },
            { step: 2, variables: { "Partial dependency?": "No" }, description: "No FD has only A or only B on the left. So R is in 2NF." },
            { step: 3, variables: { "C → D": "C is not a super key, D is non-prime" }, description: "Transitive dependency AB → C → D. R is NOT in 3NF." },
            { step: 4, variables: { "Answer": "2NF", "Fix": "R1(A, B, C), R2(C, D)" }, description: "Decompose on C → D. Both resulting tables are in BCNF." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Explain 2NF with an example.",
              trap: "Defining 2NF as 'no partial dependency' without saying what it is partial to, or giving an example whose key is a single column.",
              solution: "A partial dependency is a non-prime attribute that depends on only part of a composite candidate key. Use ENROLLMENT(roll_no, course_id, student_name): student_name depends on roll_no alone. Note that a table whose candidate keys are all single attributes is automatically in 2NF."
            },
            {
              question: "Is a two-attribute relation always in BCNF?",
              trap: "Saying 'it depends'.",
              solution: "Yes. Any relation with exactly two attributes is in BCNF: every possible non-trivial FD (A → B or B → A) has a single attribute on the left, and that attribute is then a key."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "R(A, B, C) with key A and FDs A → B, B → C. R is in:",
          options: ["1NF only", "2NF but not 3NF", "3NF but not BCNF", "BCNF"],
          answer: 1,
          explanation: "The key is a single attribute, so there are no partial dependencies (2NF). B → C is transitive (B is not a key, C is non-prime), so R is not in 3NF."
        },
        {
          type: "takeaways",
          items: [
            "1NF: atomic values. 2NF: no partial dependency on a composite key. 3NF: no transitive dependency.",
            "3NF test: for each X → A, X is a super key OR A is prime.",
            "Always find the candidate keys first; every normal-form question depends on them."
          ]
        }
      ]
    }
  },
  {
    id: "bcnf-and-decomposition",
    slug: "bcnf-and-decomposition",
    title: "BCNF, 4NF, Lossless Join and Dependency Preservation",
    description: "The stricter normal forms and the two properties every good decomposition must be checked for.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "BCNF (Boyce-Codd Normal Form)",
          content: "Rule: for every non-trivial FD X → Y, X must be a super key. Unlike 3NF, there is no 'unless Y is prime' exception.\n\nClassic example where 3NF holds but BCNF fails:\nTEACHES(student, subject, teacher)\nFDs: {student, subject} → teacher, teacher → subject (each teacher teaches one subject)\nCandidate keys: {student, subject} and {student, teacher}\n\nteacher → subject: teacher is not a super key. But subject is prime, so 3NF is satisfied. BCNF is violated.\n\nBCNF decomposition: R1(teacher, subject), R2(student, teacher). The anomaly is gone, but the FD {student, subject} → teacher can no longer be checked inside a single table."
        },
        {
          type: "text",
          title: "Lossless-Join Decomposition",
          content: "Splitting R into R1 and R2 is lossless if joining them back gives exactly R, with no extra (spurious) rows.\n\nTest for a two-way split: the decomposition is lossless if the common attributes form a super key of at least one side:\n(R1 ∩ R2) → R1   or   (R1 ∩ R2) → R2\n\nLossless join is mandatory. A lossy decomposition silently produces wrong data."
        },
        {
          type: "dryRun",
          title: "Lossless Test: R(A, B, C), F = { A → B }",
          iterations: [
            { step: "Split 1", variables: { "R1": "(A, B)", "R2": "(A, C)", "Common": "A" }, description: "A → B means A is a key of R1. Lossless." },
            { step: "Split 2", variables: { "R1": "(A, B)", "R2": "(B, C)", "Common": "B" }, description: "B determines nothing, so it isn't a key of either side. Lossy: joining on B can create spurious rows." }
          ]
        },
        {
          type: "text",
          title: "Dependency Preservation",
          content: "A decomposition preserves dependencies if every original FD can be checked using the FDs inside the individual tables, without joining them. Formally: (F1 ∪ F2 ∪ ...)+ = F+.\n\nThis is desirable but not mandatory. Without it, enforcing a lost FD needs a join or a trigger on every insert."
        },
        {
          type: "table",
          title: "3NF vs BCNF Trade-off",
          headers: ["Property", "3NF decomposition", "BCNF decomposition"],
          rows: [
            ["Lossless join", "Always achievable", "Always achievable"],
            ["Dependency preserving", "Always achievable", "Not always possible"],
            ["Redundancy", "A little may remain", "None caused by FDs"],
            ["In practice", "Common target for OLTP designs", "Used when no FD would be lost"]
          ]
        },
        {
          type: "text",
          title: "Beyond BCNF: 4NF and 5NF",
          content: "4NF deals with multivalued dependencies (MVDs). X →→ Y means that for one X there is a set of Y values independent of the other attributes.\nExample: EMP(emp, skill, language). Skills and languages are independent, so every skill must be paired with every language, which explodes the number of rows. Fix: EMP_SKILL(emp, skill) and EMP_LANG(emp, language).\n\n5NF (project-join normal form) handles join dependencies that can't be expressed as MVDs. It is rarely asked beyond its definition."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Every BCNF relation is in 3NF. Is every 3NF relation in BCNF?",
              trap: "Saying yes.",
              solution: "No. 3NF allows X → A when A is prime even if X is not a super key. BCNF does not. The TEACHES(student, subject, teacher) example is in 3NF but not BCNF."
            },
            {
              question: "Which property of a decomposition can never be sacrificed?",
              trap: "Saying dependency preservation.",
              solution: "Lossless join. Without it, joining the tables back produces wrong data. Dependency preservation can be traded away for BCNF."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "R(A, B, C, D) is decomposed into R1(A, B) and R2(C, D). With FD set { A → B, C → D }, the decomposition is:",
          options: ["Lossless and dependency preserving", "Lossy but dependency preserving", "Lossless but not dependency preserving", "Lossy and not dependency preserving"],
          answer: 1,
          explanation: "R1 ∩ R2 is empty, so the tables can't be joined back (the join is a Cartesian product): lossy. Each FD lives entirely inside one table, so dependencies are preserved."
        },
        {
          type: "takeaways",
          items: [
            "BCNF: every determinant is a super key. Stricter than 3NF.",
            "Lossless test: the common attributes are a key of at least one side.",
            "3NF can always be lossless + dependency preserving; BCNF can't always preserve dependencies.",
            "4NF removes multivalued dependencies (independent multi-valued facts)."
          ]
        }
      ]
    }
  }
];
