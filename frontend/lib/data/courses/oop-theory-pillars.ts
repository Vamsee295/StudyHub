// Long-form theory for OOP modules 4-6: inheritance, polymorphism, abstraction. Original writing.
import { LessonTheory } from './utils';

const INHERITANCE = { title: "The Java Tutorials: Inheritance", url: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html" };
const OVERRIDING = { title: "The Java Tutorials: Overriding and Hiding Methods", url: "https://docs.oracle.com/javase/tutorial/java/IandI/override.html" };
const SUPER = { title: "The Java Tutorials: Using the Keyword super", url: "https://docs.oracle.com/javase/tutorial/java/IandI/super.html" };
const FINAL = { title: "The Java Tutorials: Writing Final Classes and Methods", url: "https://docs.oracle.com/javase/tutorial/java/IandI/final.html" };
const OBJECT_TUT = { title: "The Java Tutorials: Object as a Superclass", url: "https://docs.oracle.com/javase/tutorial/java/IandI/objectclass.html" };
const OBJECT_API = { title: "Java SE API: java.lang.Object", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html" };
const POLY = { title: "The Java Tutorials: Polymorphism", url: "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html" };
const ABSTRACT = { title: "The Java Tutorials: Abstract Methods and Classes", url: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html" };
const INTERFACES = { title: "The Java Tutorials: Interfaces", url: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html" };
const DEFAULT_METHODS = { title: "The Java Tutorials: Default Methods", url: "https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html" };
const PATTERN_INSTANCEOF = { title: "JEP 394: Pattern Matching for instanceof", url: "https://openjdk.org/jeps/394" };
const JLS = { title: "The Java Language Specification", url: "https://docs.oracle.com/javase/specs/" };
const STRATEGY = { title: "Refactoring.Guru: Strategy Pattern", url: "https://refactoring.guru/design-patterns/strategy" };

export const oopPillarsTheory: Record<string, LessonTheory> = {
  "what-is-inheritance": {
    theory: `Inheritance lets one class build on another: a subclass receives the fields and methods of its superclass and adds or changes behaviour. It models "is-a" relationships, such as a SavingsAccount is an Account, and enables polymorphism. Used carelessly, it also creates some of the most rigid code in object-oriented systems. This lesson explains what inheritance gives you, what it doesn't, the is-a test, and why many designers prefer composition.

## The extends keyword

~~~java
public class Account {
    protected double balance;

    public void deposit(double amount) { balance += amount; }
    public double getBalance() { return balance; }
}

public class SavingsAccount extends Account {
    private final double rate;

    public SavingsAccount(double rate) { this.rate = rate; }

    public void addInterest() { deposit(balance * rate); }
}
~~~

A SavingsAccount object has everything an Account has, plus \`rate\` and \`addInterest\`. Code written once in Account is reused by every subclass.

## What is inherited

A subclass inherits:

- public and protected fields and methods
- package-private members, if the subclass is in the same package

It does **not** inherit:

- **constructors**: each class declares its own and calls a parent constructor with \`super(...)\`
- **private members** in a usable way: the fields exist inside the object, but subclass code can't name them directly
- **static members** in the polymorphic sense: they're accessible through the subclass, but they're hidden, not overridden

## The is-a test

Inheritance should model a true "is-a" relationship, where every subclass object can stand in for a superclass object anywhere. A Dog is an Animal; a Car is a Vehicle. Failing the test produces trouble:

- a \`Stack extends ArrayList\` inherits \`add(index, element)\`, which lets callers insert into the middle of a stack, breaking its rules. Java's own \`java.util.Stack extends Vector\` has this flaw
- a \`Square extends Rectangle\` breaks when code sets width and height independently, which the SOLID module discusses as the Liskov substitution principle

If a subclass needs to disable or contradict inherited behaviour, the relationship probably isn't is-a.

## Inheritance versus composition

**Composition** means a class holds a reference to another object and delegates to it, a "has-a" relationship:

~~~java
public class Car {
    private final Engine engine;          // Car has an Engine
    public void start() { engine.ignite(); }
}
~~~

| | Inheritance | Composition |
|---|---|---|
| Relationship | is-a | has-a |
| Coupling | Tight: subclass depends on parent internals | Loose: depends only on the public API |
| Flexibility | Fixed at compile time | Parts can be swapped at runtime |
| Exposure | Subclass inherits the whole parent API | Expose only what you choose |

"Favour composition over inheritance" is a widely followed guideline from the Gang of Four and Effective Java. Inheritance remains the right tool for genuine type hierarchies, especially when designed for extension, as with abstract base classes.

## The fragile base class problem

Subclasses depend on the parent's implementation details, not only its public contract. Suppose a parent's \`addAll\` calls \`add\` internally, and a subclass overrides \`add\` to count insertions. If the parent later changes \`addAll\` to stop calling \`add\`, the subclass's count breaks, though the subclass didn't change. Changes to a base class can silently break subclasses, which is why classes not designed for extension are often marked \`final\`.

## Single inheritance of classes

A Java class extends exactly one class. Every class without an explicit \`extends\` extends \`Object\`, so all classes form a single tree rooted at Object. Multiple inheritance of type comes through interfaces, which a class can implement in any number. The types of inheritance lesson explains why Java made this choice.

## Benefits worth naming

- **Code reuse**: shared behaviour lives in one place
- **Polymorphism**: code written against the parent type works with every subclass
- **Hierarchical modelling**: domain concepts with real is-a structure map naturally onto class trees

## When to reach for inheritance

Use it when the is-a relationship is real and stable, the parent is designed for extension (documented, with protected hooks), and you need polymorphic substitution. Otherwise, start with composition and an interface; you can always introduce a base class later if repetition appears.

## How interviewers test this

Expect "What is inheritance?", "What isn't inherited?" and "Composition vs inheritance?" Define is-a, list constructors and private members as not inherited, give the Stack-extends-Vector example of misuse, and explain why composition is usually preferred for flexibility.`,
    sources: [INHERITANCE, JLS],
  },

  "types-of-inheritance": {
    theory: `Inheritance comes in several shapes: single, multilevel, hierarchical, multiple and hybrid. Java supports the first three with classes and supports multiple inheritance only through interfaces. Understanding why Java made that choice, and how it handles the diamond problem with default methods, is a staple interview topic. This lesson walks through each type with Java examples.

## Single inheritance

One class extends one parent:

~~~java
class Animal { void eat() { } }
class Dog extends Animal { void bark() { } }
~~~

This is the basic building block of every Java class hierarchy.

## Multilevel inheritance

A chain of classes, each extending the previous one:

~~~java
class Animal { }
class Mammal extends Animal { }
class Dog extends Mammal { }
~~~

A Dog is a Mammal and an Animal. Constructors run from the top of the chain down. Deep chains, beyond three or four levels, become hard to follow, because understanding one class means reading all its ancestors.

## Hierarchical inheritance

Several classes extend the same parent:

~~~java
class Shape { }
class Circle extends Shape { }
class Square extends Shape { }
class Triangle extends Shape { }
~~~

This shape is common and works well with polymorphism: code that handles a Shape works with all three.

## Multiple inheritance

One class inheriting from two or more classes. Java **doesn't allow** this for classes:

~~~java
class A { void show() { System.out.println("A"); } }
class B { void show() { System.out.println("B"); } }
class C extends A, B { }   // compile error
~~~

## The diamond problem

Multiple inheritance creates ambiguity. Suppose B and C both extend A and override \`show()\`, and D extends both B and C. Which \`show()\` does D inherit? And does D contain one copy of A's fields or two? This is the **diamond problem**, named after the shape of the class diagram. C++ allows multiple inheritance and resolves it with virtual inheritance and explicit qualification, at the cost of complexity. Java's designers avoided the problem by allowing only one superclass.

## Multiple inheritance of type through interfaces

A Java class can implement any number of interfaces:

~~~java
interface Swimmer { void swim(); }
interface Flyer { void fly(); }

class Duck extends Animal implements Swimmer, Flyer {
    public void swim() { }
    public void fly() { }
}
~~~

Before Java 8, interfaces had no method bodies or instance state, so no ambiguity could arise: the class supplied the one implementation. This gave Java multiple inheritance of **type** without multiple inheritance of **state**.

## Default methods bring the diamond back, partly

Java 8 added default methods, interface methods with bodies. If two interfaces provide the same default method, a class implementing both must resolve the conflict:

~~~java
interface A { default String hello() { return "A"; } }
interface B { default String hello() { return "B"; } }

class C implements A, B {
    @Override
    public String hello() {
        return A.super.hello();      // explicitly choose A's version
    }
}
~~~

Without the override, the class doesn't compile. Java's resolution rules are:

1. **Class wins**: a method declared in the class or a superclass beats any interface default
2. **More specific interface wins**: if interface B extends A, B's default beats A's
3. **Otherwise**, the class must override and choose explicitly, using \`X.super.method()\`

Because interfaces still can't hold instance fields, the state half of the diamond problem never returns.

## Hybrid inheritance

A mix of the types above, such as hierarchical plus multiple. In Java, hybrid structures are built from one class chain plus interfaces. A class like \`ArrayList\` extends \`AbstractList\` and implements \`List\`, \`RandomAccess\`, \`Cloneable\` and \`Serializable\`, a real example of hybrid inheritance.

## Summary table

| Type | Java classes | Java interfaces |
|---|---|---|
| Single | Yes | Yes |
| Multilevel | Yes | Yes (interfaces extend interfaces) |
| Hierarchical | Yes | Yes |
| Multiple | No | Yes |
| Hybrid | Through one class chain plus interfaces | Yes |

## Cyclic inheritance

A class can't extend itself, directly or indirectly; \`class A extends B\` with \`class B extends A\` is a compile error. The inheritance graph must be acyclic.

## How interviewers test this

Expect "Why doesn't Java support multiple inheritance?", "What is the diamond problem?" and "How do default methods handle conflicts?" Explain ambiguity of methods and duplicated state, show interfaces as Java's solution, and walk through the three resolution rules including \`X.super.method()\`.`,
    sources: [INHERITANCE, DEFAULT_METHODS],
  },

  "super-keyword": {
    theory: `The \`super\` keyword gives a subclass access to the parts of the object that come from its parent: the parent's constructors, its versions of overridden methods, and its hidden fields. It's how subclasses extend behaviour instead of replacing it wholesale. This lesson covers the three uses of super, the constructor rules, how super differs from this, and the limits of what super can reach.

## Use 1: calling a parent constructor

A subclass constructor calls a parent constructor with \`super(...)\`, which must be the first statement:

~~~java
public class Person {
    protected final String name;
    public Person(String name) { this.name = name; }
}

public class Employee extends Person {
    private final String dept;

    public Employee(String name, String dept) {
        super(name);          // initialize the Person part first
        this.dept = dept;
    }
}
~~~

If you omit it, the compiler inserts \`super()\`, which fails if the parent has no no-argument constructor. The parent part of the object is always initialized before the child part, so child code can rely on parent fields being ready.

## Use 2: calling the parent's version of a method

When a subclass overrides a method, \`super.method()\` still reaches the parent's version. This lets the override add to the parent's behaviour:

~~~java
public class Logger {
    public void log(String msg) { System.out.println(msg); }
}

public class TimestampLogger extends Logger {
    @Override
    public void log(String msg) {
        super.log(java.time.LocalTime.now() + " " + msg);
    }
}
~~~

A common pattern in frameworks: an overridden lifecycle method such as \`onCreate\` in Android must call \`super.onCreate(...)\` so the framework's own setup still runs. Forgetting it causes errors that are hard to trace.

## Use 3: accessing hidden fields

If a subclass declares a field with the same name as a parent field, the child field **hides** the parent field. \`super.field\` reaches the parent's:

~~~java
class Parent { String label = "parent"; }
class Child extends Parent {
    String label = "child";
    void show() {
        System.out.println(label);         // child
        System.out.println(super.label);   // parent
    }
}
~~~

Field hiding is confusing and almost always a mistake; give fields distinct names instead. Fields aren't polymorphic: which field is used depends on the reference's compile-time type, not the object's runtime type.

## super versus this

| | this | super |
|---|---|---|
| Refers to | The current object, as its own class | The parent-class part of the current object |
| Constructor call | \`this(...)\`: another constructor in the same class | \`super(...)\`: a parent constructor |
| Method call | \`this.m()\`: dynamic dispatch, may run an override | \`super.m()\`: always the parent's version, no dispatch |
| Usable in static code | No | No |

The key difference in method calls: \`this.m()\` uses dynamic dispatch and runs the most specific override, while \`super.m()\` is resolved statically to the direct parent's implementation.

## Limits of super

- **Only one level up**: \`super.super.m()\` isn't allowed. A class can reach its direct parent's version, not its grandparent's, which keeps each class responsible only for its immediate parent
- **Private members stay private**: \`super.secret\` doesn't compile if \`secret\` is private in the parent
- **No static context**: super refers to part of an object, so static methods can't use it
- **Not a separate object**: there's one object; super is a view of its parent-class portion, not a pointer to another instance

## super with interfaces

Inside a class implementing an interface with a default method, \`InterfaceName.super.method()\` calls that interface's default implementation. This is how conflicts between two interface defaults are resolved, as the types of inheritance lesson explains.

## Extending versus replacing

When overriding, decide deliberately whether to call super:

- **Extend**: call super and add behaviour before or after, as with logging, validation or framework lifecycle methods
- **Replace**: skip super when the parent's behaviour is wrong for the subclass, such as overriding \`toString\` completely

If the parent's documentation says overrides must call super, do so; otherwise its invariants may break.

## How interviewers test this

Expect "What are the uses of super?", "Can you call super.super.method()?" and output questions with hidden fields. Name the three uses, explain that super method calls skip dynamic dispatch, state that super.super isn't allowed, and note that fields are resolved by reference type, not object type.`,
    sources: [SUPER, JLS],
  },

  "method-overriding-basics": {
    theory: `Method overriding lets a subclass provide its own implementation of a method inherited from its parent. When the method is called through a parent-type reference, Java runs the subclass version, chosen at runtime. Overriding is the mechanism behind runtime polymorphism. This lesson covers the rules an override must follow, the @Override annotation, covariant return types, exception rules, and what can't be overridden.

## A basic override

~~~java
class Animal {
    public String sound() { return "..."; }
}

class Dog extends Animal {
    @Override
    public String sound() { return "Woof"; }
}

Animal a = new Dog();
a.sound();   // "Woof": the Dog version runs
~~~

The reference type is Animal, but the object is a Dog, and the object's type decides which method runs.

## The rules for a valid override

An overriding method must:

1. **Have the same name and parameter types** as the parent method. Different parameters create an overload, not an override
2. **Have a compatible return type**: the same type, or a subtype for reference types (covariant return)
3. **Not reduce visibility**: a public method can't be overridden as protected
4. **Not throw broader checked exceptions**: it may throw the same, narrower or no checked exceptions
5. **Be an instance method** that the subclass can see and that isn't final

| Parent method | Allowed in override | Not allowed |
|---|---|---|
| \`protected Number get()\` | \`public Integer get()\` | \`private Number get()\` |
| \`void read() throws IOException\` | \`void read() throws FileNotFoundException\` | \`void read() throws Exception\` |

Unchecked exceptions are unrestricted.

## Why the rules exist

All the rules protect **substitutability**. Code holding an Animal reference expects to call \`sound()\` with the parent's visibility, get back the declared return type, and handle only the declared checked exceptions. An override that narrowed visibility, returned an unrelated type, or threw a new checked exception would break that caller.

## The @Override annotation

\`@Override\` tells the compiler you intend to override. If the method doesn't actually override anything, compilation fails:

~~~java
class Point {
    @Override
    public boolean equals(Point other) { ... }   // compile error: doesn't override equals(Object)
}
~~~

Without the annotation, this silently creates an overload, and collections calling \`equals(Object)\` never use it. Always use \`@Override\`; it turns a subtle runtime bug into a compile-time error.

## Covariant return types

Since Java 5, an override may return a subtype of the parent's return type:

~~~java
class Animal { Animal reproduce() { return new Animal(); } }
class Dog extends Animal {
    @Override Dog reproduce() { return new Dog(); }   // narrower return type
}
~~~

Callers holding a Dog reference get a Dog back without casting. \`clone()\` overrides commonly use this to return the specific type.

## What can't be overridden

- **final methods**: the parent forbids it
- **private methods**: not visible to the subclass; declaring a same-named method creates a new, unrelated method
- **static methods**: a same-signature static method in a subclass **hides** the parent's, and which one runs depends on the reference type, not the object
- **constructors**: they aren't inherited at all

~~~java
class Parent { static String id() { return "P"; } }
class Child extends Parent { static String id() { return "C"; } }

Parent p = new Child();
p.id();   // "P": static methods are resolved by reference type
~~~

This hiding behaviour is a frequent output question.

## Overriding versus overloading

| | Overriding | Overloading |
|---|---|---|
| Where | Subclass redefines a parent method | Same class (or subclass) adds a method with the same name |
| Parameters | Must match | Must differ |
| Resolved | At runtime, by object type | At compile time, by argument types |
| Polymorphism type | Runtime (dynamic) | Compile-time (static) |

## Calling the parent version

An override can still use the parent's logic with \`super.method()\`, which lets it extend behaviour instead of replacing it entirely.

## Overriding Object methods

The most common overrides in real code are \`toString\`, \`equals\` and \`hashCode\` from Object. The Object class lesson covers their contracts, which are stricter than they look.

## How interviewers test this

Expect "What are the rules of method overriding?", "Can you override static or private methods?" and "Overriding vs overloading?" List the five rules with the reason behind them, explain static method hiding with an output example, show how @Override catches the \`equals(Point)\` mistake, and contrast runtime and compile-time resolution.`,
    sources: [OVERRIDING, JLS],
  },

  "preventing-inheritance-final": {
    theory: `The \`final\` keyword closes doors. A final class can't be extended, a final method can't be overridden, and a final variable can't be reassigned. Choosing what to make final is a design decision about which parts of a class are fixed and which are open for extension. This lesson covers final classes and methods, why the JDK makes classes such as String final, sealed classes as a finer-grained alternative, and the design principle "design for inheritance or prohibit it".

## Final classes

~~~java
public final class Money {
    // ...
}

class Coins extends Money { }   // compile error: cannot inherit from final Money
~~~

A final class has no subclasses, so its behaviour is exactly what its own code says. JDK examples include \`String\`, \`Integer\` and the other wrapper classes, \`LocalDate\` and \`Math\`.

## Why String is final

If String could be subclassed, a malicious or buggy subclass could override methods to return different contents over time, breaking:

- **immutability**, which the string pool and hash map keys depend on
- **security checks**, such as validating a file path and then using it, if the subclass changed its value between check and use
- **performance assumptions** the JVM makes about String's behaviour

Making the class final guarantees every String behaves like a String.

## Final methods

A final method can't be overridden, while the rest of the class stays extensible:

~~~java
public abstract class Payment {
    public final void process() {       // the algorithm is fixed
        validate();
        charge();
        sendReceipt();
    }
    protected abstract void charge();   // the step subclasses customize
    protected void validate() { }
    protected void sendReceipt() { }
}
~~~

This is the **template method** pattern: the parent fixes the sequence of steps, and subclasses fill in individual steps. Making \`process\` final stops a subclass from skipping validation or receipts.

Final methods are also appropriate when a constructor must call a method: making it final (or private) prevents a subclass override from running on a half-built object.

## Design for inheritance or prohibit it

Effective Java's guideline: a class should either be carefully designed and documented for extension, or be made final. Designing for inheritance means:

- documenting which methods call which overridable methods (self-use)
- providing protected hooks deliberately
- testing by writing subclasses

Without that work, subclasses depend on undocumented implementation details and break when the parent changes, the fragile base class problem. Many teams default to final and remove it when a real extension need appears.

## Alternatives to final

- **Private constructors** with static factories prevent subclassing from outside the class, since a subclass constructor must call a parent constructor it can't access
- **Package-private constructors** allow subclasses only within the package

## Sealed classes (Java 17)

Sealed classes sit between final and fully open: they list exactly which classes may extend them.

~~~java
public sealed interface Shape permits Circle, Square, Rectangle { }

public final class Circle implements Shape { ... }
public final class Square implements Shape { ... }
public non-sealed class Rectangle implements Shape { ... }
~~~

Each permitted subclass must declare itself \`final\`, \`sealed\` (with its own permits list) or \`non-sealed\` (open again). Sealing lets the compiler know every possible subtype, so a \`switch\` over a sealed type can be checked for exhaustiveness without a default branch. Sealed hierarchies suit closed sets of variants, such as payment methods or expression nodes.

## Final variables, briefly

\`final\` on a variable means it's assigned exactly once:

- **final fields** must be assigned by the end of construction
- **final local variables and parameters** can't be reassigned
- **final references** can't point elsewhere, but the object they refer to can still change

The final keyword advanced lesson covers these in depth, including effectively final variables in lambdas.

## Performance myths

Older advice claimed final methods were faster because they could be inlined. Modern JIT compilers inline non-final methods too, using class hierarchy analysis. Use final for design reasons, not speed.

## How interviewers test this

Expect "What are the uses of final?", "Why is String final?" and "Can an abstract class be final?" Cover final classes, methods and variables, explain String's immutability and security reasons, show the template method use of final methods, mention sealed classes, and note that abstract and final together don't compile, because an abstract class needs a subclass.`,
    sources: [FINAL, JLS],
  },

  "the-object-class": {
    theory: `Every Java class ultimately extends \`java.lang.Object\`, so every object inherits its methods. Three of them, \`equals\`, \`hashCode\` and \`toString\`, are overridden in almost every serious class, and getting \`equals\` and \`hashCode\` wrong breaks hash-based collections in silent, confusing ways. This lesson covers Object's methods, the equals and hashCode contracts, and how to implement them correctly.

## Object's methods

| Method | Purpose |
|---|---|
| \`equals(Object)\` | Logical equality; defaults to reference equality |
| \`hashCode()\` | Hash value for hash tables; consistent with equals |
| \`toString()\` | Text representation; defaults to \`ClassName@hexHash\` |
| \`getClass()\` | Runtime class of the object (final) |
| \`clone()\` | Protected field-by-field copy, with Cloneable |
| \`wait()\`, \`notify()\`, \`notifyAll()\` | Thread coordination on the object's monitor (final) |
| \`finalize()\` | Deprecated cleanup hook; don't use it |

## toString

The default output, such as \`Student@1b6d3586\`, is useless in logs. Override it to show meaningful state:

~~~java
@Override
public String toString() {
    return "Student[name=" + name + ", rollNo=" + rollNo + "]";
}
~~~

\`System.out.println(obj)\` and string concatenation call \`toString\` automatically. Avoid including sensitive data such as passwords.

## The equals contract

The default \`equals\` compares references. Override it when two distinct objects with the same values should count as equal. The documented contract requires equals to be:

- **Reflexive**: \`x.equals(x)\` is true
- **Symmetric**: \`x.equals(y)\` equals \`y.equals(x)\`
- **Transitive**: if x equals y and y equals z, then x equals z
- **Consistent**: repeated calls give the same result if nothing changes
- **Non-null**: \`x.equals(null)\` is false

## A correct equals

~~~java
@Override
public boolean equals(Object o) {
    if (this == o) return true;                       // same object
    if (!(o instanceof Point other)) return false;    // type check (also handles null)
    return x == other.x && y == other.y;              // compare significant fields
}
~~~

Notes:

- the parameter must be \`Object\`, or it's an overload that collections never call; \`@Override\` catches this
- compare floating-point fields with \`Double.compare\`, and object fields with \`Objects.equals\`, which handles nulls
- using \`instanceof\` allows subclass instances to be equal to parent instances, which can break symmetry if a subclass adds fields; using \`getClass() != o.getClass()\` avoids that but rejects subclasses entirely. Making the class final sidesteps the dilemma

## The hashCode contract

If two objects are equal by \`equals\`, they **must** have the same hash code. Unequal objects may share a hash code, though fewer collisions mean faster hash tables.

~~~java
@Override
public int hashCode() {
    return Objects.hash(x, y);
}
~~~

## Why overriding only equals breaks HashMap

A HashMap finds a key by first computing its hash code to choose a bucket, then calling equals within that bucket. If you override equals but not hashCode, two equal points get different default hash codes, land in different buckets, and the map never compares them:

~~~java
Set<Point> set = new HashSet<>();
set.add(new Point(1, 2));
set.contains(new Point(1, 2));   // false without hashCode
~~~

The set ends up holding "duplicates", and lookups fail. This is one of the most asked Java interview bugs.

## Mutable keys

If a field used in hashCode changes after the object is put in a HashMap, the object sits in a bucket for its old hash and becomes unreachable by lookup. Use immutable objects as keys, or never mutate key fields.

## Records do this for you

A record generates \`equals\`, \`hashCode\` and \`toString\` from its components, following the contracts correctly. For value-like data, records remove a common source of bugs. IDEs and Lombok can also generate these methods.

## getClass and the other methods

\`getClass()\` returns the runtime class and is final. \`wait\`, \`notify\` and \`notifyAll\` support low-level thread coordination; modern code usually uses \`java.util.concurrent\` instead. \`finalize\` is deprecated for removal because it ran unpredictably; use try-with-resources or \`Cleaner\` for cleanup.

## A quick checklist

Whenever a class represents a value, override \`toString\` for readable logs, and override \`equals\` and \`hashCode\` together using the same fields. Add \`@Override\` to each, so a wrong parameter type fails at compile time. If the class is plain data, prefer a record and let the compiler write all three.

## How interviewers test this

Expect "What methods does Object have?", "What's the equals and hashCode contract?" and "What happens if you override equals but not hashCode?" List the methods, state the five equals properties and the hashCode rule, walk through the HashSet bug bucket by bucket, and mention records as the modern way to get these right.`,
    sources: [OBJECT_TUT, OBJECT_API],
  },

  "what-is-polymorphism": {
    theory: `Polymorphism means "many forms": one interface, many implementations. In Java, a variable of a parent type can refer to objects of any subclass, and calling a method on it runs the version that belongs to the actual object. This lets you write code once against an abstraction and have it work with types that don't exist yet. This lesson explains the two kinds of polymorphism, how dynamic dispatch works, and why polymorphism is central to extensible design.

## The core idea

~~~java
abstract class Shape { abstract double area(); }
class Circle extends Shape {
    final double r;
    Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }
}
class Square extends Shape {
    final double s;
    Square(double s) { this.s = s; }
    double area() { return s * s; }
}

double total(List<Shape> shapes) {
    double sum = 0;
    for (Shape s : shapes) sum += s.area();   // the right formula for each object
    return sum;
}
~~~

\`total\` knows nothing about circles or squares. Add a Triangle class tomorrow, and \`total\` works with it unchanged.

## Two kinds of polymorphism

| | Compile-time (static) | Runtime (dynamic) |
|---|---|---|
| Mechanism | Method overloading | Method overriding |
| Decided by | Compiler, from argument types | JVM, from the object's actual type |
| Also called | Static binding, early binding | Dynamic dispatch, late binding |
| Example | \`print(int)\` vs \`print(String)\` | \`shape.area()\` on a Circle or Square |

When people say "polymorphism" in OOP, they usually mean runtime polymorphism. Generics are sometimes called parametric polymorphism, a third form.

## Reference type versus object type

Every polymorphic call involves two types:

- the **reference type** (compile-time type): the declared type of the variable, such as Shape
- the **object type** (runtime type): the class of the object actually created, such as Circle

~~~java
Shape s = new Circle(2);
~~~

The **compiler** uses the reference type to decide which methods you may call: only methods declared in Shape. The **JVM** uses the object type to decide which implementation runs. That's why \`s.area()\` compiles (Shape declares it) and runs Circle's version.

## How dynamic dispatch works

The JVM typically gives each class a **virtual method table** (vtable): an array of pointers to the implementations of its overridable methods. A subclass's table copies the parent's entries and replaces those it overrides. A call like \`s.area()\` looks up the slot for \`area\` in the object's table and jumps there. The JIT compiler often optimizes this further, inlining the call when only one implementation is loaded, so polymorphism rarely costs measurable performance.

## What isn't polymorphic

- **Fields**: resolved by reference type. A field declared in both parent and child is chosen by the variable's declared type
- **Static methods**: resolved by reference type; they're hidden, not overridden
- **Private and final methods**: can't be overridden, so they're bound at compile time

## Upcasting

Assigning a subclass object to a parent reference is **upcasting**. It's implicit and always safe, because every Circle is a Shape:

~~~java
Shape s = new Circle(2);   // implicit upcast
~~~

Going the other way, downcasting, requires an explicit cast and can fail at runtime; the downcasting lesson covers it.

## Why polymorphism matters

- **Open for extension**: new types plug in without changing existing code, the open-closed principle
- **Removes type switches**: instead of \`if (type == CIRCLE) ... else if (type == SQUARE) ...\` scattered everywhere, each class carries its own behaviour
- **Enables frameworks**: a web framework calls your controller through an interface it defined years before your class existed
- **Testability**: code depending on an interface can be tested with a fake implementation

## Polymorphism through interfaces

Interfaces are the most flexible form, because unrelated classes can implement the same interface. \`List<String> list = new ArrayList<>()\` is polymorphism: code depends on List, and you can switch to LinkedList by changing one line. Programming to interfaces rather than concrete classes is a widely recommended habit.

## How interviewers test this

Expect "What is polymorphism?", "Compile-time vs runtime polymorphism?" and output questions mixing reference and object types. Define one interface with many implementations, contrast overloading and overriding, explain that the compiler checks the reference type while the JVM dispatches on the object type, and note that fields and static methods aren't polymorphic.`,
    sources: [POLY, JLS],
  },

  "method-overloading": {
    theory: `Method overloading means defining several methods with the same name but different parameter lists in one class. The compiler picks which one to call from the argument types, which is why overloading is called compile-time polymorphism. Overloading makes APIs pleasant, as with \`println\` accepting any type, but its resolution rules around widening, boxing, varargs and null produce classic interview puzzles. This lesson explains the rules and the traps.

## Valid overloads

Methods overload when their parameter lists differ in number, types or order:

~~~java
int max(int a, int b) { ... }
double max(double a, double b) { ... }
int max(int a, int b, int c) { ... }
~~~

What doesn't count:

- **return type alone**: \`int parse(String s)\` and \`long parse(String s)\` can't coexist
- **parameter names**: \`f(int a)\` and \`f(int b)\` are the same signature
- **checked exceptions or access modifiers**: they're not part of the signature
- **generic type arguments after erasure**: \`f(List<String>)\` and \`f(List<Integer>)\` both erase to \`f(List)\` and clash

## How the compiler chooses

When several overloads could apply, the compiler works in phases and stops at the first phase that finds a match:

1. **Exact match or widening of primitives** (int to long, float to double) and subtype references, without boxing or varargs
2. **Boxing and unboxing** allowed (int to Integer)
3. **Varargs** allowed

Within a phase, it picks the **most specific** method. If no single most specific method exists, the call is ambiguous and doesn't compile.

## Widening beats boxing

~~~java
void f(long x) { System.out.println("long"); }
void f(Integer x) { System.out.println("Integer"); }

f(5);   // prints "long"
~~~

Phase 1 finds \`f(long)\` by widening int to long, so boxing to Integer is never considered. This rule preserved the behaviour of pre-Java-5 code when autoboxing arrived.

## Boxing beats varargs

~~~java
void g(Integer x) { System.out.println("Integer"); }
void g(int... xs) { System.out.println("varargs"); }

g(5);   // prints "Integer"
~~~

Varargs is the last resort, used only when nothing else fits.

## Most specific wins

~~~java
void h(Object o) { System.out.println("Object"); }
void h(String s) { System.out.println("String"); }

h("hi");   // String
h(null);   // String: null fits both, and String is more specific
~~~

Add a third overload \`h(Integer i)\` and \`h(null)\` becomes ambiguous: String and Integer are both more specific than Object, but neither is more specific than the other. The fix is a cast: \`h((String) null)\`.

## Overloading uses the compile-time type

Overload selection uses the **declared** type of the argument, not its runtime type:

~~~java
void describe(Object o) { System.out.println("object"); }
void describe(String s) { System.out.println("string"); }

Object x = "hello";
describe(x);   // "object": x's declared type is Object
~~~

This is the sharpest contrast with overriding, where the runtime type decides. People expecting "string" here have confused the two mechanisms.

## The remove trap in lists

\`List<Integer>\` has \`remove(int index)\` and \`remove(Object o)\`:

~~~java
List<Integer> list = new ArrayList<>(List.of(10, 20, 30));
list.remove(1);                    // removes index 1 (the value 20)
list.remove(Integer.valueOf(10));  // removes the value 10
~~~

\`remove(1)\` picks the int overload in phase 1 without boxing. This real API pitfall appears in interviews and production bugs alike.

## Overloading and inheritance

A subclass can overload an inherited method by adding a version with different parameters. Combined with overriding, this gets confusing: a subclass method with a different parameter type looks like an override but is an overload, and it isn't called polymorphically. The \`@Override\` annotation catches this.

## Designing overloads well

- overloads should do the same conceptual thing, differing only in input form
- avoid overloads with the same number of parameters where types could convert into each other
- when overloads would be confusing, use distinct names instead, as in \`writeInt\` and \`writeLong\`
- \`println\` is the classic good example: one concept, many input types

## A quick summary

Overloading is resolved once, by the compiler, from the declared types of the arguments. The compiler tries widening first, then boxing, then varargs, and picks the most specific match in the first phase that succeeds. When two candidates are equally specific, the call is ambiguous, and a cast settles it.

## How interviewers test this

Expect output questions with widening versus boxing, \`null\` arguments, and declared versus runtime types, plus "Can you overload by return type?" Walk through the three phases, explain most-specific selection and ambiguity, and emphasize that overloading is resolved at compile time from declared types.`,
    sources: [POLY, JLS],
  },

  "method-overriding-polymorphism": {
    theory: `Runtime polymorphism is where overriding pays off: code holds a parent-type reference, calls a method, and the JVM runs the subclass's version. This is dynamic dispatch, and it's what lets frameworks, plugins and strategy objects work. This lesson goes deeper into how dispatch interacts with constructors, super calls, fields and static methods, and works through the classic output puzzles that test whether you can trace it precisely.

## Dispatch on the object, not the variable

~~~java
class Employee {
    double bonus() { return 1000; }
    String describe() { return "Bonus: " + bonus(); }
}
class Manager extends Employee {
    @Override double bonus() { return 5000; }
}

Employee e = new Manager();
e.describe();   // "Bonus: 5000.0"
~~~

\`describe\` is inherited from Employee and not overridden, yet its internal call to \`bonus()\` runs Manager's version. Every call to an overridable method, including calls the parent makes on itself (\`this.bonus()\`), dispatches on the actual object. This self-call behaviour is what makes the template method pattern work, and it's also the root of the fragile base class problem.

## Tracing a polymorphic call

To predict the output of \`ref.method(args)\`:

1. **Compile time**: look at the reference's declared type. Does it declare or inherit a method matching the arguments? If not, compile error. This step also picks the overload
2. **Runtime**: look at the object's actual class. Starting there, walk up the hierarchy and run the first implementation of that exact signature

Applying the two steps mechanically solves almost every output question.

## A combined overload and override puzzle

~~~java
class A {
    void show(Object o) { System.out.println("A-Object"); }
}
class B extends A {
    @Override void show(Object o) { System.out.println("B-Object"); }
    void show(String s) { System.out.println("B-String"); }
}

A ref = new B();
ref.show("hi");
~~~

Step 1: the reference type is A, which only has \`show(Object)\`, so the compiler selects that signature. Step 2: the object is a B, which overrides \`show(Object)\`. Output: "B-Object". The \`show(String)\` overload in B is invisible through an A reference.

## Fields don't dispatch

~~~java
class P { String name = "P"; String getName() { return name; } }
class C extends P { String name = "C"; @Override String getName() { return name; } }

P obj = new C();
System.out.println(obj.name);       // "P": field chosen by reference type
System.out.println(obj.getName());  // "C": method chosen by object type
~~~

This contrast is a favourite interview question and a strong reason to keep fields private and access them through methods.

## Static methods don't dispatch

A static method with the same signature in a subclass hides the parent's. A call through a parent reference runs the parent's static method, regardless of the object. Calling static methods through instance references is legal but misleading; call them through the class name.

## Dispatch during construction

Dynamic dispatch works even inside constructors. If a parent constructor calls an overridable method, the subclass override runs before the subclass's fields are initialized, and it may see null or zero values. Keep constructor calls to private or final methods.

## super calls skip dispatch

\`super.method()\` always runs the direct parent's implementation, without looking at the object's actual type. It's how an override reuses the parent's behaviour without recursing into itself.

## Polymorphism replaces conditionals

A common refactoring replaces a type switch with polymorphism:

~~~java
// Before: every new type means editing this method
double fee(Account a) {
    if (a.type == SAVINGS) return 0;
    else if (a.type == CURRENT) return 100;
    else return 50;
}

// After: each class knows its own fee
abstract class Account { abstract double fee(); }
~~~

With sealed types and pattern-matching switches in modern Java, a switch can be the right choice too when the set of types is closed and operations change more often than types. Polymorphism suits open hierarchies where new types arrive often.

## The cost of dispatch

Virtual calls go through a method table lookup, but the JIT compiler inlines monomorphic (one implementation) and bimorphic (two) call sites, so the overhead usually disappears. Megamorphic sites with many implementations stay slightly slower, which matters only in the hottest loops.

## How interviewers test this

Expect output puzzles combining overloads, overrides, fields and static methods through parent references. Use the two-step method: compile-time selection by reference type, runtime dispatch by object type. Point out that fields and static methods never dispatch, and that self-calls inside parent methods do.`,
    sources: [POLY, OVERRIDING],
  },

  "downcasting-and-instanceof": {
    theory: `Upcasting, treating a Dog as an Animal, is always safe. Downcasting, treating an Animal reference as a Dog, is a claim that the object is in fact a Dog, and if you're wrong, Java throws ClassCastException at runtime. The \`instanceof\` operator checks the claim first, and modern Java's pattern matching combines the check and the cast. This lesson covers both directions of casting, how to avoid cast failures, and why frequent downcasting often signals a design problem.

## Upcasting

~~~java
Dog d = new Dog();
Animal a = d;        // implicit upcast: always safe
~~~

The object doesn't change; only the view of it narrows. Through \`a\`, you can call only methods declared in Animal, though overridden ones still run Dog's versions.

## Downcasting

To use Dog-specific methods through an Animal reference, cast it back:

~~~java
Animal a = new Dog();
Dog d = (Dog) a;     // explicit downcast: succeeds, the object is a Dog
d.bark();
~~~

If the object isn't a Dog, the cast fails at runtime:

~~~java
Animal a = new Cat();
Dog d = (Dog) a;     // ClassCastException at runtime
~~~

The compiler allows the cast because an Animal reference **might** point to a Dog. Casts between unrelated class types, such as \`(String) someInteger\`, are rejected at compile time because they can never succeed.

## instanceof

\`instanceof\` tests whether an object is an instance of a type, including subclasses and implemented interfaces:

~~~java
if (a instanceof Dog) {
    Dog d = (Dog) a;
    d.bark();
}
~~~

Key facts:

- \`null instanceof AnyType\` is always false, so instanceof doubles as a null check
- it returns true for the exact class and all its supertypes: a Dog is an instance of Dog, Animal and Object
- \`instanceof\` with a type that can't possibly match is a compile error

## Pattern matching for instanceof (Java 16)

Modern Java combines the test, the cast and the variable declaration:

~~~java
if (a instanceof Dog d) {
    d.bark();          // d is already a Dog
}
~~~

The pattern variable \`d\` is in scope only where the test is known to be true. It also works with negation and early returns:

~~~java
if (!(a instanceof Dog d)) return;
d.bark();              // in scope here, because the method returned otherwise
~~~

This removes the redundant cast and the chance of casting to the wrong type by copy-paste mistake. It's the idiomatic style in \`equals\` implementations today.

## Pattern matching in switch (Java 21)

~~~java
String describe(Shape s) {
    return switch (s) {
        case Circle c -> "circle of radius " + c.r();
        case Square sq -> "square of side " + sq.side();
        default -> "some shape";
    };
}
~~~

With a sealed Shape hierarchy, the \`default\` can be dropped, and the compiler checks that every permitted subtype is handled.

## getClass versus instanceof

\`a.getClass() == Dog.class\` is true only for exactly Dog, not subclasses such as a Puppy extending Dog. \`instanceof\` accepts subclasses. Use getClass when exact type matters, as in some equals implementations; use instanceof otherwise.

## Downcasting as a design smell

Code full of instanceof chains often means behaviour is in the wrong place:

~~~java
// Smell: the caller decides behaviour by type
if (animal instanceof Dog d) d.bark();
else if (animal instanceof Cat c) c.meow();

// Better: each class carries its behaviour
animal.makeSound();
~~~

Adding a new Animal subclass breaks the first version silently; the second needs no change. Legitimate uses of downcasting do exist:

- implementing \`equals(Object)\`
- working with heterogeneous data from external sources, such as parsed JSON
- closed sealed hierarchies with pattern-matching switches, where adding a type triggers compile errors at every switch

## Generics reduce casting

Before generics, collections returned Object, and every retrieval needed a cast. \`List<Dog>\` returns Dog directly, and the compiler checks types on insertion, removing a whole category of ClassCastException.

## A quick summary

Upcasting widens the view and never fails. Downcasting narrows it and can throw ClassCastException, so guard it with \`instanceof\`, ideally the pattern-matching form that tests and binds in one step. When you find many such checks in a row, move the behaviour into the classes themselves.

## How interviewers test this

Expect "Upcasting vs downcasting?", "When does ClassCastException occur?" and "What does null instanceof X return?" Explain that upcasts are implicit and safe, downcasts need checks, show the pattern-matching form, mention getClass versus instanceof, and point out that frequent downcasting suggests missing polymorphism.`,
    sources: [POLY, PATTERN_INSTANCEOF],
  },

  "polymorphism-in-system-design": {
    theory: `Polymorphism is most valuable at the scale of whole systems. It lets you swap payment gateways, storage engines, notification channels and pricing rules without touching the code that uses them. Design patterns such as Strategy, Factory and dependency injection are built on it. This lesson shows how polymorphism shapes real designs, the patterns that rely on it, and how to apply it in low-level design interviews.

## Programming to an interface

The core habit: depend on an abstraction, not a concrete class.

~~~java
public interface PaymentGateway {
    PaymentResult charge(String customerId, long amountPaise);
}

public class RazorpayGateway implements PaymentGateway { ... }
public class StripeGateway implements PaymentGateway { ... }

public class CheckoutService {
    private final PaymentGateway gateway;
    public CheckoutService(PaymentGateway gateway) { this.gateway = gateway; }

    public void checkout(Order order) {
        gateway.charge(order.customerId(), order.totalPaise());
    }
}
~~~

CheckoutService never names a concrete gateway. Switching providers, or adding a fallback, changes only the wiring, not the business logic.

## The Strategy pattern

Strategy encapsulates interchangeable algorithms behind one interface:

~~~java
public interface PricingStrategy {
    long price(long basePaise);
}

public class RegularPricing implements PricingStrategy {
    public long price(long base) { return base; }
}

public class FestivalSale implements PricingStrategy {
    public long price(long base) { return base * 80 / 100; }
}
~~~

The cart holds a PricingStrategy and calls \`price\`. Marketing can add a new strategy without engineers editing the cart. Because PricingStrategy has one abstract method, strategies can also be lambdas: \`base -> base - 5000\`.

## Factories choose the implementation

Someone must decide which concrete class to create. A factory centralizes that decision:

~~~java
public static NotificationSender forChannel(String channel) {
    return switch (channel) {
        case "email" -> new EmailSender();
        case "sms" -> new SmsSender();
        case "push" -> new PushSender();
        default -> throw new IllegalArgumentException("Unknown channel: " + channel);
    };
}
~~~

The rest of the code works with NotificationSender. The one switch lives in one place, instead of type checks scattered through the system.

## Dependency injection

Instead of classes creating their dependencies with \`new\`, dependencies are passed in, usually through constructors. Frameworks such as Spring wire them automatically. Combined with interfaces, this means:

- production uses the real database repository
- tests pass an in-memory fake implementing the same interface
- no code changes between the two

Testability is one of polymorphism's biggest practical payoffs.

## The open-closed principle

Software entities should be open for extension but closed for modification. Polymorphism is how you achieve it: new behaviour arrives as a new class implementing an existing interface, and existing, tested code stays untouched. A notification system that needs WhatsApp support gets a WhatsAppSender, not a new branch in an existing if-else chain.

## Other polymorphic patterns

| Pattern | How it uses polymorphism |
|---|---|
| Template method | Parent fixes the algorithm; subclasses override steps |
| Observer | Subject notifies a list of listeners through one interface |
| Decorator | Wrappers implement the same interface and add behaviour, as with Java I/O streams |
| Command | Actions become objects with an \`execute()\` method, enabling undo and queues |
| State | An object delegates behaviour to a state object that changes over time |

## Polymorphism in a parking lot design

A classic low-level design interview: vehicles of different sizes and spots of different types. A polymorphic design gives \`Vehicle\` an abstract \`requiredSpotSize()\`, and a \`FeeStrategy\` interface with hourly and flat-rate implementations. Adding electric vehicles with charging spots means new classes, not edits to the allocation logic. Interviewers look for exactly this extensibility argument.

## When not to use it

Polymorphism adds indirection. If there's one implementation and no realistic second one, an interface adds files without value; introduce it when the second implementation or a test double appears. For closed sets of variants where operations change often, a sealed hierarchy with pattern-matching switches can be clearer than spreading each operation across classes.

## A quick summary

Define a small interface for each point of variation, inject implementations through constructors, and let one factory choose concrete classes. New requirements then arrive as new classes rather than edits to tested code.

## How interviewers test this

Expect low-level design questions (parking lot, payment system, notification service) and "How does polymorphism help extensibility?" Show an interface with multiple implementations, inject it through the constructor, name Strategy and Factory, connect it to the open-closed principle, and mention testing with fakes.`,
    sources: [STRATEGY, POLY],
  },

  "what-is-abstraction": {
    theory: `Abstraction means showing what something does while hiding how it does it. You drive a car through a steering wheel and pedals without knowing how fuel injection works; you call \`list.sort()\` without knowing which sorting algorithm runs. In Java, abstraction is expressed with abstract classes and interfaces, but it's first a way of thinking about design. This lesson explains abstraction as a concept, how it differs from encapsulation, its levels, and how to find the right abstractions.

## The idea

An abstraction is a simplified model that keeps the details a user needs and hides the rest. A good abstraction:

- has a small, clear interface
- hides complexity that callers don't need
- stays stable while the implementation changes

\`java.util.Map\` is an abstraction: put, get, remove. Whether it's a hash table, a red-black tree or a concurrent structure is hidden behind the interface.

## Abstraction in Java

Java offers two main tools:

- **Abstract classes**: partial implementations with some methods left abstract for subclasses
- **Interfaces**: pure contracts describing capabilities, optionally with default methods

~~~java
public interface Storage {
    void save(String key, byte[] data);
    byte[] load(String key);
}
~~~

Code using Storage doesn't know whether files go to local disk, Amazon S3 or a database. Each implementation hides its own details.

Methods and classes are abstractions too. A well-named method like \`calculateTax(order)\` hides its steps; callers read the name instead of the code.

## Abstraction versus encapsulation

These are related but distinct, and the difference is asked constantly:

| | Abstraction | Encapsulation |
|---|---|---|
| Focus | What an object does: the design-level view | How data is protected: the implementation-level mechanism |
| Goal | Reduce complexity for users | Protect invariants and internal state |
| Java tools | Interfaces, abstract classes | private fields, access modifiers, getters and setters |
| Question it answers | What can callers do? | What can callers touch? |

They work together: an interface defines the abstraction, and a class encapsulates its state while implementing it. A class can be encapsulated but poorly abstracted (private fields, but a confusing API with fifty methods), or vice versa.

## Levels of abstraction

Systems are built in layers, each hiding the one below:

1. Hardware and machine instructions
2. The JVM, hiding the operating system and CPU
3. The Java standard library, hiding data structures and I/O
4. Your service layer, hiding database queries behind business operations
5. Your API, hiding the service layer from clients

Good code keeps each method at one level. A method that mixes \`placeOrder\` logic with raw SQL string building is hard to read because it jumps between levels.

## Leaky abstractions

Every non-trivial abstraction leaks some detail. An ORM hides SQL, but performance problems such as the N+1 query issue force you to understand the SQL anyway. A remote call that looks like a local method can fail with network timeouts. Knowing where your abstractions leak is part of using them well.

## Finding good abstractions

- **Look for what varies**: if there are or will be several payment providers, abstract the payment step behind an interface
- **Name by role, not implementation**: \`MessageSender\`, not \`SmtpEmailSender\`, for the interface
- **Keep interfaces small**: callers should need most of what an interface offers
- **Don't abstract too early**: an interface with one implementation and no foreseeable second one adds indirection without benefit. Wait until a second case or a test double appears

## Benefits

- callers deal with less complexity
- implementations can change or be swapped without affecting callers
- teams can work in parallel against agreed interfaces
- testing is easier with fake implementations

## A worked example

An ATM shows a handful of operations: check balance, withdraw, deposit and change PIN. Behind them sit card readers, network calls to the bank, cash dispensers and audit logs. Customers never see those parts, and the bank can replace a dispenser model or switch networks without retraining anyone. In code, an \`AtmService\` interface plays the same role: callers depend on its few methods while implementations change freely.

## How interviewers test this

Expect "What is abstraction?", "Abstraction vs encapsulation?" and "How do you achieve abstraction in Java?" Use a real-world example (a car, an ATM), show an interface with hidden implementations, give the comparison table, and mention abstract classes and interfaces as Java's two mechanisms.`,
    sources: [ABSTRACT, INTERFACES],
  },

  "abstract-classes": {
    theory: `An abstract class is a class that can't be instantiated and may declare abstract methods, methods without a body that subclasses must implement. It sits between a concrete class and an interface: it can hold state, constructors and implemented methods, while leaving specific steps to subclasses. This lesson covers abstract class syntax and rules, when they're useful, the template method pattern, and common mistakes.

## Syntax

~~~java
public abstract class Employee {
    private final String name;
    protected final double baseSalary;

    protected Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public abstract double monthlyPay();          // no body: subclasses decide

    public String payslip() {                     // concrete: shared by all
        return name + ": " + monthlyPay();
    }
}

public class FullTimeEmployee extends Employee {
    public FullTimeEmployee(String name, double base) { super(name, base); }

    @Override
    public double monthlyPay() { return baseSalary / 12; }
}
~~~

## The rules

- \`new Employee(...)\` doesn't compile: abstract classes can't be instantiated
- a class with any abstract method must itself be declared abstract
- an abstract class may have zero abstract methods, which makes sense when you want to prevent direct instantiation of a base class
- a concrete subclass must implement every inherited abstract method; otherwise it must also be abstract
- abstract methods can't be \`private\` (subclasses couldn't implement them), \`static\` (static methods aren't overridden) or \`final\` (final methods can't be overridden)
- a class can't be both \`abstract\` and \`final\`

## Abstract classes have constructors

Even though you can't instantiate an abstract class directly, it can and often should have constructors. They run when a subclass is created, through \`super(...)\`, and initialize the shared state. Making them \`protected\` signals they're for subclasses only.

## What abstract classes offer

- **Shared state**: instance fields common to all subclasses
- **Shared implementation**: concrete methods written once
- **Enforced customization**: abstract methods that every subclass must supply
- **Controlled construction**: constructors that enforce invariants for every subclass

An abstract class can also be used as a type: \`Employee e = new FullTimeEmployee(...)\` and \`List<Employee>\` work polymorphically.

## The template method pattern

Abstract classes are the natural home of the template method pattern: a final method defines an algorithm's skeleton, and abstract or overridable methods fill in the steps.

~~~java
public abstract class DataImporter {
    public final void importFile(String path) {
        String raw = read(path);
        List<Record> records = parse(raw);    // varies by format
        validate(records);
        save(records);
    }
    protected abstract List<Record> parse(String raw);
    protected void validate(List<Record> records) { }   // optional hook
    private String read(String path) { ... }
    private void save(List<Record> records) { ... }
}
~~~

\`CsvImporter\` and \`JsonImporter\` override only \`parse\`. The sequence can't be changed by subclasses because \`importFile\` is final. The JDK uses this in \`AbstractList\`, where implementing \`get\` and \`size\` gives you a working list with iteration, contains, indexOf and more.

## Skeletal implementations

A common JDK pattern pairs an interface with an abstract class: \`List\` with \`AbstractList\`, \`Map\` with \`AbstractMap\`. The interface defines the type; the abstract class provides most of the implementation. Implementers extend the abstract class for convenience, while callers depend only on the interface.

## Common mistakes

- **Using an abstract class where an interface fits**: if there's no shared state or code, an interface is more flexible, because a class can implement many interfaces but extend only one class
- **Deep abstract hierarchies**: several layers of abstract classes make behaviour hard to locate
- **Calling abstract methods from the constructor**: the subclass implementation runs before the subclass's fields are initialized

## Abstract class versus concrete base class

A concrete base class can be instantiated, which may not make sense: what is a plain "Employee" with no pay rule? Declaring it abstract tells readers and the compiler that only specific kinds exist.

## A quick summary

Use an abstract class when subclasses share fields, constructor rules and code, and each must supply a few specific steps. Keep the shared algorithm in a final method, mark customizable steps abstract or protected, and give the class protected constructors so only subclasses create instances.

## How interviewers test this

Expect "Can an abstract class have a constructor?", "Can it have zero abstract methods?", "Can abstract methods be private, static or final?" and "Abstract class vs interface?" Answer yes, yes and no (with reasons), show the template method pattern, and save the interface comparison for its own detailed answer.`,
    sources: [ABSTRACT, JLS],
  },

  "interfaces-in-java": {
    theory: `An interface defines a contract: a set of methods a class promises to provide. Classes implement interfaces, and code that depends on an interface works with any implementation. Interfaces have grown significantly since Java 8, gaining default, static and private methods. This lesson covers interface syntax and rules, every kind of member an interface can have, functional and marker interfaces, and how interfaces enable flexible design.

## Declaring and implementing

~~~java
public interface Shape {
    double area();                  // implicitly public abstract
    double perimeter();
}

public class Circle implements Shape {
    private final double r;
    public Circle(double r) { this.r = r; }
    @Override public double area() { return Math.PI * r * r; }
    @Override public double perimeter() { return 2 * Math.PI * r; }
}
~~~

A class implementing an interface must implement all its abstract methods, or be declared abstract. Implementing methods must be public, because interface methods are implicitly public and overrides can't reduce visibility.

## Members an interface can have

| Member | Since | Notes |
|---|---|---|
| Abstract methods | Java 1.0 | Implicitly \`public abstract\` |
| Constants | Java 1.0 | Fields are implicitly \`public static final\` |
| Default methods | Java 8 | Instance methods with a body, inherited by implementers |
| Static methods | Java 8 | Called through the interface name, not inherited by implementers |
| Private methods | Java 9 | Helpers shared by default and static methods |

Interfaces can't have instance fields or constructors. They hold no per-object state.

## Default methods

Default methods let interfaces evolve without breaking existing implementations:

~~~java
public interface Shape {
    double area();
    default String describe() {
        return getClass().getSimpleName() + " with area " + area();
    }
}
~~~

Java 8 used this to add \`forEach\`, \`stream\` and \`removeIf\` to collection interfaces without breaking every collection class ever written. Implementers can override defaults. When two interfaces supply the same default, the class must override and choose, with \`InterfaceName.super.method()\`.

## Static and private methods

Static interface methods hold utilities related to the interface, such as \`Comparator.comparing\` and \`List.of\`. Private methods let several default methods share code without exposing it.

## Multiple interfaces

A class can implement many interfaces, and an interface can extend several others:

~~~java
public class SmartPhone implements Camera, Phone, MusicPlayer { ... }
public interface ReadWriteStore extends Readable, Writable { }
~~~

This is Java's form of multiple inheritance: many types, one class hierarchy. Interfaces describe capabilities ("can be compared", "can be closed", "can be iterated"), often named with -able suffixes: \`Comparable\`, \`AutoCloseable\`, \`Iterable\`, \`Runnable\`.

## Functional interfaces

An interface with exactly one abstract method is a **functional interface**, and lambdas can implement it:

~~~java
@FunctionalInterface
public interface Validator {
    boolean isValid(String input);
}

Validator notBlank = s -> !s.isBlank();
~~~

\`@FunctionalInterface\` makes the compiler enforce the single-abstract-method rule. The JDK provides common ones in \`java.util.function\`: \`Predicate\`, \`Function\`, \`Supplier\`, \`Consumer\`. Default and static methods don't count toward the single abstract method.

## Marker interfaces

Interfaces with no methods, such as \`Serializable\` and \`Cloneable\`, mark a class as having a property that other code checks with instanceof. Annotations now serve many of the same purposes, but marker interfaces have one advantage: they define a type the compiler can check.

## Interfaces as types

You can declare variables, parameters and return types as interface types:

~~~java
List<String> names = new ArrayList<>();
void process(Iterable<String> items) { ... }
~~~

This "program to an interface" habit keeps code flexible: \`process\` accepts any iterable, and \`names\` can switch to another List implementation in one line.

## Constant interfaces are an anti-pattern

Putting constants in an interface and implementing it to "import" them pollutes the implementing class's API with constants it doesn't conceptually own. Use a final class with a private constructor, or an enum, for constants.

## Sealed interfaces

Since Java 17, \`sealed interface Shape permits Circle, Square\` restricts which classes may implement an interface, enabling exhaustive pattern-matching switches over closed sets of types.

## How interviewers test this

Expect "What can an interface contain since Java 8 and 9?", "Why were default methods added?", "What is a functional interface?" and "Can an interface have a constructor?" List the member kinds with versions, explain default methods as interface evolution, define functional interfaces with a lambda example, and state that interfaces have no constructors or instance state.`,
    sources: [INTERFACES, DEFAULT_METHODS],
  },

  "abstract-class-vs-interface": {
    theory: `"Abstract class or interface?" is among the most asked OOP interview questions, and the honest answer changed with Java 8, when interfaces gained default methods. The differences that remain are about state, constructors, inheritance limits and intent. This lesson lays out the precise technical differences, the design guidance for choosing, and how the two combine in real code such as the Java collections framework.

## The technical differences

| | Abstract class | Interface |
|---|---|---|
| Instance fields (state) | Yes, any kind | No; only \`public static final\` constants |
| Constructors | Yes | No |
| Method bodies | Concrete methods of any access | Default, static and private methods (Java 8+, 9+) |
| Abstract method access | public, protected or package-private | Implicitly public |
| How many a class can use | Extends one | Implements many |
| Keyword | \`extends\` | \`implements\` (classes), \`extends\` (interfaces) |
| Relationship expressed | is-a, with shared identity | can-do, a capability |
| Lambdas | No | Yes, if functional (one abstract method) |

## The differences that matter most

**State.** Only abstract classes can hold instance fields. If subclasses share data, such as an id, a name or a creation timestamp, with logic around it, an abstract class can manage it once.

**Constructors.** An abstract class can enforce initialization rules for every subclass through its constructor. An interface can't require anything at construction time.

**Single versus multiple.** A class can extend only one class. Using an abstract class spends that one slot, which can block future designs. Interfaces don't have this cost.

**Evolution.** Adding an abstract method to either breaks existing implementations. Adding a default method to an interface, or a concrete method to an abstract class, doesn't. Since Java 8, both can evolve this way.

## Choosing: the guidance

Prefer an **interface** when:

- you're defining a capability that unrelated classes might share, such as Comparable or AutoCloseable
- you want implementations to remain free to extend some other class
- you want lambdas to implement it
- you're defining the type that callers will depend on

Prefer an **abstract class** when:

- subclasses share state and the code that manages it
- you need constructors to enforce invariants
- you need non-public methods as part of the contract with subclasses, such as protected hooks
- you're implementing the template method pattern with a fixed final algorithm

A common rule of thumb: **define types with interfaces; share implementation with abstract classes.**

## Using both together

The JDK's collections show the combination:

~~~java
public interface List<E> extends Collection<E> { ... }        // the type
public abstract class AbstractList<E> implements List<E> { ... } // skeletal implementation
public class ArrayList<E> extends AbstractList<E> implements List<E> { ... }
~~~

Callers depend on \`List\`. Implementers can extend \`AbstractList\` to get most methods for free, or implement \`List\` directly if they need to extend a different class. You get the flexibility of the interface and the code reuse of the abstract class.

## A worked example

Designing notification senders:

~~~java
public interface NotificationSender {
    void send(String to, String message);
}

public abstract class RetryingSender implements NotificationSender {
    private final int maxAttempts;
    protected RetryingSender(int maxAttempts) { this.maxAttempts = maxAttempts; }

    @Override
    public final void send(String to, String message) {
        for (int i = 1; i <= maxAttempts; i++) {
            try { deliver(to, message); return; }
            catch (RuntimeException e) { if (i == maxAttempts) throw e; }
        }
    }
    protected abstract void deliver(String to, String message);
}
~~~

Code depends on the interface. Senders needing retries extend RetryingSender, which holds state (\`maxAttempts\`) and a fixed algorithm. A sender wrapping a third-party SDK class can implement the interface directly.

## Interface default methods don't replace abstract classes

Default methods can't access instance state, because interfaces have none; they can only call other interface methods. They suit convenience methods built on the abstract ones, such as \`describe()\` calling \`area()\`, not behaviour that needs fields. Treating interfaces with many defaults as abstract classes misses this limit.

## A quick decision checklist

1. Do implementations need shared fields or constructor logic? Yes leads to an abstract class
2. Might implementers need to extend another class? Yes leads to an interface
3. Is it a capability unrelated types share? Interface
4. Want both a public type and reusable code? Interface plus an abstract skeletal class

## How interviewers test this

Expect "Differences between abstract class and interface?", "When would you use each?" and "After Java 8, why still use abstract classes?" Give the table, emphasize state, constructors and single inheritance as the lasting differences, state the rule of thumb, and show the List plus AbstractList pairing.`,
    sources: [ABSTRACT, INTERFACES],
  },
};
