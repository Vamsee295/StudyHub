// Long-form theory for OOP modules 1-3: fundamentals, encapsulation, constructors. Original writing.
import { LessonTheory } from './utils';

const JAVA_OOP = { title: "The Java Tutorials: Object-Oriented Programming Concepts", url: "https://docs.oracle.com/javase/tutorial/java/concepts/index.html" };
const JAVA_CLASSES = { title: "The Java Tutorials: Classes and Objects", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/index.html" };
const JLS = { title: "The Java Language Specification", url: "https://docs.oracle.com/javase/specs/" };
const JVM_SPEC = { title: "The Java Virtual Machine Specification: Run-Time Data Areas", url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.5" };
const ACCESS = { title: "The Java Tutorials: Controlling Access to Members of a Class", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html" };
const IMMUTABLE = { title: "The Java Tutorials: A Strategy for Defining Immutable Objects", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/imstrat.html" };
const CONSTRUCTORS = { title: "The Java Tutorials: Providing Constructors for Your Classes", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html" };
const OBJECT_API = { title: "Java SE API: java.lang.Object", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html" };

export const oopCoreTheory: Record<string, LessonTheory> = {
  "what-is-oop": {
    theory: `Object-oriented programming (OOP) organizes a program around objects: bundles of data and the code that works on that data. Instead of a long list of functions passing data around, you model the problem as interacting objects such as an Account, a Customer and a Transaction. This lesson explains why OOP exists, what the four pillars mean, how OOP compares with procedural code, and where it fits and doesn't.

## The problem OOP solves

Small programs work fine as a sequence of functions. As programs grow to tens of thousands of lines, a procedural style develops problems:

- **Data is exposed**: any function can change any shared variable, so a bug in one place corrupts data used everywhere
- **Changes ripple**: changing how a record is stored means finding and updating every function that touches it
- **Responsibility is unclear**: it's hard to tell which code owns which data

OOP addresses these by grouping each piece of data with the only code allowed to change it. A bank account's balance can only be changed through its \`deposit\` and \`withdraw\` methods, which enforce the rules. Bugs stay local, and internals can change without breaking the rest of the program.

## Objects: state and behaviour

An **object** combines:

- **State**: the data it holds, stored in fields, such as an account's balance and owner
- **Behaviour**: what it can do, defined by methods, such as deposit, withdraw and getBalance
- **Identity**: two accounts with the same balance are still different accounts

A **class** is the blueprint describing what state and behaviour its objects have. Each object created from the class is an **instance** with its own copy of the state.

## The four pillars

| Pillar | Idea | Example |
|---|---|---|
| Encapsulation | Hide internal state; allow changes only through methods | A private balance changed only through deposit and withdraw |
| Abstraction | Expose what an object does, hide how it does it | Calling \`list.add(x)\` without knowing the list's internal array |
| Inheritance | Build new classes from existing ones ("is-a") | A SavingsAccount is an Account with interest |
| Polymorphism | One interface, many implementations | \`shape.area()\` runs the right formula for a Circle or a Square |

Encapsulation and abstraction are related but different. Encapsulation protects data; abstraction simplifies how others use an object. The later modules cover each pillar in depth.

## Procedural versus object-oriented

| | Procedural | Object-oriented |
|---|---|---|
| Organized around | Functions and steps | Objects and their responsibilities |
| Data | Often shared and passed around | Owned and guarded by objects |
| Change | Data format changes ripple through many functions | Changes stay inside the class |
| Typical languages | C, early BASIC | Java, C#, Python, C++ |

Neither is always better. Short scripts and data pipelines often read more clearly as procedures. Large systems with many interacting concepts, such as banking, e-commerce or games, benefit most from OOP.

## Is Java purely object-oriented?

No. Java has eight **primitive types**, such as \`int\`, \`double\` and \`boolean\`, which aren't objects, for performance reasons. Wrapper classes like \`Integer\` turn them into objects when needed, and static methods exist without any object. Languages such as Smalltalk and Ruby treat everything as an object. Interviewers sometimes ask this to check that you know Java's primitives.

## OOP in modern Java

Modern Java mixes OOP with functional ideas. Lambdas pass behaviour as values, streams process collections declaratively, and records give concise immutable data classes. Good Java code uses classes to model concepts and responsibilities, and doesn't force everything into deep inheritance trees. "Prefer composition over inheritance" is a widely followed guideline you'll meet in the inheritance module.

## Thinking in objects

To design with objects, read the problem for nouns and verbs. In "a library lends books to members", the nouns Library, Book and Member become classes, and verbs such as lend and return become methods. Then ask which object should own each piece of data and each rule: the Book knows whether it's available, and the Library enforces the borrowing limit. Assigning responsibilities well is the core skill of object-oriented design.

## How interviewers test this

Expect "What is OOP?", "Explain the four pillars with examples" and "Is Java purely object-oriented?" Define objects as state plus behaviour, give one concrete example per pillar, distinguish encapsulation from abstraction, and mention primitives as the reason Java isn't purely object-oriented.`,
    sources: [JAVA_OOP, JAVA_CLASSES],
  },

  "classes-and-objects": {
    theory: `A class is a blueprint; an object is a concrete thing built from it. Understanding the difference, and what actually happens in memory when you write \`new\`, is the foundation of everything else in OOP. This lesson explains how classes define objects, how objects are created and referenced, what happens when two variables point at the same object, and how objects are compared.

## Classes as blueprints

A class declares the fields every object will have and the methods every object can run:

~~~java
public class Car {
    String model;
    int speed;

    void accelerate(int amount) {
        speed += amount;
    }
}
~~~

The class itself holds no car data. It describes what a car looks like. Writing the class creates no objects at all; it's like an architect's drawing before any house is built.

## Creating objects with new

\`new\` creates an object:

~~~java
Car a = new Car();
a.model = "Swift";
a.accelerate(40);
~~~

Three things happen:

1. The JVM allocates memory for a new Car object on the **heap**, with fields set to default values (0, false or null)
2. The constructor runs to initialize the object
3. \`new\` returns a **reference** to the object, which is stored in the variable \`a\`

The variable doesn't contain the object. It contains a reference, which works like an address telling the program where the object lives.

## Many objects from one class

Each object has its own copy of the instance fields:

~~~java
Car a = new Car();
Car b = new Car();
a.speed = 50;
b.speed = 80;
// a.speed is still 50
~~~

Changing one object's fields doesn't affect another's. That independence is what lets one class model thousands of distinct real-world things.

## Two references, one object

Assigning one reference variable to another copies the reference, not the object:

~~~java
Car a = new Car();
Car b = a;        // b points to the same object
b.speed = 50;
System.out.println(a.speed);   // 50
~~~

There's still only one Car; both variables refer to it. This is called **aliasing**, and it's a common source of surprising bugs: modifying an object through one variable is visible through every other variable that refers to it. To get an independent copy, you must create a new object and copy the fields, which the copy constructors lesson covers.

## null references

A reference variable can hold \`null\`, meaning it refers to no object. Calling a method or reading a field through a null reference throws \`NullPointerException\`, one of the most common runtime errors in Java. Fields of object type default to null, so an uninitialized field is a frequent cause. Java 14 and later produce "helpful NullPointerException" messages that name exactly which variable was null.

## Comparing objects

The \`==\` operator compares references: it's true only if both sides point to the same object.

~~~java
String s1 = new String("hi");
String s2 = new String("hi");
s1 == s2;        // false: different objects
s1.equals(s2);   // true: same contents
~~~

To compare contents, use \`equals()\`. Every class inherits \`equals\` from \`Object\`, where it behaves like \`==\`; classes such as String override it to compare values. Your own classes must override it, together with \`hashCode\`, if equal contents should count as equal, which the Object class lesson covers.

## Object lifetime

An object lives as long as something references it. When no references remain, it becomes unreachable, and the garbage collector eventually reclaims its memory. You never free memory manually in Java, unlike in C or C++, which removes whole classes of bugs such as double frees and dangling pointers.

## Class-level versus object-level members

Most fields and methods belong to each object. Members marked \`static\` belong to the class itself and are shared by all instances, such as a counter of how many cars have been created. Static members are accessed through the class name, \`Car.count\`. The static keyword lesson covers when to use them.

## Naming and design conventions

Java classes use PascalCase nouns, such as \`BankAccount\`; methods and fields use camelCase, such as \`getBalance\`. A class should represent one clear concept. If you struggle to name a class without "and" or "manager", it may be doing too much.

## How interviewers test this

Expect "What's the difference between a class and an object?", "What does new do?" and output questions with aliasing, such as two variables assigned the same object. Explain blueprint versus instance, references versus objects, why changes through one alias appear in the other, and \`==\` versus \`equals\`.`,
    sources: [JAVA_CLASSES, JLS],
  },

  "fields-and-methods": {
    theory: `Fields hold an object's state, and methods define its behaviour. How you declare them decides what each object remembers, who can change it, and how objects interact. This lesson covers instance fields and their default values, local variables, instance and static methods, how methods access state, method signatures and return values, and the design habits that keep classes clean.

## Instance fields

An instance field is declared inside a class but outside any method. Each object gets its own copy:

~~~java
public class Student {
    String name;
    int marks;
    boolean active = true;   // explicit initializer
}
~~~

If you don't initialize a field, Java gives it a default value:

| Type | Default |
|---|---|
| \`byte\`, \`short\`, \`int\`, \`long\` | 0 |
| \`float\`, \`double\` | 0.0 |
| \`char\` | '\\u0000' |
| \`boolean\` | false |
| Any object reference | null |

Defaults prevent garbage values, but relying on them can hide bugs. A \`String name\` that stays null causes a NullPointerException later, far from where the real mistake happened. Initialize fields in a constructor when they're required.

## Local variables are different

Variables declared inside a method are **local**. They exist only while the method runs, live on the stack, and get **no default value**. Using one before assigning it is a compile-time error:

~~~java
void report() {
    int total;
    System.out.println(total);   // compile error: variable might not have been initialized
}
~~~

The compiler enforces this "definite assignment" rule so locals can never contain leftover data.

## Instance methods

An instance method runs on a particular object and can read and change that object's fields:

~~~java
public class Student {
    int marks;

    void addMarks(int extra) {
        marks += extra;          // changes this student's marks
    }

    boolean hasPassed() {
        return marks >= 40;
    }
}
~~~

Calling \`s.addMarks(5)\` changes only \`s\`. Inside the method, \`marks\` refers to the field of the object the method was called on.

## Static fields and methods

A **static** field belongs to the class, with one copy shared by all objects. A static method belongs to the class too and runs without any object:

~~~java
public class Student {
    static int count = 0;      // shared by all students
    String name;

    Student(String name) {
        this.name = name;
        count++;
    }

    static int getCount() {
        return count;
    }
}
~~~

A static method can't use instance fields directly, because there's no object to read them from. \`Math.max\` and \`Integer.parseInt\` are static utility methods.

## Method signatures and overloading

A method's **signature** is its name plus its parameter types. Two methods in a class can share a name if their parameter lists differ, which is **overloading**:

~~~java
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
~~~

The return type isn't part of the signature, so two methods that differ only in return type don't compile.

## Return values and void

A method either returns a value of its declared type or is \`void\`. Every path through a non-void method must return a value, or the code doesn't compile. Methods that answer questions, such as \`hasPassed\`, should return values instead of printing, so callers can decide what to do with the answer.

## Accessing fields from outside

By default, other classes in the same package can read and write an object's fields directly: \`s.marks = -50\`. That bypasses any validation. The encapsulation module shows how marking fields \`private\` and exposing methods prevents invalid states.

## Design habits

- **Fields describe what an object is or has**; avoid storing values that can be computed, such as storing both a birth date and an age that goes stale
- **Methods should do one thing**, with a verb name such as \`calculateTotal\` or \`isEligible\`
- **Prefer methods that use the object's own data**; if a method uses only another object's fields, it probably belongs on that other class
- **Keep methods short**; a method that scrolls off the screen is usually several methods

## How interviewers test this

Expect "What are the default values of fields?", "Why must local variables be initialized?" and "Instance vs static methods?" Give the default table, explain definite assignment for locals, and explain that static members belong to the class, which is why static methods can't use instance fields.`,
    sources: [JAVA_CLASSES, JLS],
  },

  "the-this-keyword": {
    theory: `Inside an instance method or constructor, \`this\` refers to the current object: the one the method was called on. It resolves naming conflicts, lets an object pass itself to other code, chains constructors, and enables fluent method chaining. This lesson explains each use, what \`this\` means in memory, why static methods can't use it, and the traps around it.

## What this refers to

When you call \`a.accelerate(10)\`, Java passes a hidden reference to \`a\` into the method. Inside, that reference is available as \`this\`. Every instance method has it; you often don't write it because Java fills it in for field names:

~~~java
void accelerate(int amount) {
    speed += amount;         // means this.speed += amount
}
~~~

## Use 1: resolving shadowed names

When a parameter or local variable has the same name as a field, the local name **shadows** the field. \`this\` reaches the field:

~~~java
public class Account {
    private double balance;

    public Account(double balance) {
        this.balance = balance;   // field = parameter
    }
}
~~~

Without \`this\`, \`balance = balance\` assigns the parameter to itself, and the field stays at its default value 0.0. The code compiles without complaint, which makes this bug hard to spot. Many IDEs warn about self-assignment for this reason.

## Use 2: passing the current object

An object can hand itself to another method or object:

~~~java
public class Button {
    void register(EventBus bus) {
        bus.subscribe(this);      // pass this button to the event bus
    }
}
~~~

This is common in event listeners, the observer pattern, and parent-child relationships, such as a tree node setting \`child.parent = this\`.

## Use 3: calling another constructor

Inside a constructor, \`this(...)\` calls another constructor of the same class, which avoids duplicated initialization code:

~~~java
public class Rectangle {
    private final int width, height;

    public Rectangle(int side) {
        this(side, side);         // delegate to the two-argument constructor
    }

    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }
}
~~~

The \`this(...)\` call must be the first statement in the constructor. The constructor chaining lesson covers the rules in detail.

## Use 4: method chaining

Returning \`this\` from a method lets callers chain calls in one expression, a style called a **fluent interface**:

~~~java
public class QueryBuilder {
    private final StringBuilder sql = new StringBuilder("SELECT * FROM users");

    public QueryBuilder where(String condition) {
        sql.append(" WHERE ").append(condition);
        return this;
    }

    public QueryBuilder limit(int n) {
        sql.append(" LIMIT ").append(n);
        return this;
    }
}

String q = new QueryBuilder().where("active = true").limit(10).toString();
~~~

\`StringBuilder.append\` and the builder pattern use the same technique.

## Why static methods have no this

A static method belongs to the class and runs without any object, so there's no current object for \`this\` to refer to. Using \`this\` in a static method, including \`main\`, is a compile-time error. To use instance members from \`main\`, create an object first.

## this in lambdas and inner classes

Inside a lambda, \`this\` refers to the enclosing object, because a lambda doesn't create a new scope for \`this\`. Inside an anonymous inner class, \`this\` refers to the anonymous object itself. To reach the outer object from an inner class, write \`Outer.this\`. This difference matters when converting anonymous classes to lambdas, and it's a known interview trap.

## Leaking this from a constructor

Passing \`this\` to other code from inside a constructor, such as registering a listener, lets that code see the object before construction finishes. In multithreaded code, another thread might use a half-initialized object. The safer pattern is to finish construction first, then register, often in a static factory method.

## this versus super

\`this\` refers to the current object as its own class; \`super\` refers to the parent class part of the same object. \`super.method()\` calls the parent's version of an overridden method, and \`super(...)\` calls a parent constructor. Both are covered in the inheritance module.

## Quick recap

- \`this\` is a hidden reference to the object a method runs on
- use it to reach fields hidden by parameters, to pass the current object along, to chain constructors with \`this(...)\`, and to return the object for fluent calls
- static code has no current object, so \`this\` is unavailable there

## How interviewers test this

Expect "What is this used for?", "Can you use this in a static method?" and output questions with shadowed fields where \`balance = balance\` leaves the field unchanged. Name the four uses, explain why static contexts have no this, and mention the lambda versus anonymous class difference for extra credit.`,
    sources: [JAVA_CLASSES, JLS],
  },

  "stack-vs-heap-objects": {
    theory: `When a Java program runs, its data lives in two main memory areas: the stack, which holds method calls and local variables, and the heap, which holds objects. Knowing which goes where explains how references work, why Java passes arguments the way it does, what causes StackOverflowError and OutOfMemoryError, and when objects are garbage collected. This lesson builds a clear picture of both areas.

## The stack

Each thread has its own **stack**. Every method call pushes a **frame** holding the method's parameters, local variables and return address. When the method returns, its frame is popped and all its locals disappear instantly.

- Allocation and cleanup are extremely fast: moving a pointer
- Size is limited, often 512 KB to 1 MB per thread by default
- Data is private to the thread

## The heap

The **heap** is a single large area shared by all threads, where every object and array is allocated. Objects live there until no references reach them, and the garbage collector reclaims them later.

- Can hold gigabytes, sized with JVM options such as \`-Xmx\`
- Allocation is fast in modern JVMs, but cleanup requires garbage collection
- Shared between threads, so concurrent access needs care

## What goes where

~~~java
void demo() {
    int count = 5;                 // primitive local: on the stack
    Car car = new Car();           // reference 'car' on the stack; Car object on the heap
    car.speed = 60;                // field 'speed' lives inside the object, on the heap
}
~~~

| Item | Location |
|---|---|
| Local primitive variables | Stack (inside the method's frame) |
| Local reference variables | Stack (the reference itself) |
| Objects and arrays | Heap |
| Instance fields, including primitives | Heap, inside their object |
| Static fields | With the class's data in the heap (in modern JVMs) |

A common misconception is that primitives always live on the stack. An \`int\` field of an object lives on the heap with that object; only local primitives live on the stack.

## Java passes references by value

Java always passes arguments **by value**. For objects, the value copied is the reference, so the method gets its own copy of the address pointing to the same object:

~~~java
void rename(Car c) {
    c.model = "Baleno";   // changes the shared object: visible to the caller
    c = new Car();        // rebinds the local copy only: caller unaffected
}
~~~

The method can modify the object the caller passed, but it can't make the caller's variable point to a different object. This is why Java has no pass-by-reference, despite objects behaving that way for field changes. Swapping two objects inside a method, for the same reason, doesn't affect the caller.

## StackOverflowError

Each call adds a frame. Deep or infinite recursion keeps pushing frames until the stack's fixed size runs out, throwing \`StackOverflowError\`. Missing base cases are the usual cause. Recursion depth of tens of thousands can overflow even when correct, which is why deep traversals are often rewritten with an explicit stack data structure on the heap.

## OutOfMemoryError

If the heap fills with reachable objects and garbage collection can't free enough space, the JVM throws \`OutOfMemoryError\`. Causes include loading huge datasets into memory and **memory leaks**: objects that are no longer needed but still referenced, often from a static collection or a cache that never evicts.

## Garbage collection basics

The garbage collector finds objects that can't be reached from any **GC root**: local variables in active stack frames, static fields, and a few JVM internals. Unreachable objects are freed, even when they form cycles that reference each other. Most objects die young, so the JVM uses **generational** collection: a young generation collected often and cheaply, and an old generation for long-lived objects. You can't force collection; \`System.gc()\` is only a suggestion.

## Escape analysis

Modern JVMs analyse whether an object ever escapes the method that creates it. If it doesn't, the JIT compiler may avoid heap allocation entirely, replacing the object with its fields in registers or on the stack. This is an optimization, not a language rule, so you still reason about objects as heap-allocated.

## Strings and the pool

String literals are stored in a shared **string pool** on the heap, so identical literals refer to one object. \`new String("hi")\` always creates a separate heap object, which is why \`==\` between them is false.

## How interviewers test this

Expect "Where are objects and local variables stored?", "Is Java pass-by-value or pass-by-reference?" and "What causes StackOverflowError versus OutOfMemoryError?" Draw the stack frame holding a reference to a heap object, explain that references are passed by value, and connect each error to its memory area.`,
    sources: [JVM_SPEC, JLS],
  },

  "understanding-encapsulation": {
    theory: `Encapsulation means keeping an object's data private and allowing changes only through methods that enforce the rules. It's the pillar that makes objects trustworthy: if the only way to change a bank balance is through \`deposit\` and \`withdraw\`, the balance can never go negative by accident. This lesson explains why encapsulation matters, how it protects invariants, how it enables change, and how it differs from data hiding and abstraction.

## The problem with public fields

Consider an account with a public field:

~~~java
public class Account {
    public double balance;
}

account.balance = -5000;   // nothing stops this
~~~

Any code anywhere can set the balance to anything. The rule "balance can't go negative" isn't enforced; every caller must remember it, and one forgetful caller breaks it. Debugging is hard too, because the bad value could have come from anywhere.

## The encapsulated version

~~~java
public class Account {
    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0 || amount > balance) throw new IllegalArgumentException("Invalid withdrawal");
        balance -= amount;
    }

    public double getBalance() {
        return balance;
    }
}
~~~

Now the balance is \`private\`, so only Account's own methods can touch it, and every change goes through a check. The rule is enforced in one place, for every caller.

## Invariants

An **invariant** is a condition that must always hold for an object to be valid: balance ≥ 0, a date's month between 1 and 12, a list's size matching its element count. Encapsulation's main job is protecting invariants:

- constructors establish them when the object is created
- every public method preserves them
- private fields prevent outside code from breaking them

If an invariant ever breaks, the bug must be inside the class, which narrows the search to one file.

## Freedom to change internals

Because callers depend only on public methods, the class can change its internals freely. The account could switch from \`double\` to \`BigDecimal\` for exact money arithmetic, or store transactions and compute the balance on demand. As long as \`deposit\`, \`withdraw\` and \`getBalance\` behave the same, no caller changes. Public fields freeze the internal design forever, since any change breaks every caller.

## Encapsulation, data hiding and abstraction

These terms overlap and are often confused:

| Term | Meaning |
|---|---|
| Data hiding | Making fields inaccessible from outside, using \`private\` |
| Encapsulation | Bundling data with the methods that operate on it, and controlling access |
| Abstraction | Exposing what an object does while hiding how |

Data hiding is the mechanism; encapsulation is the broader design principle that uses it. Abstraction is about simplifying the interface others see. A well-designed class uses all three.

## Tell, don't ask

A useful guideline: tell objects what to do instead of asking for their data and making decisions outside. Compare:

~~~java
// Asking: logic lives outside the object
if (account.getBalance() >= amount) account.setBalance(account.getBalance() - amount);

// Telling: the object enforces its own rule
account.withdraw(amount);
~~~

The second keeps the rule inside Account. Classes with only getters and setters, and all logic elsewhere, are called **anemic** objects; they have private fields but little real encapsulation.

## Encapsulation beyond fields

Encapsulation applies at every level:

- **Methods**: helper methods used only internally should be private
- **Classes**: classes used only inside a package can be package-private
- **Modules**: Java's module system (\`module-info.java\`) hides whole packages from other modules

The principle is the same everywhere: expose the smallest surface that others need.

## Costs and judgement

Encapsulation adds methods and indirection. For plain data carriers, such as a DTO passed between layers or a configuration value, that ceremony may not pay off; Java **records** provide concise, immutable data classes for exactly these cases. Use full encapsulation where rules and invariants exist.

## A quick checklist

When reviewing a class for encapsulation, ask: are all fields private? Does every public method keep the invariants true? Can a caller reach a mutable internal object through a getter? Could the internal representation change without editing any caller? A yes to the last question is the clearest sign the class is well encapsulated.

## How interviewers test this

Expect "What is encapsulation and why use it?", "Encapsulation vs abstraction?" and "Give a real example." Use the bank account with a private balance and validated methods, define invariants, explain that internals can change without breaking callers, and distinguish data hiding, encapsulation and abstraction.`,
    sources: [JAVA_OOP, ACCESS],
  },

  "access-modifiers-deep-dive": {
    theory: `Access modifiers control which code can see a class, field, method or constructor. Java has four levels: private, package-private (no modifier), protected and public. Choosing the narrowest level that works is how encapsulation is enforced by the compiler. This lesson explains each level precisely, the subtle rules of protected, what applies to top-level classes, and how to choose.

## The four levels

| Modifier | Same class | Same package | Subclass in another package | Any other class |
|---|---|---|---|---|
| \`private\` | Yes | No | No | No |
| (none) package-private | Yes | Yes | No | No |
| \`protected\` | Yes | Yes | Yes (through inheritance) | No |
| \`public\` | Yes | Yes | Yes | Yes |

Each level includes everything the narrower levels allow. Package-private is the default when you write no modifier, and it's often misunderstood as "public within the project"; it's only public within the same package.

## private

Private members are visible only inside the class that declares them, including its nested classes. Use private for all fields by default, and for helper methods that are implementation details. Private members aren't inherited in a usable way: a subclass object contains the parent's private fields, but subclass code can't access them directly.

Note that private is per class, not per object. One Account object's method can read another Account's private balance:

~~~java
boolean hasMoreThan(Account other) {
    return this.balance > other.balance;   // allowed: same class
}
~~~

## Package-private

With no modifier, a member is visible to every class in the same package. It's useful for classes that collaborate closely within one package while hiding them from the rest of the codebase, and for test code placed in the same package. Many library implementation classes are package-private so users can't depend on them.

## protected

Protected members are visible within the same package and to subclasses in other packages. The subclass rule has a subtlety: code in a subclass in another package can access a protected member only through references of its own type or subtypes, not through an arbitrary parent-type reference.

~~~java
package animals;
public class Animal { protected int age; }

package pets;
public class Dog extends animals.Animal {
    void test(Dog d, animals.Animal a) {
        this.age = 3;   // allowed
        d.age = 4;      // allowed: Dog reference
        a.age = 5;      // compile error: Animal reference from another package
    }
}
~~~

Protected is part of a class's API for subclasses, so it's a commitment: changing a protected member can break subclasses you don't control. Use it deliberately, not as a halfway house between private and public.

## public

Public members are visible everywhere. Everything public becomes part of the contract other code depends on, and changing it later can break callers. Keep the public surface small: the methods others genuinely need.

## Top-level classes

A top-level class can only be \`public\` or package-private. A public class must be declared in a file with the same name, so each file has at most one public top-level class. Nested classes can use all four levels; a private nested class is a common way to hide a helper type, such as a linked list's Node.

## Overriding and access

An overriding method can't reduce visibility: if the parent method is public, the override must be public. Widening is allowed, such as overriding a protected method as public. This rule preserves substitutability: code that can call the parent method must be able to call the override.

## Access and constructors

Constructors take access modifiers too:

- a **private constructor** prevents outside instantiation, used by singletons, utility classes such as \`Math\`, and static factory methods
- a **protected constructor** lets subclasses create instances while preventing direct creation by unrelated code

## Modules add a layer

Since Java 9, the module system restricts access further. A public class in a package that its module doesn't **export** isn't accessible to other modules. This lets libraries hide internal packages completely, which earlier Java could only suggest by convention.

## Choosing a level

Start with the most restrictive level and open up only when needed:

1. Fields: private, almost always
2. Helper methods: private
3. Collaborators within a package: package-private
4. Extension points for subclasses: protected, deliberately
5. The intended API: public

## How interviewers test this

Expect the access table, "What is the default access level?", "Can a top-level class be private?" and protected subtleties. Recite the table, explain that package-private isn't project-wide, explain the protected-through-subclass-reference rule, and note that overrides can't narrow visibility.`,
    sources: [ACCESS, JLS],
  },

  "getters-and-setters-best-practices": {
    theory: `Getters and setters are methods that read and write private fields. They're the most common way to expose encapsulated state, but used carelessly they undo encapsulation by letting callers set anything. This lesson explains how to write them well: validating input, returning defensive copies of mutable data, avoiding setters where possible, and following naming conventions that frameworks rely on.

## The basic pattern

~~~java
public class Student {
    private String name;
    private int age;

    public String getName() { return name; }
    public int getAge() { return age; }

    public void setAge(int age) {
        if (age < 0 || age > 150) throw new IllegalArgumentException("Invalid age: " + age);
        this.age = age;
    }
}
~~~

Boolean getters conventionally start with \`is\`, such as \`isActive()\`. These names are the **JavaBeans** convention, which frameworks such as Spring, Hibernate and Jackson use to discover properties automatically.

## Setters must validate

A setter that assigns blindly is barely better than a public field:

~~~java
public void setAge(int age) { this.age = age; }   // allows -40
~~~

The point of a setter is to be the gatekeeper. Check the value, throw \`IllegalArgumentException\` (or a domain-specific exception) for invalid input, and keep the object's invariants intact. Validation in one place protects every caller.

## Not every field needs a setter

Generating a getter and setter for every field automatically, as IDEs make convenient, often exposes state that should never change after construction, such as an ID, a creation date or an account number. Ask for each field:

- Should outside code be able to change this at all?
- If yes, should it be a free-form set, or a meaningful operation like \`deposit\` or \`rename\`?

Behaviour-named methods carry rules and intent better than raw setters. \`account.setBalance(x)\` invites misuse; \`account.deposit(amount)\` expresses a real operation.

## Defensive copies on the way out

Returning a reference to a mutable internal object lets callers change it behind the class's back:

~~~java
public class Course {
    private final List<String> students = new ArrayList<>();

    public List<String> getStudents() {
        return students;                 // caller can now add or remove students directly
    }
}

course.getStudents().clear();            // silently empties the course
~~~

Return a copy or an unmodifiable view instead:

~~~java
public List<String> getStudents() {
    return List.copyOf(students);        // or Collections.unmodifiableList(students)
}
~~~

\`List.copyOf\` creates an independent immutable snapshot. \`Collections.unmodifiableList\` returns a read-only view that still reflects later changes inside the class. Either way, callers can't modify the internal list.

## Defensive copies on the way in

The same risk exists when accepting mutable objects. If a constructor stores a caller's \`Date\` or array directly, the caller keeps a reference and can change it later:

~~~java
public Period(Date start, Date end) {
    this.start = new Date(start.getTime());   // copy first
    this.end = new Date(end.getTime());
    if (this.start.after(this.end)) throw new IllegalArgumentException("start after end");
}
~~~

Copy before validating, so a caller can't change the value between the check and the copy. Better still, use immutable types: \`java.time.LocalDate\` replaces the mutable \`Date\` and needs no copying.

## Computed getters

A getter doesn't have to return a stored field. \`getAge()\` can compute age from a stored birth date, and \`getTotal()\` can sum line items. Callers can't tell the difference, which is encapsulation at work: the class decides what to store and what to compute.

## Getters and performance

Plain getters cost nothing measurable: the JIT compiler inlines them. Don't make fields public "for speed".

## Lombok and records

Libraries such as Lombok generate getters and setters from annotations, cutting boilerplate. Java **records** generate accessor methods automatically, named after the components, such as \`point.x()\` rather than \`getX()\`, and have no setters because records are immutable. For plain data, records are often the cleanest choice.

## A quick checklist

- validate every value a setter accepts
- skip setters for fields that never change after construction
- prefer named operations such as \`deposit\` over raw setters
- copy mutable objects on the way in and on the way out
- reach for records when the class only carries data

## How interviewers test this

Expect "Why use getters and setters instead of public fields?", "What's a defensive copy?" and "Should every field have a setter?" Explain validation in setters, show the leaked-list bug and fix it with \`List.copyOf\`, recommend behaviour-named methods over raw setters, and mention records for immutable data.`,
    sources: [JAVA_CLASSES, IMMUTABLE],
  },

  "encapsulation-in-practice": {
    theory: `The strongest form of encapsulation is immutability: an object whose state can't change after construction. Immutable objects are simpler to reason about, safe to share between threads, and excellent as map keys. This lesson explains the rules for building immutable classes, why String is immutable, how to handle mutable components, when to use records, and the trade-offs of immutability.

## What immutability means

An immutable object's observable state never changes after its constructor finishes. To "modify" it, you create a new object with the new value:

~~~java
String s = "hello";
String upper = s.toUpperCase();   // new object; s is still "hello"
~~~

\`LocalDate\`, \`Integer\`, \`BigDecimal\` and \`String\` are immutable classes in the JDK.

## Rules for an immutable class

1. Make all fields \`private\` and \`final\`
2. Provide no setters or other methods that change state
3. Prevent subclassing, by making the class \`final\` or the constructor private with a static factory, so a subclass can't add mutable behaviour
4. Make defensive copies of mutable objects passed into the constructor
5. Never return references to mutable internal objects; return copies or unmodifiable views

~~~java
public final class Money {
    private final long paise;
    private final String currency;

    public Money(long paise, String currency) {
        if (paise < 0) throw new IllegalArgumentException("Negative amount");
        this.paise = paise;
        this.currency = currency;
    }

    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("Currency mismatch");
        return new Money(paise + other.paise, currency);   // new object
    }

    public long paise() { return paise; }
    public String currency() { return currency; }
}
~~~

## final isn't enough by itself

\`final\` makes a field's reference unchangeable, not the object it points to:

~~~java
private final List<String> tags = new ArrayList<>();
// tags can't be reassigned, but tags.add("x") still works
~~~

For deep immutability, store immutable collections (\`List.copyOf\`) or copy on access. A class is only as immutable as its least immutable field.

## Benefits

- **Simpler reasoning**: an object's value is fixed when created, so there are no surprising changes through aliases
- **Thread safety**: immutable objects can be shared between threads with no locks, because there's nothing to race on. The Java memory model guarantees other threads see the fully constructed values of final fields
- **Safe hash keys**: a HashMap key whose hash code changes after insertion gets lost in the wrong bucket; immutable keys can't change
- **Caching and reuse**: identical immutable values can be shared, as Java does with the string pool and with small Integer values
- **Failure atomicity**: an operation that fails partway can't leave an immutable object half-changed

## Why String is immutable

String's immutability supports several things at once: the string pool can share literals safely; strings can be cached hash map keys with precomputed hash codes; and security-sensitive values, such as file paths or class names checked before use, can't be changed by other code after the check.

## The cost: more objects

Every change creates a new object. Concatenating strings in a loop creates many temporary strings, which is why \`StringBuilder\` exists as a mutable companion for building. The common pattern is a mutable builder for construction and an immutable result for sharing. Modern JVMs allocate short-lived objects cheaply, so immutability is rarely a performance problem outside tight loops.

## Records

Java records (Java 16+) are concise immutable data carriers:

~~~java
public record Point(int x, int y) {
    public Point {
        if (x < 0 || y < 0) throw new IllegalArgumentException("Negative coordinate");
    }
}
~~~

The compiler generates private final fields, a constructor, accessors (\`x()\` and \`y()\`), and \`equals\`, \`hashCode\` and \`toString\`. The compact constructor shown validates arguments. Records are shallowly immutable: a record component that's a mutable list can still be changed unless you copy it.

## Choosing mutability

Immutability suits values: money, dates, coordinates, configuration, messages and identifiers. Mutable objects suit entities whose state genuinely evolves, such as a shopping cart being filled, or a game character moving, especially when frequent changes would create too much garbage. Even then, keep mutation encapsulated behind methods that preserve invariants.

## How interviewers test this

Expect "How do you create an immutable class?", "Why is String immutable?" and "Is a final field enough for immutability?" List the five rules, explain that final protects the reference but not the referenced object, give thread safety and hash-key safety as benefits, and mention records.`,
    sources: [IMMUTABLE, JLS],
  },

  "what-is-a-constructor": {
    theory: `A constructor is a special block of code that runs when an object is created, putting it into a valid starting state. Good constructors make it impossible to create a half-initialized or invalid object. This lesson explains how constructors differ from methods, what happens step by step during object creation, how field initializers and initializer blocks fit in, and how to design constructors that protect invariants.

## Constructor syntax

A constructor has the same name as its class and no return type, not even \`void\`:

~~~java
public class Student {
    private final String name;
    private final int rollNo;

    public Student(String name, int rollNo) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name required");
        this.name = name;
        this.rollNo = rollNo;
    }
}

Student s = new Student("Asha", 42);
~~~

If you add a return type, it's no longer a constructor but an ordinary method that happens to share the class name, which compiles and causes confusing bugs.

## Constructors versus methods

| | Constructor | Method |
|---|---|---|
| Name | Same as the class | Any valid name |
| Return type | None | Required (or void) |
| Called | Automatically by \`new\` | Explicitly by name |
| Inherited | No | Yes (unless private or static) |
| Purpose | Initialize a new object | Perform behaviour |

Constructors aren't members in the inheritance sense: a subclass doesn't inherit its parent's constructors, though it calls one through \`super(...)\`.

## What happens during new

Creating an object runs these steps in order:

1. Memory is allocated on the heap, and every field gets its default value (0, false, null)
2. The constructor is called; its first action is calling a parent constructor, explicitly with \`super(...)\` or implicitly with \`super()\`, all the way up to \`Object\`
3. After the parent constructor returns, this class's **field initializers** and **instance initializer blocks** run, in the order they appear in the source
4. The rest of the constructor body runs
5. \`new\` returns the reference

Knowing this order explains output questions with print statements in constructors, initializers and parent classes.

## Field initializers and initializer blocks

Fields can be initialized where they're declared, and instance initializer blocks run code for every constructor:

~~~java
public class Counter {
    private int count = 10;                 // field initializer
    private final List<String> log;

    {                                       // instance initializer block
        log = new ArrayList<>();
    }

    public Counter() {
        count++;                            // runs after the initializer: count becomes 11
    }
}
~~~

Initializer blocks are rare in modern code; field initializers or a shared private method are clearer. Static initializer blocks, marked \`static { }\`, run once when the class is first loaded, not per object.

## Constructors should establish invariants

A constructor's main job is making sure every object starts valid:

- require all mandatory data as parameters, rather than allowing "empty" objects to be filled in later
- validate arguments and throw \`IllegalArgumentException\` for bad input
- initialize every final field, which the compiler enforces

If a constructor throws, no object is created, and the caller never receives a reference to invalid data.

## Avoid heavy work and overridable calls

Constructors should be quick and predictable. Avoid:

- **Expensive work** such as network calls or reading large files: callers expect \`new\` to be cheap, and failures are harder to handle. Use a factory method or a separate \`load()\` step
- **Calling overridable methods**: if a constructor calls a method that a subclass overrides, the override runs before the subclass's own fields are initialized, and may see null or zero values
- **Leaking this**: passing the half-built object to other code, as the this keyword lesson explains

## Static factory methods

An alternative to public constructors is a static method that returns an instance:

~~~java
public static Student of(String name, int rollNo) { return new Student(name, rollNo); }
~~~

Factories can have descriptive names (\`LocalDate.of\`, \`List.of\`), return cached instances, or return a subtype. Many JDK APIs prefer them for these reasons.

## How interviewers test this

Expect "What is a constructor?", "Constructor vs method?", "Can a constructor be private?" and output questions about initialization order. Give the comparison table, walk through the five creation steps including the implicit \`super()\`, explain that private constructors enable singletons and factories, and warn against calling overridable methods from constructors.`,
    sources: [CONSTRUCTORS, JLS],
  },

  "default-vs-parameterized-constructors": {
    theory: `Java gives every class a constructor, even if you don't write one. Knowing exactly when the compiler adds a default constructor, and when it doesn't, explains a whole family of compile errors, especially with inheritance and frameworks. This lesson covers the compiler-generated default constructor, no-argument and parameterized constructors, how they interact with inheritance, and when each is the right design.

## The default constructor

If a class declares no constructors at all, the compiler adds one automatically:

~~~java
public class Point {
    int x, y;
}
// The compiler adds: public Point() { super(); }
~~~

This **default constructor** takes no arguments, has the same access as the class, and calls the parent's no-argument constructor. Fields keep their default values or field initializers.

## The rule that surprises people

The compiler adds the default constructor **only if you declare no constructors**. As soon as you write any constructor, the free one disappears:

~~~java
public class Point {
    int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
}

new Point(1, 2);   // fine
new Point();       // compile error: constructor Point() is undefined
~~~

If you still want a no-argument version, you must write it yourself.

## No-argument versus default

A **no-argument constructor** is any constructor with no parameters, written by you or generated by the compiler. The **default constructor** specifically means the compiler-generated one. You'll hear the terms used loosely, but the distinction matters for the rule above.

## Parameterized constructors

A parameterized constructor takes arguments to initialize the object:

~~~java
public class Account {
    private final String id;
    private double balance;

    public Account(String id, double openingBalance) {
        if (openingBalance < 0) throw new IllegalArgumentException("Negative opening balance");
        this.id = id;
        this.balance = openingBalance;
    }
}
~~~

Requiring data through the constructor is usually the better design. The object is complete and valid from the moment it exists, and final fields can be set once. A no-argument constructor followed by setters creates an interval where the object exists but is incomplete.

## Interaction with inheritance

Every constructor calls a parent constructor first. If you don't write \`super(...)\`, the compiler inserts \`super()\`, the parent's no-argument constructor. If the parent has no such constructor, the child doesn't compile:

~~~java
public class Vehicle {
    public Vehicle(String reg) { ... }        // only constructor
}

public class Car extends Vehicle {
    public Car() { }                           // compile error: implicit super() finds no Vehicle()
}
~~~

The fix is to call the right parent constructor explicitly: \`public Car(String reg) { super(reg); }\`. This error appears often in interviews and real code after someone adds a parameterized constructor to a parent class.

## Frameworks need no-argument constructors

Some libraries create objects by reflection and need a no-argument constructor:

- JPA/Hibernate entities must have one (it may be protected)
- older serialization libraries and JavaBeans tools expect one
- Jackson needs one unless you annotate a constructor with \`@JsonCreator\` or use records

In these cases, provide a protected or package-private no-argument constructor for the framework, and a public parameterized constructor for your own code, so your own code never creates incomplete objects by accident.

## Choosing a design

| Situation | Constructor design |
|---|---|
| Object needs data to be valid | Parameterized constructor requiring it |
| Sensible defaults exist for everything | No-argument constructor, possibly with overloads |
| Many optional parameters | Builder pattern |
| Framework instantiates by reflection | Protected no-argument constructor plus a public parameterized one |
| Plain immutable data | Record (canonical constructor generated) |

## Records and enums

A record automatically gets a **canonical constructor** taking all components; you can add a compact constructor for validation. Enum constructors are implicitly private, because enum constants are created only by the enum itself.

## A worked example

Suppose a team adds \`public Vehicle(String reg)\` to a parent class that previously had no constructors. Every subclass that relied on the implicit default constructor now fails to compile, because the free \`Vehicle()\` vanished. Either add an explicit no-argument constructor to Vehicle, or update each subclass to call \`super(reg)\`. Spotting this cause quickly is a practical skill interviewers value.

## How interviewers test this

Expect "When does Java provide a default constructor?", "What happens when you add a parameterized constructor?" and the inheritance compile error. State the rule precisely, explain that the implicit \`super()\` needs a parent no-argument constructor, and mention framework requirements for no-argument constructors.`,
    sources: [CONSTRUCTORS, JLS],
  },

  "constructor-overloading": {
    theory: `Constructor overloading means giving a class several constructors with different parameter lists, so objects can be created in different convenient ways. Done well, every constructor delegates to one main constructor that holds the validation logic. Done badly, it produces confusing "telescoping" constructors. This lesson covers overloading rules, delegation with \`this(...)\`, the pitfalls of similar signatures, and the alternatives: static factories and the builder pattern.

## Overloading rules

Constructors are overloaded when they differ in the number, types or order of parameters:

~~~java
public class Pizza {
    public Pizza() { ... }
    public Pizza(String size) { ... }
    public Pizza(String size, boolean extraCheese) { ... }
    public Pizza(String size, boolean extraCheese, List<String> toppings) { ... }
}
~~~

The compiler chooses a constructor from the argument types at the call site, using the same resolution rules as method overloading: exact matches first, then widening, then boxing, then varargs.

## Delegating to one main constructor

Duplicating initialization logic across constructors leads to inconsistency: a validation added to one constructor and forgotten in another. Instead, chain them with \`this(...)\` so all paths reach one constructor that does the real work:

~~~java
public class Pizza {
    private final String size;
    private final boolean extraCheese;
    private final List<String> toppings;

    public Pizza() { this("medium"); }
    public Pizza(String size) { this(size, false); }
    public Pizza(String size, boolean extraCheese) { this(size, extraCheese, List.of()); }

    public Pizza(String size, boolean extraCheese, List<String> toppings) {
        if (!Set.of("small", "medium", "large").contains(size)) throw new IllegalArgumentException("Bad size");
        this.size = size;
        this.extraCheese = extraCheese;
        this.toppings = List.copyOf(toppings);
    }
}
~~~

The full constructor is the single source of truth; the others supply defaults. \`this(...)\` must be the first statement, which is why each shorter constructor only delegates.

## Ambiguity pitfalls

Overloads with similar parameter types confuse callers and sometimes the compiler:

- \`Rectangle(int width, int height)\` and \`Rectangle(int height, int width)\` can't both exist, since the types are identical
- \`Point(int x, int y)\` called as \`new Point(y, x)\` compiles silently with swapped values
- overloads taking \`(Object o)\` and \`(String s)\` behave surprisingly with \`null\`, which matches the more specific String version
- \`(long)\` versus \`(Integer)\` overloads: the compiler prefers widening an \`int\` to \`long\` over boxing it to \`Integer\`

When parameters have the same type, a constructor call like \`new Employee("Asha", "Engineering", "Bengaluru")\` gives no hint which string is which.

## The telescoping constructor problem

As optional parameters grow, overloads multiply: a class with six optional settings could need many constructor combinations, and callers face long lists of positional arguments such as \`new Pizza("large", true, false, true, 2, null)\`. This is the **telescoping constructor** anti-pattern: hard to read and error-prone.

## Static factory methods

Factories give each creation path a descriptive name:

~~~java
public static Duration ofMinutes(long m) { ... }
public static Duration ofSeconds(long s) { ... }
~~~

Two constructors \`Duration(long minutes)\` and \`Duration(long seconds)\` couldn't coexist because their signatures are identical, but named factories can. The JDK uses this style widely: \`LocalDate.of\`, \`List.of\`, \`Integer.valueOf\`.

## The builder pattern

For many optional parameters, a builder lets callers set only what they need, by name:

~~~java
Pizza p = new Pizza.Builder("large")
    .extraCheese()
    .topping("olives")
    .topping("corn")
    .build();
~~~

The builder accumulates settings in a mutable helper object, and \`build()\` validates everything and creates the final, often immutable, object in one step. Builders are verbose to write, so tools such as Lombok's \`@Builder\` generate them. Use a builder when a class has more than about four parameters, especially several optional ones of the same type.

## Choosing an approach

| Situation | Approach |
|---|---|
| One or two optional parameters | Overloaded constructors delegating with \`this(...)\` |
| Creation paths with identical parameter types | Named static factories |
| Many optional parameters | Builder |
| Plain immutable data | Record, possibly with static factories |

## A quick summary

Overload constructors for a small number of convenient variants, and make every variant delegate to one constructor that validates. When two creation paths share parameter types, name them with static factories. When optional settings pile up, switch to a builder so each value is labelled at the call site.

## How interviewers test this

Expect "What is constructor overloading?", "How do you avoid duplicated code between constructors?" and "When would you use a builder?" Show delegation to one main constructor with \`this(...)\`, explain the telescoping problem, and compare static factories and builders.`,
    sources: [CONSTRUCTORS, JLS],
  },

  "constructor-chaining-this-and-super": {
    theory: `Constructor chaining is how Java guarantees that every part of an object is initialized, from the root of the class hierarchy down. Within a class, \`this(...)\` passes control to another constructor; across classes, \`super(...)\` passes it to the parent. This lesson explains both calls, the first-statement rule, the exact order in which constructors, initializers and parent code run, and the classic errors and output questions.

## Two kinds of chaining

- **\`this(...)\`** calls another constructor in the same class, to reuse initialization logic
- **\`super(...)\`** calls a constructor of the parent class, to initialize the inherited part of the object

Every constructor begins with exactly one of these calls. If you write neither, the compiler inserts \`super()\` automatically.

## The first-statement rule

\`this(...)\` or \`super(...)\` must be the first statement in a constructor. Consequences:

- a constructor can't call both: only one can be first
- you can't run ordinary code before the parent part of the object exists

~~~java
public Car(String reg) {
    System.out.println("Creating car");   // compile error before super(...)
    super(reg);
}
~~~

The rule ensures parent fields are initialized before child code can use them. Java 22 began previewing relaxed rules that allow some statements before \`super(...)\`, as long as they don't touch the object being constructed, but the classic rule is what interviews expect.

## Chaining up the hierarchy

Given three classes:

~~~java
class Vehicle {
    Vehicle() { System.out.println("Vehicle"); }
}
class Car extends Vehicle {
    Car() { System.out.println("Car"); }
}
class SportsCar extends Car {
    SportsCar() { System.out.println("SportsCar"); }
}

new SportsCar();
~~~

The output is "Vehicle", "Car", "SportsCar". Each constructor's implicit \`super()\` runs first, so construction completes from the top of the hierarchy (ultimately \`Object\`) down to the class being created.

## Combining this and super

A class can chain internally, then up:

~~~java
class Employee extends Person {
    private final String dept;

    Employee(String name) {
        this(name, "General");          // same class
    }

    Employee(String name, String dept) {
        super(name);                     // parent
        this.dept = dept;
    }
}
~~~

Calling \`new Employee("Asha")\` runs \`Employee(String)\`, which delegates to \`Employee(String, String)\`, which calls \`Person(String)\`. Exactly one constructor in each class along the path calls \`super\`.

## Full initialization order

For \`new Child()\`, where Child extends Parent:

1. Memory is allocated, and all fields get default values
2. \`Child()\` starts and immediately calls \`super(...)\`
3. \`Parent()\` runs its own \`super()\` up to Object, then Parent's field initializers and instance initializer blocks, then the rest of Parent's constructor body
4. Back in Child: Child's field initializers and instance initializer blocks run
5. The rest of Child's constructor body runs

Static initialization happens earlier, once per class when it's first loaded: Parent's static blocks, then Child's.

## The overridable-method trap

If Parent's constructor calls a method that Child overrides, Child's version runs during step 3, before Child's fields are initialized:

~~~java
class Parent {
    Parent() { describe(); }
    void describe() { }
}
class Child extends Parent {
    private String label = "child";
    @Override void describe() { System.out.println(label); }
}

new Child();   // prints "null"
~~~

\`label\` still has its default value null when the override runs. This is why constructors shouldn't call overridable methods; mark such helpers \`private\` or \`final\`.

## Common compile errors

- **Implicit super() not found**: the parent has only parameterized constructors, so the child must call one explicitly
- **Recursive constructor invocation**: two constructors calling each other with \`this(...)\` in a loop
- **Using instance fields in this(...) or super(...) arguments**: the object isn't initialized yet, so \`super(this.name)\` isn't allowed, though static members and parameters are

## super for methods and fields

Outside constructors, \`super.method()\` calls the parent's implementation of an overridden method, often to extend rather than replace behaviour:

~~~java
@Override
public String toString() {
    return super.toString() + " [dept=" + dept + "]";
}
~~~

## A quick summary

Every constructor starts with \`this(...)\` or \`super(...)\`, written or implied. Construction always runs from Object down to the class you named, and within each class field initializers run before the constructor body. Keep constructors free of overridable calls so subclasses never see their own fields before they are set.

## How interviewers test this

Expect output questions with print statements in a three-level hierarchy, "Can a constructor call both this() and super()?" and the overridable-method-in-constructor trap. Explain the first-statement rule, trace construction from Object downward, give the five-step order including initializers, and show why the override prints null.`,
    sources: [CONSTRUCTORS, JLS],
  },

  "copy-constructors-and-cloning": {
    theory: `Copying an object sounds trivial, but assigning a reference doesn't copy anything, and naive copies share mutable internals with the original. Java offers two approaches: copy constructors (or copy factory methods) that you write yourself, and the \`clone()\` mechanism inherited from Object. This lesson explains shallow versus deep copies, how to write a correct copy constructor, why \`clone()\` is widely avoided, and when copying isn't needed at all.

## Assignment isn't copying

~~~java
Student a = new Student("Asha");
Student b = a;          // same object, two references
b.setName("Ravi");
a.getName();            // "Ravi"
~~~

To get an independent object, you must create a new one and copy the state.

## Shallow versus deep copies

- A **shallow copy** creates a new object and copies each field's value. Primitive fields are copied fully, but reference fields copy only the reference, so both objects share the same inner objects
- A **deep copy** also copies the objects that the fields refer to, recursively, so the copy shares nothing mutable with the original

~~~java
public class Team {
    private String name;
    private List<String> members;
}
~~~

A shallow copy of a Team gets its own \`name\` reference (fine, since String is immutable) but shares the same \`members\` list. Adding a member to the copy's list adds it to the original too. A deep copy creates a new list containing the same strings.

## Copy constructors

A copy constructor takes an instance of the same class and builds an independent copy:

~~~java
public class Team {
    private final String name;
    private final List<String> members;

    public Team(String name, List<String> members) {
        this.name = name;
        this.members = new ArrayList<>(members);
    }

    public Team(Team other) {                     // copy constructor
        this(other.name, other.members);          // reuses the defensive copy above
    }
}
~~~

Copy constructors are explicit, type-safe, need no casts or checked exceptions, and work with final fields. A static **copy factory**, such as \`Team.copyOf(other)\`, is an equivalent alternative. The JDK collections use this style: \`new ArrayList<>(otherList)\` copies a list.

## How deep is deep enough

Deep-copy only mutable state. Immutable objects, such as String, Integer and LocalDate, can be shared safely, so copying them wastes memory. For each reference field, ask whether the object it points to can change. If yes, copy it; if no, share it. Deeply nested mutable graphs, especially with cycles, are expensive and tricky to copy correctly, which is one more argument for immutable designs.

## Object.clone() and Cloneable

Every object inherits a protected \`clone()\` method from Object. To use it, a class implements the \`Cloneable\` marker interface and overrides \`clone()\`:

~~~java
public class Team implements Cloneable {
    private List<String> members = new ArrayList<>();

    @Override
    public Team clone() {
        try {
            Team copy = (Team) super.clone();          // shallow field-by-field copy
            copy.members = new ArrayList<>(members);   // fix up mutable fields
            return copy;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);               // can't happen: we implement Cloneable
        }
    }
}
~~~

Calling \`super.clone()\` on a class that doesn't implement Cloneable throws \`CloneNotSupportedException\`.

## Why clone() is widely avoided

\`clone()\` has well-known design problems:

- **Cloneable has no methods**: implementing it changes the behaviour of a protected method in Object, an unusual and confusing contract
- **Shallow by default**: every mutable field must be fixed manually, and forgetting one creates shared state bugs
- **Bypasses constructors**: objects are created without running any constructor, so constructor validation is skipped
- **Conflicts with final fields**: you can't reassign a final field in \`clone()\` to give it a fresh copy
- **Checked exception and casts**: \`CloneNotSupportedException\` and casting add noise

For these reasons, Effective Java and most style guides recommend copy constructors or copy factories instead. Arrays are the main exception: \`array.clone()\` works well and returns the right type, though it's still shallow for arrays of objects.

## Records and immutable objects

Immutable objects rarely need copying at all; sharing them is safe. For records, "copying with a change" is done by creating a new record with one component changed, often through a small helper method such as \`withName(String name)\`.

## How interviewers test this

Expect "Shallow vs deep copy?", "What is a copy constructor?" and "Why avoid clone()?" Show the shared-list bug in a shallow copy, write a copy constructor that copies the mutable list, list clone's problems (marker interface, shallow default, bypassed constructors, final fields), and note that immutable objects don't need copying.`,
    sources: [CONSTRUCTORS, OBJECT_API],
  },
};
