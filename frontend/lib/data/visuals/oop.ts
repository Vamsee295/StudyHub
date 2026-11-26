import type { VisualMap } from "./types";

const c = "oop";

export const oopVisuals: VisualMap = {
  [`${c}/what-is-oop`]: {
    plain:
      "Object-oriented programming models a program as a set of things that each know some facts and can do some actions, like people in a school: a Student knows their name and can submit homework, a Teacher can grade it. Instead of one long list of steps, objects send each other requests.",
    diagram: `flowchart LR
  S["Student<br/>name, marks<br/>submit()"] -->|"submits homework"| T["Teacher<br/>subject<br/>grade()"]
  T -->|"records grade"| R["ReportCard<br/>grades<br/>average()"]`,
    caption: "Objects hold their own data and talk to each other through methods.",
  },
  [`${c}/classes-and-objects`]: {
    plain:
      "A class is a cookie cutter, objects are the cookies. The cutter defines the shape (which fields and methods every object has); each cookie is a separate object with its own values. One Car class, many cars with different colours.",
    diagram: `flowchart TB
  C["class Car<br/>color, speed<br/>drive()"] -->|"new Car('red')"| A["car1<br/>color = red"]
  C -->|"new Car('blue')"| B["car2<br/>color = blue"]
  C -->|"new Car('black')"| D["car3<br/>color = black"]`,
    caption: "One blueprint, many independent objects.",
  },
  [`${c}/fields-and-methods`]: {
    plain:
      "Fields are what an object knows (its data), methods are what it can do (its behaviour). A BankAccount knows its balance and can deposit or withdraw. Methods usually read or change the object's own fields.",
    diagram: `classDiagram
  class BankAccount {
    -String owner
    -double balance
    +deposit(double amount) void
    +withdraw(double amount) boolean
    +getBalance() double
  }`,
    caption: "A class box: name on top, fields in the middle, methods at the bottom.",
  },
  [`${c}/the-this-keyword`]: {
    plain:
      "this means 'the object I am right now'. When a constructor parameter has the same name as a field, this.name = name says 'put the parameter into my own field'. Without this, you'd just be assigning the parameter to itself.",
    diagram: `flowchart LR
  P["parameter name = 'Asha'"] -->|"this.name = name"| F["this object's field<br/>name = 'Asha'"]`,
    caption: "this.name is the field, plain name is the parameter.",
  },
  [`${c}/stack-vs-heap-objects`]: {
    plain:
      "When you write Car c = new Car(), the object is built on the heap and the variable c on the stack just holds its address. Copying c copies the address, not the car: two variables, one car.",
    diagram: `flowchart LR
  subgraph Stack
    a["Car c1"]
    b["Car c2 = c1"]
  end
  subgraph Heap
    o["Car object<br/>color = red"]
  end
  a --> o
  b --> o`,
    caption: "Two references, one object: change it through c2 and c1 sees it too.",
  },

  // ── Encapsulation ──
  [`${c}/understanding-encapsulation`]: {
    plain:
      "Encapsulation is a capsule: the medicine (data) is sealed inside and you only get it the intended way. Fields are private, and the outside world uses public methods that can check the rules, so nobody can set a balance to minus a million.",
    diagram: `flowchart LR
  O["Outside code"] -->|"deposit(500) ✓"| M["public methods<br/>check the rules"]
  O -.->|"balance = -1000000 ✗"| X["private balance"]
  M --> X`,
    caption: "Data stays private; public methods are the only door in.",
  },
  [`${c}/access-modifiers-deep-dive`]: {
    plain:
      "Access modifiers are door locks of different strength. public: anyone can enter. protected: family (subclasses) and neighbours (same package). default (no keyword): neighbours only. private: only the class itself.",
    diagram: `flowchart LR
  pub["public<br/>everyone"] --> pro["protected<br/>package + subclasses"] --> def["default<br/>same package"] --> pri["private<br/>same class only"]`,
    caption: "From most open to most closed.",
  },
  [`${c}/getters-and-setters-best-practices`]: {
    plain:
      "Getters and setters are the reception desk for private fields. A getter hands out the value; a setter takes a new value but checks it first, like refusing an age of -5. That check is the whole point: a setter that accepts anything adds nothing.",
    diagram: `flowchart TB
  S["setAge(-5)"] --> Q{"age between 0 and 150?"}
  Q -->|"no"| E["reject: throw an exception"]
  Q -->|"yes"| F["this.age = age"]`,
    caption: "A setter guards the field with a rule.",
  },

  // ── Constructors ──
  [`${c}/what-is-a-constructor`]: {
    plain:
      "A constructor is the setup routine that runs once, at the moment an object is born with new. It makes sure the object starts life in a valid state: a Student always has a name and roll number from the very first moment.",
    diagram: `sequenceDiagram
  participant M as main()
  participant H as Heap
  participant K as Student constructor
  M->>H: new Student("Asha", 7)
  H->>K: allocate memory, call constructor
  K->>K: this.name = "Asha", this.roll = 7
  K-->>M: reference to the ready object`,
    caption: "new allocates memory, the constructor fills it in, and you get back a reference.",
  },
  [`${c}/constructor-chaining-this-and-super`]: {
    plain:
      "Constructor chaining is one constructor handing work to another. this(...) calls another constructor of the same class, super(...) calls the parent's. The parent is always built first, like laying the foundation before the walls.",
    diagram: `flowchart TB
  N["new Manager('Ravi')"] --> MC["Manager constructor"]
  MC -->|"super(name)"| EC["Employee constructor"]
  EC -->|"super()"| OC["Object constructor"]
  OC -.->|"finishes first"| EC
  EC -.-> MC`,
    caption: "Constructors run from the top of the family tree down.",
  },

  // ── Inheritance ──
  [`${c}/what-is-inheritance`]: {
    plain:
      "Inheritance lets a new class start from an existing one and add or change things, like a child inheriting family traits. A Dog is an Animal: it gets eat() and sleep() for free and adds bark(). Use it only for real 'is-a' relationships.",
    diagram: `classDiagram
  class Animal {
    +String name
    +eat() void
    +sleep() void
  }
  class Dog {
    +bark() void
  }
  class Cat {
    +meow() void
  }
  Animal <|-- Dog
  Animal <|-- Cat`,
    caption: "Dog and Cat inherit Animal's fields and methods and add their own.",
  },
  [`${c}/types-of-inheritance`]: {
    plain:
      "Classes can inherit in a line (A → B → C), or many children can share one parent. Java does not allow a class to have two parent classes, because if both had a method with the same name, which one would win? Interfaces solve that need.",
    diagram: `flowchart TB
  subgraph Single
    A1["A"] --> B1["B"]
  end
  subgraph Multilevel
    A2["A"] --> B2["B"] --> C2["C"]
  end
  subgraph Hierarchical
    A3["A"] --> B3["B"]
    A3 --> C3["C"]
  end
  subgraph Multiple["Multiple (classes ✗, interfaces ✓)"]
    I1["I1"] --> D4["D"]
    I2["I2"] --> D4
  end`,
    caption: "Arrows point from parent to child.",
  },
  [`${c}/method-overriding-basics`]: {
    plain:
      "Overriding is a child replacing a parent's method with its own version, keeping the same name and parameters. Every Animal can makeSound(), but a Dog's version barks and a Cat's meows. Java picks the version that belongs to the actual object at run time.",
    diagram: `flowchart LR
  R["Animal a = new Dog()"] --> C["a.makeSound()"]
  C --> Q{"actual object?"}
  Q -->|"Dog"| D["Dog.makeSound(): Woof"]
  Q -->|"Cat"| K["Cat.makeSound(): Meow"]`,
    caption: "The object's real class decides which version runs.",
  },

  // ── Polymorphism ──
  [`${c}/what-is-polymorphism`]: {
    plain:
      "Polymorphism means 'many forms': one instruction, different behaviour depending on who receives it. Say 'pay' to a CardPayment and it charges a card; say it to UpiPayment and it sends a UPI request. The caller doesn't need to know which one it has.",
    diagram: `flowchart LR
  C["checkout(Payment p)<br/>p.pay(500)"] --> P{"p is…"}
  P -->|"CardPayment"| A["charge card"]
  P -->|"UpiPayment"| B["send UPI request"]
  P -->|"WalletPayment"| W["debit wallet"]`,
    caption: "One call, three behaviours.",
  },
  [`${c}/method-overloading`]: {
    plain:
      "Overloading is several methods with the same name but different parameters, like a printer that accepts a page, a photo or a stack of pages. The compiler picks the right one from the arguments you pass, before the program even runs.",
    diagram: `flowchart LR
  A["add(2, 3)"] --> M1["add(int, int)"]
  B["add(2.5, 1.5)"] --> M2["add(double, double)"]
  C["add(1, 2, 3)"] --> M3["add(int, int, int)"]`,
    caption: "Same name, chosen at compile time by the arguments.",
  },
  [`${c}/downcasting-and-instanceof`]: {
    plain:
      "Upcasting (Dog to Animal) is always safe: every dog is an animal. Downcasting (Animal to Dog) is a promise that this animal really is a dog. Check with instanceof first, or a wrong promise crashes with ClassCastException.",
    diagram: `flowchart TB
  A["Animal a"] --> Q{"a instanceof Dog?"}
  Q -->|"yes"| D["Dog d = (Dog) a<br/>d.bark()"]
  Q -->|"no"| S["skip: it's not a dog"]`,
    caption: "Check before you downcast.",
  },

  // ── Abstraction ──
  [`${c}/what-is-abstraction`]: {
    plain:
      "Abstraction is showing the what and hiding the how. You drive a car with a steering wheel and pedals without knowing how fuel injection works. In code, callers use a simple method like sendEmail() and never see the messy details inside.",
    diagram: `flowchart LR
  U["You"] --> W["Steering, pedals<br/>(what you use)"]
  W -.-> H["Engine, gearbox, ECU<br/>(hidden how)"]`,
    caption: "A simple surface in front of complex insides.",
  },
  [`${c}/abstract-class-vs-interface`]: {
    plain:
      "An abstract class is a half-built house: some rooms finished (shared code), some left for the buyer. An interface is a contract: a list of things you promise to do, with no rooms built. A class can extend one abstract class but implement many interfaces.",
    diagram: `classDiagram
  class Shape {
    <<abstract>>
    +String color
    +area()* double
    +describe() String
  }
  class Drawable {
    <<interface>>
    +draw() void
  }
  class Circle {
    +double r
    +area() double
    +draw() void
  }
  Shape <|-- Circle
  Drawable <|.. Circle`,
    caption: "Circle extends one abstract class and implements an interface.",
  },

  // ── Advanced ──
  [`${c}/lambda-expressions-and-functional-interfaces`]: {
    plain:
      "A lambda is a tiny method without a name that you can pass around like a value, such as 'sort by marks'. It fits wherever Java expects an interface with exactly one method (a functional interface).",
    diagram: `flowchart LR
  L["(a, b) -> a.marks - b.marks"] -->|"is a"| C["Comparator&lt;Student&gt;<br/>one method: compare()"]
  C --> S["list.sort(...)"]`,
    caption: "A lambda supplies the one method of a functional interface.",
  },
  [`${c}/static-keyword-deep-dive`]: {
    plain:
      "static means 'belongs to the class, not to any one object'. A school's name is shared by every student, so it's stored once (static), while each student's roll number is per object. Static methods can't use this, because there is no particular object.",
    diagram: `flowchart TB
  K["class Student<br/>static school = 'KL University'"] --- s1["s1: roll = 1"]
  K --- s2["s2: roll = 2"]
  K --- s3["s3: roll = 3"]`,
    caption: "One shared static field, separate instance fields per object.",
  },
  [`${c}/java-generics-basics`]: {
    plain:
      "Generics are labelled containers. A Box&lt;String&gt; only accepts strings, so the compiler stops you putting a number in by mistake, and you never need to cast when taking things out.",
    diagram: `flowchart LR
  B["Box&lt;T&gt;"] -->|"T = String"| S["Box&lt;String&gt;<br/>put('hi') ✓ · put(5) ✗"]
  B -->|"T = Integer"| I["Box&lt;Integer&gt;<br/>put(5) ✓"]`,
    caption: "One generic class, type-checked for each use.",
  },

  // ── SOLID ──
  [`${c}/single-responsibility-principle`]: {
    plain:
      "A class should have one reason to change, like a restaurant where the chef cooks and the cashier bills. If one class did cooking, billing and delivery, a change to billing could break cooking. Split responsibilities into separate classes.",
    diagram: `flowchart LR
  B["OrderManager<br/>save + email + invoice ✗"] ==> S1["OrderRepository<br/>save"]
  B ==> S2["EmailService<br/>notify"]
  B ==> S3["InvoiceGenerator<br/>invoice"]`,
    caption: "One class doing three jobs becomes three focused classes.",
  },
  [`${c}/interface-segregation-and-dependency-inversion`]: {
    plain:
      "Depend on a promise, not a particular product. A Checkout should need 'something that can pay', not specifically 'Razorpay'. Then you can swap providers, or use a fake one in tests, without touching Checkout.",
    diagram: `flowchart TB
  C["Checkout (high level)"] --> I["PaymentGateway<br/>interface"]
  R["RazorpayGateway"] -.->|"implements"| I
  S["StripeGateway"] -.->|"implements"| I
  F["FakeGateway (tests)"] -.->|"implements"| I`,
    caption: "Both the high-level code and the providers depend on the interface.",
  },
};
