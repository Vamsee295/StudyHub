// Module 2 - Encapsulation (4 lessons)
import { CourseLessonContent } from './types';

export const encapsulationLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "understanding-encapsulation",
    title: "Understanding Encapsulation: The First Pillar of OOP",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-oop`, `classes-and-objects`, and `fields-and-methods`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Encapsulation as an **Automated Bank ATM Machine**:\n• **The Inner Vault (Private State)**: Millions of dollars in cash are locked inside a thick steel safe (`private double cashVault`). No customer can reach in and grab bills directly.\n• **The Keypad & Dispenser (Public Interface)**: Customers interact with the machine strictly through controlled public buttons (`insertCard()`, `enterPin()`, `withdraw()`).\n• The ATM validates preconditions (Is PIN correct? Is vault balance sufficient? Is daily limit exceeded?) before dispensing cash, ensuring the internal cash vault is never corrupted or stolen."
        },
        {
          type: "callout",
          title: "The 2 Core Tenets of Encapsulation",
          content: "1. **Data Bundling**: Unifying state (fields) and the behaviors (methods) that operate on that state within a single cohesive class.\n2. **Data Hiding & Protection**: Restricting direct external access to internal fields using the `private` access modifier, allowing access only through validated public methods."
        },
        {
          type: "code",
          title: "Vulnerable Public Fields vs Encapsulated BankAccount",
          code: "public class EncapsulationDemo {\n    // === BAD DESIGN: Unencapsulated (Public Fields) ===\n    static class VulnerableAccount {\n        public double balance; // DISASTER: Anyone can do account.balance = -999999.0\n    }\n\n    // === GOOD DESIGN: Properly Encapsulated ===\n    static class SecureAccount {\n        private String accountNumber;\n        private double balance;\n        private static final double MIN_BALANCE = 0.0;\n\n        public SecureAccount(String accNo, double initialDeposit) {\n            this.accountNumber = accNo;\n            if (initialDeposit < MIN_BALANCE) {\n                throw new IllegalArgumentException(\"Initial deposit cannot be negative.\");\n            }\n            this.balance = initialDeposit;\n        }\n\n        // Read-only accessor\n        public double getBalance() {\n            return this.balance;\n        }\n\n        // Controlled mutator with validation\n        public boolean withdraw(double amount) {\n            if (amount <= 0) {\n                throw new IllegalArgumentException(\"Withdrawal amount must be positive.\");\n            }\n            if (amount > this.balance) {\n                System.out.println(\"Transaction Denied: Insufficient funds.\");\n                return false;\n            }\n            this.balance -= amount;\n            System.out.println(\"Withdrew $\" + amount + \". New Balance: $\" + this.balance);\n            return true;\n        }\n    }\n\n    public static void main(String[] args) {\n        SecureAccount acc = new SecureAccount(\"ACC-9921\", 1000.0);\n        acc.withdraw(400.0);  // Success: New Balance = $600.0\n        acc.withdraw(1200.0); // Denied: Insufficient funds\n        System.out.println(\"Final Verified Balance: $\" + acc.getBalance()); // $600.0\n    }\n}",
          language: "java",
          explanation: "In SecureAccount, the balance field is private. External callers cannot arbitrarily alter or corrupt account funds without passing through withdraw() validation rules."
        },
        {
          type: "table",
          title: "The 4 Pillars of Encapsulation",
          headers: ["Pillar", "Implementation Mechanism", "Purpose"],
          rows: [
            ["Data Hiding", "Marking fields `private`", "Prevents unauthorized external reads and arbitrary modifications."],
            ["Accessor Methods (Getters)", "Public `getFieldName()` methods", "Provides controlled, read-only visibility into state."],
            ["Mutator Methods (Setters)", "Public `setFieldName(val)` methods", "Enables state updates only after verifying business rules."],
            ["Invariant Validation", "Guard clauses inside setters/constructors", "Guarantees the object never enters an invalid or illegal state."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Encapsulated Mutation Guard",
          code: "class Thermostat {\n    private int temperature = 20; // Celsius\n    public void setTemperature(int t) {\n        if (t >= 10 && t <= 35) {\n            this.temperature = t;\n        }\n    }\n    public int getTemperature() { return this.temperature; }\n}\n\nclass TestThermostat {\n    public static void main(String[] args) {\n        Thermostat thermo = new Thermostat();\n        thermo.setTemperature(50); // Outside valid range [10, 35]\n        System.out.println(thermo.getTemperature());\n    }\n}",
          expectedOutput: "20",
          explanation: "Because 50 is outside the valid range [10, 35], setTemperature(50) rejects the change, leaving the temperature at its initial value of 20."
        },
        {
          type: "dryRun",
          title: "Execution Trace: `acc.withdraw(1200.0)`",
          iterations: [
            { step: 1, variables: { "balance": "600.0", "Call": "withdraw(1200.0)" }, description: "Invokes member method with amount = 1200.0." },
            { step: 2, variables: { "Check 1": "amount <= 0 (1200.0 <= 0)", "Result": "FALSE" }, description: "Passes positive amount validation." },
            { step: 3, variables: { "Check 2": "amount > balance (1200.0 > 600.0)", "Result": "TRUE" }, description: "Insufficient funds guard triggers. Prints denial message." },
            { step: 4, variables: { "balance": "600.0 (Unchanged)", "Return": "false" }, description: "Aborts transaction without mutating internal balance. Returns false." }
          ]
        },
        {
          type: "warning",
          title: "Common Encapsulation Anti-Patterns",
          items: [
            "**Blindly Generating Getters & Setters**: Automatically creating getters and setters for all private fields without asking if callers need write access destroys encapsulation.",
            "**Public Fields with Separate Validation Methods**: Keeping `public int age;` and writing `validateAge()` does nothing to prevent code from bypassing validation.",
            "**Exposing Internal Data Structures**: Returning direct references to mutable collections or arrays from getters allows external callers to mutate them secretly."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Encapsulation vs Abstraction",
          traps: [
            {
              question: "What is the precise difference between Encapsulation and Abstraction in Object-Oriented Design?",
              trap: "Confusing data hiding with complexity hiding.",
              solution: "• **Encapsulation (Information Hiding & Protection)**: Focuses on **HOW** an object guards its internal data and implementation. Solves the problem of data security and invalid states (achieved via `private` fields and getters/setters).\n• **Abstraction (Complexity Hiding & Interface Design)**: Focuses on **WHAT** an object does rather than how it does it. Solves the problem of high cognitive load and code coupling (achieved via `abstract class` and `interface`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the primary objective of data hiding in Encapsulation?",
          options: [
            "To encrypt source code files on disk",
            "To prevent unauthorized direct access and ensure object invariants cannot be corrupted",
            "To make the program execute with zero RAM usage",
            "To eliminate the need for methods"
          ],
          answer: 1,
          explanation: "Data hiding protects internal object fields from direct outside manipulation, ensuring all state changes are validated through class methods."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Encapsulation binds state and behavior together and protects data via `private` access.",
            "Getters provide read access; setters validate updates before modifying state.",
            "Encapsulation prevents objects from ever entering invalid or inconsistent states.",
            "Encapsulation is about data protection; Abstraction is about interface simplicity."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Access Modifiers Deep Dive, comparing private, default (package-private), protected, and public across classes, packages, and subclasses."
        }
      ]
    }
  },
  {
    slug: "access-modifiers-deep-dive",
    title: "Access Modifiers: private, default, protected & public",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `understanding-encapsulation`, Java package structures, and basic class declarations."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Java Access Modifiers as **Security Clearance Badges in a Corporate Campus**:\n• **`private` (Personal Safe Deposit Box)**: Only you (the exact enclosing class) have the key. Nobody else in the building or outside can see inside.\n• **`default` (Department Floor / Package-Private)**: Anyone working inside your immediate department (**Same Package**) can enter freely. Outsiders and other floors are blocked.\n• **`protected` (Family & Subsidiary Access)**: Open to your department (**Same Package**) PLUS any of your official child subsidiaries (**Subclasses**), even if they are located in another city (**Different Package**).\n• **`public` (Public Street Reception)**: Anyone anywhere in the world can access it."
        },
        {
          type: "callout",
          title: "The 4 Java Access Modifiers Hierarchy",
          content: "From strictest to most accessible:\n$$\\text{private} \\longrightarrow \\text{default (no keyword)} \\longrightarrow \\text{protected} \\longrightarrow \\text{public}$$\nAccess modifiers can be applied to fields, methods, constructors, and nested classes. Top-level classes can only be `public` or `default`."
        },
        {
          type: "code",
          title: "Access Modifiers in Action Across Classes & Packages",
          code: "package com.bank.core;\n\npublic class AccountSecurityDemo {\n    // 1. private: Only accessible inside AccountSecurityDemo\n    private String secretPin = \"4321\";\n\n    // 2. default (package-private): Accessible anywhere inside com.bank.core\n    String internalTrackingCode = \"TRK-881\";\n\n    // 3. protected: Accessible in com.bank.core + subclasses in ANY package\n    protected double transactionFee = 2.50;\n\n    // 4. public: Accessible anywhere in the entire application\n    public String bankName = \"GlobalTrust\";\n\n    public void testInnerAccess() {\n        System.out.println(secretPin);           // OK: Same class\n        System.out.println(internalTrackingCode); // OK: Same class\n        System.out.println(transactionFee);      // OK: Same class\n        System.out.println(bankName);            // OK: Same class\n    }\n}",
          language: "java",
          explanation: "Demonstrates the 4 access levels declared inside a single class. Their visibility changes depending on the caller's package and inheritance relationship."
        },
        {
          type: "table",
          title: "The Definitive Java Access Modifiers Matrix",
          headers: ["Access Modifier", "Same Class", "Same Package", "Subclass (Different Package)", "World (Different Package)"],
          rows: [
            ["`private`", "✅ YES", "❌ NO", "❌ NO", "❌ NO"],
            ["`default` (package-private)", "✅ YES", "✅ YES", "❌ NO", "❌ NO"],
            ["`protected`", "✅ YES", "✅ YES", "✅ YES (via inheritance)", "❌ NO"],
            ["`public`", "✅ YES", "✅ YES", "✅ YES", "✅ YES"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Modifier Access Error",
          code: "class Parent {\n    private int secret = 100;\n    protected int shared = 200;\n}\nclass Child extends Parent {\n    void show() {\n        // System.out.println(secret); // Would cause compile error!\n        System.out.println(shared);\n    }\n}\nclass TestAccess {\n    public static void main(String[] args) {\n        new Child().show();\n    }\n}",
          expectedOutput: "200",
          explanation: "'secret' is private to Parent and inaccessible in Child. 'shared' is protected and accessible to subclasses, printing 200."
        },
        {
          type: "dryRun",
          title: "Compiler Access Verification Trace: Accessing `protected double transactionFee`",
          iterations: [
            { step: 1, variables: { "Caller": "SameClass.java", "Package": "com.bank.core" }, description: "Same class access -> ALLOWED (private, default, protected, public)." },
            { step: 2, variables: { "Caller": "Auditor.java", "Package": "com.bank.core", "IsSubclass": "false" }, description: "Same package non-subclass -> ALLOWED (default, protected, public)." },
            { step: 3, variables: { "Caller": "PremiumAccount.java", "Package": "com.bank.vip", "IsSubclass": "true" }, description: "Different package subclass -> ALLOWED for protected via 'super.transactionFee' or 'this.transactionFee'." },
            { step: 4, variables: { "Caller": "ExternalApp.java", "Package": "com.external.client", "IsSubclass": "false" }, description: "Different package non-subclass -> BLOCKED by compiler! Only public is allowed." }
          ]
        },
        {
          type: "warning",
          title: "Common Access Modifier Pitfalls",
          items: [
            "**Declaring Top-Level Classes `private` or `protected`**: Top-level classes in `.java` files can ONLY be `public` or `default` (package-private). Declaring `private class App {}` causes a compile error.",
            "**Overusing `protected` for Convenience**: Making fields `protected` exposes them to any class in the same package and any subclass worldwide, weakening encapsulation.",
            "**Accidental Default Access**: Omitting a modifier (e.g. `int count;`) does NOT mean public; it means package-private, causing confusing compile errors when imported into other packages."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can Method Overriding Reduce Visibility?",
          traps: [
            {
              question: "If a superclass defines `protected void calculate()`, can a subclass override it as `private void calculate()` or `void calculate()` (package-private)?",
              trap: "Thinking a subclass can restrict access to its own methods.",
              solution: "NO! **A subclass cannot reduce the visibility of an inherited method** (Compile Error: *cannot assign weaker access privileges*). In Java method overriding:\n• You can **widen** visibility (`protected` &rarr; `public`).\n• You **CANNOT narrow** visibility (`public` &rarr; `protected` &rarr; `default` &rarr; `private`) because it would violate Liskov Substitution Principle (polymorphism would fail if a caller using the parent reference cannot access the overridden child method)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which access modifier allows access within the same package and by subclasses located in different packages?",
          options: [
            "private",
            "default (package-private)",
            "protected",
            "public"
          ],
          answer: 2,
          explanation: "`protected` grants access to all classes in the same package, plus subclasses in any package via inheritance."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Java has 4 access levels: `private`, `default` (package-private), `protected`, and `public`.",
            "Top-level classes can only be `public` or `default`.",
            "`private` is the foundation of encapsulation (class-only visibility).",
            "Method overriding can widen access privileges but can never narrow them."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Getters, Setters & Defensive Copying, discovering how mutable objects leak internal state and how defensive copies protect invariants."
        }
      ]
    }
  },
  {
    slug: "getters-and-setters-best-practices",
    title: "Getters, Setters & Defensive Copying",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `understanding-encapsulation`, `access-modifiers-deep-dive`, and `stack-vs-heap-objects`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Defensive Copying as a **Security Desk at an Embassy (Certified Photocopy vs Original Document)**:\n• If a visitor asks to view a secret government record, the security clerk does NOT hand over the original physical ledger book (**Internal Mutable Object**). If they did, the visitor could take a pen and scribble over the numbers.\n• Instead, the clerk places the ledger on a Xerox machine, makes a certified duplicate photocopy (**Defensive Copy**), and hands the copy to the visitor. The visitor can shred or scribble on their copy without affecting the master ledger."
        },
        {
          type: "callout",
          title: "The Mutable Reference Leak Bug",
          content: "Making fields `private` is NOT enough if the field is a **Mutable Reference Type** (e.g. `java.util.Date`, `int[]`, `ArrayList`, custom objects)!\n• If your getter returns `return this.birthDate;`, the caller receives a direct pointer to your internal heap object and can do: `person.getBirthDate().setYear(1900);`, silently corrupting your private field!"
        },
        {
          type: "code",
          title: "The Mutable Reference Leak & The Defensive Copying Solution",
          code: "import java.util.Date;\nimport java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\npublic class DefensiveCopyingDemo {\n    // === SECURE ENCAPSULATED CLASS ===\n    static final class EmployeeRecord {\n        private final String name;           // String is immutable (safe)\n        private final Date joiningDate;      // Date is mutable (VULNERABLE!)\n        private final List<String> skills;   // List is mutable (VULNERABLE!)\n\n        public EmployeeRecord(String name, Date joiningDate, List<String> skills) {\n            this.name = name;\n            // DEFENSIVE COPY ON INPUT (Constructor)\n            this.joiningDate = (joiningDate != null) ? new Date(joiningDate.getTime()) : null;\n            this.skills = (skills != null) ? new ArrayList<>(skills) : new ArrayList<>();\n        }\n\n        public String getName() {\n            return this.name; // Safe: String is immutable\n        }\n\n        // DEFENSIVE COPY ON OUTPUT (Getter)\n        public Date getJoiningDate() {\n            return (this.joiningDate != null) ? new Date(this.joiningDate.getTime()) : null;\n        }\n\n        // UNMODIFIABLE VIEW ON OUTPUT (Getter)\n        public List<String> getSkills() {\n            return Collections.unmodifiableList(this.skills);\n        }\n    }\n\n    public static void main(String[] args) {\n        Date joinDate = new Date(1262304000000L); // Jan 1, 2010\n        List<String> skillsList = new ArrayList<>(List.of(\"Java\", \"SQL\"));\n\n        EmployeeRecord emp = new EmployeeRecord(\"Alice\", joinDate, skillsList);\n\n        // ATTACK 1: Mutating external date passed into constructor\n        joinDate.setTime(0L); // Mutates local variable\n        System.out.println(\"Employee Joining Year: \" + (emp.getJoiningDate().getYear() + 1900)); // Still 2010! Safe!\n\n        // ATTACK 2: Mutating date returned from getter\n        emp.getJoiningDate().setTime(0L); // Mutates copy only\n        System.out.println(\"Employee Joining Year after attack: \" + (emp.getJoiningDate().getYear() + 1900)); // Still 2010! Safe!\n    }\n}",
          language: "java",
          explanation: "Defensive copying in both constructor and getter prevents external callers from ever obtaining a direct mutable pointer to internal state."
        },
        {
          type: "table",
          title: "Safe vs Vulnerable Return Types in Getters",
          headers: ["Data Type Category", "Examples", "Getter Strategy Required"],
          rows: [
            ["Primitives", "`int`, `double`, `boolean`", "Safe to return directly (passed by value)."],
            ["Immutable Reference Types", "`String`, `Integer`, `LocalDate`, `UUID`", "Safe to return directly (internal state cannot be modified)."],
            ["Legacy Mutable Dates", "`java.util.Date`, `Calendar`", "MUST return a clone / defensive copy: `new Date(d.getTime())`."],
            ["Arrays", "`int[]`, `String[]`", "MUST return a cloned copy: `return arr.clone();`."],
            ["Collections", "`List<T>`, `Set<T>`, `Map<K, V>`", "Return unmodifiable wrapper: `Collections.unmodifiableList(list)` or defensive copy."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict UnmodifiableList Mutation Result",
          code: "import java.util.*;\nclass ListGuardTest {\n    public static void main(String[] args) {\n        List<String> internal = new ArrayList<>(List.of(\"A\", \"B\"));\n        List<String> exposed = Collections.unmodifiableList(internal);\n        try {\n            exposed.add(\"C\"); // Attempting to modify unmodifiable view\n        } catch (UnsupportedOperationException e) {\n            System.out.println(\"Blocked: UnsupportedOperationException\");\n        }\n    }\n}",
          expectedOutput: "Blocked: UnsupportedOperationException",
          explanation: "Collections.unmodifiableList throws UnsupportedOperationException if any code attempts to mutate it."
        },
        {
          type: "dryRun",
          title: "Memory Trace: Defensive Copying during `emp.getJoiningDate()`",
          iterations: [
            { step: 1, variables: { "Internal Field": "this.joiningDate (Heap 0x1111)" }, description: "EmployeeRecord holds private Date object at 0x1111." },
            { step: 2, variables: { "Getter Called": "emp.getJoiningDate()", "Action": "new Date(this.joiningDate.getTime())" }, description: "Allocates brand-new Date object on Heap at 0x2222 with identical timestamp." },
            { step: 3, variables: { "Returned Pointer": "0x2222 to Caller" }, description: "Caller receives pointer to 0x2222." },
            { step: 4, variables: { "Caller Action": "returnedDate.setTime(0L)", "Mutated Address": "0x2222" }, description: "Mutates 0x2222. Internal object at 0x1111 remains completely untouched and pristine." }
          ]
        },
        {
          type: "warning",
          title: "Getter and Setter Traps",
          items: [
            "**Returning Direct Array References**: Writing `public int[] getScores() { return this.scores; }` allows callers to do `scores[0] = 999;`, destroying encapsulation.",
            "**Defending Only in Getters but Not Constructors**: If you make defensive copies in getters but forget constructor defensive copies, the caller can mutate the object passed to the constructor.",
            "**Using Modern `java.time` Instead of `java.util.Date`**: In modern Java (Java 8+), use immutable `LocalDate`, `LocalTime`, and `Instant` instead of `java.util.Date` to eliminate the need for defensive date copying."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Is Returning Arrays Dangerous in Java?",
          traps: [
            {
              question: "Why is `public int[] getNumbers() { return this.numbers; }` considered a critical security vulnerability even if `numbers` is declared `private final`?",
              trap: "Thinking `final` makes the array elements immutable.",
              solution: "`final int[] numbers` only makes the **reference pointer unmodifiable** (you cannot reassign `numbers = new int[5]`). However, the **array elements inside the heap object remain 100% mutable**! Any caller can do `obj.getNumbers()[0] = -1;` to corrupt internal state. Fix: `return this.numbers.clone();`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How should a getter safely return a private `List<String>` without allowing callers to modify the internal list?",
          options: [
            "`return this.list;`",
            "`return Collections.unmodifiableList(this.list);`",
            "`return (List<String>) this.list.clone();`",
            "`return null;`"
          ],
          answer: 1,
          explanation: "`Collections.unmodifiableList()` wraps the internal list in a read-only decorator that throws an exception upon any mutation attempt."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Defensive copying creates isolated duplicates to prevent external reference mutation.",
            "Always defend on BOTH input (constructors/setters) and output (getters) for mutable types.",
            "Never return raw array references; return `arr.clone()`.",
            "Use `Collections.unmodifiableList()` or immutable types (`LocalDate`, `String`, records) to simplify design."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Encapsulation in Practice & Immutability, learning the 5 rules for creating 100% immutable classes and modern Java Records."
        }
      ]
    }
  },
  {
    slug: "encapsulation-in-practice",
    title: "Encapsulation in Practice & Immutability",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `getters-and-setters-best-practices`, `access-modifiers-deep-dive`, and defensive copying."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of an Immutable Class as a **Solid Gold Minted Coin**:\n• Once stamped at the mint (**Constructor Initialization**), its weight, purity, and engravings can never be altered by anyone.\n• If you need a coin with a different value or date, you cannot melt and repaint the existing coin; you must mint a completely brand-new coin (**Creating a New Object**).\n• Multiple people (threads) can hold and inspect the coin simultaneously with zero fear of data corruption or race conditions."
        },
        {
          type: "callout",
          title: "The 5 Rules for Creating a 100% Immutable Class in Java",
          content: "1. **Declare the class `final`**: Prevents subclasses from overriding methods and introducing mutable state.\n2. **Make all fields `private` and `final`**: Enforces data hiding and prevents reassignment after construction.\n3. **Do not provide any setter / mutator methods**.\n4. **Initialize all fields in the constructor using Defensive Copies** for any mutable parameters.\n5. **Return Defensive Copies (or unmodifiable views)** in all getter methods for any mutable fields."
        },
        {
          type: "code",
          title: "Classic Immutable Class vs Modern Java Record (Java 14+)",
          code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\npublic class ImmutabilityDemo {\n    // === 1. CLASSIC IMMUTABLE CLASS (Pre-Java 14 Pattern) ===\n    public static final class ImmutableStudent {\n        private final int id;\n        private final String name;\n        private final List<String> subjects;\n\n        public ImmutableStudent(int id, String name, List<String> subjects) {\n            this.id = id;\n            this.name = name;\n            // Defensive copy on input\n            this.subjects = (subjects != null) ? new ArrayList<>(subjects) : new ArrayList<>();\n        }\n\n        public int getId() { return id; }\n        public String getName() { return name; }\n        \n        // Defensive unmodifiable view on output\n        public List<String> getSubjects() {\n            return Collections.unmodifiableList(subjects);\n        }\n    }\n\n    // === 2. MODERN JAVA RECORD (Java 14+) ===\n    // Automatically generates: private final fields, constructor, getters, equals(), hashCode(), and toString()!\n    public record StudentRecord(int id, String name, List<String> subjects) {\n        // Compact Canonical Constructor with defensive copy\n        public StudentRecord {\n            subjects = (subjects != null) ? List.copyOf(subjects) : List.of();\n        }\n    }\n\n    public static void main(String[] args) {\n        List<String> subs = new ArrayList<>(List.of(\"Math\", \"CS\"));\n        ImmutableStudent student1 = new ImmutableStudent(101, \"Alice\", subs);\n        StudentRecord student2 = new StudentRecord(102, \"Bob\", subs);\n\n        System.out.println(student1.getName() + \": \" + student1.getSubjects());\n        System.out.println(student2.name() + \": \" + student2.subjects());\n    }\n}",
          language: "java",
          explanation: "Java 14+ Records eliminate boilerplate while providing immutable data carriers. List.copyOf() ensures the record's list cannot be modified."
        },
        {
          type: "table",
          title: "Encapsulation Architecture: Mutable Class vs Immutable Class vs Record",
          headers: ["Feature", "Standard Encapsulated Class", "Immutable Class", "Java Record (`record`)"],
          rows: [
            ["State Mutability", "Mutable (Setters modify state)", "100% Immutable after construction", "100% Immutable by default"],
            ["Thread Safety", "Requires synchronization (`synchronized`, locks)", "Inherently Thread-Safe (zero locks needed)", "Inherently Thread-Safe"],
            ["Inheritance", "Can extend or be extended", "Declared `final` (cannot be extended)", "`final` by default (extends `java.lang.Record`)"],
            ["Boilerplate Code", "Medium (Getters, setters, validation)", "High (Constructors, defensive copies, getters)", "Zero (Auto-generated constructor, getters, equals, toString)"],
            ["Best Use Case", "Entities with evolving lifecycles (BankAccount)", "Domain Value Objects, Security Tokens, Cache Keys", "Data Transfer Objects (DTOs), API Responses"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Record Immutability",
          code: "record Point(int x, int y) {}\n\nclass RecordTest {\n    public static void main(String[] args) {\n        Point p1 = new Point(5, 10);\n        Point p2 = new Point(5, 10);\n        // p1.x = 20; // Would cause compile error: cannot assign value to final variable x\n        System.out.println(p1.x() + \" \" + (p1.equals(p2)));\n    }\n}",
          expectedOutput: "5 true",
          explanation: "Records provide value-based equality out of the box. p1.equals(p2) is true because both have identical components (5, 10)."
        },
        {
          type: "dryRun",
          title: "Encapsulation in JDK: How `java.util.ArrayList` Maintains Internal Invariants",
          iterations: [
            { step: 1, variables: { "Internal State": "private Object[] elementData; private int size = 0;" }, description: "ArrayList stores elements in private heap array." },
            { step: 2, variables: { "Public Call": "list.get(5)", "Validation": "if (index >= size) throw IndexOutOfBoundsException" }, description: "get() performs bounds checking before accessing elementData." },
            { step: 3, variables: { "Public Call": "list.add(item)", "Action": "ensureCapacityInternal(size + 1)" }, description: "add() automatically handles dynamic array reallocation behind the scenes." },
            { step: 4, variables: { "Result": "Client sees clean O(1) list interface", "Internal Complexity": "Completely hidden" }, description: "Encapsulation achieves full separation between API interface and internal memory management." }
          ]
        },
        {
          type: "warning",
          title: "Common Immutability Mistakes",
          items: [
            "**Omitting the `final` Keyword on Class**: If an immutable class is not `final`, a subclass could override getters to return mutable static fields.",
            "**Assuming `List.of()` or `Arrays.asList()` Can Be Mutated**: `List.of()` creates an immutable list; calling `.add()` throws `UnsupportedOperationException`.",
            "**Modifying Fields via Reflection**: While reflection can technically override private fields, it violates JVM safety and will fail under Java Platform Module System (JPMS) strong encapsulation."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Is `String` Immutable in Java?",
          traps: [
            {
              question: "Why was `java.lang.String` designed to be completely immutable in Java?",
              trap: "Only giving a single reason like 'security'.",
              solution: "1. **String Constant Pool (SCP)**: Immutability allows multiple variables to share the exact same string literal in the SCP, saving massive amounts of Heap memory.\n2. **Security & Parameter Integrity**: Strings are used for database connection URLs, file paths, and network sockets. If String were mutable, a malicious thread could change the file path between verification and file opening (Time-of-Check to Time-of-Use race condition).\n3. **Thread Safety**: Immutable strings can be shared across threads with zero synchronization overhead.\n4. **Hash Code Caching**: String caches its `hashCode` during creation, making HashMap and HashSet key lookups extremely fast."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following is NOT required to make a custom Java class fully immutable?",
          options: [
            "Make all fields private and final",
            "Do not provide setter methods",
            "Implement the `Serializable` interface",
            "Declare the class `final` so it cannot be extended"
          ],
          answer: 2,
          explanation: "Implementing `Serializable` is for object persistence/serialization, not a requirement for immutability."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Immutable classes cannot be modified after construction and are inherently thread-safe.",
            "Follow the 5 rules: `final class`, `private final fields`, no setters, constructor defensive copies, getter defensive copies.",
            "Java 14+ Records (`record`) provide concise immutable data carriers with auto-generated getters, `equals`, and `hashCode`.",
            "`String` immutability powers the String Constant Pool, thread safety, and secure API parameters."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 3: Constructors, mastering default vs parameterized constructors, copy constructors, constructor overloading, and initialization blocks."
        }
      ]
    }
  }
];
