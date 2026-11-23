import type { LessonQuestions } from './index';

export const oopQuestions: LessonQuestions = {
  "what-is-oop": [
    { q: "Which are the four pillars of OOP?", o: ["Encapsulation, inheritance, polymorphism, abstraction", "Classes, objects, methods, fields", "Compilation, linking, loading, execution", "Recursion, iteration, selection, sequence"], a: 0, e: "These four principles organize code around objects that bundle state and behaviour." },
    { q: "What problem does OOP mainly address compared with large procedural programs?", o: ["Managing complexity by grouping data with the code that operates on it", "Making programs run faster", "Removing the need for memory", "Avoiding compilation"], a: 0, e: "Objects localize change: data and the methods that modify it live together." },
    { q: "Is Java purely object-oriented?", o: ["No; it has primitive types such as int that aren't objects", "Yes, everything is an object", "No; it has no classes", "Yes, except for strings"], a: 0, e: "Primitives exist for performance; wrapper classes like Integer box them when needed." },
  ],
  "classes-and-objects": [
    { q: "What does the new keyword do?", o: ["Allocates an object on the heap and runs its constructor", "Declares a class", "Creates a primitive variable", "Imports a package"], a: 0, e: "new returns a reference to the freshly constructed object." },
    { q: "Car a = new Car(); Car b = a; b.speed = 50; What is a.speed?", o: ["50", "0", "Compile error", "Undefined"], a: 0, e: "a and b refer to the same object, so changes through either are visible through both." },
    { q: "How many objects does a class definition create by itself?", o: ["None; it's only a blueprint", "One", "One per method", "One per field"], a: 0, e: "Objects exist only when instantiated with new (or similar mechanisms)." },
  ],
  "fields-and-methods": [
    { q: "What default value does an int instance field get if not initialized?", o: ["0", "Garbage value", "null", "Compile error"], a: 0, e: "Fields get defaults (0, false, null); local variables must be initialized before use." },
    { q: "Using an uninitialized local variable in Java causes what?", o: ["A compile-time error", "It defaults to 0", "A runtime exception", "Nothing"], a: 0, e: "The compiler enforces definite assignment for locals." },
    { q: "An instance method can access which fields directly?", o: ["Both instance and static fields", "Only static fields", "Only local variables", "No fields"], a: 0, e: "Static methods, by contrast, can't access instance fields without an object reference." },
  ],
  "the-this-keyword": [
    { q: "Why write this.name = name in a constructor?", o: ["The parameter shadows the field, so this.name refers to the field", "It's required syntax", "It creates a new object", "It calls the parent constructor"], a: 0, e: "Without this, name = name assigns the parameter to itself." },
    { q: "Can this be used inside a static method?", o: ["No; static methods have no current object", "Yes, always", "Only in constructors", "Only in interfaces"], a: 0, e: "Static methods belong to the class, not an instance." },
    { q: "What enables method chaining like builder.setA(1).setB(2)?", o: ["Each setter returns this", "Static methods", "Final fields", "Interfaces"], a: 0, e: "Returning the current object lets calls continue on it." },
  ],
  "stack-vs-heap-objects": [
    { q: "Where does a local reference variable live, and where does the object it points to live?", o: ["Reference on the stack, object on the heap", "Both on the stack", "Both on the heap", "Reference on the heap, object on the stack"], a: 0, e: "Each method frame holds locals; objects are allocated on the heap." },
    { q: "When does an object become eligible for garbage collection?", o: ["When no live references can reach it", "When its method returns", "When it's set to final", "Immediately after construction"], a: 0, e: "The GC reclaims unreachable objects; timing isn't guaranteed." },
    { q: "Java passes object arguments how?", o: ["By value of the reference", "By reference", "By deep copy", "By name"], a: 0, e: "The method gets a copy of the reference, so it can mutate the object but not rebind the caller's variable." },
  ],
  "understanding-encapsulation": [
    { q: "What is the main benefit of encapsulation?", o: ["Internal state can only change through controlled methods, protecting invariants", "Faster execution", "Less memory", "Multiple inheritance"], a: 0, e: "Hiding fields lets a class validate changes and evolve its internals freely." },
    { q: "A BankAccount with a public balance field breaks which principle?", o: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction only"], a: 0, e: "Any code could set balance to a negative value, bypassing rules." },
    { q: "Encapsulation is mainly achieved in Java with what?", o: ["private fields and public methods", "static methods", "final classes", "Interfaces only"], a: 0, e: "Access modifiers control what other code can see." },
  ],
  "access-modifiers-deep-dive": [
    { q: "Which access level does a member get with no modifier?", o: ["Package-private (default)", "public", "private", "protected"], a: 0, e: "Default access means visible only within the same package." },
    { q: "Which modifier allows access from subclasses in other packages?", o: ["protected", "private", "default", "None"], a: 0, e: "protected = package access plus subclass access." },
    { q: "Can a top-level class be declared private?", o: ["No; only public or package-private", "Yes", "Only if abstract", "Only if final"], a: 0, e: "Nested classes can be private; top-level ones can't." },
  ],
  "getters-and-setters-best-practices": [
    { q: "Why return a copy of a mutable List from a getter?", o: ["So callers can't modify the object's internal list", "To save memory", "Because lists can't be returned", "For speed"], a: 0, e: "Defensive copies, or unmodifiable views, preserve encapsulation." },
    { q: "Which setter design protects an invariant?", o: ["Validate the value and throw IllegalArgumentException if invalid", "Assign without checks", "Make the field public", "Ignore the argument"], a: 0, e: "Setters are the place to enforce rules such as non-negative age." },
    { q: "Why not generate setters for every field automatically?", o: ["Some fields should never change after construction", "Setters are slow", "Java forbids it", "Getters break without them"], a: 0, e: "Fewer setters means fewer ways state can become invalid." },
  ],
  "encapsulation-in-practice": [
    { q: "Which is required for a class to be immutable?", o: ["Private final fields with no setters, and defensive copies of mutable state", "Only a final class keyword", "Public fields", "Static methods only"], a: 0, e: "All state must be fixed at construction and not leaked." },
    { q: "Why are immutable objects naturally thread-safe?", o: ["Their state never changes after construction", "They use locks", "They run on one thread", "The JVM copies them"], a: 0, e: "No writes means no data races." },
    { q: "Which JDK class is immutable?", o: ["String", "StringBuilder", "ArrayList", "HashMap"], a: 0, e: "String methods return new strings instead of modifying the original." },
  ],
  "what-is-a-constructor": [
    { q: "Which statement about constructors is true?", o: ["They have no return type and share the class name", "They return void", "They can be called like methods anytime", "They must be static"], a: 0, e: "Adding a return type turns it into an ordinary method." },
    { q: "If you define a parameterized constructor only, does Java still provide a no-arg constructor?", o: ["No", "Yes", "Only for abstract classes", "Only at runtime"], a: 0, e: "The default constructor is added only when no constructor is declared." },
    { q: "Can a constructor be private?", o: ["Yes, for example in singletons and factory patterns", "No", "Only in interfaces", "Only if final"], a: 0, e: "A private constructor prevents outside instantiation." },
  ],
  "default-vs-parameterized-constructors": [
    { q: "class A { A(int x) {} } What does new A() do?", o: ["Compile error: no no-arg constructor exists", "Creates A with x = 0", "Runtime exception", "Calls A(int) with null"], a: 0, e: "Declaring any constructor removes the implicit default." },
    { q: "What does the compiler-provided default constructor do?", o: ["Calls super() with no arguments", "Initializes all fields to user values", "Nothing at all, not even super()", "Throws an exception"], a: 0, e: "Fields still get their default values or field initializers." },
    { q: "Why prefer parameterized constructors for required fields?", o: ["Objects are never created in an invalid, half-initialized state", "They're faster", "They avoid garbage collection", "They allow multiple inheritance"], a: 0, e: "Required data is provided and validated up front." },
  ],
  "constructor-overloading": [
    { q: "Constructor overloading requires what?", o: ["Different parameter lists", "Different return types", "Different names", "Different access modifiers"], a: 0, e: "Constructors share the class name and differ by parameter types or count." },
    { q: "How can one constructor reuse another in the same class?", o: ["this(...) as its first statement", "super(...) anywhere", "Calling the constructor by name", "new this()"], a: 0, e: "Delegation avoids duplicating initialization logic." },
    { q: "When many optional parameters lead to many overloads, which pattern helps?", o: ["Builder", "Singleton", "Observer", "Adapter"], a: 0, e: "Builders avoid 'telescoping' constructors with confusing argument orders." },
  ],
  "constructor-chaining-this-and-super": [
    { q: "Where must this() or super() appear in a constructor?", o: ["As the first statement", "As the last statement", "Anywhere", "Outside the constructor"], a: 0, e: "So the object and its parent part are initialized before other code runs (relaxed slightly in recent Java previews)." },
    { q: "Can a constructor call both this() and super() explicitly?", o: ["No; only one can be first", "Yes", "Only in abstract classes", "Only with static fields"], a: 0, e: "A this() chain eventually reaches a constructor that calls super()." },
    { q: "In what order do constructors run when creating a subclass object?", o: ["Parent constructor first, then child", "Child first, then parent", "Only the child", "Random order"], a: 0, e: "The parent part is built before the child's constructor body runs." },
  ],
  "copy-constructors-and-cloning": [
    { q: "What does a shallow copy share with the original?", o: ["References to the same nested mutable objects", "Nothing", "Only primitives", "The object header"], a: 0, e: "Changing a nested list through the copy changes it for the original too." },
    { q: "Why do many developers avoid Object.clone()?", o: ["It's error-prone: shallow by default, needs Cloneable, and bypasses constructors", "It's slow always", "It's deprecated and removed", "It only works on arrays"], a: 0, e: "Copy constructors or factory methods are clearer." },
    { q: "Calling clone() on a class that doesn't implement Cloneable throws what?", o: ["CloneNotSupportedException", "NullPointerException", "ClassCastException", "Nothing"], a: 0, e: "Cloneable is a marker interface that permits Object.clone." },
  ],
  "what-is-inheritance": [
    { q: "Inheritance models which relationship?", o: ["Is-a", "Has-a", "Uses-a", "Part-of only"], a: 0, e: "A Dog is an Animal; a Car has an Engine (composition)." },
    { q: "Why is 'favor composition over inheritance' common advice?", o: ["Inheritance tightly couples a subclass to its parent's implementation", "Composition is faster", "Inheritance is not allowed in Java", "Composition removes interfaces"], a: 0, e: "Parent changes can break subclasses; composition is more flexible." },
    { q: "Which members are NOT inherited by a subclass?", o: ["Constructors and private members (not directly accessible)", "Public methods", "Protected fields", "Default methods of interfaces"], a: 0, e: "Private fields exist in the object but aren't accessible from subclass code." },
  ],
  "types-of-inheritance": [
    { q: "Why doesn't Java support multiple inheritance of classes?", o: ["To avoid the diamond problem of ambiguous inherited state and behaviour", "It's too slow", "Interfaces don't exist", "The JVM can't load two classes"], a: 0, e: "Java allows multiple interfaces instead." },
    { q: "If two interfaces provide the same default method, what must the implementing class do?", o: ["Override it to resolve the conflict", "Nothing", "Delete one interface", "Mark it static"], a: 0, e: "It can call a specific one with InterfaceName.super.method()." },
    { q: "Class C extends B, and B extends A. Which type of inheritance is this?", o: ["Multilevel", "Multiple", "Hierarchical", "Hybrid"], a: 0, e: "Hierarchical means several classes extend one parent." },
  ],
  "super-keyword": [
    { q: "What does super.display() call?", o: ["The parent class's version of display()", "The current class's display()", "A static method", "The constructor"], a: 0, e: "Useful when an override extends rather than replaces the parent behaviour." },
    { q: "Can super be used in a static method?", o: ["No", "Yes", "Only in interfaces", "Only with generics"], a: 0, e: "super refers to the parent part of the current object, which static contexts lack." },
    { q: "If a child declares a field with the same name as the parent's, how does the child access the parent's field?", o: ["super.fieldName", "this.fieldName", "Parent.fieldName for instance fields", "It can't"], a: 0, e: "Field hiding is confusing and best avoided." },
  ],
  "method-overriding-basics": [
    { q: "Which change is NOT allowed when overriding a method?", o: ["Reducing visibility, for example public to private", "Returning a subtype (covariant return)", "Adding @Override", "Throwing fewer checked exceptions"], a: 0, e: "Overrides can widen but not narrow access." },
    { q: "Why use the @Override annotation?", o: ["The compiler checks that a method really overrides one", "It makes methods faster", "It's required at runtime", "It hides the parent method"], a: 0, e: "A typo in the name or parameters becomes a compile error instead of a silent overload." },
    { q: "Can static methods be overridden?", o: ["No; they're hidden, not overridden", "Yes", "Only in abstract classes", "Only if public"], a: 0, e: "Static calls are resolved by the reference type at compile time." },
  ],
  "preventing-inheritance-final": [
    { q: "What does a final class prevent?", o: ["Being subclassed", "Being instantiated", "Having methods", "Having fields"], a: 0, e: "String and Integer are final classes." },
    { q: "What does a final method prevent?", o: ["Being overridden", "Being called", "Being inherited at all", "Being overloaded"], a: 0, e: "Overloading is still allowed; overriding isn't." },
    { q: "Which Java 17 feature restricts which classes may extend a class?", o: ["sealed classes with permits", "final interfaces", "private classes", "static classes"], a: 0, e: "Sealed hierarchies allow a fixed set of subclasses." },
  ],
  "the-object-class": [
    { q: "If you override equals(), which method must you also override?", o: ["hashCode()", "toString()", "finalize()", "getClass()"], a: 0, e: "Equal objects must have equal hash codes for HashMap and HashSet." },
    { q: "What does Object's default equals() compare?", o: ["References (identity)", "Field values", "Hash codes only", "Class names"], a: 0, e: "Two separate objects with identical fields aren't equal by default." },
    { q: "What does the default toString() print?", o: ["Class name, @, and a hex hash code", "All field values", "An empty string", "null"], a: 0, e: "Override it for readable logging." },
  ],
  "what-is-polymorphism": [
    { q: "Method overloading is which kind of polymorphism?", o: ["Compile-time (static)", "Runtime (dynamic)", "Parametric only", "None"], a: 0, e: "The compiler picks the overload from argument types." },
    { q: "Animal a = new Dog(); a.sound(); which sound() runs if Dog overrides it?", o: ["Dog's", "Animal's", "Both", "Compile error"], a: 0, e: "Overridden methods are dispatched on the actual object type at runtime." },
    { q: "What is the main benefit of polymorphism?", o: ["Code can work with a general type while each subtype supplies its own behaviour", "Faster method calls", "Fewer classes", "No need for interfaces"], a: 0, e: "New subtypes can be added without changing the calling code." },
  ],
  "method-overloading": [
    { q: "Which change alone does NOT create a valid overload?", o: ["Changing only the return type", "Changing parameter types", "Changing parameter count", "Changing parameter order of different types"], a: 0, e: "Calls can't be distinguished by return type." },
    { q: "Given print(long) and print(Integer), which does print(5) call?", o: ["print(long)", "print(Integer)", "Compile error", "Both"], a: 0, e: "Widening a primitive is preferred over boxing during overload resolution." },
    { q: "In what order does Java try conversions during overload resolution?", o: ["Exact match, widening, boxing, varargs", "Varargs, boxing, widening", "Boxing first", "Random"], a: 0, e: "Varargs is the last resort." },
  ],
  "method-overriding-polymorphism": [
    { q: "How does the JVM typically implement dynamic dispatch?", o: ["A virtual method table per class", "Recompiling at each call", "Searching source code", "Using reflection on every call"], a: 0, e: "The vtable maps each method to the implementation for that class." },
    { q: "Are fields polymorphic in Java?", o: ["No; field access uses the reference's declared type", "Yes, like methods", "Only static fields", "Only final fields"], a: 0, e: "Only instance methods are dispatched dynamically." },
    { q: "Calling an overridable method from a constructor is risky because what?", o: ["A subclass override may run before the subclass's fields are initialized", "It's a compile error", "It's always slow", "Constructors can't call methods"], a: 0, e: "The subclass method can see default values such as null." },
  ],
  "downcasting-and-instanceof": [
    { q: "Animal a = new Cat(); Dog d = (Dog) a; What happens?", o: ["ClassCastException at runtime", "Compile error", "d becomes a Dog", "d is null"], a: 0, e: "The compiler allows the cast between related types, but the runtime check fails." },
    { q: "What does if (a instanceof Dog d) do in Java 16+?", o: ["Tests the type and binds a typed variable d if it matches", "Creates a new Dog", "Casts unconditionally", "Compares hash codes"], a: 0, e: "Pattern matching removes the separate explicit cast." },
    { q: "Is upcasting from Dog to Animal safe?", o: ["Yes, always; it's implicit", "No, it needs a check", "Only with instanceof", "Only for final classes"], a: 0, e: "Every Dog is an Animal." },
  ],
  "polymorphism-in-system-design": [
    { q: "The Strategy pattern replaces what?", o: ["Long if-else or switch chains selecting behaviour", "Constructors", "Inheritance entirely", "Interfaces"], a: 0, e: "Each behaviour becomes a class implementing a common interface." },
    { q: "Adding a new payment method without changing checkout code illustrates which principle?", o: ["Open-closed principle", "Single responsibility only", "DRY only", "YAGNI"], a: 0, e: "The system is open for extension but closed for modification." },
    { q: "In Strategy, what does the context class depend on?", o: ["The strategy interface, not concrete strategies", "Every concrete strategy", "Static methods", "The database"], a: 0, e: "That's dependency inversion in action." },
  ],
  "what-is-abstraction": [
    { q: "How does abstraction differ from encapsulation?", o: ["Abstraction hides complexity behind a simple interface; encapsulation hides internal state", "They're identical", "Abstraction is about access modifiers", "Encapsulation is about interfaces"], a: 0, e: "They work together but answer different questions: what vs how protected." },
    { q: "Which is an everyday example of abstraction in Java?", o: ["Using List without knowing ArrayList's internal array", "Writing assembly", "Declaring an int", "A for loop"], a: 0, e: "You program to the interface, not the implementation." },
    { q: "Which Java constructs provide abstraction?", o: ["Abstract classes and interfaces", "Only final classes", "Only packages", "Only enums"], a: 0, e: "They define what operations exist without fixing how." },
  ],
  "abstract-classes": [
    { q: "Can an abstract class have a constructor?", o: ["Yes; subclasses call it via super()", "No", "Only private ones", "Only static ones"], a: 0, e: "It initializes the shared state of the abstract part." },
    { q: "Can you instantiate an abstract class directly?", o: ["No", "Yes", "Only with new abstract", "Only if it has no abstract methods"], a: 0, e: "Even an abstract class with no abstract methods can't be instantiated." },
    { q: "In the Template Method pattern, what does the abstract class define?", o: ["The skeleton of an algorithm, with steps subclasses override", "Only fields", "Only static methods", "Database access"], a: 0, e: "The final template method calls abstract hook methods." },
  ],
  "interfaces-in-java": [
    { q: "Fields declared in an interface are implicitly what?", o: ["public static final", "private", "protected", "transient"], a: 0, e: "Interfaces can only hold constants as fields." },
    { q: "Since Java 8, interfaces can contain which methods with bodies?", o: ["default and static methods", "Only abstract methods", "Constructors", "Instance fields"], a: 0, e: "Java 9 added private methods too." },
    { q: "How many interfaces can a class implement?", o: ["Any number", "One", "Two", "None if it extends a class"], a: 0, e: "This is how Java offers multiple inheritance of type." },
  ],
  "abstract-class-vs-interface": [
    { q: "When should you prefer an abstract class over an interface?", o: ["When subclasses share state and constructor logic", "When unrelated classes need a common capability", "When you need multiple inheritance", "Never"], a: 0, e: "Interfaces can't hold instance state." },
    { q: "Comparable is an interface rather than an abstract class because what?", o: ["Unrelated classes such as String and LocalDate need the same capability", "It has state", "It has constructors", "It's final"], a: 0, e: "A class can implement many capability interfaces alongside its own superclass." },
    { q: "What is a functional interface?", o: ["An interface with exactly one abstract method", "An interface with no methods", "An abstract class", "An interface with only default methods"], a: 0, e: "It can be implemented with a lambda." },
  ],
  "nested-and-inner-classes": [
    { q: "What does a non-static inner class hold implicitly?", o: ["A reference to an instance of the outer class", "A copy of all outer fields", "Nothing", "A static lock"], a: 0, e: "This hidden reference can cause memory leaks if inner objects outlive the outer." },
    { q: "How do you create an instance of a static nested class Outer.Nested?", o: ["new Outer.Nested()", "outer.new Nested()", "Outer.Nested.create()", "It can't be instantiated"], a: 0, e: "Static nested classes need no outer instance." },
    { q: "Why is a static nested class often preferred?", o: ["It doesn't capture the outer instance, avoiding leaks", "It's faster to type", "It can access outer instance fields directly", "It can't be private"], a: 0, e: "Use an inner class only when it genuinely needs outer instance state." },
  ],
  "local-and-anonymous-inner-classes": [
    { q: "Local variables captured by an anonymous class must be what?", o: ["Final or effectively final", "Static", "Public", "Volatile"], a: 0, e: "The class captures a copy, so the variable can't change later." },
    { q: "Can an anonymous class have a constructor?", o: ["No; it has no name", "Yes", "Only private", "Only if abstract"], a: 0, e: "Use an instance initializer block instead." },
    { q: "Which usually replaces anonymous classes for single-method interfaces?", o: ["Lambda expressions", "Enums", "Records", "Static nested classes"], a: 0, e: "Lambdas are shorter and don't create a new 'this'." },
  ],
  "lambda-expressions-and-functional-interfaces": [
    { q: "Which functional interface takes one argument and returns a boolean?", o: ["Predicate<T>", "Supplier<T>", "Consumer<T>", "Runnable"], a: 0, e: "Supplier takes none and returns T; Consumer takes T and returns nothing." },
    { q: "Inside a lambda, what does this refer to?", o: ["The enclosing instance", "The lambda object", "null", "The functional interface"], a: 0, e: "Unlike anonymous classes, lambdas don't introduce a new this." },
    { q: "What does String::toUpperCase represent?", o: ["A method reference", "A static field", "A constructor call", "A lambda with no body"], a: 0, e: "It's shorthand for s -> s.toUpperCase()." },
  ],
  "static-keyword-deep-dive": [
    { q: "How many copies of a static field exist?", o: ["One per class (per class loader)", "One per object", "One per method", "One per thread"], a: 0, e: "All instances share it." },
    { q: "When does a static initializer block run?", o: ["Once, when the class is initialized", "Every time an object is created", "Before main always for every class", "Never"], a: 0, e: "Class initialization happens on first active use." },
    { q: "Why can't a static method call an instance method directly?", o: ["There's no object to call it on", "Instance methods are private", "It's slower", "It can"], a: 0, e: "Create or receive an instance first." },
  ],
  "final-keyword-advanced": [
    { q: "final List<String> list = new ArrayList<>(); Can you add elements?", o: ["Yes; final fixes the reference, not the object", "No", "Only once", "Compile error"], a: 0, e: "Use List.of or unmodifiable wrappers for immutable contents." },
    { q: "What is a blank final field?", o: ["A final field assigned in every constructor rather than at declaration", "A final field set to null", "A static constant", "An uninitialized local"], a: 0, e: "The compiler checks it's assigned exactly once." },
    { q: "What concurrency guarantee do final fields give?", o: ["Other threads see their constructed values once the reference is safely published", "Automatic locking", "Atomic increments", "None"], a: 0, e: "The Java memory model gives final fields initialization safety." },
  ],
  "enum-types-and-custom-enums": [
    { q: "Can an enum have fields and constructors?", o: ["Yes; constructors are implicitly private", "No", "Only static fields", "Only public constructors"], a: 0, e: "Each constant calls the constructor with its arguments." },
    { q: "Why is an enum a good way to implement a singleton?", o: ["The JVM guarantees one instance and handles serialization safely", "Enums are faster", "Enums can't have methods", "It avoids classes"], a: 0, e: "Effective Java recommends single-element enums for singletons." },
    { q: "What does Color.valueOf(\"PURPLE\") throw if PURPLE isn't a constant?", o: ["IllegalArgumentException", "NullPointerException", "Nothing; returns null", "ClassCastException"], a: 0, e: "valueOf needs an exact constant name." },
  ],
  "java-records": [
    { q: "What does a record generate automatically?", o: ["Constructor, accessors, equals, hashCode and toString", "Setters", "A builder", "Database mappings"], a: 0, e: "Records are concise immutable data carriers." },
    { q: "Can a record extend another class?", o: ["No; records implicitly extend java.lang.Record", "Yes", "Only abstract classes", "Only other records"], a: 0, e: "Records can implement interfaces." },
    { q: "How do you validate record components?", o: ["In a compact canonical constructor", "In setters", "With finalize()", "You can't"], a: 0, e: "record Age(int v) { Age { if (v < 0) throw ...; } }" },
  ],
  "java-generics-basics": [
    { q: "What does type erasure mean?", o: ["Generic type arguments are removed at compile time", "Generics run slower", "Types are checked at runtime", "Generics can't be used with classes"], a: 0, e: "That's why new T() and List<int> aren't allowed." },
    { q: "Is List<Integer> a subtype of List<Number>?", o: ["No; generics are invariant", "Yes", "Only at runtime", "Only for arrays"], a: 0, e: "Use List<? extends Number> to accept both." },
    { q: "What does PECS stand for?", o: ["Producer extends, consumer super", "Private enums, constant statics", "Public extends, class super", "Primitive equals compares structure"], a: 0, e: "Read from <? extends T>; write to <? super T>." },
  ],
  "single-responsibility-principle": [
    { q: "SRP says a class should have how many reasons to change?", o: ["One", "None", "As many as needed", "Two"], a: 0, e: "Separate concerns such as formatting, persistence and business rules." },
    { q: "A class that computes payroll, writes to the database and emails payslips violates what?", o: ["Single responsibility principle", "Liskov substitution", "Interface segregation only", "Nothing"], a: 0, e: "Each concern changes for different reasons and different people." },
    { q: "High cohesion means what?", o: ["A class's members work closely toward one purpose", "Classes depend heavily on each other", "Many static methods", "Few methods"], a: 0, e: "SRP leads to high cohesion and low coupling." },
  ],
  "open-closed-and-liskov": [
    { q: "Square extends Rectangle, and setWidth also changes height. Which principle breaks?", o: ["Liskov substitution", "Open-closed", "Single responsibility", "Dependency inversion"], a: 0, e: "Code expecting a Rectangle's independent sides behaves wrongly with a Square." },
    { q: "Open-closed means classes should be what?", o: ["Open for extension, closed for modification", "Open source", "Closed to subclasses", "Open to public fields"], a: 0, e: "Add behaviour through new classes instead of editing tested code." },
    { q: "An override that throws UnsupportedOperationException for an inherited method suggests what?", o: ["An LSP violation", "Good design", "Encapsulation", "Strategy pattern"], a: 0, e: "Subtypes must honour the parent's contract." },
  ],
  "interface-segregation-and-dependency-inversion": [
    { q: "A Printer class forced to implement fax() and scan() violates which principle?", o: ["Interface segregation", "Liskov substitution", "Open-closed", "Single responsibility only"], a: 0, e: "Prefer several small interfaces over one fat one." },
    { q: "Dependency inversion says high-level modules should depend on what?", o: ["Abstractions", "Concrete low-level classes", "Static utilities", "The database driver"], a: 0, e: "Both high- and low-level modules depend on interfaces." },
    { q: "Constructor injection mainly makes code easier to do what?", o: ["Test, by passing in mocks or fakes", "Compile", "Run faster", "Serialize"], a: 0, e: "Dependencies become explicit and replaceable." },
  ],
  "oop-design-patterns-and-interview-traps": [
    { q: "Which pattern ensures only one instance of a class exists?", o: ["Singleton", "Factory", "Observer", "Decorator"], a: 0, e: "Thread-safe options include an enum or a holder class." },
    { q: "Which pattern notifies many subscribers when an object's state changes?", o: ["Observer", "Adapter", "Builder", "Proxy"], a: 0, e: "Event listeners are a common example." },
    { q: "What is a 'God object'?", o: ["An anti-pattern: one class that knows and does too much", "A singleton", "The Object class", "An abstract class"], a: 0, e: "Split it into cohesive classes with single responsibilities." },
  ],
};
