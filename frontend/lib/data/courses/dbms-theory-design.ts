// Long-form theory for DBMS modules 4-5 (relational algebra, normalization). Original writing.
import { LessonTheory } from './utils';

const CMU_445 = { title: "CMU 15-445/645 Database Systems (free lectures and notes)", url: "https://15445.courses.cs.cmu.edu/" };
const SILBERSCHATZ = { title: "Database System Concepts (Silberschatz, Korth, Sudarshan) companion site", url: "https://www.db-book.com/" };
const CODD_1970 = { title: "E. F. Codd, A Relational Model of Data for Large Shared Data Banks (1970)", url: "https://dl.acm.org/doi/10.1145/362384.362685" };
const PG_DOCS = { title: "PostgreSQL documentation: Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", license: "PostgreSQL License" };

export const dbmsDesignTheory: Record<string, LessonTheory> = {
  "basic-relational-algebra": {
    theory: `Relational algebra is a small set of operations that take tables as input and produce a table as output. SQL is built on it, and every database turns your SQL into an algebra expression before running it. This lesson explains the six fundamental operators with the college database, so you can read a query plan and answer GATE algebra questions with confidence.

## Why an algebra

Arithmetic has numbers and operators such as + and ×, and you can combine them freely because every result is again a number. Relational algebra works the same way with tables. Because every operator returns a table, you can feed one operator's output into the next and build any query from a few pieces.

The database relies on this property. It rewrites your query into an equivalent algebra expression that's cheaper to run, for example by filtering rows before a join instead of after. That rewriting is safe only because the algebra has precise rules.

## Selection: keep some rows

Selection, written σ (sigma), keeps the rows that satisfy a condition. \`σ branch='CSE' (STUDENT)\` returns only CSE students. The condition can combine comparisons with AND (∧), OR (∨) and NOT (¬).

Selection never changes the columns, only the number of rows. In SQL, it's the \`WHERE\` clause.

## Projection: keep some columns

Projection, written π (pi), keeps the listed columns. \`π name, cgpa (STUDENT)\` returns two columns. Because relational algebra works with sets, projection also removes duplicate rows: if two students share a name and CGPA, the result has one row for them.

SQL doesn't remove duplicates unless you ask, so the exact SQL equivalent is \`SELECT DISTINCT name, cgpa\`. Forgetting this difference is a common source of wrong answers in algebra-to-SQL questions.

## Rename

Rename, written ρ (rho), gives a relation or its columns a new name. It looks trivial, but you need it whenever a query uses the same table twice, such as comparing students with other students. Without renaming, the two copies would have identical column names and you couldn't tell them apart. SQL's table aliases (\`FROM student s1, student s2\`) do the same job.

## Set operations: union, difference, intersection

Union (∪) returns rows in either relation, difference (−) returns rows in the first but not the second, and intersection (∩) returns rows in both. They require **union compatibility**: both relations must have the same number of columns, with matching domains in the same order.

For example, roll numbers enrolled in DBMS but not in OS:

~~~sql
SELECT roll_no FROM enroll WHERE course = 'DBMS'
EXCEPT
SELECT roll_no FROM enroll WHERE course = 'OS';
~~~

Intersection isn't one of the six fundamental operators, because you can build it from difference: R ∩ S = R − (R − S).

## Cartesian product

The Cartesian product R × S pairs every row of R with every row of S. If R has 10 rows and 3 columns and S has 5 rows and 4 columns, the product has 50 rows and 7 columns: rows multiply and columns add.

On its own, the product is rarely what you want, because most pairs are unrelated. Its value is as the foundation of joins: a join is a product followed by a selection that keeps only the matching pairs.

## Building queries by composition

Combining operators answers real questions. "Names of CSE students with CGPA above 8" is:

~~~text
π name ( σ branch='CSE' ∧ cgpa>8 (STUDENT) )
~~~

Read it inside out: start with STUDENT, keep the matching rows, then keep the name column. The SQL version reads in a different order, but the meaning is identical.

## Useful equivalence rules

The optimizer uses equivalences like these to make queries faster:

- **Cascading selections**: σp(σq(R)) = σp∧q(R), so two filters can be combined or split
- **Commuting selections**: σp(σq(R)) = σq(σp(R)), so the cheaper filter can run first
- **Pushing selection below a join**: if p mentions only R's columns, σp(R ⋈ S) = σp(R) ⋈ S, so fewer rows reach the expensive join
- **Cascading projections**: only the outermost projection matters, as long as inner ones keep its columns

Pushing selections down is the single most important optimization, and you can see it in PostgreSQL's \`EXPLAIN\` output, where filters appear on the table scans rather than after the join.

## How interviewers test this

GATE questions give an algebra expression and ask for the number of result rows, or ask which SQL query is equivalent. Track two things carefully: projection removes duplicates, and × multiplies row counts. Placement interviews more often ask you to explain what σ and π correspond to in SQL.`,
    sources: [CODD_1970, CMU_445, SILBERSCHATZ, PG_DOCS]
  },

  "joins-and-division": {
    theory: `Joins combine related rows from two tables, and division answers "for all" questions such as "students who completed every core course". Both are built from the basic operators, but they appear so often that databases implement them directly. This lesson explains each join type, its pitfalls, and the division operator, which many students find the hardest part of relational algebra.

## From product to join

A Cartesian product pairs every student with every course, most of which is noise. A **theta join**, written R ⋈θ S, keeps only the pairs that satisfy the condition θ, and it's exactly σθ(R × S). When θ uses only equality, the theta join is called an **equi join**.

Databases never compute the full product for a join. They use hash joins, merge joins or index lookups to find matching pairs directly, but the result is defined as if they had.

## Natural join

A **natural join**, R ⋈ S, is an equi join on every column the two relations share by name, keeping one copy of each shared column. \`STUDENT ⋈ ENROLL\` matches on \`roll_no\` automatically.

The convenience hides two traps:

- If both tables have an unrelated column with the same name, such as \`created_at\` or \`name\`, the join silently matches on it as well and returns far fewer rows
- If the tables share no column names, the natural join becomes a Cartesian product

In production SQL, prefer explicit \`JOIN ... ON\`, so the matching columns are stated and a later schema change can't alter the query's meaning.

## Outer joins

Inner joins drop rows without a match. Outer joins keep them and fill the missing side with NULL:

- **Left outer join** (⟕): every row of the left table, matched or not. "All students, with their enrollments if any"
- **Right outer join** (⟖): every row of the right table
- **Full outer join** (⟗): every row of both tables

Outer joins answer "who has none?" questions. A left join from students to enrollments, followed by a filter on NULL enrollment, finds students enrolled in nothing.

## Semi join and anti join

A **semi join** (⋉) returns rows of R that have at least one match in S, with only R's columns and without duplicating R's rows. SQL expresses it with \`EXISTS\` or \`IN\`. An **anti join** returns rows of R with no match in S, expressed with \`NOT EXISTS\`. Optimizers recognize these patterns and run them efficiently.

## Division: the "for all" operator

Division answers questions containing "all" or "every". Given \`ENROLL(roll_no, course)\` and \`CORE(course)\`, the division \`ENROLL ÷ CORE\` returns every roll number paired with all the core courses.

Think of it as a checklist. For each student, take the set of courses they're enrolled in. The student qualifies if that set contains the entire CORE list. Extra courses don't matter; a single missing core course disqualifies them.

## Building division from basic operators

Division isn't fundamental, and its standard construction explains how to write it in SQL:

1. **All candidates**: π roll_no(ENROLL), every student who appears at all
2. **All required pairings**: candidates × CORE, every student paired with every core course
3. **Missing pairings**: (candidates × CORE) − ENROLL, pairs that should exist but don't
4. **Disqualified students**: π roll_no of the missing pairings
5. **Answer**: candidates − disqualified

In words: start with everyone, then remove anyone missing at least one required course.

## Division in SQL

SQL has no division operator, and two patterns are common. The first is a double \`NOT EXISTS\`, which reads as "there is no core course that this student isn't enrolled in":

~~~sql
SELECT s.roll_no FROM student s
WHERE NOT EXISTS (
  SELECT 1 FROM core c
  WHERE NOT EXISTS (
    SELECT 1 FROM enroll e
    WHERE e.roll_no = s.roll_no AND e.course = c.course));
~~~

The second counts: group the student's core enrollments and compare the count with the size of CORE using \`HAVING COUNT(DISTINCT course) = (SELECT COUNT(*) FROM core)\`. Counting is shorter, but it breaks if duplicates sneak in, so keep the \`DISTINCT\`.

## Size reasoning for division

If R(A, B) has r rows and S(B) has s rows, R ÷ S has at most ⌊r/s⌋ rows, because each qualifying A value needs s distinct rows in R. This bound is a frequent one-mark GATE question.

## How interviewers test this

Interviewers ask for the difference between inner and outer joins with an example, and for "find students who took all courses" in SQL. For the second, state that it's relational division, then write the double \`NOT EXISTS\` version and explain how to read it aloud.`,
    sources: [CMU_445, SILBERSCHATZ]
  },

  "relational-calculus": {
    theory: `Relational calculus describes a query by stating what the result must satisfy, without saying how to compute it. It comes in two forms, tuple relational calculus (TRC) and domain relational calculus (DRC), and it's the theoretical model behind declarative languages such as SQL. This lesson explains both, the quantifiers they use, and the idea of safe expressions.

## Procedural versus declarative

Relational algebra is procedural: an expression lists steps such as "select, then join, then project". Relational calculus is declarative: you describe the properties of the rows you want, and the system decides the steps.

SQL sits closer to calculus. When you write \`WHERE cgpa > 8\`, you describe the result, and the optimizer chooses whether to scan the table or use an index. That freedom is what lets the database pick an efficient plan.

## Tuple relational calculus

In TRC, a variable ranges over whole rows. A query has the form \`{ t | P(t) }\`, read as "the set of tuples t such that P(t) is true".

"All CSE students" becomes:

~~~text
{ t | t ∈ STUDENT ∧ t.branch = 'CSE' }
~~~

To return only some columns, you describe a result tuple built from other tuples. "Names of CSE students" is \`{ t | ∃s (s ∈ STUDENT ∧ s.branch = 'CSE' ∧ t.name = s.name) }\`.

## Domain relational calculus

In DRC, variables range over single attribute values instead of whole rows. A query lists the values it returns:

~~~text
{ <r, n> | ∃b ∃g (<r, n, b, g> ∈ STUDENT ∧ b = 'CSE') }
~~~

This returns roll number and name pairs of CSE students. DRC inspired Query By Example (QBE), where users fill in a grid that looks like the table. Microsoft Access's query designer works this way.

## Quantifiers

Calculus uses two quantifiers inside conditions:

- **There exists (∃)**: at least one value satisfies the condition. "Students enrolled in some course": \`{ t | t ∈ STUDENT ∧ ∃e (e ∈ ENROLL ∧ e.roll_no = t.roll_no) }\`
- **For all (∀)**: every value satisfies the condition. "Students enrolled in every core course" uses ∀ over CORE, which is the calculus form of division

In SQL, ∃ maps to \`EXISTS\`. SQL has no "for all", so you express ∀x P(x) as "there is no x for which P is false", which is the double \`NOT EXISTS\` pattern.

## Safe and unsafe expressions

Some calculus expressions describe infinite results. \`{ t | ¬(t ∈ STUDENT) }\` asks for every possible tuple that isn't a student: every combination of every string and number. No database can return that.

An expression is **safe** if its result contains only values that appear in the database or in the query itself (the active domain). Practical query languages accept only safe expressions. SQL guarantees safety by construction, because every value in a result comes from a table in the \`FROM\` clause or a literal in the query.

## Expressive power

E. F. Codd proved that relational algebra and safe relational calculus can express exactly the same set of queries. A language that can express all of them is called **relationally complete**. SQL is relationally complete, and with aggregation, grouping and recursive queries, it can express things pure algebra and calculus can't, such as counts and transitive closure.

## Why it matters today

You'll rarely write calculus directly. Its value is the way of thinking: describe the result precisely, including what "for all" and "there exists" mean, and let the system find the method. That habit makes tricky SQL, especially "for all" questions and correlated subqueries, far less error-prone.

## Comparison

| | Relational algebra | Tuple calculus | Domain calculus |
|---|---|---|---|
| Style | Procedural | Declarative | Declarative |
| Variables | None (operators on tables) | Whole tuples | Attribute values |
| Influenced | Query optimizers | SQL | QBE |
| Power | Same as safe calculus | Same | Same |

## How interviewers test this

GATE questions ask which statements about expressive power are true, or which calculus expression matches an English query. Remember three facts: algebra is procedural, calculus is declarative, and safe calculus equals algebra in power. Placement interviews rarely go deeper than that distinction.`,
    sources: [CODD_1970, SILBERSCHATZ, CMU_445]
  },

  "anomalies-and-redundancy": {
    theory: `Normalization is the process of organizing tables so each fact is stored exactly once. Its motivation is concrete: tables that repeat facts suffer from update, insertion and deletion anomalies, which silently corrupt data over time. This lesson shows each anomaly on one badly designed table, then shows how splitting the table removes them, and when deliberately keeping redundancy is the right call.

## One table that does too much

Imagine the exam cell keeps everything in a single table:

| roll_no | name | course_id | course_name | instructor | instructor_phone |
|---|---|---|---|---|---|
| 101 | Ravi | CS301 | DBMS | Dr. Rao | 98400 11111 |
| 101 | Ravi | CS302 | OS | Dr. Iyer | 98400 22222 |
| 102 | Meena | CS301 | DBMS | Dr. Rao | 98400 11111 |
| 103 | Arjun | CS301 | DBMS | Dr. Rao | 98400 11111 |

The table works for reading a transcript, and that's why designs like it are common. The trouble appears when the data changes.

## Update anomaly

Dr. Rao changes phone numbers. The number appears in three rows, so three rows must change. If a script updates only the rows for one section, the table now holds two different numbers for the same person. Nothing in the table says which is correct.

Every repeated fact is a chance for copies to disagree. The more rows repeat a fact, the more likely an update misses one.

## Insertion anomaly

A new course, CS303 Computer Networks, is announced, but no student has enrolled yet. The table's key is \`(roll_no, course_id)\`, and \`roll_no\` can't be NULL, so the course can't be recorded until someone enrolls. The design forces you to know one fact (an enrollment) before you can store an unrelated fact (a course exists).

## Deletion anomaly

Ravi drops OS, so his CS302 row is deleted. That was the only row mentioning OS, so the database also forgets that Dr. Iyer teaches OS and what his phone number is. Deleting one fact destroyed others that happened to share its row.

## The cause: mixing subjects in one table

All three anomalies share a cause. The table describes several different things (students, courses, instructors and enrollments) in one place, so facts about one subject are tied to rows about another. The fix is to give each subject its own table:

- \`STUDENT(roll_no, name)\`
- \`INSTRUCTOR(instructor, instructor_phone)\`
- \`COURSE(course_id, course_name, instructor)\`
- \`ENROLLMENT(roll_no, course_id)\`

Now Dr. Rao's phone number lives in one row, a course exists independently of enrollments, and dropping a course removes only the enrollment. You recover the original wide view with joins whenever you need it.

## Functional dependencies make this precise

"Each subject in its own table" is a guideline; normal forms make it a rule. They're defined using functional dependencies such as \`course_id → course_name\` (a course ID determines the course name) and \`instructor → instructor_phone\`. The next lessons show how to find these dependencies and use them to decide exactly how to split a table.

## Redundancy you should keep

Normalization isn't always the goal. Denormalization means keeping redundant data on purpose to make reads faster:

- **Counters**: a \`comments_count\` column on a post, so a feed doesn't count comments for every post on every page load
- **Analytics**: data warehouses use wide, denormalized star schemas because analysts run large aggregations, and joins at that scale are expensive
- **Historical facts**: an order stores the price paid, even though the product table has a current price, because the invoice must not change when prices do

The difference between denormalization and a bad design is intent and maintenance. Deliberate redundancy has a documented reason and something that keeps the copies consistent: a trigger, a background job, or an update inside the same transaction.

## Costs of over-normalizing

Splitting tables has a cost too. Every split adds a join to queries that need the combined data, and a schema split into dozens of narrow tables can make one screen need five or six joins. Most transactional systems normalize to third normal form or BCNF, and stop there.

## How interviewers test this

The most common question is "What is normalization and why is it needed?" Answer with the three anomalies, each with a one-line example, then say that normalization removes redundancy by splitting tables according to functional dependencies. Mentioning when you'd denormalize shows you understand the trade-off rather than a rule.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "functional-dependencies": {
    theory: `A functional dependency (FD) is a rule of the form "if you know X, you know Y". FDs are the mathematical tool behind normalization: they tell you which attributes belong together, what the candidate keys are, and whether a table is in a given normal form. This lesson explains FDs, Armstrong's axioms, attribute closure and the method for finding every candidate key, which is the most tested skill in DBMS exams.

## What an FD says

X → Y means: any two rows that agree on X must also agree on Y. In a student table, \`roll_no → name\` holds, because one roll number always belongs to one name. \`name → roll_no\` doesn't hold, because two students can share a name.

An FD is a rule about all valid data, not an observation about today's rows. If today's table happens to have unique names, that doesn't make \`name → roll_no\` an FD. FDs come from the meaning of the data, which you learn from the organization's rules.

## Trivial and non-trivial FDs

An FD X → Y is **trivial** if Y is a subset of X, such as \`{roll_no, name} → name\`. Trivial FDs always hold and tell you nothing. Normal forms only care about non-trivial FDs.

## Armstrong's axioms

Three rules let you derive every FD implied by a given set:

- **Reflexivity**: if Y ⊆ X, then X → Y
- **Augmentation**: if X → Y, then XZ → YZ for any Z
- **Transitivity**: if X → Y and Y → Z, then X → Z

These axioms are sound (they never derive a false FD) and complete (they derive every true one). Three useful rules follow from them: **union** (X → Y and X → Z give X → YZ), **decomposition** (X → YZ gives X → Y and X → Z), and **pseudo-transitivity** (X → Y and WY → Z give WX → Z).

## Attribute closure

Applying axioms by hand is slow. The practical tool is the **closure** of a set of attributes X, written X+: every attribute that X determines. The algorithm is:

1. Start with result = X
2. For each FD A → B, if every attribute of A is in result, add B to result
3. Repeat step 2 until nothing new is added

If X+ contains every attribute of the relation, X is a super key. If additionally no proper subset of X is a super key, X is a candidate key.

## A worked closure

Take R(A, B, C, D, E) with FDs A → B, B → C and CD → E. Compute (AD)+: start with {A, D}. A → B adds B, giving {A, B, D}. B → C adds C. Now C and D are both present, so CD → E adds E. The result is all five attributes, so AD is a super key.

## Finding all candidate keys

Classify each attribute by where it appears in the FDs:

- **Only on left sides, or in no FD**: must be in every candidate key, because nothing derives it
- **Only on right sides**: never in any candidate key, because something else always derives it
- **On both sides**: may or may not be in a key

Then test: compute the closure of the "must" set. If it covers the relation, it's the only candidate key. Otherwise, add "both sides" attributes one at a time, compute closures, and keep the minimal sets that cover everything.

In the example, A and D appear only on left sides, so every key contains both. (AD)+ is everything, so AD is the only candidate key. If the FDs were A → B, B → C and C → A instead, every attribute appears on both sides, and testing each one shows that {A}, {B} and {C} are all candidate keys.

## Minimal cover

A **minimal (canonical) cover** is the smallest set of FDs equivalent to the original. You compute it in three steps:

1. Split right sides so every FD has one attribute on the right
2. Remove extraneous left-side attributes: in AB → C, drop A if B+ already contains C
3. Remove redundant FDs: drop an FD if the remaining ones still imply it

The minimal cover is the input to the 3NF synthesis algorithm, which builds one table per FD.

## How interviewers test this

GATE and placement tests give a relation and FD set and ask for candidate keys, the closure of a set, or the number of super keys. Classify attributes first, then compute closures. Write each closure step out, since one skipped FD is the usual cause of a wrong answer.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "normal-forms-1nf-2nf-3nf": {
    theory: `The normal forms are a ladder of increasingly strict rules about which attributes may determine which. Each step removes a specific kind of redundancy: 1NF removes multi-valued cells, 2NF removes partial dependencies, and 3NF removes transitive dependencies. This lesson defines each one, shows a table that fails it, and shows the split that fixes it.

## Two terms first

Every normal form question depends on these definitions:

- **Prime attribute**: an attribute that belongs to at least one candidate key
- **Non-prime attribute**: an attribute that belongs to no candidate key

Normal forms restrict how non-prime attributes depend on keys. So the first step of any normal form question is always the same: find all candidate keys.

## First normal form (1NF)

A table is in 1NF if every cell holds a single atomic value and there are no repeating groups. \`STUDENT(roll_no, name, phones)\` with a cell containing "98400 11111, 97100 22222" violates 1NF.

The fix moves the repeating values into their own table, \`STUDENT_PHONE(roll_no, phone)\`, with one row per number. Searching by phone number becomes an indexed equality lookup instead of string matching.

## Second normal form (2NF)

A table is in 2NF if it's in 1NF and no non-prime attribute depends on only part of a candidate key. That kind of dependency is called a **partial dependency**, and it can only exist when a candidate key has two or more attributes.

Consider \`ENROLLMENT(roll_no, course_id, student_name, course_name, grade)\`, with key \`(roll_no, course_id)\`. Here \`student_name\` depends on \`roll_no\` alone, and \`course_name\` on \`course_id\` alone. Both are partial dependencies, so the student's name repeats in every course they take.

The fix moves each partially dependent attribute out, alongside the part of the key it depends on:

- \`STUDENT(roll_no, student_name)\`
- \`COURSE(course_id, course_name)\`
- \`ENROLLMENT(roll_no, course_id, grade)\`

A useful shortcut: if every candidate key has a single attribute, the table is automatically in 2NF.

## Third normal form (3NF)

A table is in 3NF if it's in 2NF and no non-prime attribute depends on another non-prime attribute. That chain is called a **transitive dependency**: the key determines X, and X determines Y.

Consider \`PROFESSOR(prof_id, name, dept_id, dept_name)\`. Here \`prof_id → dept_id\` and \`dept_id → dept_name\`, so the department's name depends on the professor only through the department. Every professor in Computer Science repeats "Computer Science", and renaming the department means updating every professor row.

The fix gives the department its own table: \`PROFESSOR(prof_id, name, dept_id)\` and \`DEPARTMENT(dept_id, dept_name)\`.

## The formal 3NF test

The ladder definition helps you remember the idea, while the formal test is what you apply to a relation. For every non-trivial FD X → A, at least one of these must hold:

1. X is a super key, or
2. A is a prime attribute

If some FD fails both conditions, the table isn't in 3NF. This test checks 2NF and 3NF at once, because a partial dependency also fails it.

## A full worked example

R(A, B, C, D) with FDs AB → C and C → D. First, find the keys: A and B never appear on a right side, and (AB)+ = {A, B, C, D}, so AB is the only candidate key. A and B are prime; C and D aren't.

Check 2NF: no FD has only A or only B on the left, so there are no partial dependencies, and R is in 2NF. Check 3NF: in C → D, C isn't a super key and D isn't prime, so R fails 3NF. The highest normal form is 2NF. Splitting on the violating FD gives R1(A, B, C) and R2(C, D), and both are in BCNF.

## A practical habit

When you design tables, you rarely run the formal algorithm. Instead, ask of each column: "What does this fact describe?" If the answer is "the department" while the table is about professors, the column belongs in a department table. That question catches most 2NF and 3NF problems before they exist.

## How interviewers test this

The classic question is "Explain 1NF, 2NF and 3NF with examples". Use one example per form, and define partial and transitive dependencies explicitly. GATE asks for the highest normal form of a relation: find the keys, then apply the formal test FD by FD.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "bcnf-and-decomposition": {
    theory: `Boyce-Codd normal form (BCNF) is a stricter version of 3NF that removes every redundancy caused by functional dependencies. Reaching it sometimes costs something, so this lesson also covers the two properties every decomposition must be checked for: lossless join, which you can never give up, and dependency preservation, which you sometimes must. It ends with 4NF, which handles a kind of redundancy FDs can't describe.

## The BCNF rule

A relation is in BCNF if, for every non-trivial FD X → Y, X is a super key. Compared with the 3NF test, BCNF drops the escape clause "or Y is prime". Every determinant must identify the whole row.

## A table in 3NF but not BCNF

Suppose each teacher teaches exactly one subject, and each student has one teacher per subject. Consider \`TEACHES(student, subject, teacher)\` with these FDs:

- \`{student, subject} → teacher\`
- \`teacher → subject\`

The candidate keys are \`{student, subject}\` and \`{student, teacher}\`. In \`teacher → subject\`, \`teacher\` isn't a super key, but \`subject\` is prime, so the table passes 3NF. It fails BCNF.

The redundancy is real: every student taught by Dr. Rao repeats the fact that Dr. Rao teaches DBMS. If Dr. Rao switches subjects, every one of those rows must change.

## Decomposing to BCNF

The BCNF algorithm repeatedly splits on a violating FD X → Y into R1 = X ∪ Y and R2 = R − Y. For TEACHES, splitting on \`teacher → subject\` gives \`TEACHER_SUBJECT(teacher, subject)\` and \`STUDENT_TEACHER(student, teacher)\`. Both are in BCNF, and the repeated fact now lives in one row.

The cost appears immediately. The original rule \`{student, subject} → teacher\` (a student has one teacher per subject) involves attributes now spread across two tables, so neither table can enforce it alone. That's a loss of dependency preservation.

## Lossless join: the property you can't skip

A decomposition of R into R1 and R2 is **lossless** if joining R1 and R2 gives back exactly R, with no extra rows. A lossy decomposition produces spurious rows: combinations that never existed in the original data. That's wrong data, so a lossy decomposition is never acceptable.

For a split into two tables, the test is short. The decomposition is lossless if the common attributes form a super key of at least one side:

- (R1 ∩ R2) → R1, or
- (R1 ∩ R2) → R2

With R(A, B, C) and A → B, splitting into (A, B) and (A, C) is lossless, because A is the key of (A, B). Splitting into (A, B) and (B, C) is lossy: B determines nothing, so joining on B pairs unrelated rows.

## Dependency preservation: the property you can trade

A decomposition **preserves dependencies** if every original FD can be checked inside a single table, without joining. Formally, the union of the FDs that hold within each table implies all the original FDs.

Without preservation, enforcing a lost FD means joining tables or writing a trigger on every insert. That's extra work and a chance for bugs, but the data itself stays correct, which is why this property is the one you can trade away.

## The 3NF versus BCNF trade-off

| Property | 3NF synthesis | BCNF decomposition |
|---|---|---|
| Lossless join | Always achievable | Always achievable |
| Dependency preserving | Always achievable | Not always possible |
| Redundancy from FDs | A little may remain | None |

The practical rule: aim for BCNF. If reaching it would lose an important FD, settle for 3NF and accept a little redundancy, or keep BCNF and enforce the lost rule another way.

## Multivalued dependencies and 4NF

Some redundancy has nothing to do with FDs. Suppose a professor has a set of skills and, independently, a set of languages: \`PROF(prof, skill, language)\`. To record that the skills and languages are independent, every skill must be paired with every language. Two skills and three languages mean six rows.

This is a **multivalued dependency** (MVD), written \`prof ↠ skill\`: for one professor there's a set of skills, independent of the other attributes. 4NF requires every non-trivial MVD to have a super key on the left. The fix splits the independent facts: \`PROF_SKILL(prof, skill)\` and \`PROF_LANGUAGE(prof, language)\`, giving five rows instead of six, and the savings grow quickly with larger sets.

5NF (project-join normal form) handles join dependencies that MVDs can't express. It rarely appears in practice or in exams beyond its definition.

## How interviewers test this

Expect "Difference between 3NF and BCNF" (BCNF removes the "or Y is prime" exception; give the TEACHES example) and "Which decomposition property can't be sacrificed?" (lossless join, because a lossy split produces wrong data). GATE also tests the lossless-join check on two-way splits.`,
    sources: [SILBERSCHATZ, CMU_445]
  }
};
