// Long-form theory for OOP modules 7-8: advanced OOP, SOLID and interview patterns. Original writing.
import { LessonTheory } from './utils';

const NESTED = { title: "The Java Tutorials: Nested Classes", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html" };
const LOCAL = { title: "The Java Tutorials: Local Classes", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/localclasses.html" };
const ANON = { title: "The Java Tutorials: Anonymous Classes", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html" };
const LAMBDAS = { title: "The Java Tutorials: Lambda Expressions", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html" };
const FUNCTION_PKG = { title: "Java SE API: java.util.function", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html" };
const CLASS_VARS = { title: "The Java Tutorials: Understanding Class Members", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html" };
const FINAL = { title: "The Java Tutorials: Writing Final Classes and Methods", url: "https://docs.oracle.com/javase/tutorial/java/IandI/final.html" };
const ENUMS = { title: "The Java Tutorials: Enum Types", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html" };
const RECORDS = { title: "JEP 395: Records", url: "https://openjdk.org/jeps/395" };
const GENERICS = { title: "The Java Tutorials: Generics", url: "https://docs.oracle.com/javase/tutorial/java/generics/index.html" };
const JLS = { title: "The Java Language Specification", url: "https://docs.oracle.com/javase/specs/" };
const SOLID = { title: "Wikipedia: SOLID", url: "https://en.wikipedia.org/wiki/SOLID" };
const PATTERNS = { title: "Refactoring.Guru: Design Patterns Catalog", url: "https://refactoring.guru/design-patterns/catalog" };
const SINGLETON = { title: "Refactoring.Guru: Singleton", url: "https://refactoring.guru/design-patterns/singleton" };

export const oopAdvancedTheory: Record<string, LessonTheory> = {
  "nested-and-inner-classes": {
    theory: `Java lets you declare a class inside another class. Nested classes group helpers with the only class that uses them, keep implementation types hidden, and give access to the outer class's private members. There are two main kinds, static nested classes and inner classes, and confusing them causes memory leaks and compile errors. This lesson explains both, how they access outer members, how they're instantiated, and when to use each.

## The four kinds of nested class

| Kind | Declared | Has outer instance? |
|---|---|---|
| Static nested class | As a static member of a class | No |
| Inner class (non-static) | As a non-static member | Yes |
| Local class | Inside a method or block | Yes, if in an instance method |
| Anonymous class | Inline, in an expression | Yes, if in an instance context |

This lesson covers the first two; the next covers local and anonymous classes.

## Static nested classes

~~~java
public class LinkedList<T> {
    private Node<T> head;

    private static class Node<T> {
        T value;
        Node<T> next;
        Node(T value) { this.value = value; }
    }
}
~~~

A static nested class behaves like a top-level class that happens to live inside another class's namespace:

- it has **no reference** to an instance of the outer class
- it can access the outer class's private **static** members
- it can be instantiated without an outer object: \`new Outer.Nested()\`
- with \`private\`, it's hidden from all other code

The builder pattern commonly uses a public static nested \`Builder\` class, and \`Map.Entry\` is a nested interface.

## Inner classes

A non-static nested class is an **inner class**. Every instance is tied to an instance of the outer class and can read its instance fields directly:

~~~java
public class Library {
    private final List<String> books = new ArrayList<>();

    public class BookIterator implements Iterator<String> {
        private int index = 0;
        public boolean hasNext() { return index < books.size(); }   // reads the outer field
        public String next() { return books.get(index++); }
    }
}
~~~

Creating one requires an outer instance:

~~~java
Library lib = new Library();
Library.BookIterator it = lib.new BookIterator();   // unusual syntax
~~~

Inside the outer class's instance methods, plain \`new BookIterator()\` works, using \`this\` as the outer instance.

## Reaching the outer instance

If an inner class has a member with the same name as an outer member, \`Outer.this.member\` reaches the outer one:

~~~java
public class Outer {
    int x = 1;
    class Inner {
        int x = 2;
        void show() {
            System.out.println(x);              // 2
            System.out.println(Outer.this.x);   // 1
        }
    }
}
~~~

## The hidden reference and memory leaks

Each inner class instance holds a hidden reference to its outer instance. If the inner object lives longer than expected, for example when it's registered as a listener or stored in a static cache, it keeps the entire outer object alive, along with everything that object references. In Android, an inner class holding an Activity is a classic leak that keeps a whole screen in memory.

The rule: **make nested classes static unless they need the outer instance.** Effective Java gives this exact advice, and IDEs warn about inner classes that could be static.

## Static members inside inner classes

Before Java 16, inner classes couldn't declare static members other than constants. Java 16 relaxed this as part of the records work. Static nested classes have always allowed static members.

## Access in both directions

Nested and outer classes can access each other's private members, because they're part of the same top-level class. The compiler historically generated hidden accessor methods to make this work; since Java 11, nestmates allow direct private access at the JVM level.

## When to use nested classes

- **Helper types used only by the outer class**, such as a list's Node: private static nested
- **Builders and related public types**, such as \`Pizza.Builder\`: public static nested
- **Iterators and views that need the outer object's state**: inner class
- **Anything used widely across the codebase**: a top-level class, for discoverability

## How interviewers test this

Expect "Static nested vs inner class?", "How do you instantiate an inner class from outside?" and "Why can inner classes cause memory leaks?" Explain the hidden outer reference, show \`outer.new Inner()\` and \`Outer.this.x\`, and recommend static nested classes by default.`,
    sources: [NESTED, JLS],
  },

  "local-and-anonymous-inner-classes": {
    theory: `Local classes are declared inside a method; anonymous classes are declared and instantiated in a single expression, without a name. Both were the standard way to pass behaviour around before lambdas arrived in Java 8, and both still appear in older codebases and in cases lambdas can't handle. This lesson explains how they work, what variables they can capture, how they differ from lambdas, and when each is the right tool.

## Local classes

A local class is declared inside a block, usually a method, and is visible only there:

~~~java
public List<String> validEmails(List<String> inputs) {
    class EmailValidator {
        boolean isValid(String s) { return s.contains("@") && s.indexOf('@') < s.lastIndexOf('.'); }
    }
    EmailValidator v = new EmailValidator();
    List<String> out = new ArrayList<>();
    for (String s : inputs) if (v.isValid(s)) out.add(s);
    return out;
}
~~~

Local classes are rare in modern code, but they're useful when a helper needs several methods or fields and is used in only one method.

## Anonymous classes

An anonymous class declares and instantiates a class at once, implementing an interface or extending a class:

~~~java
Comparator<String> byLength = new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return Integer.compare(a.length(), b.length());
    }
};
~~~

The expression creates one object of an unnamed class that implements Comparator. Anonymous classes can't have constructors (they have no name), but they can use instance initializer blocks and pass arguments to a superclass constructor: \`new Thread("worker") { ... }\`.

## Capturing variables: effectively final

Local and anonymous classes can use local variables from the enclosing method, but only if those variables are **final or effectively final**, meaning never reassigned after initialization:

~~~java
int threshold = 5;
Predicate<String> longWord = new Predicate<>() {
    public boolean test(String s) { return s.length() > threshold; }   // OK
};
threshold = 6;   // now threshold isn't effectively final: the code above fails to compile
~~~

The reason: the class captures a **copy** of the value, because the local variable lives on the method's stack frame, which may be gone when the object is used later. Allowing reassignment would let the copy and the original disagree. To share mutable state, capture a reference to a mutable object, such as an \`AtomicInteger\` or a one-element array, though that's often a sign the design needs rethinking.

## Anonymous classes versus lambdas

When the interface has exactly one abstract method, a lambda is shorter:

~~~java
Comparator<String> byLength = (a, b) -> Integer.compare(a.length(), b.length());
// or: Comparator.comparingInt(String::length)
~~~

They differ in more than syntax:

| | Anonymous class | Lambda |
|---|---|---|
| Works with | Any interface or class, any number of methods | Functional interfaces only |
| Meaning of \`this\` | The anonymous object itself | The enclosing instance |
| Can hold state | Yes, fields | No fields of its own |
| Can extend a class | Yes | No |
| New class file per use | Yes, such as \`Outer$1.class\` | No; uses invokedynamic |

The different meaning of \`this\` matters when converting old code: \`this.toString()\` inside an anonymous class refers to the anonymous object, but inside a lambda it refers to the surrounding object.

## When anonymous classes still make sense

- the interface has **more than one abstract method**, such as a listener with several callbacks
- you need to **extend an abstract class**, not implement an interface
- the object needs **its own fields** to track state across calls
- you need \`this\` to refer to the object itself, for example to unregister a listener from inside its callback

## Memory considerations

Like inner classes, anonymous classes created in instance methods hold a reference to the enclosing instance, even if they don't use it. A long-lived anonymous listener can leak its enclosing object. Lambdas capture the enclosing instance only if they use it.

## The double-brace initialization trap

~~~java
List<String> list = new ArrayList<>() {{ add("a"); add("b"); }};
~~~

This creates an anonymous subclass of ArrayList with an initializer block. It works, but creates an extra class and captures the enclosing instance. Use \`List.of("a", "b")\` or \`new ArrayList<>(List.of(...))\` instead.

## How interviewers test this

Expect "What is an anonymous class?", "Why must captured variables be effectively final?" and "Anonymous class vs lambda?" Explain that captured values are copies, give the comparison table with emphasis on \`this\`, and name cases where anonymous classes are still needed.`,
    sources: [LOCAL, ANON],
  },

  "lambda-expressions-and-functional-interfaces": {
    theory: `Lambda expressions, added in Java 8, let you treat behaviour as a value: pass a function to a method, store it in a variable, or return it. They work with functional interfaces, interfaces with exactly one abstract method. Together with method references and streams, lambdas changed how idiomatic Java is written. This lesson covers lambda syntax, functional interfaces, the standard ones in java.util.function, method references, and the rules around captured variables.

## Lambda syntax

A lambda is a parameter list, an arrow and a body:

~~~java
(a, b) -> a + b                        // two parameters, expression body
s -> s.isBlank()                       // one parameter: parentheses optional
() -> System.out.println("hi")         // no parameters
(String s) -> s.length()               // explicit parameter type
(a, b) -> {                            // block body needs return
    int sum = a + b;
    return sum * 2;
}
~~~

Parameter types are usually inferred from the context, the functional interface the lambda is assigned to.

## Functional interfaces

A lambda has no type of its own; it takes the type of the functional interface it's assigned to:

~~~java
@FunctionalInterface
interface DiscountRule {
    long apply(long pricePaise);
}

DiscountRule tenPercent = p -> p * 90 / 100;
long finalPrice = tenPercent.apply(50000);
~~~

The annotation is optional but makes the compiler reject a second abstract method. Default and static methods don't count. Pre-existing interfaces such as \`Runnable\`, \`Comparator\` and \`Callable\` are functional interfaces too, which is why lambdas work with them.

## The standard functional interfaces

The \`java.util.function\` package covers most needs:

| Interface | Method | Shape | Example |
|---|---|---|---|
| \`Predicate<T>\` | \`test(T)\` | T to boolean | \`s -> s.isEmpty()\` |
| \`Function<T, R>\` | \`apply(T)\` | T to R | \`s -> s.length()\` |
| \`Consumer<T>\` | \`accept(T)\` | T to nothing | \`s -> System.out.println(s)\` |
| \`Supplier<T>\` | \`get()\` | nothing to T | \`() -> new ArrayList<>()\` |
| \`UnaryOperator<T>\` | \`apply(T)\` | T to T | \`s -> s.trim()\` |
| \`BinaryOperator<T>\` | \`apply(T, T)\` | (T, T) to T | \`(a, b) -> a + b\` |
| \`BiFunction<T, U, R>\` | \`apply(T, U)\` | (T, U) to R | \`(name, age) -> name + age\` |

Primitive specializations such as \`IntPredicate\` and \`ToIntFunction\` avoid boxing costs. Many have useful default methods for composition: \`predicate.and(other)\`, \`predicate.negate()\`, \`function.andThen(next)\`.

## Method references

When a lambda only calls an existing method, a method reference is shorter:

| Kind | Syntax | Equivalent lambda |
|---|---|---|
| Static method | \`Integer::parseInt\` | \`s -> Integer.parseInt(s)\` |
| Instance method of a particular object | \`System.out::println\` | \`x -> System.out.println(x)\` |
| Instance method of an arbitrary object | \`String::toUpperCase\` | \`s -> s.toUpperCase()\` |
| Constructor | \`ArrayList::new\` | \`() -> new ArrayList<>()\` |

## Lambdas with streams

Lambdas made the Streams API practical:

~~~java
List<String> topScorers = students.stream()
    .filter(s -> s.marks() >= 90)
    .sorted(Comparator.comparingInt(Student::marks).reversed())
    .map(Student::name)
    .toList();
~~~

Each step takes a functional interface: \`filter\` a Predicate, \`map\` a Function, \`sorted\` a Comparator.

## Capturing variables

Like anonymous classes, lambdas can use local variables from the enclosing scope only if they're **effectively final**. Lambdas can freely read and modify instance fields, since those live on the heap with the object, though modifying shared state from lambdas, especially in parallel streams, invites race conditions.

## this inside a lambda

A lambda doesn't introduce a new scope for \`this\`: inside a lambda, \`this\` refers to the enclosing instance. This differs from anonymous classes, where \`this\` is the anonymous object.

## Checked exceptions

Standard functional interfaces don't declare checked exceptions, so a lambda calling a method that throws IOException doesn't compile in \`map\` or \`forEach\`. Options are catching inside the lambda, wrapping in an unchecked exception, or defining your own functional interface that declares the exception.

## Lambdas and OOP

Lambdas complement objects rather than replacing them. The Strategy pattern becomes a one-line lambda when the strategy has one method. Classes still model concepts with state and multiple behaviours; lambdas handle small pieces of behaviour passed between them.

## How interviewers test this

Expect "What is a functional interface?", "Name the core java.util.function interfaces", "Types of method references" and "Why effectively final?" Give the Predicate, Function, Consumer and Supplier shapes, the four method reference kinds, explain captured copies, and contrast \`this\` in lambdas with anonymous classes.`,
    sources: [LAMBDAS, FUNCTION_PKG],
  },

  "static-keyword-deep-dive": {
    theory: `The \`static\` keyword marks members that belong to the class itself rather than to any object. Static fields are shared by all instances, static methods run without an object, static blocks run once when the class loads, and static nested classes need no outer instance. Static is useful for constants, utilities and factories, and harmful when it turns into hidden global state. This lesson covers each use, class loading order, and the design trade-offs.

## Static fields

A static field has one copy per class, shared by every instance:

~~~java
public class Order {
    private static long nextId = 1;     // shared counter
    private final long id;

    public Order() { id = nextId++; }
}
~~~

Each Order gets a unique id from the shared counter. Note this counter isn't thread-safe; concurrent creation could produce duplicates, and \`AtomicLong\` would fix it.

Static fields are stored with the class's data, not inside objects, and live as long as the class stays loaded, usually the whole program run.

## Constants

\`static final\` fields of primitive or String type, initialized with constant expressions, are compile-time constants:

~~~java
public static final int MAX_ATTEMPTS = 3;
public static final String API_VERSION = "v2";
~~~

By convention they use UPPER_SNAKE_CASE. The compiler inlines compile-time constants into calling classes, which means changing a constant in a library requires recompiling the callers, a subtle deployment trap.

## Static methods

Static methods belong to the class and are called through its name:

~~~java
public final class MathUtils {
    private MathUtils() { }                     // prevent instantiation
    public static int clamp(int v, int lo, int hi) { return Math.max(lo, Math.min(hi, v)); }
}
~~~

Rules:

- they can't use \`this\` or \`super\`
- they can't access instance fields or call instance methods directly; they need an object reference
- they can't be overridden, only hidden
- they can be called through an instance reference, but the reference's declared type decides which method runs, which is misleading

\`main\` is static so the JVM can call it without creating an object.

## Static factory methods

Static methods that create instances, such as \`List.of\`, \`Integer.valueOf\` and \`LocalDate.now\`, are a widely used alternative to constructors. They can have descriptive names, return cached instances, and return subtypes.

## Static initializer blocks

A static block runs once, when the class is initialized:

~~~java
public class Config {
    private static final Map<String, String> DEFAULTS;
    static {
        Map<String, String> m = new HashMap<>();
        m.put("timeout", "30");
        m.put("retries", "3");
        DEFAULTS = Collections.unmodifiableMap(m);
    }
}
~~~

## When a class is initialized

A class is initialized lazily, the first time it's actively used: an instance is created, a static method is called, or a non-constant static field is accessed. Static initialization runs in textual order, top to bottom. For a subclass, the parent class is initialized first. Accessing a compile-time constant doesn't trigger initialization, because the value was inlined.

This laziness enables the **initialization-on-demand holder** idiom for thread-safe lazy singletons:

~~~java
public class Registry {
    private Registry() { }
    private static class Holder { static final Registry INSTANCE = new Registry(); }
    public static Registry getInstance() { return Holder.INSTANCE; }
}
~~~

The JVM guarantees class initialization is thread-safe, and Holder isn't initialized until \`getInstance\` first runs.

## Static nested classes

A static nested class doesn't hold a reference to an outer instance, which makes it the right default for nested helper types, as the nested classes lesson explains.

## Static imports

\`import static java.lang.Math.*;\` lets you write \`sqrt(x)\` instead of \`Math.sqrt(x)\`. Use sparingly: overuse makes it unclear where methods come from. Common in tests, such as JUnit assertions.

## The dangers of static state

Mutable static fields are global variables:

- **hidden dependencies**: any code can read or change them, so behaviour depends on invisible state
- **test interference**: one test's changes leak into the next
- **thread-safety problems**: shared by all threads
- **memory leaks**: a static collection that only grows keeps every object it holds alive forever

Prefer passing dependencies explicitly and keeping static members to constants, pure utility functions and factories.

## How interviewers test this

Expect "Can a static method access instance variables?", "Why is main static?", "Can static methods be overridden?" and initialization order questions with static blocks. Explain that static belongs to the class, show method hiding, describe lazy class initialization, and warn about mutable static state.`,
    sources: [CLASS_VARS, JLS],
  },

  "final-keyword-advanced": {
    theory: `\`final\` means "assigned once" for variables, "can't be overridden" for methods, and "can't be extended" for classes. The variable case has more depth than it first appears: blank finals, final references to mutable objects, effectively final variables for lambdas, and the special memory-model guarantee that final fields give to multithreaded code. This lesson covers each in detail, along with common misconceptions.

## Final local variables

A final local variable can be assigned only once:

~~~java
final int max = 10;
max = 20;   // compile error
~~~

It doesn't have to be assigned at declaration, as long as every path assigns it exactly once before use:

~~~java
final String label;
if (score >= 90) label = "A";
else label = "B";
~~~

The compiler's definite assignment analysis checks this.

## Final parameters

\`void process(final Order order)\` prevents reassigning \`order\` inside the method. Some teams use it everywhere for clarity; others consider it noise because reassigning parameters is already discouraged. It has no effect on callers.

## Final fields and blank finals

A final field must be assigned exactly once by the end of construction. A **blank final** is declared without an initializer and assigned in every constructor:

~~~java
public class Account {
    private final String id;          // blank final

    public Account(String id) { this.id = id; }
    public Account() { this(UUID.randomUUID().toString()); }
}
~~~

If any constructor path fails to assign it, compilation fails. A static final field must be assigned at declaration or in a static block.

## Final references versus immutable objects

The most common misconception: \`final\` freezes the **reference**, not the **object**.

~~~java
final List<String> names = new ArrayList<>();
names.add("Asha");           // allowed: the list changes
names = new ArrayList<>();   // compile error: the reference can't change
~~~

For an unmodifiable list, use \`List.of(...)\` or \`List.copyOf(...)\`. An immutable class needs final fields **and** immutable or defensively copied contents.

## Effectively final

A local variable that's never reassigned after initialization is **effectively final**, even without the keyword. Lambdas, anonymous classes and local classes can only capture effectively final variables:

~~~java
int limit = 5;
list.removeIf(x -> x > limit);   // fine: limit is effectively final
limit++;                         // makes the lambda above fail to compile
~~~

Since Java 8, you don't need to write \`final\` for captured variables; the compiler infers it.

## Final and the memory model

Final fields have a special guarantee in the Java Memory Model: once a constructor finishes, any thread that obtains a reference to the object sees the correctly initialized values of its final fields, without synchronization. Non-final fields don't have this guarantee; another thread could see default values if the object was published unsafely.

This is why immutable objects with final fields are safe to share between threads. The guarantee breaks if \`this\` escapes during construction, for example by registering the object with a listener inside its constructor.

## Final methods and classes, briefly

- **final methods** can't be overridden, used in template methods and for methods called from constructors
- **final classes** can't be extended, used for immutable value types and security-sensitive classes such as String

## final, finally and finalize

A classic interview trick question compares three unrelated words:

| Term | What it is |
|---|---|
| \`final\` | Keyword: assign once, no override, no subclass |
| \`finally\` | Block after try/catch that runs whether or not an exception occurred |
| \`finalize()\` | Deprecated Object method once called before garbage collection; don't use it |

## Where final isn't allowed

- constructors can't be final (they aren't inherited, so there's nothing to prevent)
- abstract methods can't be final (they must be overridden)
- a class can't be both abstract and final
- interface methods can't be final

## Using final well

- make fields final by default, and remove it only when mutation is required
- use final classes for value types and anything not designed for extension
- don't rely on final for performance; modern JITs optimize non-final code well

## How interviewers test this

Expect "What does final mean for variables, methods and classes?", "Can a final list be modified?" and "final vs finally vs finalize?" Show that final freezes the reference not the object, explain blank finals and effectively final variables, and mention the memory-model guarantee for immutable objects.`,
    sources: [FINAL, JLS],
  },

  "enum-types-and-custom-enums": {
    theory: `An enum defines a fixed set of named constants, such as days of the week, order statuses or card suits. Java enums are far more powerful than integer constants: each constant is a full object that can have fields, constructors, methods and even its own method overrides. This lesson covers enum basics, adding state and behaviour, constant-specific methods, EnumSet and EnumMap, and why enums are the recommended way to build singletons.

## Why not integer constants?

~~~java
public static final int STATUS_PLACED = 0;
public static final int STATUS_SHIPPED = 1;
~~~

Integer constants have no type safety: a method taking \`int status\` accepts 42 or a weekday constant. They print as numbers, and there's no way to list all valid values. Enums fix all three.

## Basic enums

~~~java
public enum OrderStatus { PLACED, PACKED, SHIPPED, DELIVERED, CANCELLED }

OrderStatus s = OrderStatus.SHIPPED;
s.name();        // "SHIPPED"
s.ordinal();     // 2: position in declaration order
OrderStatus.valueOf("PLACED");   // parses; throws IllegalArgumentException if unknown
OrderStatus.values();            // array of all constants in order
~~~

Every enum implicitly extends \`java.lang.Enum\`, so enums can't extend other classes, but they can implement interfaces. Enum constants are compared safely with \`==\`, because each constant is a single instance.

## Enums in switch

~~~java
String label = switch (status) {
    case PLACED, PACKED -> "Processing";
    case SHIPPED -> "On the way";
    case DELIVERED -> "Delivered";
    case CANCELLED -> "Cancelled";
};
~~~

With switch expressions, the compiler checks that every constant is covered when there's no default branch.

## Fields, constructors and methods

~~~java
public enum Plan {
    FREE(0, 1), PRO(49900, 5), TEAM(149900, 25);

    private final long pricePaise;
    private final int seats;

    Plan(long pricePaise, int seats) {        // implicitly private
        this.pricePaise = pricePaise;
        this.seats = seats;
    }

    public long pricePaise() { return pricePaise; }
    public boolean allows(int users) { return users <= seats; }
}
~~~

Enum constructors are always private; you can't create new constants at runtime. Fields should be final, since enum constants are shared globally.

## Constant-specific behaviour

Each constant can override an abstract method, replacing switch statements with polymorphism:

~~~java
public enum Operation {
    ADD("+") { public int apply(int a, int b) { return a + b; } },
    SUBTRACT("-") { public int apply(int a, int b) { return a - b; } },
    MULTIPLY("*") { public int apply(int a, int b) { return a * b; } };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
    public abstract int apply(int a, int b);
}
~~~

Adding a new operation forces you to implement \`apply\`; you can't forget, as you might with a separate switch somewhere else.

## Don't depend on ordinal

\`ordinal()\` changes if constants are reordered or inserted. Storing ordinals in a database, or using them as array indices for business data, breaks silently. Store \`name()\` or an explicit code field instead. Likewise, JPA's \`EnumType.STRING\` is safer than \`EnumType.ORDINAL\`.

## EnumSet and EnumMap

These specialized collections are fast and compact:

~~~java
EnumSet<DayOfWeek> weekend = EnumSet.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);
EnumMap<OrderStatus, Integer> counts = new EnumMap<>(OrderStatus.class);
~~~

\`EnumSet\` is backed by a bit vector, and \`EnumMap\` by an array indexed by ordinal, internally and safely. Prefer them over HashSet and HashMap for enum keys.

## Enum singletons

An enum with one constant is the simplest robust singleton:

~~~java
public enum AppClock {
    INSTANCE;
    public long now() { return System.currentTimeMillis(); }
}
~~~

The JVM guarantees exactly one instance, thread-safe initialization, and protection against reflection and serialization attacks that can break class-based singletons. Effective Java calls this the best way to implement a singleton, when a singleton is appropriate at all.

## Enums implementing interfaces

\`enum Operation implements IntBinaryOperator\` lets enum constants be used wherever the interface is expected, and lets other code extend the set of operations with its own enum implementing the same interface.

## A quick summary

Reach for an enum whenever a value comes from a fixed, known set. Give constants fields through a private constructor, move per-constant behaviour into overridden methods, persist \`name()\` rather than \`ordinal()\`, and use EnumSet and EnumMap for collections keyed by the enum.

## How interviewers test this

Expect "Why use enums over constants?", "Can enums have constructors and methods?", "Why is enum the best singleton?" and "Can an enum extend a class?" Cover type safety and values(), private constructors, constant-specific methods, the ordinal pitfall, and the reflection and serialization safety of enum singletons.`,
    sources: [ENUMS, JLS],
  },

  "java-records": {
    theory: `Records, finalized in Java 16, are concise classes for immutable data. Declaring \`record Point(int x, int y)\` gives you private final fields, a constructor, accessors, and correct \`equals\`, \`hashCode\` and \`toString\`, all generated by the compiler. Records remove the boilerplate that made Java data classes verbose and error-prone. This lesson covers what records generate, compact constructors for validation, what records can and can't do, and when to choose them.

## A record declaration

~~~java
public record Point(int x, int y) { }
~~~

From this one line, the compiler generates:

- private final fields \`x\` and \`y\`
- a **canonical constructor** \`Point(int x, int y)\`
- accessor methods \`x()\` and \`y()\`, named after the components, not \`getX()\`
- \`equals\` and \`hashCode\` based on all components
- \`toString\` returning \`Point[x=1, y=2]\`

~~~java
Point p = new Point(1, 2);
p.x();                              // 1
p.equals(new Point(1, 2));          // true
Set.of(p).contains(new Point(1, 2)); // true: hashCode is consistent
~~~

## Compact constructors for validation

A **compact constructor** omits the parameter list and assigns fields automatically after its body runs:

~~~java
public record Range(int start, int end) {
    public Range {
        if (start > end) throw new IllegalArgumentException("start > end");
    }
}
~~~

You can also normalize parameters before assignment, by reassigning the parameter inside the compact constructor:

~~~java
public record Email(String value) {
    public Email {
        value = value.trim().toLowerCase();
    }
}
~~~

## Defensive copies in records

Records are **shallowly** immutable. A component that's a mutable collection can still change:

~~~java
public record Team(String name, List<String> members) {
    public Team {
        members = List.copyOf(members);   // copy in, and the result is unmodifiable
    }
}
~~~

Without the copy, the caller could keep a reference to the original list and modify it later.

## What records can have

- static fields and static methods, including factories
- instance methods
- additional constructors, which must delegate to the canonical constructor with \`this(...)\`
- implemented interfaces
- nested types
- annotations on components

~~~java
public record Money(long paise, String currency) implements Comparable<Money> {
    public static Money inr(long rupees) { return new Money(rupees * 100, "INR"); }
    public Money plus(Money o) { return new Money(paise + o.paise, currency); }
    public int compareTo(Money o) { return Long.compare(paise, o.paise); }
}
~~~

## What records can't do

- **extend a class**: every record implicitly extends \`java.lang.Record\`
- **be extended**: records are implicitly final
- **declare instance fields** beyond the components
- **have setters** or reassign component fields

These restrictions are the point: a record's state is exactly its components, transparently.

## Records versus Lombok and hand-written classes

| | Record | Lombok @Value | Hand-written class |
|---|---|---|---|
| Boilerplate | None | None, via annotation processing | All of it |
| Language feature | Yes | External library | Yes |
| Accessor names | \`x()\` | \`getX()\` | Your choice |
| Inheritance | No | No (final) | Yes |

Some older frameworks expect JavaBeans getters, but modern Jackson, Spring and JPA projections support records.

## Records with pattern matching

Record patterns (Java 21) let you destructure records in \`instanceof\` and \`switch\`:

~~~java
if (obj instanceof Point(int x, int y)) {
    System.out.println(x + y);
}

double area(Shape s) {
    return switch (s) {
        case Circle(double r) -> Math.PI * r * r;
        case Rectangle(double w, double h) -> w * h;
    };
}
~~~

Combined with sealed interfaces, records model algebraic data types: a closed set of data shapes with exhaustive handling.

## When to use records

Good fits:

- DTOs and API request or response bodies
- value objects: coordinates, money, ranges, identifiers
- map keys and set elements, thanks to correct equals and hashCode
- multiple return values from a method
- events and messages

Poor fits:

- entities whose state changes over their lifetime
- classes needing inheritance
- JPA entities, which need a no-argument constructor and mutable fields

## A quick summary

A record is a transparent carrier for a fixed set of values. Validate and normalize in a compact constructor, copy mutable components, add methods freely, and remember that records are final and can't add instance fields. When state must change over time, use a regular class instead.

## How interviewers test this

Expect "What is a record?", "What does the compiler generate?", "Are records immutable?" and "Can a record extend a class?" List the generated members, show a compact constructor validating input, explain shallow immutability with the defensive list copy, and state that records are final and extend Record.`,
    sources: [RECORDS, JLS],
  },

  "java-generics-basics": {
    theory: `Generics let classes and methods work with any type while keeping compile-time type safety. Before generics, a List held Objects, and every retrieval needed a cast that could fail at runtime. With \`List<String>\`, the compiler guarantees only strings go in and strings come out. This lesson covers generic classes and methods, bounded types, wildcards and the PECS rule, type erasure, and the restrictions erasure causes.

## The problem generics solve

~~~java
List list = new ArrayList();      // raw type, pre-Java 5 style
list.add("hello");
list.add(42);                     // nothing stops this
String s = (String) list.get(1);  // ClassCastException at runtime
~~~

With generics, the mistake moves to compile time:

~~~java
List<String> list = new ArrayList<>();
list.add(42);                     // compile error
String s = list.get(0);           // no cast needed
~~~

## Generic classes

~~~java
public class Box<T> {
    private T value;
    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

Box<Integer> b = new Box<>();     // diamond operator infers Integer
b.set(5);
int n = b.get();
~~~

\`T\` is a **type parameter**. Conventional names: \`T\` (type), \`E\` (element), \`K\` and \`V\` (key and value), \`R\` (return). Type arguments must be reference types: \`Box<int>\` isn't allowed, so use \`Box<Integer>\`.

## Generic methods

A method can declare its own type parameters, before the return type:

~~~java
public static <T> T firstOrDefault(List<T> list, T fallback) {
    return list.isEmpty() ? fallback : list.get(0);
}

String s = firstOrDefault(names, "none");   // T inferred as String
~~~

## Bounded type parameters

\`extends\` restricts a type parameter to a type and its subtypes, which lets you call that type's methods:

~~~java
public static <T extends Comparable<T>> T max(List<T> list) {
    T best = list.get(0);
    for (T item : list) if (item.compareTo(best) > 0) best = item;
    return best;
}
~~~

Without the bound, \`compareTo\` wouldn't compile, because an arbitrary T might not have it. Multiple bounds use \`&\`: \`<T extends Number & Comparable<T>>\`.

## Generics aren't covariant

A \`List<Integer>\` is **not** a \`List<Number>\`, even though Integer is a Number:

~~~java
List<Integer> ints = new ArrayList<>();
List<Number> nums = ints;    // compile error
~~~

If it were allowed, you could add a Double through \`nums\` and corrupt the list of integers. Arrays are covariant, \`Integer[]\` is a \`Number[]\`, and that's why arrays throw ArrayStoreException at runtime.

## Wildcards

Wildcards provide flexibility where invariance is too strict:

- \`List<?>\`: a list of some unknown type; you can read Objects but can't add anything except null
- \`List<? extends Number>\`: a list of Number or some subtype; you can **read** Numbers but can't add
- \`List<? super Integer>\`: a list of Integer or some supertype; you can **add** Integers but reads give Object

~~~java
double sum(List<? extends Number> nums) {      // accepts List<Integer>, List<Double>
    double total = 0;
    for (Number n : nums) total += n.doubleValue();
    return total;
}

void fill(List<? super Integer> out) {          // accepts List<Integer>, List<Number>, List<Object>
    for (int i = 0; i < 5; i++) out.add(i);
}
~~~

## PECS

The rule to remember: **Producer Extends, Consumer Super**. If a parameter produces values for you to read, use \`extends\`; if it consumes values you write, use \`super\`. \`Collections.copy(List<? super T> dest, List<? extends T> src)\` shows both.

## Type erasure

Generics exist only at compile time. The compiler checks types, inserts casts, and then **erases** type parameters, replacing them with their bounds (Object if unbounded). At runtime, \`List<String>\` and \`List<Integer>\` are both plain \`List\`. This kept compatibility with pre-generics code.

Consequences:

- \`new T()\` isn't allowed: the type isn't known at runtime
- \`new T[10]\` and \`new List<String>[10]\` aren't allowed
- \`obj instanceof List<String>\` doesn't compile; only \`instanceof List<?>\` does
- overloads differing only in type arguments clash after erasure
- static fields can't use the class's type parameter, since one static field is shared by all parameterizations

A common workaround for creating instances is passing a \`Class<T>\` or a \`Supplier<T>\`.

## Raw types

Using \`List\` without a type argument is a **raw type**, kept for legacy compatibility. It disables generic checks and produces unchecked warnings. Don't use raw types in new code.

## How interviewers test this

Expect "Why use generics?", "What is type erasure?", "Is List<Integer> a List<Number>?" and "Explain wildcards and PECS." Show the compile-time safety benefit, explain invariance with the corrupted-list argument, give PECS with \`Collections.copy\`, and list erasure's restrictions.`,
    sources: [GENERICS, JLS],
  },

  "single-responsibility-principle": {
    theory: `The Single Responsibility Principle (SRP), the S in SOLID, says a class should have only one reason to change. It's often misread as "a class should do one thing", but its real focus is on who requests changes: each class should answer to one source of requirements. Classes that mix responsibilities become hard to change, hard to test and prone to unrelated breakages. This lesson explains SRP precisely, how to spot violations, how to split classes, and how to avoid overdoing it.

## The principle

Robert C. Martin, who popularized SOLID, phrases SRP as "a module should be responsible to one, and only one, actor", where an actor is a group of people who request changes. If the finance team and the operations team can both force changes to the same class for unrelated reasons, that class has two responsibilities.

## A violation

~~~java
public class Invoice {
    private final List<LineItem> items;

    public long total() { ... }                       // business rules: finance
    public String toHtml() { ... }                    // presentation: UI team
    public void saveToDatabase(Connection c) { ... }  // persistence: platform team
    public void emailTo(String address) { ... }       // delivery: operations
}
~~~

Problems:

- a change to the HTML layout risks breaking the tax calculation, because both live in one file
- testing \`total()\` drags in database and email dependencies
- two developers changing unrelated features conflict in the same class
- reusing the calculation in a mobile app also pulls in HTML and SQL code

## Splitting the responsibilities

~~~java
public class Invoice {                        // business rules only
    private final List<LineItem> items;
    public long total() { ... }
}

public class InvoiceHtmlRenderer {            // presentation
    public String render(Invoice invoice) { ... }
}

public interface InvoiceRepository {          // persistence
    void save(Invoice invoice);
}

public class InvoiceMailer {                  // delivery
    private final EmailClient client;
    public void send(Invoice invoice, String to) { ... }
}
~~~

Each class now changes for one reason. The core Invoice class has no I/O dependencies and can be tested in isolation.

## Spotting violations

- **The "and" test**: describing the class needs "and": "it calculates totals and renders HTML and saves to the database"
- **Vague names**: \`Manager\`, \`Processor\`, \`Helper\`, \`Utils\` often hide many responsibilities
- **Mixed imports**: a class importing both \`java.sql\` and HTML or HTTP libraries
- **Size**: a class of thousands of lines, or methods that don't share fields, often called low cohesion
- **Change history**: if one file shows up in commits for many unrelated features, it's doing too much

## Cohesion

SRP is closely related to **cohesion**: how strongly a class's members belong together. In a cohesive class, most methods use most fields. If one group of methods uses fields A and B while another group uses C and D, the class is two classes sharing a file.

## SRP at other levels

The idea applies beyond classes:

- **methods**: a method should do one thing at one level of abstraction
- **modules and packages**: group code that changes together
- **microservices**: each service owns one business capability

## Don't over-split

SRP doesn't mean one method per class. Splitting too far creates many tiny classes with heavy coordination, where following a single feature means opening a dozen files. Split along **real axes of change**, ones that have changed or clearly will. A small class that does a few closely related things for one actor is fine.

## SRP and other principles

- splitting responsibilities often reveals interfaces, such as \`InvoiceRepository\`, that support dependency inversion
- focused classes are easier to extend without modification, supporting open-closed
- smaller interfaces follow naturally, supporting interface segregation

## A worked example

A \`UserService\` that registers users, hashes passwords, sends welcome emails and writes audit logs answers to product, security, marketing and compliance teams. Splitting it gives \`UserRegistration\` for the workflow, a \`PasswordHasher\` owned by security, a \`WelcomeMailer\` owned by marketing and an \`AuditLog\` owned by compliance. Each piece now changes only when its own team asks, and the registration workflow reads as a short sequence of calls.

## How interviewers test this

Expect "Explain SRP with an example", "How do you identify a violation?" and low-level design reviews where a god class must be split. Use the "one reason to change, one actor" definition, show the Invoice split into calculation, rendering, persistence and delivery, and mention cohesion and the risk of over-splitting.`,
    sources: [SOLID, PATTERNS],
  },

  "open-closed-and-liskov": {
    theory: `The O and L in SOLID govern how classes evolve and how subclasses behave. The Open-Closed Principle (OCP) says software should be open for extension but closed for modification: add features by adding code, not by editing tested code. The Liskov Substitution Principle (LSP) says subclasses must be usable anywhere their parent is expected, without surprises. This lesson explains both, shows typical violations and fixes, and covers the famous Rectangle and Square problem.

## Open-Closed Principle

Bertrand Meyer introduced OCP in 1988; the modern reading relies on abstraction and polymorphism. When requirements change, you should be able to add a new class rather than edit a growing if-else chain.

## An OCP violation

~~~java
public class DiscountCalculator {
    public long discount(String customerType, long amount) {
        if (customerType.equals("REGULAR")) return 0;
        else if (customerType.equals("PREMIUM")) return amount * 10 / 100;
        else if (customerType.equals("VIP")) return amount * 20 / 100;
        return 0;
    }
}
~~~

Every new customer type means editing this method, retesting it, and risking breaking existing types. Similar chains tend to be duplicated across the codebase, and each must be found and updated.

## Fixing with polymorphism

~~~java
public interface DiscountPolicy {
    long discount(long amount);
}

public class RegularPolicy implements DiscountPolicy { public long discount(long a) { return 0; } }
public class PremiumPolicy implements DiscountPolicy { public long discount(long a) { return a * 10 / 100; } }
public class VipPolicy implements DiscountPolicy { public long discount(long a) { return a * 20 / 100; } }
~~~

A new "Student" type is a new class. The calculator and the existing policies don't change. Some code still chooses which policy to use, usually a factory or configuration, but that decision lives in one place.

## OCP in practice

- **plugin architectures**: IDEs and browsers accept extensions without modifying their core
- **strategy and decorator patterns**: new behaviour by composing new objects
- **event listeners**: new reactions to an event by registering a new listener

OCP is a direction, not an absolute. You can't anticipate every change, and abstracting everything up front creates needless complexity. A practical approach: write the direct version first, and when a second or third variation appears, refactor toward an extension point.

## Liskov Substitution Principle

Barbara Liskov stated it in 1987: if S is a subtype of T, objects of type T may be replaced with objects of type S without altering the correctness of the program. Compiling isn't enough; the subclass must keep the parent's **behavioural contract**.

## The Rectangle and Square problem

Mathematically a square is a rectangle, so inheritance seems natural:

~~~java
class Rectangle {
    protected int width, height;
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    @Override void setWidth(int w) { width = w; height = w; }
    @Override void setHeight(int h) { width = h; height = h; }
}

void resize(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    assert r.area() == 20;   // fails for a Square: area is 16
}
~~~

Code written for Rectangle reasonably assumes width and height change independently. Square breaks that assumption, so it isn't a valid behavioural subtype, even though it compiles.

Fixes: make both immutable (with no setters, the conflict disappears), or don't relate them by inheritance, giving both a common \`Shape\` interface with \`area()\`.

## LSP rules for subclasses

A subclass must not:

- **strengthen preconditions**: accept fewer inputs than the parent (rejecting values the parent accepted)
- **weaken postconditions**: promise less than the parent (returning null where the parent never did)
- **break invariants** the parent maintains
- **throw new kinds of exceptions** that callers of the parent don't expect

## Common LSP violations

- overriding a method to throw \`UnsupportedOperationException\`. Java's own \`List.of(...)\` returns an unmodifiable list whose \`add\` throws, a known compromise in the collections design
- a \`ReadOnlyFile extends File\` whose \`write\` does nothing silently
- a subclass that ignores a parameter the parent's contract depends on

Each forces callers to check concrete types, defeating polymorphism.

## How LSP and OCP connect

OCP relies on substituting new implementations behind an abstraction. If those implementations violate LSP, the code using the abstraction breaks or fills with instanceof checks, which is an OCP violation in turn. Correct substitution is what makes extension safe.

## How interviewers test this

Expect "Explain OCP with an example", "What is LSP?" and the Rectangle and Square problem. Show the if-else chain replaced by a policy interface, explain behavioural contracts beyond compiling, walk through the failing resize example, and propose immutable shapes or a shared interface as the fix.`,
    sources: [SOLID, PATTERNS],
  },

  "interface-segregation-and-dependency-inversion": {
    theory: `The I and D in SOLID shape how classes depend on each other. The Interface Segregation Principle (ISP) says clients shouldn't be forced to depend on methods they don't use, so interfaces should be small and focused. The Dependency Inversion Principle (DIP) says high-level policy shouldn't depend on low-level details; both should depend on abstractions. Together they make systems testable and replaceable piece by piece. This lesson explains both with examples and connects DIP to dependency injection.

## Interface Segregation

A "fat" interface forces implementers to provide methods that don't apply to them:

~~~java
public interface Machine {
    void print(Document d);
    void scan(Document d);
    void fax(Document d);
}

public class BasicPrinter implements Machine {
    public void print(Document d) { ... }
    public void scan(Document d) { throw new UnsupportedOperationException(); }
    public void fax(Document d) { throw new UnsupportedOperationException(); }
}
~~~

BasicPrinter lies about its capabilities, callers can't trust the interface, and any change to fax-related signatures forces recompiling and redeploying BasicPrinter, which never faxes.

## Segregated interfaces

~~~java
public interface Printer { void print(Document d); }
public interface Scanner { void scan(Document d); }
public interface Fax { void fax(Document d); }

public class BasicPrinter implements Printer { ... }
public class OfficeMachine implements Printer, Scanner, Fax { ... }
~~~

Each client depends only on what it uses: a print queue needs a Printer, nothing more. Implementers provide only what they support.

## Spotting ISP violations

- implementations throwing \`UnsupportedOperationException\` or leaving methods empty
- interfaces with many methods serving different groups of callers
- callers that use only a small slice of an interface they depend on

Role interfaces named after what a client needs, such as \`OrderReader\` and \`OrderWriter\` instead of one \`OrderService\` with forty methods, follow ISP naturally. Java's own \`Readable\`, \`Appendable\`, \`Closeable\` and \`Flushable\` are small, single-purpose interfaces.

## Dependency Inversion

Traditional layered code has high-level business logic calling low-level details directly:

~~~java
public class OrderService {
    private final MySqlOrderDao dao = new MySqlOrderDao();   // depends on a concrete detail
    public void place(Order o) { dao.insert(o); }
}
~~~

OrderService can't be tested without a MySQL database, and switching databases means editing business logic.

DIP has two parts:

1. high-level modules shouldn't depend on low-level modules; both should depend on abstractions
2. abstractions shouldn't depend on details; details should depend on abstractions

## Inverting the dependency

~~~java
public interface OrderRepository {               // owned by the business layer
    void save(Order order);
}

public class OrderService {
    private final OrderRepository repository;
    public OrderService(OrderRepository repository) { this.repository = repository; }
    public void place(Order o) { repository.save(o); }
}

public class MySqlOrderRepository implements OrderRepository { ... }   // detail depends on the abstraction
~~~

The source-code dependency now points from the database class toward the business interface, the opposite of the runtime call direction. That reversal is the "inversion". The interface is defined in terms the business layer needs (\`save(Order)\`), not in terms of SQL.

## Dependency injection

DIP is the principle; **dependency injection** (DI) is the common technique. Instead of creating its dependencies, a class receives them, usually through its constructor:

~~~java
OrderService service = new OrderService(new MySqlOrderRepository(dataSource));   // production
OrderService testService = new OrderService(new InMemoryOrderRepository());      // tests
~~~

Frameworks like Spring automate the wiring: they find implementations and pass them into constructors. Constructor injection is preferred over field injection, because dependencies are explicit, can be final, and tests can construct the class without a framework.

## Inversion of control

DI is one form of **inversion of control**: a framework calls your code rather than your code calling the framework. Servlet containers calling your handlers and Spring creating your beans are examples.

## Balance

Not every class needs an interface. Stable, low-level utilities like \`String\` or \`LocalDate\` are fine to depend on directly. Apply DIP at boundaries that may change or that make testing hard: databases, external APIs, message queues, clocks and file systems.

## How interviewers test this

Expect "Explain ISP and DIP with examples", "DIP vs dependency injection?" and design reviews where a service creates its own dependencies. Split a fat interface into role interfaces, invert a service-to-DAO dependency through an interface owned by the business layer, explain constructor injection, and show how it enables testing with fakes.`,
    sources: [SOLID, PATTERNS],
  },

  "oop-design-patterns-and-interview-traps": {
    theory: `Design patterns are named, proven solutions to recurring design problems. Knowing the common ones lets you communicate designs in a word ("use a strategy here") and recognize them in frameworks. OOP interviews combine pattern questions with tricky output puzzles that test precise knowledge of the language. This lesson surveys the patterns interviewers ask about most, with when to use each, and then collects the classic OOP traps from across the course.

## Pattern categories

The Gang of Four book (1994) grouped 23 patterns into three families:

| Category | Concern | Common examples |
|---|---|---|
| Creational | How objects are created | Singleton, Factory Method, Builder, Prototype |
| Structural | How objects are composed | Adapter, Decorator, Facade, Proxy, Composite |
| Behavioural | How objects interact | Strategy, Observer, Command, Template Method, State |

## Singleton

Ensures one instance with global access. Thread-safe options:

~~~java
public enum Clock { INSTANCE; }                          // simplest, reflection-safe

public final class Config {                              // lazy holder idiom
    private Config() { }
    private static class Holder { static final Config I = new Config(); }
    public static Config get() { return Holder.I; }
}
~~~

Caution: singletons are global state, which hides dependencies and complicates testing. Prefer one instance managed by a DI container where possible. A classic follow-up asks about double-checked locking, which requires the field to be \`volatile\`.

## Factory Method and Builder

**Factory** centralizes object creation, returning an interface type so callers don't depend on concrete classes. **Builder** constructs complex objects step by step with named settings, avoiding telescoping constructors, as in \`HttpRequest.newBuilder().uri(...).GET().build()\`.

## Adapter, Decorator and Proxy

- **Adapter** converts one interface to another, such as wrapping a third-party SMS SDK to match your \`MessageSender\` interface
- **Decorator** wraps an object with the same interface to add behaviour, as with \`new BufferedReader(new FileReader(file))\`
- **Proxy** stands in for another object to control access, add caching, or load lazily; Spring uses proxies for transactions

All three wrap objects, but their intents differ: change the interface, add behaviour, or control access.

## Strategy, Observer and Command

- **Strategy**: interchangeable algorithms behind one interface; often a lambda today
- **Observer**: subjects notify registered listeners of changes, as in event systems and UI frameworks
- **Command**: requests as objects, enabling undo stacks, queues and logging

## Patterns aren't goals

Patterns solve specific problems. Applying them without the problem adds indirection: a factory for one class, or a strategy with one implementation. Interviewers value candidates who can explain why a pattern fits and when it doesn't.

## Classic OOP traps

These questions recur constantly. Each was covered earlier in the course:

1. **Fields aren't polymorphic.** \`Parent p = new Child(); p.name\` reads Parent's field; \`p.getName()\` runs Child's override
2. **Static methods are hidden, not overridden.** A static call through a parent reference runs the parent's version
3. **Overloads are chosen at compile time.** \`Object o = "hi"; print(o)\` calls \`print(Object)\`, not \`print(String)\`
4. **Widening beats boxing beats varargs.** \`f(5)\` prefers \`f(long)\` over \`f(Integer)\`
5. **Constructors call overridable methods dangerously.** A parent constructor calling an override sees the child's fields uninitialized
6. **equals without hashCode breaks HashSet.** Equal objects land in different buckets
7. **\`equals(Point)\` doesn't override \`equals(Object)\`.** Use @Override to catch it
8. **== compares references.** Two \`new String("a")\` are \`==\`-different but \`equals\`-same
9. **final freezes references, not objects.** A final list can still be modified
10. **Private methods can't be overridden.** A same-named subclass method is unrelated
11. **Java is pass-by-value.** A method can change an object's fields but not the caller's reference
12. **Integer caching.** \`Integer a = 127, b = 127; a == b\` is true, but with 128 it's typically false, because only -128 to 127 are cached. Always compare wrappers with \`equals\`
13. **Adding any constructor removes the default one.** Subclasses relying on implicit \`super()\` then fail to compile
14. **Abstract classes have constructors; interfaces don't.**

## Answering design questions

For low-level design rounds (parking lot, elevator, library system):

1. clarify requirements and scope
2. identify core entities (nouns) and their responsibilities
3. define interfaces where variation exists, applying SOLID
4. name the patterns you use and why
5. discuss extensions: how a new vehicle type or payment method fits without modifying existing classes

## How interviewers test this

Expect "Implement a thread-safe singleton", "Difference between Adapter, Decorator and Proxy?", rapid output puzzles from the trap list, and a low-level design problem. Know two singleton implementations and their trade-offs, distinguish wrappers by intent, trace traps with the reference-type versus object-type rule, and justify every pattern you use with the problem it solves.`,
    sources: [PATTERNS, SINGLETON],
  },
};
