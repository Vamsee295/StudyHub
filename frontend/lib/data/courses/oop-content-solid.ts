// Module 8 - SOLID & Interview Concepts (4 lessons)
import { CourseLessonContent } from './types';

export const solidLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "single-responsibility-principle",
    title: "Single Responsibility Principle (SRP) & Cohesion",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `classes-and-objects`, `fields-and-methods`, `encapsulation-in-practice`, and `understanding-encapsulation`."
        },
        {
          type: "text",
          title: "Mental Model: The Swiss Army Knife vs The Specialist Tool",
          content: "Think of class design as **Kitchen Gadgets**:\n• **The God Object Anti-Pattern (Swiss Army Knife)**: A single gadget with scissors, corkscrew, flashlight, knife, and magnifying glass. If the corkscrew breaks or needs sharpening, you have to risk damaging the blade and flashlight just to open it up. If 3 chefs need different tools at the same time, they collide over the same knife.\n• **Single Responsibility (Specialist Tools)**: You have a chef's knife, a wine bottle opener, and a torch. Each tool has **only one reason to change** (improving knife alloy only changes the knife, not the bottle opener). High cohesion makes maintenance, unit testing, and team collaboration clean and bug-free."
        },
        {
          type: "callout",
          title: "Robert C. Martin's Definition of SRP",
          content: "\"A class should have one, and only one, reason to change.\"\n\nIn practical software engineering, a 'reason to change' maps directly to a **specific stakeholder or business actor**. If an `Invoice` class handles calculating totals (accounting actor), rendering PDF layout (design/UI actor), and writing to SQL database (DB administrator actor), it has THREE separate reasons to change!"
        },
        {
          type: "code",
          title: "Violation of SRP vs Clean SRP Separation in Java",
          code: "// --- VIOLATION: God Object (3 Responsibilities) ---\nclass BadInvoice {\n    private String id;\n    private double amount;\n\n    public BadInvoice(String id, double amount) {\n        this.id = id;\n        this.amount = amount;\n    }\n\n    // 1. Business Logic\n    public double calculateTotalWithTax(double taxRate) {\n        return amount + (amount * taxRate);\n    }\n\n    // 2. Presentation / Printing (Reason to change: UI/Email designer changes layout)\n    public void printInvoiceToConsole() {\n        System.out.println(\"=== INVOICE: \" + id + \" | Total: $\" + amount + \" ===\");\n    }\n\n    // 3. Persistence (Reason to change: DB schema or ORM changes)\n    public void saveToDatabase() {\n        System.out.println(\"Executing: INSERT INTO invoices VALUES ('\" + id + \"', \" + amount + \");\");\n    }\n}\n\n// --- CLEAN SRP DESIGN ---\n// Responsibility 1: Core Domain Entity & Calculation\nclass Invoice {\n    private final String id;\n    private final double amount;\n\n    public Invoice(String id, double amount) {\n        this.id = id;\n        this.amount = amount;\n    }\n\n    public String getId() { return id; }\n    public double getAmount() { return amount; }\n\n    public double calculateTotalWithTax(double taxRate) {\n        return amount + (amount * taxRate);\n    }\n}\n\n// Responsibility 2: Presentation & Formatting\nclass InvoicePrinter {\n    public void printConsole(Invoice invoice) {\n        System.out.println(\"=== INVOICE: \" + invoice.getId() + \" | Base: $\" + invoice.getAmount() + \" ===\");\n    }\n}\n\n// Responsibility 3: Persistence\nclass InvoiceRepository {\n    public void save(Invoice invoice) {\n        System.out.println(\"Saved invoice \" + invoice.getId() + \" to Database.\");\n    }\n}\n\npublic class SRPDemo {\n    public static void main(String[] args) {\n        Invoice inv = new Invoice(\"INV-2026-001\", 450.00);\n        InvoicePrinter printer = new InvoicePrinter();\n        InvoiceRepository repo = new InvoiceRepository();\n\n        System.out.println(\"Total with 10% tax: $\" + inv.calculateTotalWithTax(0.10));\n        printer.printConsole(inv);\n        repo.save(inv);\n    }\n}",
          language: "java",
          explanation: "By isolating Invoice (state & calc), InvoicePrinter (view), and InvoiceRepository (DB storage), each component can be modified, refactored, or mock-tested in complete isolation without breaking the others."
        },
        {
          type: "table",
          title: "Cohesion vs Coupling in OOP Architecture",
          headers: ["Concept", "Definition", "Target Goal", "Why It Matters"],
          rows: [
            ["High Cohesion", "All methods and fields inside a class are closely related to its single purpose.", "ALWAYS Maximize", "Easy to understand, reuse, and unit test without complex mock setups."],
            ["Low Coupling", "Classes have minimal direct dependencies on the internal implementation of other classes.", "ALWAYS Minimize", "Changing Class A does not ripple breaking bugs across Classes B, C, and D."],
            ["God Class", "A monolithic class that knows or does everything (5000+ lines, 50+ methods).", "AVOID (Anti-Pattern)", "Impossible to test safely; changes create unexpected side effects across entire app."],
            ["Shotgun Surgery", "Making 1 small business change forces edits across 15 different classes.", "AVOID (Symptom of poor SRP)", "Indicates responsibilities are scattered rather than centralized in one cohesive class."]
          ]
        },
        {
          type: "warning",
          title: "Over-Engineering Trap: Don't Atomize into Single-Method Classes",
          content: "SRP does NOT mean every class should have only one method! Cohesion means a class manages **one coherent concept**. An `ArrayList` has `add()`, `remove()`, `get()`, `size()`, and `clear()`. It has multiple methods, but they all serve the single responsibility of managing a dynamically resizing array in memory."
        },
        {
          type: "dryRun",
          title: "Step-by-Step Architectural Impact of SRP",
          code: "// Scenario: Accounting requires changing tax calculation algorithm.\n// Result with BadInvoice: Must re-compile, re-test, and deploy printing & DB code.\n// Result with Clean SRP: Only Invoice class is modified. InvoicePrinter & InvoiceRepository are untouched!",
          steps: [
            { step: 1, explanation: "Tax law introduces tiered tax brackets based on transaction volume." },
            { step: 2, explanation: "In clean SRP, you update `Invoice.calculateTotalWithTax()` or inject a `TaxCalculatorStrategy`." },
            { step: 3, explanation: "`InvoicePrinter` and `InvoiceRepository` have zero diff in Git, zero regression risk, and need no re-verification." },
            { step: 4, explanation: "Unit tests for printing and DB continue passing 100% without modification." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "How does SRP differ from creating single-method classes?",
              trap: "Creating hundreds of single-method micro-classes (e.g. InvoiceValidator, InvoiceSaver), destroying code readability.",
              solution: "Group cohesive behaviors that change for the same business actor under one class. Separate only when different business actors or systems drive changes."
            },
            {
              question: "Should logging and database transactions be written directly inside business domain entities?",
              trap: "Mixing Logging, Security, and Caching directly inside Core Entities violates SRP and tightly couples business logic to infrastructure.",
              solution: "Use Decorator Pattern, Proxy Pattern, or Aspect-Oriented Programming (AOP / Interceptors) for cross-cutting infrastructure concerns."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following scenarios is the clearest violation of the Single Responsibility Principle (SRP)?",
          options: [
            "A `User` class containing `getName()`, `getEmail()`, and `updateProfileDetails()` methods.",
            "A `UserManager` class that validates user credentials, generates JWT tokens, formats HTML welcome emails, and writes raw SQL queries to insert user records into PostgreSQL.",
            "A `MathUtil` class containing static methods `factorial()`, `gcd()`, and `isPrime()`.",
            "A `PaymentProcessor` interface implemented by `StripePaymentProcessor` and `PayPalPaymentProcessor`."
          ],
          correctIndex: 1,
          explanation: "Option B is a classic God Object anti-pattern: authentication, token generation, email templating, and SQL persistence are 4 distinct responsibilities with 4 different reasons to change."
        },
        {
          type: "takeaways",
          items: [
            "SRP states that a class should have only one reason to change (one primary actor/responsibility).",
            "Aim for high cohesion (closely related methods) and low coupling (minimal direct dependencies).",
            "Symptoms of SRP violation include God Classes, fragile tests, and high merge conflict rates during teamwork.",
            "SRP does not mean one method per class; it means one unified domain purpose."
          ]
        }
      ]
    }
  },
  {
    slug: "open-closed-and-liskov",
    title: "Open-Closed Principle (OCP) & Liskov Substitution Principle (LSP)",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-polymorphism`, `method-overriding-polymorphism`, `abstract-classes`, and `interfaces-in-java`."
        },
        {
          type: "text",
          title: "Mental Model: Hardware Ports & Plug-in Adapters",
          content: "Think of OCP and LSP in terms of **USB-C Standards**:\n• **Open-Closed Principle (OCP)**: A computer's USB-C port is **closed for modification** (you don't tear open the laptop motherboard and re-solder chips every time you want to plug in a webcam) but **open for extension** (anyone can engineer a new USB-C microphone, display, or flash drive that plugs right in).\n• **Liskov Substitution Principle (LSP)**: If a device claims to be a USB-C device, plugging it in must NEVER short-circuit your motherboard, blow a fuse, or throw unexpected hardware panics. Subtypes must honor the exact behavioral contract of the parent type."
        },
        {
          type: "callout",
          title: "Core Definitions",
          content: "• **Open-Closed Principle (OCP)**: Software entities (classes, modules, functions) should be *open for extension, but closed for modification*.\n• **Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without altering the correctness or intended behavior of the program ($S \\subseteq T$ implies objects of type $T$ may be replaced with objects of type $S$)."
        },
        {
          type: "code",
          title: "Open-Closed Principle: Eliminating Switch / If-Else Cascades",
          code: "// --- VIOLATION: Modifying existing class for every new discount type ---\nclass BadDiscountCalculator {\n    public double calculate(String customerType, double amount) {\n        if (customerType.equals(\"REGULAR\")) {\n            return amount * 0.05;\n        } else if (customerType.equals(\"PREMIUM\")) {\n            return amount * 0.15;\n        } else if (customerType.equals(\"VIP\")) { // Modified when VIP was added!\n            return amount * 0.25;\n        }\n        return 0.0;\n    }\n}\n\n// --- CLEAN OCP: Polymorphic Extension via Interface ---\ninterface DiscountStrategy {\n    double calculateDiscount(double amount);\n}\n\nclass RegularDiscount implements DiscountStrategy {\n    @Override\n    public double calculateDiscount(double amount) { return amount * 0.05; }\n}\n\nclass PremiumDiscount implements DiscountStrategy {\n    @Override\n    public double calculateDiscount(double amount) { return amount * 0.15; }\n}\n\n// Adding VIPDiscount REQUIRES ZERO EDITS to existing classes!\nclass VIPDiscount implements DiscountStrategy {\n    @Override\n    public double calculateDiscount(double amount) { return amount * 0.25; }\n}\n\nclass CheckoutService {\n    public double applyDiscount(double amount, DiscountStrategy strategy) {\n        return amount - strategy.calculateDiscount(amount);\n    }\n}\n\npublic class OCPDemo {\n    public static void main(String[] args) {\n        CheckoutService checkout = new CheckoutService();\n        double bill = 1000.0;\n        System.out.println(\"VIP Bill: $\" + checkout.applyDiscount(bill, new VIPDiscount())); // $750.0\n    }\n}",
          language: "java",
          explanation: "When marketing introduces a 'BlackFridayDiscount', we simply create a new class implementing DiscountStrategy without touching CheckoutService or existing discount classes."
        },
        {
          type: "code",
          title: "The Classic LSP Violation: Square Inheriting from Rectangle",
          code: "// Mathematical fact: A Square is a Rectangle with equal sides.\n// OOP Design Reality: Inheriting Square from Rectangle violates LSP!\n\nclass Rectangle {\n    protected int width;\n    protected int height;\n\n    public void setWidth(int w) { this.width = w; }\n    public void setHeight(int h) { this.height = h; }\n    public int getWidth() { return width; }\n    public int getHeight() { return height; }\n    public int getArea() { return width * height; }\n}\n\nclass Square extends Rectangle {\n    @Override\n    public void setWidth(int w) {\n        this.width = w;\n        this.height = w; // Force both to maintain square invariant\n    }\n\n    @Override\n    public void setHeight(int h) {\n        this.width = h;\n        this.height = h; // Force both to maintain square invariant\n    }\n}\n\npublic class LSPViolationDemo {\n    // Client function written for base class Rectangle\n    public static void resize(Rectangle r) {\n        r.setWidth(5);\n        r.setHeight(10);\n        // Expectation for ANY valid Rectangle: Area MUST be 5 * 10 = 50\n        System.out.println(\"Expected Area: 50 | Actual Area: \" + r.getArea());\n        if (r.getArea() != 50) {\n            System.out.println(\"💥 LSP VIOLATION DETECTED! Subtype broke client assumptions.\");\n        }\n    }\n\n    public static void main(String[] args) {\n        resize(new Rectangle()); // Works! Expected Area: 50 | Actual: 50\n        resize(new Square());    // BROKEN! Expected: 50 | Actual: 100 (height overrode width to 10!)\n    }\n}",
          language: "java",
          explanation: "Square breaks the post-conditions and behavior expected of a Rectangle (setting width independently of height). A Square is NOT a behavioral subtype of Rectangle in OOP mutability."
        },
        {
          type: "table",
          title: "LSP Behavioral Contract Rules (Barbara Liskov)",
          headers: ["Rule", "Description", "Violation Example"],
          rows: [
            ["Preconditions Cannot Be Strengthened", "Subclass cannot require stricter input conditions than parent.", "Parent allows negative numbers; child throws `IllegalArgumentException` on negative."],
            ["Postconditions Cannot Be Weakened", "Subclass must guarantee at least as much as parent.", "Parent guarantees `balance >= 0`; child allows overdraft into negative balance."],
            ["Invariants Must Be Preserved", "State invariants of parent must be preserved by child.", "Rectangle invariant (independent width/height) broken by Square."],
            ["History Constraint", "Child cannot mutate immutable state defined by parent.", "Child adds mutator method to an ostensibly immutable collection/record parent."],
            ["No Unhandled Checked Exceptions", "Child overridden method cannot throw new or broader checked exceptions.", "Child method signature adds `throws Exception` not declared in parent."]
          ]
        },
        {
          type: "dryRun",
          title: "Execution Trace: Why Square Breaks Rectangle's Contract",
          code: "Rectangle r = new Square();\nr.setWidth(5);  // Square sets width=5 AND height=5\nr.setHeight(10); // Square sets width=10 AND height=10\nint area = r.getArea(); // 10 * 10 = 100 instead of 5 * 10 = 50",
          steps: [
            { step: 1, explanation: "Caller passes reference `r` typed as `Rectangle` to `resize()`." },
            { step: 2, explanation: "`r.setWidth(5)` runs. Overridden Square implementation silently sets BOTH width=5 and height=5." },
            { step: 3, explanation: "`r.setHeight(10)` runs. Square overrides and mutates BOTH width=10 and height=10." },
            { step: 4, explanation: "`r.getArea()` returns $10 \\times 10 = 100$. Caller expected $5 \\times 10 = 50$. The client code fails or produces corrupt financial data." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why does throwing UnsupportedOperationException in a subclass break LSP?",
              trap: "Subclasses like ReadOnlyArrayList throwing UnsupportedOperationException on add() crash callers expecting standard List behavior.",
              solution: "Split into segregated interfaces: ReadableCollection and MutableCollection instead of forcing read-only classes to inherit mutating methods."
            },
            {
              question: "Is using instanceof checks in client code an acceptable workaround for subclass differences?",
              trap: "Using instanceof checks in client code (e.g. if shape instanceof Square) violates both OCP and LSP.",
              solution: "Rely exclusively on polymorphic method dispatch defined in the common interface."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "An engineer creates an abstract class `Bird` with method `fly()`. They create `Ostrich extends Bird` and implement `fly()` by throwing `UnsupportedOperationException(\"Ostriches cannot fly!\")`. Which principle is violated?",
          options: [
            "Single Responsibility Principle (SRP)",
            "Liskov Substitution Principle (LSP)",
            "Dependency Inversion Principle (DIP)",
            "Interface Segregation Principle (ISP)"
          ],
          correctIndex: 1,
          explanation: "This is a textbook LSP violation. Any client expecting a `Bird` and invoking `fly()` will crash at runtime when passed an `Ostrich`. `Bird` should not enforce flying as a universal behavior for all avian species."
        },
        {
          type: "takeaways",
          items: [
            "OCP states systems should allow adding new features by writing new classes, not editing existing battle-tested code.",
            "LSP mandates that subclasses must behave seamlessly in place of parent classes without breaking client invariants or throwing unexpected exceptions.",
            "The Square-Rectangle paradox proves that real-world 'is-a' relationships do not always translate to OOP mutable inheritance.",
            "Never override a parent method with `throw new UnsupportedOperationException()`—use interface segregation instead."
          ]
        }
      ]
    }
  },
  {
    slug: "interface-segregation-and-dependency-inversion",
    title: "Interface Segregation (ISP) & Dependency Inversion (DIP)",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `interfaces-in-java`, `abstract-class-vs-interface`, `downcasting-and-instanceof`, and `open-closed-and-liskov`."
        },
        {
          type: "text",
          title: "Mental Model: Power Outlets & Slim Interfaces",
          content: "Think of ISP and DIP as **Modern Electronics & Wall Sockets**:\n• **Interface Segregation (ISP - Slim Ports)**: Instead of one massive 50-pin master port on your smartphone (charging + audio + video + antenna + biometric + keyboard), you have focused, segregated interfaces (USB-C for power/data, Bluetooth for audio). Clients only connect to the capabilities they actually need.\n• **Dependency Inversion (DIP - Wall Outlets)**: Your lamp does NOT solder its power wires directly into the high-voltage electrical grid transformer down the street (tight coupling to low-level details). Instead, both the lamp and the power grid depend on an **abstraction (the standard 120V/230V wall socket interface)**. You can unplug a desk lamp and plug in a laptop charger without rebuilding your house."
        },
        {
          type: "callout",
          title: "Formal Definitions",
          content: "• **Interface Segregation Principle (ISP)**: Clients should not be forced to depend on methods they do not use. Prefer many small, client-specific interfaces over one 'fat/polluted' general-purpose interface.\n• **Dependency Inversion Principle (DIP)**:\n  1. High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces/abstract classes).\n  2. Abstractions should not depend on details. Details (concrete implementations) should depend on abstractions."
        },
        {
          type: "code",
          title: "Interface Segregation Principle: Refactoring Fat Interfaces",
          code: "// --- VIOLATION: Fat / Polluted 'Super-Interface' ---\ninterface BadSmartDevice {\n    void print();\n    void scan();\n    void fax();\n    void staple();\n}\n\n// BasicPrinter is forced to implement fax and staple which it physically cannot do!\nclass BasicPrinter implements BadSmartDevice {\n    public void print() { System.out.println(\"Printing document...\"); }\n    public void scan() { System.out.println(\"Scanning document...\"); }\n    public void fax() { throw new UnsupportedOperationException(\"No fax hardware!\"); }\n    public void staple() { throw new UnsupportedOperationException(\"No stapler!\"); }\n}\n\n// --- CLEAN ISP DESIGN: Role-Based Segregated Interfaces ---\ninterface Printable {\n    void print();\n}\n\ninterface Scannable {\n    void scan();\n}\n\ninterface Faxable {\n    void fax();\n}\n\n// Standard Printer only implements what it supports\nclass StandardOfficePrinter implements Printable, Scannable {\n    public void print() { System.out.println(\"Standard printer: Printing...\"); }\n    public void scan() { System.out.println(\"Standard printer: Scanning...\"); }\n}\n\n// High-end Enterprise Machine implements all roles\nclass EnterpriseMultiFunctionDevice implements Printable, Scannable, Faxable {\n    public void print() { System.out.println(\"Enterprise: High-speed Print...\"); }\n    public void scan() { System.out.println(\"Enterprise: 600 DPI Scan...\"); }\n    public void fax() { System.out.println(\"Enterprise: Faxing abroad...\"); }\n}\n\npublic class ISPDemo {\n    public static void main(String[] args) {\n        Printable printer = new StandardOfficePrinter();\n        printer.print();\n    }\n}",
          language: "java",
          explanation: "Segregating interfaces ensures clients are never forced to provide empty dummy implementations or throw UnsupportedOperationExceptions."
        },
        {
          type: "code",
          title: "Dependency Inversion Principle (DIP) & Dependency Injection (DI)",
          code: "// --- VIOLATION: High-Level NotificationService depends directly on Low-Level Concrete GmailService ---\nclass BadGmailSender {\n    public void sendEmail(String to, String msg) {\n        System.out.println(\"Sending via Gmail to \" + to + \": \" + msg);\n    }\n}\n\nclass BadNotificationService {\n    // TIGHT COUPLING: Direct instantiation with 'new'\n    private BadGmailSender emailSender = new BadGmailSender();\n\n    public void notifyUser(String user, String message) {\n        emailSender.sendEmail(user, message); // Cannot easily switch to Twilio SMS or SendGrid!\n    }\n}\n\n// --- CLEAN DIP DESIGN ---\n// 1. Abstraction (Both high-level and low-level will depend on this)\ninterface MessageService {\n    void sendMessage(String recipient, String message);\n}\n\n// 2. Low-Level Detail A\nclass EmailMessageService implements MessageService {\n    @Override\n    public void sendMessage(String recipient, String message) {\n        System.out.println(\"[Email] To: \" + recipient + \" | Body: \" + message);\n    }\n}\n\n// 3. Low-Level Detail B\nclass SMSMessageService implements MessageService {\n    @Override\n    public void sendMessage(String recipient, String message) {\n        System.out.println(\"[SMS] To: \" + recipient + \" | Text: \" + message);\n    }\n}\n\n// 4. High-Level Business Module (Depends ONLY on MessageService abstraction)\nclass NotificationService {\n    private final MessageService messageService; // Inversion: Injected from outside!\n\n    // Constructor Dependency Injection (DI)\n    public NotificationService(MessageService service) {\n        this.messageService = service;\n    }\n\n    public void notifyUser(String recipient, String msg) {\n        messageService.sendMessage(recipient, msg);\n    }\n}\n\npublic class DIPDemo {\n    public static void main(String[] args) {\n        // Production uses SMS\n        NotificationService smsNotifier = new NotificationService(new SMSMessageService());\n        smsNotifier.notifyUser(\"+1-555-0199\", \"Your verification code is 492019\");\n\n        // Seamlessly switch to Email without changing a single line inside NotificationService!\n        NotificationService emailNotifier = new NotificationService(new EmailMessageService());\n        emailNotifier.notifyUser(\"student@studyhub.dev\", \"Welcome to the SOLID module!\");\n    }\n}",
          language: "java",
          explanation: "NotificationService no longer instantiates concrete senders with 'new'. By accepting the MessageService interface via constructor injection, the high-level business service is decoupled and 100% testable with mock services."
        },
        {
          type: "table",
          title: "Complete Summary of All 5 SOLID Principles",
          headers: ["Principle", "Core Concept", "Smell If Violated", "Design Solution"],
          rows: [
            ["S - Single Responsibility", "A class should have 1 reason to change.", "God classes, huge bloated files with 20+ unrelated methods.", "Split by stakeholder / domain role."],
            ["O - Open / Closed", "Open for extension, closed for modification.", "Cascading `if-else` / `switch` statements on object types.", "Polymorphism, Strategy & Factory patterns."],
            ["L - Liskov Substitution", "Subtypes must preserve base type contracts.", "Subclass throws `UnsupportedOperationException` or breaks invariants.", "Segregate interfaces, check invariants, avoid fake inheritance."],
            ["I - Interface Segregation", "Clients shouldn't depend on unused methods.", "Forced empty dummy method overrides across implementing classes.", "Split fat interfaces into small role interfaces."],
            ["D - Dependency Inversion", "Depend on abstractions, not concrete classes.", "Hardcoded `new ConcreteClass()` inside high-level business logic.", "Constructor Dependency Injection & Interfaces."]
          ]
        },
        {
          type: "dryRun",
          title: "Dependency Inversion in Unit Testing & Mocking",
          code: "// Test Environment: Inject MockMessageService into NotificationService\nclass MockMessageService implements MessageService {\n    public boolean wasSent = false;\n    public String lastMessage = \"\";\n    public void sendMessage(String r, String m) { wasSent = true; lastMessage = m; }\n}\nNotificationService testService = new NotificationService(new MockMessageService());\ntestService.notifyUser(\"user@test.com\", \"Test\");",
          steps: [
            { step: 1, explanation: "Test creates a `MockMessageService` that does not send real network packets or incur API costs." },
            { step: 2, explanation: "`NotificationService` accepts the mock without knowing or caring that it is a test double." },
            { step: 3, explanation: "`testService.notifyUser()` executes in <1ms completely offline in memory." },
            { step: 4, explanation: "Unit test asserts `mock.wasSent == true` reliably and deterministically." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What is the key difference between Dependency Inversion (DIP) and Dependency Injection (DI)?",
              trap: "Confusing DIP with DI in technical system design interviews.",
              solution: "DIP is the architectural principle (depend on abstractions). Dependency Injection (DI) is the concrete pattern/technique (passing dependencies via constructor/setter) used to satisfy DIP."
            },
            {
              question: "Why are monolithic 'Mega-Repository' interfaces considered bad practice?",
              trap: "Creating one gigantic repository interface forces lightweight UI consumers to depend on unneeded destructive operations (violates ISP).",
              solution: "Break large interfaces into small role-focused query/command interfaces (e.g. UserReader, UserWriter)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which code snippet best demonstrates the Dependency Inversion Principle (DIP)?",
          options: [
            "`public class OrderService { private MySQLDatabase db = new MySQLDatabase(); }`",
            "`public class OrderService { private DatabaseConnection db; public OrderService(DatabaseConnection db) { this.db = db; } }` (where `DatabaseConnection` is an interface)",
            "`public class OrderService extends MySQLDatabase { public void process() { super.insert(); } }`",
            "`public class OrderService { public void save() { MySQLDatabase.getInstance().insert(); } }`"
          ],
          correctIndex: 1,
          explanation: "Option B depends on the `DatabaseConnection` interface and receives the dependency via constructor injection, completely decoupling `OrderService` from specific DB implementations like MySQL, Mongo, or PostgreSQL."
        },
        {
          type: "takeaways",
          items: [
            "ISP advocates for small, role-focused interfaces (`Printable`, `Closeable`, `AutoCloseable`, `Comparable`) rather than monolithic super-interfaces.",
            "DIP decouples high-level policy logic from low-level infrastructure details by inserting an interface abstraction between them.",
            "Dependency Injection (DI) is the primary programmatic mechanism used to achieve DIP without hardcoding `new` operator calls.",
            "Adhering to SOLID principles produces software that is scalable, easy to extend, simple to test, and resistant to architectural rot."
          ]
        }
      ]
    }
  },
  {
    slug: "oop-design-patterns-and-interview-traps",
    title: "OOP Design Patterns, Anti-Patterns & Technical Interview Traps",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should have completed all prior OOP modules: Fundamentals, Encapsulation, Constructors, Inheritance, Polymorphism, Abstraction, and Advanced OOP."
        },
        {
          type: "text",
          title: "Mental Model: Design Patterns as Architectural Blueprints",
          content: "Think of Design Patterns as **Civil Engineering Blueprints for Recurring Architectural Challenges**:\n• **Creational (How to build)**: E.g., **Factory Method & Singleton**. How objects are instantiated without coupling client code to exact constructor signatures or creating duplicate shared state.\n• **Structural (How to assemble)**: E.g., **Adapter & Decorator**. How classes and objects compose to form larger structures (like a power plug adapter bridging UK plugs to US sockets).\n• **Behavioral (How to communicate)**: E.g., **Observer & Strategy**. How algorithms, responsibilities, and events are distributed cleanly among collaborating objects."
        },
        {
          type: "callout",
          title: "The Top 3 Must-Know Design Patterns for Placement Coding Rounds",
          content: "1. **Singleton Pattern**: Ensures a class has only ONE instance and provides a global access point (e.g., ThreadPool, Logger, DB Connection Manager).\n2. **Factory Method Pattern**: Defines an interface for creating an object, but lets subclasses or factories decide which class to instantiate.\n3. **Strategy Pattern**: Defines a family of interchangeable algorithms and makes them selectable at runtime."
        },
        {
          type: "code",
          title: "Thread-Safe Singleton with Double-Checked Locking in Java",
          code: "public class DatabaseConnectionPool {\n    // volatile prevents Instruction Reordering by JVM during object initialization\n    private static volatile DatabaseConnectionPool instance;\n    private String connectionUrl;\n\n    // 1. Private constructor prevents direct instantiation with 'new'\n    private DatabaseConnectionPool() {\n        this.connectionUrl = \"jdbc:postgresql://db.studyhub.internal:5432/main\";\n        System.out.println(\"Initializing expensive database connection pool...\");\n    }\n\n    // 2. Thread-safe Double-Checked Locking\n    public static DatabaseConnectionPool getInstance() {\n        if (instance == null) { // First check (no locking overhead for existing instance)\n            synchronized (DatabaseConnectionPool.class) {\n                if (instance == null) { // Second check (ensures only ONE thread initializes)\n                    instance = new DatabaseConnectionPool();\n                }\n            }\n        }\n        return instance;\n    }\n\n    public void executeQuery(String sql) {\n        System.out.println(\"Executing on \" + connectionUrl + \": \" + sql);\n    }\n}\n\n// Usage demonstration\nclass SingletonDemo {\n    public static void main(String[] args) {\n        DatabaseConnectionPool pool1 = DatabaseConnectionPool.getInstance();\n        DatabaseConnectionPool pool2 = DatabaseConnectionPool.getInstance();\n\n        System.out.println(\"Are both references identical? \" + (pool1 == pool2)); // true\n        pool1.executeQuery(\"SELECT * FROM users;\");\n    }\n}",
          language: "java",
          explanation: "The 'volatile' keyword is mandatory: it prevents JVM compiler reordering where memory is allocated and assigned to 'instance' before the constructor finishes executing."
        },
        {
          type: "code",
          title: "Factory Method & Strategy Patterns in Action",
          code: "// --- 1. STRATEGY PATTERN (Interchangeable Algorithms) ---\ninterface RouteStrategy {\n    int calculateTravelTime(int distanceKm);\n}\n\nclass DrivingStrategy implements RouteStrategy {\n    public int calculateTravelTime(int distanceKm) { return distanceKm / 60 * 60; } // 60 km/h\n}\n\nclass WalkingStrategy implements RouteStrategy {\n    public int calculateTravelTime(int distanceKm) { return distanceKm * 12; } // 5 km/h -> 12 min/km\n}\n\n// --- 2. FACTORY METHOD PATTERN (Object Creation Abstraction) ---\nclass RouteStrategyFactory {\n    public static RouteStrategy getStrategy(String transportMode) {\n        switch (transportMode.toUpperCase()) {\n            case \"WALK\": return new WalkingStrategy();\n            case \"DRIVE\": return new DrivingStrategy();\n            default: throw new IllegalArgumentException(\"Unknown mode: \" + transportMode);\n        }\n    }\n}\n\npublic class DesignPatternDemo {\n    public static void main(String[] args) {\n        String userPreference = \"WALK\";\n        RouteStrategy strategy = RouteStrategyFactory.getStrategy(userPreference);\n        System.out.println(\"Travel time for 5 km walk: \" + strategy.calculateTravelTime(5) + \" minutes.\");\n    }\n}",
          language: "java",
          explanation: "Strategy decouples routing algorithms from the Navigator client, and Factory centralizes instantiation logic so clients never call concrete constructors directly."
        },
        {
          type: "table",
          title: "OOP Anti-Patterns Every Placement Candidate Must Recognize",
          headers: ["Anti-Pattern", "What It Looks Like", "Why It Is Dangerous", "Refactoring Remedy"],
          rows: [
            ["God Object / Blob", "A 4000-line class holding 80% of entire application state.", "Zero modularity, merge conflict nightmare, untestable.", "Extract classes following Single Responsibility Principle."],
            ["Lava Flow / Dead Code", "Old legacy methods kept 'just in case' with TODOs from 2021.", "Confuses new developers, increases cognitive load.", "Delete aggressively; Git history preserves old code."],
            ["Spaghetti Code", "Tangled control flow with circular dependencies between classes.", "Changing class A breaks class B which breaks class A.", "Establish clear layered architecture (UI -> Service -> Repository)."],
            ["Golden Hammer", "Using one favorite design pattern (e.g., Singleton or Factory) everywhere.", "Adds massive unnecessary boilerplate for simple 10-line scripts.", "Apply patterns only when architectural pain justifies them."],
            ["Yo-Yo Problem", "Deep inheritance hierarchies (8+ levels: A extends B extends C...).", "Reading a method requires jumping up and down 10 source files.", "Favor Object Composition over deep inheritance hierarchies."]
          ]
        },
        {
          type: "dryRun",
          title: "Interview Question Breakdown: Composition vs Inheritance",
          code: "// Question: 'Why do software architects recommend Composition over Inheritance?'\n// Analysis of Inheritance (White-box reuse) vs Composition (Black-box reuse):\nclass InheritanceEngineCar extends Engine { /* Car is an Engine? Bad! */ }\nclass CompositionCar { private Engine engine; /* Car HAS an Engine. Good! */ }",
          steps: [
            { step: 1, explanation: "Inheritance creates tight compile-time coupling (fragile base class problem: modifying superclass can silently break subclasses)." },
            { step: 2, explanation: "Inheritance exposes superclass internal implementation details to child classes (breaks encapsulation)." },
            { step: 3, explanation: "Java allows only Single Inheritance: extending a class consumes the class's only inheritance slot." },
            { step: 4, explanation: "Composition allows swapping behavior dynamically at runtime (e.g. `car.setEngine(new ElectricEngine())`) while keeping engine internals private." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why is synchronizing the entire getInstance() method an anti-pattern for Singletons?",
              trap: "Synchronizing the entire getInstance() method introduces a major thread bottleneck on every single read call.",
              solution: "Use Double-Checked Locking with volatile or an Initialization-on-Demand Holder / Enum Singleton."
            },
            {
              question: "How can standard Java Singletons be broken via Reflection or Serialization?",
              trap: "Standard Singletons can be bypassed by setting constructor accessibility to true via Reflection, or deserializing duplicate objects.",
              solution: "Implement readResolve() for serialization and throw exceptions in constructor, or use a single-element enum which JVM natively protects."
            },
            {
              question: "When does applying design patterns become an anti-pattern (Premature Abstraction)?",
              trap: "Creating abstract factories, visitors, and mediators for trivial scripts introduces massive unnecessary cognitive overhead.",
              solution: "Write simple, clean code first; refactor to design patterns only when real business variation or complexity requires it."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following is the most robust, thread-safe, reflection-proof way to implement a Singleton in Java?",
          options: [
            "Eager initialization with a `public static final` field.",
            "Lazy initialization with `synchronized public static Singleton getInstance()`.",
            "A single-element `enum Singleton { INSTANCE; }`.",
            "Double-checked locking without the `volatile` modifier."
          ],
          correctIndex: 2,
          explanation: "As noted in Joshua Bloch's Effective Java, a single-element enum is the gold standard: it provides 100% thread safety, handles serialization automatically, and the JVM strictly prohibits reflection-based instantiation of enum constants."
        },
        {
          type: "takeaways",
          items: [
            "Creational patterns handle instantiation, Structural patterns handle composition, and Behavioral patterns handle object communication.",
            "Always use Double-Checked Locking with `volatile` or an `enum` when building Singletons.",
            "Favor composition over inheritance to avoid fragile base class coupling and maintain flexible runtime behavior.",
            "Avoid common anti-patterns like God Classes, Yo-Yo Inheritance hierarchies, and Premature Abstraction in interview rounds."
          ]
        }
      ]
    }
  }
];
