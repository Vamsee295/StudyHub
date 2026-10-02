import { Course } from './types';
import { generateLessons } from './utils';
import { sqlBasicsLessons } from './sql-content-basics';
import { sqlCrudLessons } from './sql-content-crud';

function extractLessonDescription(content: any): string {
  if (content?.definition) return content.definition;
  if (content?.sections && Array.isArray(content.sections)) {
    const textSec = content.sections.find((s: any) => s.type === 'text' && s.title !== 'Prerequisites') || content.sections[0];
    if (textSec && textSec.content) {
      const plain = textSec.content.replace(/[*_#`]/g, '').trim();
      return plain.slice(0, 160) + (plain.length > 160 ? '...' : '');
    }
  }
  return '';
}

export const sqlCourse: Course = {
  id: "course-sql",
  slug: "sql",
  title: "SQL & Relational Databases",
  description: "From basic queries to complex joins and subqueries. Learn the standard language for relational database management systems.",
  category: "Technical",
  icon: "Database",
  displayOrder: 3,
  modules: [
    {
      id: "sql-mod-1",
      slug: "database-basics",
      title: "Database Basics",
      description: "Introduction to RDBMS, tables, and fundamental database concepts.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: sqlBasicsLessons.map(lesson => ({
        id: `sql-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "sql-mod-2",
      slug: "sql-basics",
      title: "SQL Basics",
      description: "Write your first SELECT, INSERT, UPDATE, and DELETE statements.",
      difficulty: "Beginner",
      estimatedMinutes: 105,
      lessons: sqlCrudLessons.map(lesson => ({
        id: `sql-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "sql-mod-3",
      slug: "filtering",
      title: "Filtering",
      description: "Filter data efficiently using WHERE, LIKE, IN, and BETWEEN.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: generateLessons("filtering", 8)
    },
    {
      id: "sql-mod-4",
      slug: "sql-functions",
      title: "SQL Functions",
      description: "Transform data with built-in string, math, and date functions.",
      difficulty: "Intermediate",
      estimatedMinutes: 120,
      lessons: generateLessons("sql-functions", 8)
    },
    {
      id: "sql-mod-5",
      slug: "grouping",
      title: "Grouping",
      description: "Aggregate data using GROUP BY and HAVING clauses.",
      difficulty: "Intermediate",
      estimatedMinutes: 45,
      lessons: generateLessons("grouping", 3)
    },
    {
      id: "sql-mod-6",
      slug: "joins",
      title: "Joins",
      description: "Combine data from multiple tables using INNER, LEFT, RIGHT, and FULL joins.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: [
        {
          id: "inner-join-lesson",
          slug: "inner-join-lesson",
          title: "INNER JOIN: Combining Related Data from Multiple Tables",
          description: "Master the most important type of SQL join for combining related data.",
          estimatedMinutes: 25,
          content: {
            sections: [
              {
                type: "text",
                title: "Learning Objectives",
                content: "After completing this lesson, you will be able to:\n\n1. Explain what INNER JOIN does and why it's essential for relational databases\n2. Write INNER JOIN queries using both explicit JOIN syntax and WHERE clause syntax\n3. Understand how INNER JOIN differs from other join types (LEFT, RIGHT, FULL)\n4. Handle table aliases and ambiguous column names properly\n5. Solve real-world problems requiring data from multiple related tables\n6. Answer common interview questions about INNER JOIN and query optimization"
              },
              {
                type: "prerequisites",
                links: [
                  {
                    title: "SQL Basics",
                    slug: "sql-basics"
                  },
                  {
                    title: "Filtering",
                    slug: "filtering"
                  }
                ]
              },
              {
                type: "text",
                title: "What Problem Does INNER JOIN Solve?",
                content: "In relational databases, data is normalized across multiple tables to reduce redundancy and improve data integrity. For example:\n\n- **Customers** table: customer information\n- **Orders** table: order information (references customer)\n- **OrderItems** table: items in each order (references order and product)\n- **Products** table: product information\n\nThe challenge is: \"How do I get a complete view of an order including customer details and product information?\"\n\nINNER JOIN solves this by combining rows from two or more tables based on a related column between them, returning only the rows where there is a match in both tables."
              },
              {
                type: "think",
                title: "Think About It: The Dating Problem",
                question: "Imagine you have two lists: one of people who like hiking, and another of people who like photography. How would you find people who enjoy both activities?",
                answerReveal: "You're looking for the intersection of two sets - people who appear in BOTH lists. This is exactly what INNER JOIN does:\n\n- Find rows in Table A that have matching rows in Table B\n- Return only those matching pairs\n- Discard rows from A that don't have matches in B\n- Discard rows from B that don't have matches in A\n\nIn database terms: INNER JOIN returns records that have matching values in both tables."
              },
              {
                type: "text",
                title: "INNER JOIN Syntax: Two Approaches",
                content: "There are two syntactically different but semantically identical ways to write INNER JOIN:\n\n**1. Explicit JOIN Syntax (Recommended)**\n```sql\nSELECT columns\nFROM table1\nINNER JOIN table2\n    ON table1.column = table2.column\nWHERE conditions;\n```\n\n**2. Implicit JOIN Syntax (WHERE clause)**\n```sql\nSELECT columns\nFROM table1, table2\nWHERE table1.column = table2.column\n    AND conditions;\n```\n\n**Why explicit JOIN is preferred:**\n- Separates join conditions from filter conditions\n- More readable, especially with multiple joins\n- Less likely to accidentally create cartesian products\n- Clearly shows intent to join vs filter\n- ANSI standard that works across all major databases\n\nNote: INNER can be omitted - JOIN alone means INNER JOIN in most databases."
              },
              {
                type: "code",
                title: "Simple INNER JOIN Example",
                code: "-- Tables: Customers and Orders\n-- Customers: customer_id, name, email, city\n-- Orders: order_id, customer_id, order_date, total_amount\n\n-- Get customer name with their order details\nSELECT \n    c.name AS customer_name,\n    o.order_id,\n    o.order_date,\n    o.total_amount\nFROM Customers c\nINNER JOIN Orders o\n    ON c.customer_id = o.customer_id;\n\n-- Equivalent using WHERE clause (not recommended)\nSELECT \n    c.name AS customer_name,\n    o.order_id,\n    o.order_date,\n    o.total_amount\nFROM Customers c, Orders o\nWHERE c.customer_id = o.customer_id;",
                explanation: "This query combines customer information with their orders:\n\n1. **FROM Customers c**: Start with the Customers table (aliased as 'c')\n2. **INNER JOIN Orders o**: Join with the Orders table (aliased as 'o')\n3. **ON c.customer_id = o.customer_id**: Match rows where customer IDs are equal\n4. **SELECT**: Choose which columns to return from both tables\n\nResult: Each row shows one customer's name along with one of their orders.\nCustomers without orders are excluded. Orders without valid customer_ids are excluded."
              },
              {
                type: "dryRun",
                title: "Execution Trace: Sample Data",
                iterations: [
                  {
                    "step": 1,
                    "variables": {
                      "Customers": "(1, 'Alice Smith', 'alice@email.com', 'New York'), (2, 'Bob Jones', 'bob@email.com', 'LA'), (3, 'Carol Lee', 'carol@email.com', 'Chicago')",
                      "Orders": "(101, 1, '2023-01-15', 250.00), (102, 1, '2023-01-20', 75.50), (103, 2, '2023-01-18', 300.00)",
                      "join_condition": "c.customer_id = o.customer_id",
                      "result_so_far": ""
                    },
                    "description": "Starting state: 3 customers, 3 orders"
                  },
                  {
                    "step": 2,
                    "variables": {
                      "Customers_row": "(1, 'Alice Smith', 'alice@email.com', 'New York')",
                      "Orders_row": "(101, 1, '2023-01-15', 250.00)",
                      "match": "1 = 1 ✓",
                      "result_row": "('Alice Smith', 101, '2023-01-15', 250.00)",
                      "result_so_far": "1 row"
                    },
                    "description": "First customer matches first order"
                  },
                  {
                    "step": 3,
                    "variables": {
                      "Customers_row": "(1, 'Alice Smith', 'alice@email.com', 'New York')",
                      "Orders_row": "(102, 1, '2023-01-20', 75.50)",
                      "match": "1 = 1 ✓",
                      "result_row": "('Alice Smith', 102, '2023-01-20', 75.50)",
                      "result_so_far": "2 rows"
                    },
                    "description": "First customer matches second order (Alice has two orders)"
                  },
                  {
                    "step": 4,
                    "variables": {
                      "Customers_row": "(2, 'Bob Jones', 'bob@email.com', 'LA')",
                      "Orders_row": "(103, 2, '2023-01-18', 300.00)",
                      "match": "2 = 2 ✓",
                      "result_row": "('Bob Jones', 103, '2023-01-18', 300.00)",
                      "result_so_far": "3 rows"
                    },
                    "description": "Second customer matches his order"
                  },
                  {
                    "step": 5,
                    "variables": {
                      "Customers_row": "(3, 'Carol Lee', 'carol@email.com', 'Chicago')",
                      "Orders_remaining": "none",
                      "match": "No orders for Carol",
                      "result_row": "None (excluded)",
                      "result_so_far": "3 rows (final)"
                    },
                    "description": "Carol has no orders, so she's excluded from results"
                  }
                ]
              },
              {
                type: "text",
                title: "Table Aliases: Why and How to Use Them",
                content: "Table aliases (like 'c' for Customers, 'o' for Orders) are essential for readable JOIN queries:\n\n**Reasons to use aliases:**\n1. **Shorter queries**: 'c.customer_id' vs 'Customers.customer_id'\n2. **Better readability**: Especially important with multiple joins\n3. **Avoid ambiguity**: When same column name exists in multiple tables\n4. **Required for self-joins**: Joining a table to itself\n\n**Best practices for aliases:**\n- Use meaningful abbreviations (cust, ord, prod, emp, dept)\n- Be consistent throughout the query\n- Make aliases obvious (first letter often works)\n- Avoid single letters that could be confusing (like 'a', 'b', 'c' without context)\n\n**Example with ambiguous column names:**\n```sql\nSELECT \n    e.name AS employee_name,\n    d.name AS department_name\nFROM Employees e\nINNER JOIN Departments d\n    ON e.department_id = d.id;\n```\n\nWithout aliases, we'd need: Employees.name and Departments.name - much more verbose."
              },
              {
                type: "code",
                title: "Multiple JOINs: Combining Three or More Tables",
                code: "-- Get order details with customer and product information\nSELECT \n    c.name AS customer_name,\n    o.order_date,\n    p.name AS product_name,\n    oi.quantity,\n    oi.price_per_unit\nFROM Orders o\nINNER JOIN Customers o\n    ON o.customer_id = c.customer_id\nINNER JOIN OrderItems oi\n    ON o.order_id = oi.order_id\nINNER JOIN Products p\n    ON oi.product_id = p.product_id\nWHERE o.order_date >= '2023-01-01';\n\n-- Notice: We can filter after joins or in WHERE clause",
                explanation: "This query shows how to navigate a typical e-commerce schema:\n\n1. **Orders** (central table) - connects to customers and order items\n2. **Customers** - get customer name for each order\n3. **OrderItems** - get what was ordered (quantities, prices)\n4. **Products** - get product names for each item\n\nThe query returns a flattened view where each row represents one item in an order, with all relevant context.\n\nImportant: The order of INNER JOINs doesn't matter for correctness (though it can affect performance)."
              },
              {
                type: "warning",
                title: "Common INNER JOIN Mistakes",
                items: [
                  "Forgetting the ON clause: Results in cartesian product (every row combined with every row)\n      Solution: Always specify how tables are related\n\n      Using wrong join columns: Joining on unrelated columns like name to id\n      Solution: Understand your schema and foreign key relationships\n\n      Ambiguous column names: SELECT city when both tables have a city column\n      Solution: Always qualify column names with table aliases in JOIN queries\n\n      Missing rows due to NULL values: INNER JOIN excludes NULL matches\n      Solution: Understand that NULL ≠ NULL in SQL - use LEFT JOIN if you need to keep NULL matches\n\n      Joining too many tables without necessity: Performance degradation\n      Solution: Only join tables you actually need for your query\n\n      Confusing INNER with OUTER joins: Getting fewer rows than expected\n      Solution: Remember INNER JOIN = intersection, only matching rows"
                ]
              },
              {
                type: "text",
                title: "When to Use INNER JOIN vs Other Join Types",
                content: "Understanding when INNER JOIN is appropriate vs other join types:\n\n**Use INNER JOIN when:**\n- You only want rows that have matches in BOTH tables\n- You're looking for intersections or relationships\n- Business logic requires data from both sides to exist\n- Examples: Orders with customers, Employees with departments, Products with categories\n\n**Consider LEFT JOIN when:**\n- You want ALL rows from the left table, regardless of matches in right\n- You need to find missing relationships (e.g., customers without orders)\n- You're doing data quality checks\n- Examples: All customers (even those who haven't ordered), Products (even those never ordered)\n\n**Consider RIGHT JOIN when:**\n- You want ALL rows from the right table (less common - usually rewrite as LEFT JOIN)\n- Examples: Rarely needed in practice\n\n**Consider FULL JOIN when:**\n- You want ALL rows from both tables, matching where possible\n- Examples: Comparing two versions of a dataset, finding discrepancies\n\n**Key insight**: Start with INNER JOIN unless you specifically need to keep non-matching rows from one or both tables."
              },
              {
                type: "table",
                title: "Comparison: INNER JOIN vs Other Join Types",
                headers: ["Aspect", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
                rows: [
                  ["Returns", "Matching rows from both tables", "All rows from left + matches from right", "All rows from right + matches from left", "All rows from both tables"],
                  ["Non-matching left rows", "Excluded", "Included (NULL for right columns)", "Excluded", "Included (NULL for right columns)"],
                  ["Non-matching right rows", "Excluded", "Excluded", "Included (NULL for left columns)", "Included (NULL for left columns)"],
                  ["Use when", "You need data from both sides", "You need all left records", "You need all right records", "You need complete picture from both sides"],
                  ["Example scenario", "Orders with valid customers", "All customers (see who hasn't ordered)", "All orders (see invalid customer refs)", "Find discrepancies between two datasets"]
                ]
              },
              {
                type: "interviewTraps",
                title: "Interview Questions & Common Traps",
                traps: [
                  {
                    "question": "What's the difference between INNER JOIN and LEFT JOIN?",
                    "trap": "Just saying \"INNER JOIN returns matches, LEFT JOIN includes unmatched left rows\" without explaining when to use each",
                    "solution": "INNER JOIN returns only rows where there's a match in both tables (intersection). LEFT JOIN returns all rows from the left table, plus matching rows from the right table (or NULL if no match).\n\nChoose INNER JOIN when you only want complete relationships (e.g., \"show me orders with customer information\").\nChoose LEFT JOIN when you need to see all records from one side regardless of matches (e.g., \"show me all customers, and their orders if they have any\").\n\nThe key is understanding whether missing relationships are meaningful for your question."
                  },
                  {
                    "question": "Can you INNER JOIN a table to itself? When would you do this?",
                    "trap": "Saying no or not understanding self-joins",
                    "solution": "Yes, you can JOIN a table to itself - this is called a self-join. Use it when:\n\n1. **Hierarchical data**: Employees table with manager_id referencing another employee\n   ```sql\n   SELECT e.name AS employee, m.name AS manager\n   FROM Employees e\n   LEFT JOIN Employees m ON e.manager_id = m.employee_id;\n   ```\n\n2. **Comparing records within same table**: Find pairs of employees hired in same month\n   ```sql\n   SELECT e1.name, e2.name\n   FROM Employees e1\n   INNER JOIN Employees e2 ON e1.hire_month = e2.hire_month AND e1.id < e2.id;\n   ```\n\n3. **Finding missing sequences**: In a table of dates, find gaps\n\nRemember to use aliases to distinguish between the two instances of the same table."
                  },
                  {
                    "question": "How does INNER JOIN handle NULL values in the join columns?",
                    "trap": "Saying NULL values match each other or getting confused",
                    "solution": "In SQL, NULL represents unknown/missing data, and NULL ≠ NULL (NULL compared to anything is NULL/unknown, not true).\n\nTherefore, INNER JOIN treats NULL join column values as non-matching:\n- If table1.column IS NULL, it won't match any row in table2\n- If table2.column IS NULL, it won't match any row in table1\n- Two NULL values do NOT satisfy the join condition\n\nThis is why you might unexpectedly lose rows when joining on nullable columns. Consider:\n1. Cleaning your data to remove NULLs from join columns\n2. Using LEFT JOIN and filtering for NULLs to find missing relationships\n3. Using COALESCE to provide default values for NULL join columns (when appropriate)"
                  }
                ]
              },
              {
                type: "practice",
                "title": "Practice Problems",
                "problems": [
                  {
                    "id": "join-practice-1",
                    "title": "Employees and Departments",
                    "difficulty": "Easy"
                  },
                  {
                    "id": "join-practice-2",
                    "title": "Orders with Customer and Product Details",
                    "difficulty": "Medium"
                  },
                  {
                    "id": "join-practice-3",
                    "title": "Find Students Without Any Enrollments",
                    "difficulty": "Medium"
                  },
                  {
                    "id": "join-practice-4",
                    "title": "Self-Join: Employee Hierarchy",
                    "difficulty": "Hard"
                  }
                ]
              },
              {
                type: "takeaways",
                "title": "Key Takeaways",
                "items": [
                  "INNER JOIN returns only rows where there's a match in both tables (mathematical intersection)",
                  "Always use explicit JOIN syntax with ON clause - never rely on comma-separated WHERE joins",
                  "Table aliases are essential for readability and avoiding ambiguous column references",
                  "INNER JOIN eliminates rows where join column is NULL in either table",
                  "The order of INNER JOINs doesn't affect results (but can affect query performance)",
                  "Use INNER JOIN when you need data from both tables; use OUTER joins when you need to keep non-matching rows",
                  "Understand your schema's foreign key relationships to write correct JOIN conditions",
                  "INNER JOIN is the most commonly used join type in real-world SQL queries"
                ]
              },
              {
                type: "list",
                title: "Revision Checklist",
                items: [
                  "[ ] I can explain what INNER JOIN does and why it's essential for relational databases",
                  "[ ] I can write INNER JOIN queries using both explicit and implicit syntax",
                  "[ ] I can explain the difference between INNER JOIN and LEFT JOIN/RIGHT JOIN/FULL JOIN",
                  "[ ] I can properly use table aliases to avoid ambiguous column references",
                  "[ ] I can handle NULL values correctly in JOIN conditions",
                  "[ ] I can write queries that join three or more tables together",
                  "[ ] I can identify when to use INNER JOIN vs other join types based on the question",
                  "[ ] I can solve real-world problems requiring data from multiple related tables"
                ]
              },
              {
                "type": "text",
                title: "Next Topic: LEFT and RIGHT JOINs",
                content: "Now that you've mastered INNER JOIN, the next step is learning about OUTER joins: LEFT JOIN, RIGHT JOIN, and FULL JOIN. These join types are essential when you need to keep rows that don't have matches in the other table.\n\nIn the OUTER joins section, you'll learn:\n- How LEFT JOIN keeps all rows from the left table regardless of matches\n- How RIGHT JOIN keeps all rows from the right table (less commonly used)\n- How FULL JOIN combines both behaviors\n- Practical use cases for each join type\n- How to combine different join types in complex queries\n- Common interview questions about OUTER joins"
              }
            ]
          }
        },
        // Keep the other 5 lessons as generated content for now
        {
          id: "joins-lesson-2",
          slug: "joins-lesson-2",
          title: "LEFT JOIN: Keeping All Records from the Left Table",
          description: "Learn how LEFT JOIN preserves unmatched rows from the left table.",
          estimatedMinutes: 15,
          content: {
            sections: [
              {
                type: "text",
                title: "Definition",
                content: "LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table, and the matched rows from the right table. If there is no match, the result is NULL on the right side."
              },
              {
                type: "text",
                title: "Why This Matters",
                content: "LEFT JOIN is essential for finding missing relationships and keeping complete records from your primary table."
              },
              {
                type: "text",
                title: "Core Concept",
                content: "LEFT JOIN = all rows from left table + matching rows from right table (NULL where no match)"
              },
              {
                type: "text",
                title: "Syntax",
                content: "```sql\nSELECT columns\nFROM table1\nLEFT JOIN table2\n    ON table1.column = table2.column;\n```"
              },
              {
                type: "code",
                title: "Example: Customers and Their Orders",
                code: "-- Find all customers and their orders (customers without orders show NULL)\nSELECT c.name, o.order_id\nFROM Customers c\nLEFT JOIN Orders o ON c.customer_id = o.customer_id;",
                explanation: "Every row from the left table appears in the result. If there's a matching row in the right table, those columns are filled; otherwise they're NULL."
              },
              {
                type: "text",
                title: "Real-World Use",
                content: "Used extensively for data analysis, finding orphaned records, and ensuring complete reporting."
              },
              {
                type: "warning",
                title: "Common Mistakes",
                items: [
                  "Confusing LEFT JOIN with INNER JOIN",
                  "Forgetting that unmatched rows produce NULL values",
                  "Using WHERE conditions on the right table that unintentionally filter out NULLs"
                ]
              },
              {
                type: "interviewTraps",
                title: "Interview Questions",
                traps: [
                  {
                    question: "How would you find customers who have never placed an order?",
                    trap: "Just saying \"use LEFT JOIN\" without specifying the IS NULL check",
                    solution: "Use LEFT JOIN and check for NULL in the order columns: WHERE o.order_id IS NULL"
                  },
                  {
                    question: "What's the difference between LEFT JOIN and LEFT OUTER JOIN?",
                    trap: "Thinking there's a difference when there isn't one",
                    solution: "Nothing - they're synonymous. OUTER is optional in LEFT/RIGHT/FULL JOIN."
                  }
                ]
              },
              {
                type: "takeaways",
                title: "Quick Revision",
                items: [
                  "LEFT JOIN: Keep all left table rows, fill in right table data where matches exist."
                ]
              },
              {
                type: "practice",
                title: "Practice Prompt",
                problems: [
                  {
                    id: "left-join-practice-1",
                    title: "Find Unmatched Records",
                    difficulty: "Medium"
                  }
                ]
              }
            ]
          }
        },
        {
          id: "joins-lesson-3",
          slug: "joins-lesson-3",
          title: "RIGHT JOIN: Keeping All Records from the Right Table",
          description: "Understand RIGHT JOIN and when it's useful (spoiler: usually rewrite as LEFT JOIN).",
          estimatedMinutes: 15,
          content: {
            sections: [
              {
                type: "text",
                title: "Definition",
                content: "RIGHT JOIN (or RIGHT OUTER JOIN) returns all rows from the right table, and the matched rows from the left table. If there is no match, the result is NULL on the left side."
              },
              {
                type: "text",
                title: "Why This Matters",
                content: "While RIGHT JOIN is less commonly used, understanding it helps you read others' queries and handle specific scenarios."
              },
              {
                type: "text",
                title: "Core Concept",
                content: "RIGHT JOIN = all rows from right table + matching rows from left table (NULL where no match)"
              },
              {
                type: "text",
                title: "Syntax",
                content: "```sql\nSELECT columns\nFROM table1\nRIGHT JOIN table2\n    ON table1.column = table2.column;\n```"
              },
              {
                type: "code",
                title: "Example: Orders and Their Customer Info",
                code: "-- Find all orders and their customer info (orders without valid customers show NULL)\nSELECT o.order_id, c.name\nFROM Customers c\nRIGHT JOIN Orders o ON c.customer_id = o.customer_id;",
                explanation: "Every row from the right table appears in the result. If there's a matching row in the left table, those columns are filled; otherwise they're NULL."
              },
              {
                type: "text",
                title: "Real-World Use",
                content: "Less common in practice - usually clearer to rewrite as LEFT JOIN by swapping table order."
              },
              {
                type: "warning",
                title: "Common Mistakes",
                items: [
                  "Using RIGHT JOIN when LEFT JOIN would be clearer",
                  "Not realizing RIGHT JOIN table1, table2 is equivalent to LEFT JOIN table2, table1",
                  "Confusing which table's rows are preserved"
                ]
              },
              {
                type: "interviewTraps",
                title: "Interview Questions",
                traps: [
                  {
                    question: "When would you choose RIGHT JOIN over LEFT JOIN?",
                    trap: "Saying RIGHT JOIN is commonly used when it's actually rare",
                    solution: "Rarely - usually better to rewrite as LEFT JOIN for clarity. Might be used when the right table is logically your primary focus."
                  },
                  {
                    question: "Is RIGHT JOIN table1, table2 the same as LEFT JOIN table2, table1?",
                    trap: "Thinking they're different operations",
                    solution: "Yes, they produce identical results."
                  }
                ]
              },
              {
                type: "takeaways",
                title: "Quick Revision",
                items: [
                  "RIGHT JOIN: Keep all right table rows, fill in left table data where matches exist (usually rewrite as LEFT JOIN)."
                ]
              },
              {
                type: "practice",
                title: "Practice Prompt",
                problems: [
                  {
                    id: "right-join-practice-1",
                    title: "Rewrite as LEFT JOIN",
                    difficulty: "Medium"
                  }
                ]
              }
            ]
          }
        },
        {
          id: "joins-lesson-4",
          slug: "joins-lesson-4",
          title: "FULL JOIN: Combining Both Outer Join Behaviors",
          description: "Learn how FULL JOIN preserves unmatched rows from both tables.",
          estimatedMinutes: 15,
          content: {
            sections: [
              {
                type: "text",
                title: "Definition",
                content: "FULL JOIN (or FULL OUTER JOIN) returns all rows when there is a match in either left or right table. Rows that don't match are filled with NULL values."
              },
              {
                type: "text",
                title: "Why This Matters",
                content: "FULL JOIN is useful when you need a complete view of data from both tables, including unmatched records from both sides."
              },
              {
                type: "text",
                title: "Core Concept",
                content: "FULL JOIN = all rows from both tables, with NULLs where no match exists"
              },
              {
                type: "text",
                title: "Syntax",
                content: "```sql\nSELECT columns\nFROM table1\nFULL JOIN table2\n    ON table1.column = table2.column;\n```"
              },
              {
                type: "code",
                title: "Example: Customers and All Orders",
                code: "-- See all customers and all orders, matched where possible\nSELECT c.name, o.order_id\nFROM Customers c\nFULL JOIN Orders o ON c.customer_id = o.customer_id;",
                explanation: "Combines the behavior of LEFT JOIN and RIGHT JOIN: keeps all rows from both tables, matching where possible."
              },
              {
                type: "text",
                title: "Real-World Use",
                content: "Used for comparing datasets, finding discrepancies between two versions of data, and comprehensive reporting."
              },
              {
                type: "warning",
                title: "Common Mistakes",
                items: [
                  "Not realizing FULL JOIN may not be supported in all databases (MySQL doesn't support it natively)",
                  "Expecting FULL JOIN to be faster than separate LEFT and RIGHT JOIN queries",
                  "Forgetting that unmatched sides will have NULL values"
                ]
              },
              {
                type: "interviewTraps",
                title: "Interview Questions",
                traps: [
                  {
                    question: "How can you simulate FULL JOIN in MySQL which doesn't support it?",
                    trap: "Just saying \"use UNION\" without specifying the exact approach",
                    solution: "Use UNION of LEFT JOIN and RIGHT JOIN, or UNION of LEFT JOIN with WHERE IS NULL and RIGHT JOIN with WHERE IS NULL"
                  },
                  {
                    question: "What's the difference between FULL JOIN and INNER JOIN?",
                    trap: "Saying FULL JOIN just returns more rows without explaining NULL handling",
                    solution: "FULL JOIN includes unmatched rows from both tables (with NULLs); INNER JOIN only includes matched rows."
                  }
                ]
              },
              {
                type: "takeaways",
                title: "Quick Revision",
                items: [
                  "FULL JOIN: Keep all rows from both tables, showing matches where they exist and NULLs where they don't."
                ]
              },
              {
                type: "practice",
                title: "Practice Prompt",
                problems: [
                  {
                    id: "full-join-practice-1",
                    title: "Compare Two Tables",
                    difficulty: "Medium"
                  }
                ]
              }
            ]
          }
        },
        {
          id: "joins-lesson-5",
          slug: "joins-lesson-5",
          title: "Join Performance and Optimization",
          description: "Learn how to write efficient JOIN queries and understand query execution plans.",
          estimatedMinutes: 15,
          content: {
            sections: [
              {
                type: "text",
                title: "Definition",
                content: "Join performance optimization involves writing queries that execute efficiently by leveraging indexes, choosing join order wisely, and avoiding common performance pitfalls."
              },
              {
                type: "text",
                title: "Why This Matters",
                content: "Poorly written JOIN queries can be extremely slow on large datasets, turning seconds into minutes or hours."
              },
              {
                type: "text",
                title: "Core Concept",
                content: "Optimize JOINs by: using indexed join columns, filtering early, choosing efficient join order, and understanding your database's query planner."
              },
              {
                type: "text",
                title: "Syntax",
                content: "```sql\n-- Good: Join on indexed columns\nSELECT *\nFROM large_table t1\nINNER JOIN large_table t2\n    ON t1.indexed_col = t2.indexed_col\nWHERE t1.date >= '2023-01-01';\n```"
              },
              {
                type: "code",
                title: "Example: Creating Indexes for Joins",
                code: "-- Create indexes to speed up joins\nCREATE INDEX idx_orders_customer_id ON Orders(customer_id);\nCREATE INDEX idx_orderitems_order_id ON OrderItems(order_id);\nCREATE INDEX idx_orderitems_product_id ON OrderItems(product_id);",
                explanation: "Indexes allow the database to quickly find matching rows instead of scanning entire tables. Join order affects how intermediate result sizes grow."
              },
              {
                type: "text",
                title: "Real-World Use",
                content: "Critical for production applications handling large volumes of data."
              },
              {
                type: "warning",
                title: "Common Mistakes",
                items: [
                  "Joining on non-indexed columns causing full table scans",
                  "Not applying WHERE filters early enough in the query execution",
                  "Creating cartesian products by forgetting JOIN conditions",
                  "Not understanding how your specific database executes JOINs"
                ]
              },
              {
                type: "interviewTraps",
                title: "Interview Questions",
                traps: [
                  {
                    question: "How do indexes improve JOIN performance?",
                    trap: "Just saying \"indexes make it faster\" without explaining how",
                    solution: "Indexes allow the database to quickly locate matching rows instead of scanning entire tables, reducing IO and computation."
                  },
                  {
                    question: "Should you always put the smallest table first in a JOIN?",
                    trap: "Saying yes without considering query optimizer complexity",
                    solution: "Not necessarily - modern query optimizers consider many factors. Focus on join conditions and filtering rather than arbitrary ordering."
                  }
                ]
              },
              {
                type: "takeaways",
                title: "Quick Revision",
                items: [
                  "Index join columns, filter early, understand your database's query planner, and measure actual performance."
                ]
              },
              {
                type: "practice",
                title: "Practice Prompt",
                problems: [
                  {
                    id: "join-perf-practice-1",
                    title: "Analyze JOIN Execution Plan",
                    difficulty: "Medium"
                  }
                ]
              }
            ]
          }
        },
        {
          id: "joins-lesson-6",
          slug: "joins-lesson-6",
          title: "Advanced JOIN Techniques: Non-Equi Joins and More",
          description: "Learn about JOINs that use conditions other than equality, and other advanced patterns.",
          estimatedMinutes: 15,
          content: {
            sections: [
              {
                type: "text",
                title: "Definition",
                content: "Advanced JOIN techniques include non-equi joins (using <, >, BETWEEN, etc.), self-joins for hierarchical data, and specialized patterns for temporal data and gap analysis."
              },
              {
                type: "text",
                title: "Why This Matters",
                content: "While equi-joins (=) are most common, understanding advanced JOIN patterns opens up solutions to complex problems."
              },
              {
                type: "text",
                title: "Core Concept",
                content: "JOIN conditions aren't limited to equality - you can use any comparison operator that makes sense for your data relationship."
              },
              {
                type: "text",
                title: "Syntax",
                content: "```sql\n-- Non-equi join example: Find employees who earn more than their managers\nSELECT e.name AS employee, m.name AS manager\nFROM Employees e\nINNER JOIN Employees m\n    ON e.manager_id = m.employee_id\n    AND e.salary > m.salary;\n```"
              },
              {
                type: "code",
                title: "Example: Price Ranges for Products",
                code: "-- Find price ranges for products\nSELECT p.name, MIN(pr.price) AS min_price, MAX(pr.price) AS max_price\nFROM Products p\nINNER JOIN PriceHistory pr\n    ON p.product_id = pr.product_id\n    AND pr.effective_date BETWEEN '2023-01-01' AND '2023-12-31'\nGROUP BY p.name;",
                explanation: "Non-equi joins create relationships based on ranges or inequalities rather than exact matches. Self-joins allow a table to relate to itself."
              },
              {
                type: "text",
                title: "Real-World Use",
                content: "Used in scheduling systems, financial analysis, hierarchical data processing, and temporal data analysis."
              },
              {
                type: "warning",
                title: "Common Mistakes",
                items: [
                  "Assuming all JOINs must use equality (=) conditions",
                  "Not realizing non-equi joins can produce cartesian products if not careful",
                  "Overlooking self-join solutions for hierarchical or relational data within a single table",
                  "Confusing JOIN conditions with WHERE clause filtering purposes"
                ]
              },
              {
                type: "interviewTraps",
                title: "Interview Questions",
                traps: [
                  {
                    question: "What's a non-equi join and when would you use it?",
                    trap: "Just saying \"it's a JOIN with < or >\" without explaining the use case",
                    solution: "A JOIN using comparison operators other than = (like <, >, BETWEEN). Use when relationships are based on ranges or inequalities rather than exact matches."
                  },
                  {
                    question: "How would you find employees who earn more than their managers using JOINs?",
                    trap: "Just saying \"self-join\" without explaining the condition",
                    solution: "Self-join the Employees table joining on manager_id, then add condition e.salary > m.salary"
                  }
                ]
              },
              {
                type: "takeaways",
                title: "Quick Revision",
                items: [
                  "JOIN conditions can use any comparison operator (=, <, >, <=, >=, BETWEEN, LIKE) that correctly represents the table relationship."
                ]
              },
              {
                type: "practice",
                title: "Practice Prompt",
                problems: [
                  {
                    id: "advanced-join-practice-1",
                    title: "Non-Equi JOIN Problems",
                    difficulty: "Medium"
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: "sql-mod-7",
      slug: "subqueries",
      title: "Subqueries",
      description: "Write nested queries to solve complex data retrieval problems.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("subqueries", 4)
    },
    {
      id: "sql-mod-8",
      slug: "database-design",
      title: "Database Design",
      description: "Understand normalization, primary keys, and foreign keys.",
      difficulty: "Advanced",
      estimatedMinutes: 105,
      lessons: generateLessons("database-design", 7)
    },
    {
      id: "sql-mod-9",
      slug: "advanced-sql",
      title: "Advanced SQL",
      description: "Learn Window Functions, CTEs, and advanced analytical queries.",
      difficulty: "Advanced",
      estimatedMinutes: 105,
      lessons: generateLessons("advanced-sql", 7)
    },
    {
      id: "sql-mod-10",
      slug: "placement-sql",
      title: "Placement SQL",
      description: "Practice the most frequently asked SQL interview queries.",
      difficulty: "Advanced",
      estimatedMinutes: 135,
      lessons: generateLessons("placement-sql", 9)
    }
  ]
};
