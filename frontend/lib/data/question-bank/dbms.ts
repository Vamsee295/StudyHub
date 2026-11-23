import type { LessonQuestions } from './index';

export const dbmsQuestions: LessonQuestions = {
  "what-is-a-dbms": [
    { q: "Two offices store the same student's phone number in separate files, and only one gets updated. What problem is this?", o: ["Data isolation", "Data inconsistency", "Atomicity failure", "Deadlock"], a: 1, e: "Redundant copies drifting apart is data inconsistency, a classic weakness of file-based systems that a DBMS removes by storing each fact once." },
    { q: "Which DBMS feature lets an application keep working after an index is added to a table?", o: ["Physical data independence", "Referential integrity", "Normalization", "Concurrency control"], a: 0, e: "Physical data independence means storage changes such as new indexes or file layouts don't require changes to applications or the logical schema." },
    { q: "Which is NOT a typical advantage of a DBMS over a flat-file system?", o: ["Controlled concurrent access", "Crash recovery", "Zero setup and administration cost", "Fine-grained access control"], a: 2, e: "A DBMS adds setup, licensing and administration overhead. Its advantages are concurrency control, recovery, security and reduced redundancy." },
  ],
  "dbms-tier-architecture": [
    { q: "In a 3-tier architecture, where does the business logic usually run?", o: ["In the database server", "In the client browser only", "In the application server", "In the storage controller"], a: 2, e: "3-tier separates presentation (client), business logic (application server) and data (database server)." },
    { q: "Why do 3-tier designs improve security compared with 2-tier ones?", o: ["Clients never connect directly to the database", "They encrypt every row automatically", "They remove the need for passwords", "They store data only in memory"], a: 0, e: "Only the application server talks to the database, so clients don't hold database credentials or reach it over the network." },
    { q: "A desktop app on each clerk's PC queries a shared database server directly. Which architecture is this?", o: ["1-tier", "2-tier", "3-tier", "Peer-to-peer"], a: 1, e: "Client applications talking directly to a database server form the classic 2-tier client-server architecture." },
  ],
  "schemas-and-data-independence": [
    { q: "Which level of the three-schema architecture describes how data is stored on disk?", o: ["External level", "Conceptual level", "View level", "Internal level"], a: 3, e: "The internal (physical) level describes files, pages, indexes and storage structures." },
    { q: "Adding a new column to a table without breaking existing views is an example of what?", o: ["Physical data independence", "Logical data independence", "Referential integrity", "Data abstraction failure"], a: 1, e: "Logical data independence means changes to the conceptual schema don't force changes to external schemas or applications." },
    { q: "Which kind of data independence is harder to achieve in practice?", o: ["Logical data independence", "Physical data independence", "Both are equally easy", "Neither can be achieved"], a: 0, e: "Applications depend closely on the logical structure, so changing it without affecting them is harder than changing storage details." },
  ],
  "data-models-oltp-olap": [
    { q: "Which workload best describes OLTP?", o: ["Few large analytical scans over history", "Many short reads and writes of current data", "Batch machine learning training", "Read-only reporting once a month"], a: 1, e: "Online transaction processing handles many small, concurrent transactions such as orders and payments." },
    { q: "Why do OLAP systems often use columnar storage?", o: ["It speeds up single-row inserts", "It enforces foreign keys", "Queries read only the few columns they aggregate, with better compression", "It removes the need for indexes on primary keys"], a: 2, e: "Analytical queries scan a few columns across many rows. Column stores read only those columns and compress similar values well." },
    { q: "Which schema is typical in a data warehouse?", o: ["Fully normalized BCNF schema", "Network model", "Hierarchical model", "Star schema with fact and dimension tables"], a: 3, e: "Warehouses use star or snowflake schemas: a central fact table of measurements surrounded by dimension tables." },
  ],
  "entities-and-attributes": [
    { q: "A person's age, computed from their date of birth, is which kind of attribute?", o: ["Composite", "Multivalued", "Derived", "Key"], a: 2, e: "A derived attribute is calculated from other stored attributes and usually isn't stored itself." },
    { q: "How is a multivalued attribute such as phone numbers usually mapped to tables?", o: ["As a separate table with the owner's key", "As a comma-separated column", "As several columns phone1, phone2, phone3", "It can't be mapped"], a: 0, e: "Each value becomes a row in a separate table keyed by the owning entity, which keeps the design in first normal form." },
    { q: "An address made of street, city and PIN code is which kind of attribute?", o: ["Simple", "Derived", "Multivalued", "Composite"], a: 3, e: "A composite attribute is made of smaller component attributes that can be used separately." },
  ],
  "relationships-and-cardinality": [
    { q: "Each employee works in exactly one department, and a department has many employees. What's the cardinality from department to employee?", o: ["One-to-one", "One-to-many", "Many-to-many", "Many-to-one from department"], a: 1, e: "One department relates to many employees, while each employee relates to one department: one-to-many." },
    { q: "Every loan must belong to some customer. What does this express about the loan entity's participation?", o: ["Total participation", "Partial participation", "Optional cardinality", "Recursive relationship"], a: 0, e: "Total participation means every entity in the set takes part in the relationship, drawn with a double line in ER diagrams." },
    { q: "Where does the foreign key go when mapping a one-to-many relationship?", o: ["On the 'one' side", "In a separate junction table always", "On the 'many' side", "On both sides"], a: 2, e: "Each row on the many side references exactly one row on the one side, so the foreign key belongs on the many side." },
  ],
  "weak-entities-and-extended-er": [
    { q: "What identifies a weak entity uniquely?", o: ["Its own primary key alone", "Its partial key combined with the owner entity's key", "A surrogate key generated by the DBMS", "Its multivalued attributes"], a: 1, e: "A weak entity has only a partial key (discriminator), so it needs its owner's key to be unique." },
    { q: "Grouping Car and Truck into a higher-level Vehicle entity is called what?", o: ["Specialization", "Aggregation", "Generalization", "Normalization"], a: 2, e: "Generalization is bottom-up: common features of lower-level entities are combined into a higher-level entity." },
    { q: "Aggregation in an ER model is used to do what?", o: ["Treat a relationship as an entity so it can take part in another relationship", "Compute SUM and AVG over attributes", "Merge two weak entities", "Remove redundant attributes"], a: 0, e: "Aggregation lets a relationship set, such as works-on, participate in another relationship, such as monitored-by." },
  ],
  "er-to-relational-mapping": [
    { q: "How is a many-to-many relationship between Student and Course mapped?", o: ["Foreign key in Student", "Foreign key in Course", "Merge both into one table", "A junction table holding both keys"], a: 3, e: "A junction table with the two foreign keys, usually forming a composite primary key, represents each pairing." },
    { q: "A weak entity Dependent of Employee becomes a table whose primary key is what?", o: ["The dependent's name alone", "Employee key plus the dependent's partial key", "A new auto-increment ID only", "The employee key alone"], a: 1, e: "The owner's key plus the partial key together identify a weak entity, so both form the primary key." },
    { q: "For a one-to-one relationship with total participation on one side, a good mapping puts the foreign key where?", o: ["In the table with total participation", "In the table with partial participation", "In a separate junction table", "Nowhere; one-to-one needs no key"], a: 0, e: "Placing the foreign key on the total-participation side avoids NULLs, since every row there has a partner." },
  ],
  "relations-tuples-domains": [
    { q: "In relational terms, what is the degree of a relation?", o: ["The number of tuples", "The number of attributes", "The number of keys", "The number of foreign keys"], a: 1, e: "Degree counts attributes (columns); cardinality counts tuples (rows)." },
    { q: "Why can't a true relation contain two identical tuples?", o: ["Because a relation is a set", "Because of foreign keys", "Because of indexing", "Because tuples are ordered"], a: 0, e: "A relation is a set of tuples, and sets have no duplicates. That's why every relation has at least one key." },
    { q: "What is a domain in the relational model?", o: ["The table's name", "The set of rows in a table", "The set of allowed values for an attribute", "The database server's network name"], a: 2, e: "A domain is the set of atomic values an attribute can take, similar to a data type plus constraints." },
  ],
  "keys-in-dbms": [
    { q: "A minimal superkey is called what?", o: ["Foreign key", "Composite key", "Alternate key", "Candidate key"], a: 3, e: "A candidate key is a superkey from which no attribute can be removed without losing uniqueness." },
    { q: "If {roll_no} and {email} are both candidate keys and roll_no is chosen as primary key, what is email?", o: ["An alternate key", "A foreign key", "A partial key", "A superkey only"], a: 0, e: "Candidate keys not chosen as the primary key are alternate keys, usually enforced with UNIQUE." },
    { q: "How many superkeys does a relation R(A, B, C) have if A alone is its only candidate key?", o: ["1", "3", "4", "8"], a: 2, e: "Any set containing A is a superkey: {A}, {A,B}, {A,C}, {A,B,C}, which is 4." },
  ],
  "integrity-constraints": [
    { q: "Which constraint says a primary key attribute can't be NULL?", o: ["Referential integrity", "Entity integrity", "Domain constraint", "Check constraint"], a: 1, e: "Entity integrity requires every row to have a non-NULL primary key so it can be identified." },
    { q: "With ON DELETE CASCADE on orders.customer_id, what happens when a customer is deleted?", o: ["The delete is rejected", "The customer's orders are deleted too", "Orders keep a dangling customer_id", "Orders get customer_id set to NULL"], a: 1, e: "CASCADE propagates the delete to referencing child rows." },
    { q: "Inserting an employee with dept_id 99 when department 99 doesn't exist violates which constraint?", o: ["Entity integrity", "Domain constraint", "Key constraint", "Referential integrity"], a: 3, e: "Referential integrity requires every foreign key value to match an existing referenced key." },
  ],
  "basic-relational-algebra": [
    { q: "Which operator picks rows that satisfy a condition?", o: ["Projection (π)", "Selection (σ)", "Rename (ρ)", "Union (∪)"], a: 1, e: "Selection filters tuples by a predicate, like SQL's WHERE; projection picks columns." },
    { q: "R has 5 tuples and S has 4 tuples. How many tuples does R × S have?", o: ["9", "20", "5", "4"], a: 1, e: "A Cartesian product pairs every tuple of R with every tuple of S: 5 × 4 = 20." },
    { q: "What must be true for R ∪ S to be valid?", o: ["R and S have the same number of tuples", "R and S share a key", "R and S are union-compatible: same degree and compatible domains", "S is a subset of R"], a: 2, e: "Set operations need union-compatible relations: the same number of attributes with matching domains." },
  ],
  "joins-and-division": [
    { q: "Which query is a natural fit for the division operator?", o: ["Students who took every required course", "Students who took any course", "Courses with no students", "The average grade per course"], a: 0, e: "Division answers 'for all' questions: tuples in R related to every tuple in S." },
    { q: "How does a natural join decide which attributes to match?", o: ["It matches on primary keys only", "It matches all attributes with the same name", "It needs an explicit ON condition", "It matches nothing and returns a Cartesian product"], a: 1, e: "A natural join equates all commonly named attributes and keeps one copy of each." },
    { q: "Which join keeps unmatched tuples from both relations, padding with NULLs?", o: ["Inner join", "Left outer join", "Semi-join", "Full outer join"], a: 3, e: "A full outer join returns matched tuples plus unmatched tuples from both sides." },
  ],
  "relational-calculus": [
    { q: "How does relational calculus differ from relational algebra?", o: ["Calculus is procedural; algebra is declarative", "Calculus is declarative: it says what to retrieve, not how", "Calculus can't express joins", "Calculus only works on one table"], a: 1, e: "Algebra specifies a sequence of operations; calculus describes the desired result with logic formulas." },
    { q: "What does Codd's theorem state?", o: ["Every relation has a key", "BCNF is always dependency preserving", "Safe relational calculus and relational algebra are equally expressive", "SQL is Turing complete"], a: 2, e: "Codd's theorem shows relational algebra and safe relational calculus can express exactly the same queries." },
    { q: "Why must calculus expressions be 'safe'?", o: ["To guarantee a finite result", "To prevent SQL injection", "To avoid deadlocks", "To ensure indexes are used"], a: 0, e: "An unsafe expression such as 'all tuples not in R' could describe an infinite set; safety restricts results to finite answers." },
  ],
  "anomalies-and-redundancy": [
    { q: "You can't record a new course until a student enrolls in it. Which anomaly is this?", o: ["Update anomaly", "Deletion anomaly", "Insertion anomaly", "Read anomaly"], a: 2, e: "An insertion anomaly happens when a fact can't be stored without an unrelated fact." },
    { q: "Deleting the last student in a course also deletes the course's instructor details. Which anomaly is this?", o: ["Deletion anomaly", "Insertion anomaly", "Update anomaly", "Phantom read"], a: 0, e: "A deletion anomaly loses unrelated facts that happened to be stored in the same row." },
    { q: "What is the root cause of update, insertion and deletion anomalies?", o: ["Missing indexes", "Redundant storage of facts in one table", "Too many tables", "Using surrogate keys"], a: 1, e: "Storing the same fact in many rows, or mixing facts about different entities, causes all three anomalies." },
  ],
  "functional-dependencies": [
    { q: "Given A → B and B → C, which dependency follows by transitivity?", o: ["C → A", "B → A", "A → C", "C → B"], a: 2, e: "Armstrong's transitivity rule: if A → B and B → C, then A → C." },
    { q: "R(A, B, C, D) with A → B, B → C, C → D. What is the closure of {A}?", o: ["{A, B}", "{A, B, C}", "{A}", "{A, B, C, D}"], a: 3, e: "From A get B, from B get C, from C get D, so A+ = {A, B, C, D} and A is a candidate key." },
    { q: "When is a functional dependency X → Y called trivial?", o: ["When Y is a subset of X", "When X is a key", "When Y is empty only", "When X and Y share no attributes"], a: 0, e: "X → Y is trivial if Y ⊆ X, since it holds in every relation." },
  ],
  "normal-forms-1nf-2nf-3nf": [
    { q: "R(StudentID, CourseID, StudentName, Grade) with key (StudentID, CourseID). StudentID → StudentName violates which form?", o: ["1NF", "2NF", "3NF only", "BCNF only"], a: 1, e: "StudentName depends on part of the composite key, which is a partial dependency and violates 2NF." },
    { q: "Which dependency violates 3NF in a relation already in 2NF?", o: ["A non-key attribute depending on another non-key attribute", "A key attribute depending on the full key", "A trivial dependency", "A dependency on the whole key"], a: 0, e: "3NF forbids transitive dependencies, where a non-key attribute depends on another non-key attribute." },
    { q: "A column storing 'Java, Python, SQL' as one value violates which normal form?", o: ["2NF", "3NF", "1NF", "BCNF"], a: 2, e: "1NF requires atomic values; a list in a single cell is a repeating group." },
  ],
  "bcnf-and-decomposition": [
    { q: "A relation is in BCNF when, for every non-trivial X → Y, what holds?", o: ["Y is a prime attribute", "X is a superkey", "X is a foreign key", "Y is a superkey"], a: 1, e: "BCNF requires the left side of every non-trivial functional dependency to be a superkey." },
    { q: "Decomposing R into R1 and R2 is lossless if what holds?", o: ["R1 ∩ R2 is empty", "R1 and R2 have the same degree", "R1 ∩ R2 is a superkey of R1 or of R2", "R1 ∪ R2 has fewer attributes than R"], a: 2, e: "The common attributes must functionally determine all of R1 or all of R2, so the join reconstructs R exactly." },
    { q: "Which trade-off can occur when decomposing into BCNF?", o: ["Some functional dependencies may not be preserved", "The decomposition always becomes lossy", "Redundancy increases", "Candidate keys disappear"], a: 0, e: "BCNF decomposition is always possible losslessly but may lose dependency preservation; 3NF guarantees both." },
  ],
  "what-is-a-transaction": [
    { q: "A transaction has executed its last statement but not yet committed. Which state is it in?", o: ["Active", "Partially committed", "Failed", "Aborted"], a: 1, e: "After the final operation and before the commit is durable, a transaction is partially committed." },
    { q: "After a transaction aborts, what two options does the DBMS have?", o: ["Restart it or kill it", "Commit or checkpoint it", "Lock or unlock it", "Index or vacuum it"], a: 0, e: "An aborted transaction can be restarted, if the failure wasn't a logic error, or killed." },
    { q: "Which statement makes a transaction's changes permanent?", o: ["BEGIN", "SAVEPOINT", "ROLLBACK", "COMMIT"], a: 3, e: "COMMIT ends the transaction successfully and makes its changes durable and visible." },
  ],
  "acid-properties": [
    { q: "Which ACID property does write-ahead logging with a forced flush at commit mainly guarantee?", o: ["Isolation", "Consistency", "Durability", "Atomicity only"], a: 2, e: "Flushing log records to stable storage before acknowledging COMMIT ensures committed changes survive crashes." },
    { q: "Money is debited from A but the crash happens before B is credited; after restart the debit is undone. Which property is this?", o: ["Atomicity", "Isolation", "Durability", "Consistency only"], a: 0, e: "Atomicity: all or nothing. The recovery manager undoes partial transactions." },
    { q: "Which ACID property is mostly the application developer's responsibility?", o: ["Atomicity", "Durability", "Isolation", "Consistency"], a: 3, e: "The DBMS enforces declared constraints, but correct business rules inside transactions are the developer's job." },
  ],
  "isolation-levels": [
    { q: "T1 reads a row, T2 updates and commits it, T1 reads it again and sees a new value. Which anomaly is this?", o: ["Dirty read", "Non-repeatable read", "Phantom read", "Lost update"], a: 1, e: "Reading the same row twice in one transaction and getting different committed values is a non-repeatable read." },
    { q: "Which is the lowest isolation level that prevents dirty reads?", o: ["Read uncommitted", "Read committed", "Repeatable read", "Serializable"], a: 1, e: "Read committed guarantees you only see committed data." },
    { q: "New rows matching a WHERE clause appear when a query is re-run in the same transaction. What is this called?", o: ["Phantom read", "Dirty write", "Cascading abort", "Deadlock"], a: 0, e: "Phantoms are new rows inserted by others that match a previously evaluated predicate." },
  ],
  "schedules-and-serializability": [
    { q: "Two operations conflict when they belong to different transactions, access the same item, and what else?", o: ["Both are reads", "At least one is a write", "Both are commits", "They run on different servers"], a: 1, e: "Read-read pairs never conflict; any pair involving a write on the same item does." },
    { q: "A schedule is conflict serializable if and only if its precedence graph is what?", o: ["Connected", "Complete", "Acyclic", "A tree"], a: 2, e: "An acyclic precedence graph can be topologically sorted into an equivalent serial order." },
    { q: "Which statement about view and conflict serializability is true?", o: ["Every conflict-serializable schedule is view serializable", "Every view-serializable schedule is conflict serializable", "They are identical", "Neither implies correctness"], a: 0, e: "Conflict serializability is stricter. View-serializable schedules with blind writes may not be conflict serializable." },
  ],
  "recoverable-schedules": [
    { q: "A schedule is recoverable when what holds?", o: ["No transaction reads uncommitted data", "A transaction commits only after every transaction it read from has committed", "All transactions commit in timestamp order", "There are no writes"], a: 1, e: "If T2 reads T1's write, T2 must commit after T1, or T1's abort could leave T2 committed on bad data." },
    { q: "What does a cascadeless schedule prevent?", o: ["Deadlocks", "Cascading rollbacks", "Phantom reads", "Lost updates"], a: 1, e: "If transactions only read committed data, one abort can't force others to roll back." },
    { q: "In a strict schedule, what is forbidden until the writer commits or aborts?", o: ["Reading or overwriting the written item", "Reading any item", "Starting new transactions", "Creating checkpoints"], a: 0, e: "Strict schedules block both reads and writes of an item written by an uncommitted transaction, which makes undo by restoring before-images safe." },
  ],
  "locking-and-2pl": [
    { q: "What does basic two-phase locking guarantee?", o: ["Freedom from deadlock", "Conflict serializability", "No cascading aborts", "Maximum concurrency"], a: 1, e: "Basic 2PL guarantees conflict-serializable schedules but can still deadlock and cascade aborts." },
    { q: "Which lock pair is compatible on the same item?", o: ["Shared and exclusive", "Exclusive and exclusive", "Shared and shared", "Exclusive and update"], a: 2, e: "Many readers can hold shared locks together; any exclusive lock conflicts." },
    { q: "Strict 2PL holds which locks until commit or abort?", o: ["All exclusive locks", "Only shared locks", "No locks", "Only intention locks"], a: 0, e: "Holding exclusive locks to the end prevents others reading uncommitted writes, avoiding cascading aborts." },
  ],
  "deadlocks-and-timestamps": [
    { q: "In the wait-die scheme, what happens when a younger transaction requests a lock held by an older one?", o: ["The younger waits", "The younger dies (aborts) and restarts later", "The older is aborted", "Both continue"], a: 1, e: "Wait-die: older transactions may wait for younger ones; younger ones requesting from older ones abort." },
    { q: "In basic timestamp ordering, T with TS(T) < W-timestamp(X) tries to read X. What happens?", o: ["The read succeeds", "T waits", "T is rolled back", "X is deleted"], a: 2, e: "A newer transaction already wrote X, so T would read a value from its future. T is aborted and restarted." },
    { q: "Why do MVCC databases let readers avoid blocking writers?", o: ["Readers see a consistent snapshot from older row versions", "They disable writes during reads", "They use only exclusive locks", "They serialize all transactions"], a: 0, e: "Multi-version concurrency control keeps old versions so readers read a snapshot while writers create new versions." },
  ],
  "failures-and-logging": [
    { q: "What is the write-ahead logging rule?", o: ["Write data pages before log records", "Write a change's log record to stable storage before the changed page", "Never write logs for reads", "Write the log only at checkpoints"], a: 1, e: "WAL requires the log record describing a change to reach stable storage before the modified data page does." },
    { q: "A disk head crash destroys the data files. Which failure type is this?", o: ["Transaction failure", "System crash", "Media failure", "Logical error"], a: 2, e: "Media failure loses non-volatile storage and needs backups plus archived logs to recover." },
    { q: "Which information does an update log record typically contain?", o: ["Transaction ID, item, old value and new value", "Only the new value", "Only the query text", "Only the timestamp"], a: 0, e: "Old values enable undo and new values enable redo." },
  ],
  "undo-redo-checkpoints": [
    { q: "During recovery, which transactions are redone?", o: ["Those with neither start nor commit records", "Those with a commit record in the log", "Only those started after the last checkpoint", "None; only undo is used"], a: 1, e: "Committed transactions are redone to restore durable effects; uncommitted ones are undone." },
    { q: "What is the main purpose of a checkpoint?", o: ["Commit all transactions", "Limit how much log must be scanned during recovery", "Lock the whole database", "Remove indexes"], a: 1, e: "Checkpoints record a known point, so recovery can start near it instead of from the beginning of the log." },
    { q: "What are the three phases of ARIES recovery, in order?", o: ["Analysis, redo, undo", "Undo, redo, analysis", "Redo, analysis, undo", "Lock, log, flush"], a: 0, e: "ARIES analyzes the log, repeats history with redo, then undoes losers." },
  ],
  "file-organization-and-indexes": [
    { q: "A clustered (primary) index has which property?", o: ["Data rows are stored in the index key's order", "It is always a hash index", "A table can have many of them", "It contains no pointers"], a: 0, e: "Clustering orders the data file by the index key, so a table has at most one clustered index." },
    { q: "How does a dense index differ from a sparse index?", o: ["A dense index has an entry for every search key value", "A dense index uses less space", "A sparse index works on unsorted files", "There's no difference"], a: 0, e: "Dense indexes have an entry per key; sparse indexes have entries for only some keys and need a sorted file." },
    { q: "Which file organization makes inserts cheapest?", o: ["Sorted (sequential) file", "Heap (unordered) file", "Clustered B+ tree", "Static hash with full buckets"], a: 1, e: "A heap file appends new records anywhere free, with no ordering to maintain." },
  ],
  "b-trees-and-b-plus-trees": [
    { q: "In a B+ tree, where are all data pointers stored?", o: ["In the root only", "In internal nodes only", "In the leaf nodes", "In a separate hash table"], a: 2, e: "B+ trees keep data pointers in leaves; internal nodes hold only separator keys for routing." },
    { q: "Why are B+ trees good for range queries?", o: ["Leaves are linked in key order", "They store data in the root", "They use hashing", "They have no internal nodes"], a: 0, e: "After finding the start key, the scan follows leaf-to-leaf links sequentially." },
    { q: "With a fan-out of about 100, roughly how many levels index 1 million keys?", o: ["1", "3", "10", "1,000"], a: 1, e: "100³ = 1,000,000, so about three levels. That shallowness is why B+ tree lookups need few disk reads." },
  ],
  "hashing-and-index-choice": [
    { q: "Which query can't use a hash index efficiently?", o: ["WHERE id = 42", "WHERE email = 'x@y.com'", "WHERE salary BETWEEN 40000 AND 60000", "WHERE code = 'A1'"], a: 2, e: "Hashing scatters keys, so range queries can't be answered by walking the index in order." },
    { q: "In extendible hashing, what happens when a bucket overflows?", o: ["The whole table is rebuilt", "The bucket splits and the directory may double", "Records are discarded", "A B+ tree is built instead"], a: 1, e: "Extendible hashing splits only the full bucket, doubling the directory when its local depth exceeds the global depth." },
    { q: "Which column is usually the worst candidate for a B-tree index?", o: ["A boolean column queried for its common value", "A primary key", "A foreign key used in joins", "A frequently filtered date column"], a: 0, e: "Low-selectivity columns return a large fraction of rows, so a full scan is often cheaper than the index." },
  ],
  "sql-vs-nosql-and-cap": [
    { q: "According to the CAP theorem, during a network partition a distributed system must choose between what?", o: ["Consistency and availability", "Atomicity and durability", "Latency and throughput", "Indexing and hashing"], a: 0, e: "When partitions happen, a system either rejects some requests to stay consistent or serves them and risks stale data." },
    { q: "What does 'eventual consistency' mean?", o: ["Reads are always up to date", "Replicas converge to the same value if updates stop", "Data is never replicated", "Writes are rejected until all replicas agree"], a: 1, e: "Replicas may disagree briefly, but they converge once updates stop propagating." },
    { q: "Which data model does MongoDB use?", o: ["Key-value", "Wide-column", "Document", "Graph"], a: 2, e: "MongoDB stores JSON-like BSON documents in collections." },
  ],
  "replication-sharding-partitioning": [
    { q: "What does sharding mainly improve?", o: ["Write scalability, by spreading data across servers", "Referential integrity", "Query parsing speed", "Normal form"], a: 0, e: "Sharding splits data horizontally so writes and storage spread over many machines." },
    { q: "Asynchronous replication can cause which problem?", o: ["Lost writes if the primary fails before replicas receive them", "Deadlocks between replicas", "Duplicate primary keys always", "Slower reads on replicas"], a: 0, e: "With async replication the primary acknowledges commits before replicas have them, so a failover can lose recent writes." },
    { q: "Why can a poorly chosen shard key hurt performance?", o: ["It creates hot shards that receive most traffic", "It disables indexes", "It forces BCNF", "It removes replication"], a: 0, e: "A key such as a timestamp sends all new writes to one shard, creating a hotspot." },
  ],
};
