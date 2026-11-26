import type { VisualMap } from "./types";

const c = "oop";

export const oopMoreVisuals: VisualMap = {
  [`${c}/encapsulation-in-practice`]: {
    plain:
      "An immutable object is a printed certificate: once issued, nobody can edit it. Make fields private and final, set them only in the constructor, and give no setters. To 'change' it, you issue a new certificate.",
    diagram: `flowchart LR
  A["Money(100, 'INR')<br/>private final fields"] -->|"add(50)"| B["new Money(150, 'INR')"]
  A -.->|"unchanged"| A`,
    caption: "Operations return new objects instead of changing the old one.",
  },
  [`${c}/default-vs-parameterized-constructors`]: {
    plain:
      "If you write no constructor, Java quietly gives you an empty default one. The moment you write a constructor with parameters, that free default disappears, so new Student() stops compiling unless you add it back.",
    diagram: `flowchart TB
  A{"class declares any constructor?"} -->|"no"| D["Java adds Student()"]
  A -->|"yes: Student(String name)"| N["no default added<br/>new Student() ✗"]`,
    caption: "The free default constructor only exists when you write none.",
  },
  [`${c}/constructor-overloading`]: {
    plain:
      "Constructor overloading gives several ways to create an object, like ordering coffee with or without sugar. Each version takes different parameters, and the simpler ones usually delegate to the fullest one with this(...).",
    diagram: `flowchart LR
  A["Pizza()"] -->|"this('M')"| B["Pizza(String size)"]
  B -->|"this(size, 'cheese')"| C["Pizza(String size, String topping)<br/>does the real work"]`,
    caption: "Simple constructors delegate to the complete one.",
  },
  [`${c}/copy-constructors-and-cloning`]: {
    plain:
      "A shallow copy photocopies the folder but keeps pointing at the same documents inside; a deep copy photocopies every document too. With a shallow copy, editing the inner list through one object changes it for both.",
    diagram: `flowchart TB
  subgraph Shallow
    a1["original"] --> L1["marks list"]
    b1["copy"] --> L1
  end
  subgraph Deep
    a2["original"] --> L2["marks list"]
    b2["copy"] --> L3["its own marks list"]
  end`,
    caption: "Shallow copies share inner objects; deep copies don't.",
  },
  [`${c}/super-keyword`]: {
    plain:
      "super is the way a child class talks to its parent: super(...) calls the parent's constructor, super.method() runs the parent's version of a method you've overridden, so you can extend it instead of rewriting it.",
    diagram: `sequenceDiagram
  participant D as Dog.describe()
  participant A as Animal.describe()
  D->>A: super.describe()
  A-->>D: "I am an animal"
  D->>D: add " and I bark"`,
    caption: "Reuse the parent's behaviour, then add to it.",
  },
  [`${c}/preventing-inheritance-final`]: {
    plain:
      "final is a lock. A final class can't be extended (String is final so nobody can make a sneaky subclass). A final method can't be overridden. A final variable can't be reassigned.",
    diagram: `flowchart LR
  F["final class String"] -.->|"extends ✗"| X["class MyString"]
  M["final void pay()"] -.->|"override ✗"| Y["subclass pay()"]`,
    caption: "final blocks extension and overriding.",
  },
  [`${c}/the-object-class`]: {
    plain:
      "Every class in Java secretly extends Object, the root of the family tree. That's why every object has toString(), equals(), hashCode() and getClass(), and why you override equals and hashCode together.",
    diagram: `classDiagram
  class Object {
    +toString() String
    +equals(Object o) boolean
    +hashCode() int
    +getClass() Class
  }
  Object <|-- String
  Object <|-- Student
  Object <|-- ArrayList`,
    caption: "Object sits above every class.",
  },
  [`${c}/method-overriding-polymorphism`]: {
    plain:
      "Each object carries a pointer to its class's method table (vtable). When you call a method through a parent-type reference, Java follows the object's own table at run time, which is how the right override is found.",
    diagram: `flowchart LR
  R["Shape s = new Circle()"] --> O["Circle object"] --> V["Circle vtable<br/>area → Circle.area<br/>toString → Shape.toString"]
  V --> M["s.area() runs Circle.area"]`,
    caption: "Dynamic dispatch through the object's method table.",
  },
  [`${c}/polymorphism-in-system-design`]: {
    plain:
      "The Strategy pattern turns 'which algorithm?' into an object you can swap, like choosing a route mode in a maps app: fastest, shortest or no tolls. The navigator just calls route() on whichever strategy it was given.",
    diagram: `classDiagram
  class RouteStrategy {
    <<interface>>
    +route(a, b) Path
  }
  class Fastest
  class Shortest
  class NoTolls
  class Navigator {
    -RouteStrategy strategy
    +navigate(a, b)
  }
  RouteStrategy <|.. Fastest
  RouteStrategy <|.. Shortest
  RouteStrategy <|.. NoTolls
  Navigator --> RouteStrategy`,
    caption: "Swap behaviour by swapping the strategy object.",
  },
  [`${c}/abstract-classes`]: {
    plain:
      "The Template Method pattern fixes the order of steps in a parent class and leaves some steps for children to fill in, like a recipe card with blanks: 'boil water, add ___, steep, serve'. Tea and coffee fill the blank differently.",
    diagram: `flowchart TB
  T["abstract Beverage.make()<br/>final: the fixed order"] --> S1["boilWater()"]
  T --> S2["brew() · abstract"]
  T --> S3["pour()"]
  S2 --> Tea["Tea.brew(): steep leaves"]
  S2 --> Cof["Coffee.brew(): drip coffee"]`,
    caption: "The parent fixes the steps; children fill the blanks.",
  },
  [`${c}/interfaces-in-java`]: {
    plain:
      "An interface is a job description: it lists what must be done, not how. A class can take on many jobs at once (implement many interfaces), which is how Java gets the benefits of multiple inheritance safely.",
    diagram: `classDiagram
  class Flyable {
    <<interface>>
    +fly()
  }
  class Swimmable {
    <<interface>>
    +swim()
  }
  class Duck {
    +fly()
    +swim()
  }
  Flyable <|.. Duck
  Swimmable <|.. Duck`,
    caption: "One class, several contracts.",
  },
  [`${c}/nested-and-inner-classes`]: {
    plain:
      "A static nested class is a helper that just lives inside another class's namespace, like a separate shed in the garden. An inner class is a room inside the house: it can only exist with a house and can see everything in it.",
    diagram: `flowchart TB
  O["class Outer"] --> S["static class Builder<br/>no Outer instance needed"]
  O --> I["class Iterator (inner)<br/>tied to one Outer object<br/>can read its fields"]`,
    caption: "Static nested vs inner class.",
  },
  [`${c}/local-and-anonymous-inner-classes`]: {
    plain:
      "An anonymous class is a one-off class written right where you need it, with no name, like a substitute teacher for one lesson. It's handy for a quick listener or comparator; lambdas now cover most of these cases.",
    diagram: `flowchart LR
  A["new Comparator&lt;Student&gt;() { compare(...) }"] -->|"same job, shorter"| B["(a, b) -> a.marks - b.marks"]`,
    caption: "Anonymous class and its lambda equivalent.",
  },
  [`${c}/final-keyword-advanced`]: {
    plain:
      "A final reference can't point at a different object, but the object itself can still change: a final list can still have items added. For true immutability the object's own fields must be final and unchangeable too.",
    diagram: `flowchart LR
  F["final List list"] --> L["ArrayList object"]
  F -.->|"list = new ArrayList() ✗"| N["another list"]
  L -->|"list.add(5) ✓"| L`,
    caption: "final locks the reference, not the object.",
  },
  [`${c}/enum-types-and-custom-enums`]: {
    plain:
      "An enum is a fixed set of named values, like the days of the week: you can't invent an eighth day. Enums can carry fields and methods, for example each Planet storing its mass.",
    diagram: `classDiagram
  class OrderStatus {
    <<enumeration>>
    PLACED
    SHIPPED
    DELIVERED
    CANCELLED
    +isFinal() boolean
  }`,
    caption: "A closed set of values with behaviour attached.",
  },
  [`${c}/java-records`]: {
    plain:
      "A record is a class for plain data, written in one line. record Point(int x, int y) gives you private final fields, a constructor, getters, equals, hashCode and toString automatically, all immutable.",
    diagram: `flowchart LR
  R["record Point(int x, int y)"] --> G["generated:<br/>final fields · constructor<br/>x(), y() · equals · hashCode · toString"]`,
    caption: "One line instead of ~40 lines of boilerplate.",
  },
  [`${c}/open-closed-and-liskov`]: {
    plain:
      "Open-closed: add new behaviour by adding new classes, not by editing old, tested code. Liskov: a subclass must work anywhere its parent is expected. A Square that breaks Rectangle's setWidth promise violates Liskov.",
    diagram: `flowchart TB
  D["Discount (interface)"] --> A["FestiveDiscount"]
  D --> B["StudentDiscount"]
  D --> N["NewYearDiscount<br/>added without editing others"]`,
    caption: "Extend by adding classes; subclasses keep the parent's promises.",
  },
  [`${c}/oop-design-patterns-and-interview-traps`]: {
    plain:
      "Design patterns are named, proven solutions to recurring design problems, grouped by what they do: creating objects, combining objects, or coordinating behaviour. Knowing the names lets you discuss designs quickly in interviews.",
    diagram: `flowchart TB
  P["Design patterns"] --> C["Creational<br/>Singleton · Factory · Builder"]
  P --> S["Structural<br/>Adapter · Decorator · Facade"]
  P --> B["Behavioural<br/>Strategy · Observer · Template"]`,
    caption: "The three families of classic patterns.",
  },
};
