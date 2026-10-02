// Module 6 - Abstraction (4 lessons)
import { CourseLessonContent } from './types';

export const abstractionLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-abstraction",
    title: "What is Abstraction? Hiding Complexity",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-oop`, `understanding-encapsulation`, and `method-overriding-polymorphism`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Abstraction as the **Dashboard & Pedals of a Modern Car**:\n• When you press the accelerator pedal (**Clean Abstract Interface**), the car moves forward.\n• You do not need to know fuel injection timing, spark plug ignition firing orders, crankshaft rotational physics, or transmission gear ratios (**Hidden Implementation Complexity**).\n• Abstraction allows human developers to manage massive, millions-of-lines enterprise systems by interacting with simple, high-level conceptual interfaces while hiding dizzying low-level machinery."
        },
        {
          type: "callout",
          title: "WHAT vs HOW: The Core Principle of Abstraction",
          content: "• **Abstraction defines WHAT an object does** (Exposes public method contracts).\n• **Implementation defines HOW it does it** (Hidden inside concrete classes).\nIn Java, Abstraction is implemented through **Abstract Classes** (partial abstraction) and **Interfaces** (pure abstraction)."
        },
        {
          type: "code",
          title: "Abstraction in Action: High-Level Audio Processing Pipeline",
          code: "public class AbstractionOverviewDemo {\n    // 1. THE ABSTRACT INTERFACE (Defines WHAT happens)\n    interface AudioDecoder {\n        byte[] decodeAudioStream(byte[] rawCompressedData);\n    }\n\n    // 2. CONCRETE IMPLEMENTATION A (Hidden HOW: Complex MP3 Huffman decoding)\n    static class Mp3Decoder implements AudioDecoder {\n        @Override\n        public byte[] decodeAudioStream(byte[] rawData) {\n            System.out.println(\"Executing MP3 discrete cosine transform & decompression...\");\n            return new byte[]{1, 0, 1, 1}; // Decoded PCM bytes\n        }\n    }\n\n    // 3. CONCRETE IMPLEMENTATION B (Hidden HOW: FLAC Lossless algorithm)\n    static class FlacDecoder implements AudioDecoder {\n        @Override\n        public byte[] decodeAudioStream(byte[] rawData) {\n            System.out.println(\"Executing FLAC linear prediction & lossless decompression...\");\n            return new byte[]{1, 1, 1, 1};\n        }\n    }\n\n    // 4. CLIENT SYSTEM: Relies strictly on the Abstraction\n    static class MusicPlayer {\n        public static void playTrack(AudioDecoder decoder, byte[] trackData) {\n            byte[] pcmStream = decoder.decodeAudioStream(trackData);\n            System.out.println(\"Pumping \" + pcmStream.length + \" PCM audio frames to speakers.\\n\");\n        }\n    }\n\n    public static void main(String[] args) {\n        byte[] sampleData = new byte[]{10, 20, 30};\n        \n        // Client plays music through abstract decoder interface with zero audio algorithm knowledge\n        MusicPlayer.playTrack(new Mp3Decoder(), sampleData);\n        MusicPlayer.playTrack(new FlacDecoder(), sampleData);\n    }\n}",
          language: "java",
          explanation: "MusicPlayer is decoupled from specific audio formats. It interacts with the clean AudioDecoder abstraction."
        },
        {
          type: "table",
          title: "Abstraction vs Encapsulation: The Deep Comparison",
          headers: ["Dimension", "Abstraction", "Encapsulation"],
          rows: [
            ["Primary Goal", "Hide complexity by exposing essential features.", "Hide data to guard integrity and prevent corruption."],
            ["Focus", "Focuses on **WHAT** the object does.", "Focuses on **HOW** the object protects internal state."],
            ["Mechanism", "Abstract Classes (`abstract`) and Interfaces (`interface`).", "Access Modifiers (`private`, `protected`) and Getters/Setters."],
            ["Perspective", "External Design (How collaborators see the object).", "Internal Implementation (How the class organizes its fields)."],
            ["Example", "A Car's steering wheel and brake pedal.", "A Car's fuel tank sealed with a lockable gas cap."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Abstract Contract Output",
          code: "interface CloudStorage {\n    void upload(String fileName);\n}\nclass AWSStorage implements CloudStorage {\n    public void upload(String file) { System.out.println(\"S3: \" + file); }\n}\nclass App {\n    public static void main(String[] args) {\n        CloudStorage storage = new AWSStorage();\n        storage.upload(\"database_backup.sql\");\n    }\n}",
          expectedOutput: "S3: database_backup.sql",
          explanation: "Client code holds a CloudStorage abstraction pointer and calls upload(), executing AWSStorage's implementation."
        },
        {
          type: "dryRun",
          title: "Execution Trace: `MusicPlayer.playTrack(new FlacDecoder(), ...)`",
          iterations: [
            { step: 1, variables: { "Caller": "MusicPlayer.playTrack", "Passed Decoder": "FlacDecoder instance" }, description: "Invokes method with polymorphic AudioDecoder parameter." },
            { step: 2, variables: { "Abstraction Call": "decoder.decodeAudioStream(...)" }, description: "Dynamic dispatch resolves call to FlacDecoder.class." },
            { step: 3, variables: { "Execution": "Flac lossless decompression runs", "Return": "byte[] PCM buffer" }, description: "Decodes audio and returns raw PCM bytes." },
            { step: 4, variables: { "Output": "Pumping PCM frames to speakers" }, description: "MusicPlayer plays sound with zero knowledge of FLAC mathematics." }
          ]
        },
        {
          type: "warning",
          title: "Abstraction Traps",
          items: [
            "**Leaking Implementation Details**: Naming an abstract method `queryMySQLDatabase()` leaks technical details; name it `loadUserRecord()` so implementations can switch to MongoDB or Redis seamlessly.",
            "**Premature Abstraction**: Creating 5 interfaces and abstract factories for simple 10-line scripts adds unnecessary boilerplate; abstract when code has multiple implementations or evolving requirements.",
            "**Confusing Abstraction with Encapsulation**: Saying 'encapsulation is hiding data, abstraction is hiding code' is imprecise: Encapsulation protects state; Abstraction reduces conceptual complexity."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can an Abstract Class Have Zero Abstract Methods?",
          traps: [
            {
              question: "Can a class be declared `abstract` if it contains zero `abstract` methods (i.e. all methods are 100% concrete)?",
              trap: "Assuming abstract classes must have at least one abstract method.",
              solution: "YES! **An abstract class does NOT require any abstract methods**. Programmers intentionally declare a fully concrete class `abstract` to **prevent direct instantiation with `new`**, forcing developers to extend it (e.g. `java.awt.event.MouseAdapter`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the primary difference between Abstraction and Encapsulation?",
          options: [
            "Abstraction protects data; Encapsulation hides complexity",
            "Abstraction hides implementation complexity (WHAT); Encapsulation protects internal data integrity (HOW)",
            "Abstraction requires static methods; Encapsulation requires final classes",
            "They are identical concepts with different names"
          ],
          answer: 1,
          explanation: "Abstraction simplifies interfaces by hiding complex details (WHAT), while Encapsulation guards internal state using access modifiers (HOW)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Abstraction exposes clean interfaces while hiding complex internal implementations.",
            "Defines WHAT an object does rather than HOW it does it.",
            "Implemented in Java via Abstract Classes and Interfaces.",
            "Enables loose coupling and high architectural maintainability."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Abstract Classes & Template Method Pattern, learning how abstract classes combine concrete state with abstract hook methods."
        }
      ]
    }
  },
  {
    slug: "abstract-classes",
    title: "Abstract Classes & Template Method Pattern",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-abstraction`, `what-is-inheritance`, and `super-keyword`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of an Abstract Class as an **Incomplete Architectural Housing Foundation Template**:\n• A master construction firm pours the concrete slab foundation, installs standard plumbing pipes, and wires the electrical fuse box (**Concrete Shared Methods & State**).\n• However, the master architect leaves the exterior facade, roof tiles, and interior paint (**Abstract Hook Methods**) blank.\n• You cannot move into the raw foundation (`new HouseTemplate()` is illegal); a builder must create a finished subclass (`ModernVilla extends HouseTemplate`) that completes all unfinished rooms."
        },
        {
          type: "callout",
          title: "The Inviolable Rules of Abstract Classes",
          content: "1. **Cannot Be Instantiated**: Writing `new AbstractClass()` causes a compile error.\n2. **Can Have Constructors & State**: Has instance fields and constructors (invoked by child constructors via `super()`).\n3. **Contains Both Concrete and Abstract Methods**: Can provide shared common logic while forcing subclasses to implement abstract methods.\n4. **First Concrete Subclass Must Implement All Abstract Methods**: If a child class fails to implement all inherited abstract methods, the child class itself MUST be declared `abstract`."
        },
        {
          type: "code",
          title: "The Template Method Design Pattern with Abstract Classes",
          code: "public class AbstractClassTemplateDemo {\n    // ABSTRACT BASE CLASS: Defines fixed workflow skeleton\n    static abstract class DataParser {\n        protected String sourceFile;\n\n        public DataParser(String file) {\n            this.sourceFile = file;\n        }\n\n        // Concrete shared method\n        public void openFile() {\n            System.out.println(\"Opening raw binary stream for: \" + sourceFile);\n        }\n\n        // ABSTRACT HOOK STEP: Must be implemented by specific file parsers\n        public abstract void parseContent();\n\n        // Concrete shared method\n        public void closeFile() {\n            System.out.println(\"Closing file stream: \" + sourceFile + \"\\n\");\n        }\n\n        // THE TEMPLATE METHOD (final so subclasses cannot alter the execution sequence!)\n        public final void process() {\n            openFile();\n            parseContent(); // Polymorphic hook invocation\n            closeFile();\n        }\n    }\n\n    // Concrete Subclass 1: CSV\n    static class CSVParser extends DataParser {\n        public CSVParser(String file) { super(file); }\n\n        @Override\n        public void parseContent() {\n            System.out.println(\"Parsing comma-separated rows into table records.\");\n        }\n    }\n\n    // Concrete Subclass 2: JSON\n    static class JSONParser extends DataParser {\n        public JSONParser(String file) { super(file); }\n\n        @Override\n        public void parseContent() {\n            System.out.println(\"Parsing nested JSON key-value tokens into document tree.\");\n        }\n    }\n\n    public static void main(String[] args) {\n        DataParser p1 = new CSVParser(\"users.csv\");\n        DataParser p2 = new JSONParser(\"config.json\");\n\n        p1.process(); // Runs open -> parse CSV -> close\n        p2.process(); // Runs open -> parse JSON -> close\n    }\n}",
          language: "java",
          explanation: "DataParser defines the immutable process() template workflow. CSVParser and JSONParser supply only the custom parseContent() step."
        },
        {
          type: "table",
          title: "Abstract Class Rules & Modifiers Matrix",
          headers: ["Element", "Permitted in Abstract Class?", "Rules / Invariants"],
          rows: [
            ["Instance Variables", "✅ YES", "Can have `private`, `protected`, `public`, `final`, `static` fields."],
            ["Constructors", "✅ YES", "Executed via `super(...)` during subclass instantiation."],
            ["Concrete Methods", "✅ YES", "Shared implementations inherited by all subclasses."],
            ["Abstract Methods", "✅ YES", "Declared with `abstract`; must NOT have a body `{}`."],
            ["Instantiation with `new`", "❌ NO", "Compile error: *class is abstract; cannot be instantiated*."],
            ["`private abstract` method", "❌ NO", "Compile error! Abstract methods must be visible to be overridden."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Abstract Class Compilation",
          code: "abstract class Shape {\n    int colorCode = 1;\n    Shape() { colorCode = 5; }\n    abstract void draw();\n}\nclass Square extends Shape {\n    void draw() { System.out.println(\"Draw Square Color: \" + colorCode); }\n}\nclass TestAbstract {\n    public static void main(String[] args) {\n        Shape s = new Square();\n        s.draw();\n    }\n}",
          expectedOutput: "Draw Square Color: 5",
          explanation: "new Square() invokes Shape() constructor initializing colorCode to 5. s.draw() executes Square's overridden draw() method."
        },
        {
          type: "dryRun",
          title: "Execution Trace: `new CSVParser(\"users.csv\").process()`",
          iterations: [
            { step: 1, variables: { "Call": "new CSVParser(\"users.csv\")" }, description: "Invokes super(\"users.csv\") in DataParser; sets sourceFile." },
            { step: 2, variables: { "Template Method": "process()", "Step 1": "openFile()" }, description: "Executes concrete openFile() from DataParser." },
            { step: 3, variables: { "Template Method": "process()", "Step 2": "parseContent()" }, description: "Dispatches dynamically to CSVParser.parseContent()." },
            { step: 4, variables: { "Template Method": "process()", "Step 3": "closeFile()" }, description: "Executes concrete closeFile() from DataParser." }
          ]
        },
        {
          type: "warning",
          title: "Abstract Class Traps",
          items: [
            "**Illegal Modifier Combinations**: Marking an abstract method `private abstract`, `static abstract`, or `final abstract` causes a compile error (because private, static, and final methods cannot be overridden!).",
            "**Empty Method Body `{}` on Abstract Method**: Writing `abstract void run() {}` produces a compile error: *abstract methods cannot have a body* (must end with a semicolon `;`).",
            "**Forgetting Constructors in Abstract Classes**: Abstract classes should define constructors to initialize base fields cleanly."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Do Abstract Classes Have Constructors?",
          traps: [
            {
              question: "If an Abstract Class cannot be instantiated with the `new` keyword, why does Java allow it to have constructors?",
              trap: "Thinking constructors in abstract classes are dead code.",
              solution: "Because **Constructors in Abstract Classes initialize the superclass state of concrete subclass objects**!\n• When a child class is instantiated (`new CSVParser()`), the child constructor calls `super(\"users.csv\")` to execute the abstract parent's constructor.\n• This guarantees that all private/protected fields and invariant checks in the abstract class are properly initialized before child code executes."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which modifier combination is ILLEGAL on a method in Java?",
          options: [
            "`public abstract`",
            "`protected abstract`",
            "`final abstract`",
            "`public final`"
          ],
          answer: 2,
          explanation: "`final abstract` is a contradictory compile error: `abstract` mandates that the method MUST be overridden, while `final` strictly forbids overriding."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Abstract classes cannot be instantiated and can contain both abstract and concrete methods.",
            "Abstract classes have constructors executed via `super()` during subclass creation.",
            "The Template Method Pattern uses abstract classes to define fixed algorithm skeletons with customizable hook steps.",
            "`abstract` methods cannot be `private`, `static`, or `final`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Interfaces: Contracts & Multiple Inheritance, mastering pure contract design, default constant fields, and implementing multiple interfaces."
        }
      ]
    }
  },
  {
    slug: "interfaces-in-java",
    title: "Interfaces: Contracts & Multiple Inheritance",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-abstraction`, `types-of-inheritance`, and method overriding."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a Java Interface as a **Standard Universal Electrical Wall Outlet (USB-C / 120V Socket)**:\n• The power grid company publishes a precise physical interface specification (**The Interface**).\n• Any device manufacturer—whether making a toaster, a laptop charger, or a Tesla car charger—can implement the matching prongs (`implements PowerConsumer`).\n• The power grid outlet does not care about the internal circuitry or brand of the device; as long as the device implements the standard plug contract, electricity flows flawlessly."
        },
        {
          type: "callout",
          title: "Implicit Modifiers in Java Interfaces",
          content: "By default in Java interfaces:\n• **All Fields** are implicitly `public static final` (Constant values).\n• **All Non-Default Methods** are implicitly `public abstract` (Public contracts).\n*You can omit these keywords in source code, but the compiler injects them automatically.*"
        },
        {
          type: "code",
          title: "Multiple Interface Implementation in Action",
          code: "public class InterfaceDemo {\n    // 1. Interface 1: Flyable contract\n    interface Flyable {\n        int MAX_ALTITUDE_METERS = 10000; // Implicitly public static final\n        void takeOff();                  // Implicitly public abstract\n        void land();\n    }\n\n    // 2. Interface 2: GPSNavigable contract\n    interface GPSNavigable {\n        void navigateToCoordinates(double lat, double lon);\n    }\n\n    // 3. Interface 3: CameraEquipped contract\n    interface CameraEquipped {\n        void capture4KPhoto();\n    }\n\n    // CONCRETE CLASS implementing MULTIPLE INTERFACES\n    static class AutonomousDrone implements Flyable, GPSNavigable, CameraEquipped {\n        private String modelName;\n\n        public AutonomousDrone(String model) { this.modelName = model; }\n\n        // Implementing Flyable\n        @Override\n        public void takeOff() { System.out.println(modelName + \" rotors spinning up. Taking off!\"); }\n\n        @Override\n        public void land() { System.out.println(modelName + \" landing safely on landing pad.\"); }\n\n        // Implementing GPSNavigable\n        @Override\n        public void navigateToCoordinates(double lat, double lon) {\n            System.out.println(modelName + \" routing to Lat: \" + lat + \", Lon: \" + lon);\n        }\n\n        // Implementing CameraEquipped\n        @Override\n        public void capture4KPhoto() {\n            System.out.println(modelName + \" gimbal stabilized. 4K Photo captured!\");\n        }\n    }\n\n    public static void main(String[] args) {\n        AutonomousDrone drone = new AutonomousDrone(\"SkyGuard Pro\");\n        drone.takeOff();\n        drone.navigateToCoordinates(37.7749, -122.4194);\n        drone.capture4KPhoto();\n        drone.land();\n    }\n}",
          language: "java",
          explanation: "AutonomousDrone implements Flyable, GPSNavigable, and CameraEquipped, achieving clean multiple inheritance of type and capabilities."
        },
        {
          type: "table",
          title: "Interface Rules & Invariants Summary",
          headers: ["Element", "Implicit Modifiers Injected by Compiler", "Rules / Constraints"],
          rows: [
            ["Fields", "`public static final`", "Must be initialized at declaration; cannot be modified (Constants)."],
            ["Standard Methods", "`public abstract`", "No body `{}`; must be implemented by concrete classes with `public` modifier."],
            ["Instantiation", "CANNOT be instantiated with `new`", "Can be used as polymorphic reference types (`Flyable f = new Drone()`)."],
            ["Multiple Implementation", "`implements A, B, C`", "A class can implement unlimited interfaces."],
            ["Interface Inheritance", "`interface C extends A, B`", "An interface can extend multiple other interfaces using `extends`!"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Interface Constant Output",
          code: "interface Config {\n    int TIMEOUT = 5000; // public static final\n}\nclass TestConfig {\n    public static void main(String[] args) {\n        System.out.println(Config.TIMEOUT);\n        // Config.TIMEOUT = 1000; // Would cause compile error: cannot assign value to final variable\n    }\n}",
          expectedOutput: "5000",
          explanation: "Interface fields are static constants accessed via InterfaceName.FIELD."
        },
        {
          type: "dryRun",
          title: "Interface Method Dispatch Trace: `Flyable f = new AutonomousDrone(\"DJI\"); f.takeOff();`",
          iterations: [
            { step: 1, variables: { "Reference Type": "Flyable", "Heap Object": "AutonomousDrone (0x811A)" }, description: "Upcasts AutonomousDrone instance to Flyable interface reference." },
            { step: 2, variables: { "Bytecode": "invokeinterface Flyable.takeOff" }, description: "Issues interface method invocation opcode." },
            { step: 3, variables: { "ITable Lookup": "AutonomousDrone Interface Table (itable)" }, description: "Locates concrete takeOff() method implementation in AutonomousDrone." },
            { step: 4, variables: { "Execution": "Drone rotors spinning up. Taking off!" }, description: "Executes drone takeOff logic." }
          ]
        },
        {
          type: "warning",
          title: "Interface Implementation Traps",
          items: [
            "**Omitting `public` on Overriding Methods**: Writing `void takeOff() {}` in the implementing class causes compile error: *attempting to assign weaker access privileges; was public* (because interface methods are implicitly public!).",
            "**Constants Anti-Pattern**: Using interfaces solely to hold constant variables (`interface Constants { ... }`) is an anti-pattern. Use `final class` with private constructors or `enum` instead.",
            "**Interface Names**: Prefer adjectives ending in '-able' (`Runnable`, `Comparable`, `Serializable`, `AutoCloseable`) or clear nouns (`Repository`, `PaymentGateway`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can an Interface Extend Multiple Other Interfaces?",
          traps: [
            {
              question: "Can an interface extend multiple other interfaces using the `extends` keyword?",
              trap: "Thinking multiple inheritance is never allowed with extends.",
              solution: "YES! **An interface CAN extend multiple interfaces** using the `extends` keyword:\n```java\ninterface SmartDevice extends WifiConnectable, BluetoothConnectable, PowerManageable {}\n```\nMultiple inheritance is forbidden for *classes* (because of state/constructor conflicts), but fully supported for *interfaces*."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What are the implicit modifiers applied to every field declared inside a Java interface?",
          options: [
            "`private final`",
            "`public static final`",
            "`protected volatile`",
            "`default transient`"
          ],
          answer: 1,
          explanation: "All fields in a Java interface are automatically `public static final` constants."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Interfaces define pure contracts of behavior.",
            "A class can implement multiple interfaces (`implements A, B, C`).",
            "All interface fields are implicitly `public static final` constants.",
            "All standard interface methods are implicitly `public abstract`.",
            "Implementing methods MUST be declared `public`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Abstract Class vs Interface & Modern Java Features, examining default methods, static methods, private interface methods, and architectural selection criteria."
        }
      ]
    }
  },
  {
    slug: "abstract-class-vs-interface",
    title: "Abstract Class vs Interface & Modern Java Features",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `abstract-classes`, `interfaces-in-java`, and `what-is-inheritance`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the choice between an Abstract Class and an Interface as **Biological Identity vs Skill Certifications**:\n• **Abstract Class (Species / Identity / \"Is-A\")**: A Bird (`abstract class Bird`). It has physical state (feathers, beak, internal body temperature) and shared genetics.\n• **Interface (Capabilities / Certifications / \"Can-Do\")**: Flying (`interface Flyable`). A Bird can fly, an Airplane can fly, a Drone can fly, and a Superhero can fly. None of them share biological genetics, but all implement the `Flyable` capability contract."
        },
        {
          type: "callout",
          title: "The Modern Evolution of Java Interfaces",
          content: "• **Java 8 `default` Methods**: Allows interfaces to provide backward-compatible default method implementations without breaking existing implementing classes.\n• **Java 8 `static` Methods**: Allows utility helper methods directly inside interfaces (`List.of()`, `Comparator.comparing()`).\n• **Java 9 `private` Methods**: Allows sharing common internal helper code between multiple default methods without exposing them to implementing classes."
        },
        {
          type: "code",
          title: "Modern Interface with `default`, `static`, and `private` Methods (Java 9+)",
          code: "public class ModernInterfaceDemo {\n    interface Logger {\n        // 1. Abstract method (Must be implemented)\n        void logRaw(String formattedMessage);\n\n        // 2. Default method (Java 8+): Provides default behavior with fallback\n        default void logInfo(String message) {\n            logWithPrefix(\"INFO\", message); // Calls private helper\n        }\n\n        default void logError(String message) {\n            logWithPrefix(\"ERROR\", message);\n        }\n\n        // 3. Private helper method (Java 9+): Shared internal logic\n        private void logWithPrefix(String level, String msg) {\n            String timestamp = java.time.LocalTime.now().toString();\n            logRaw(\"[\" + timestamp + \"] [\" + level + \"] \" + msg);\n        }\n\n        // 4. Static utility method (Java 8+)\n        static Logger getConsoleLogger() {\n            return message -> System.out.println(message);\n        }\n    }\n\n    public static void main(String[] args) {\n        // Using static factory method\n        Logger consoleLog = Logger.getConsoleLogger();\n        consoleLog.logInfo(\"Server initialized on port 8080.\");\n        consoleLog.logError(\"Database timeout after 5000ms.\");\n    }\n}",
          language: "java",
          explanation: "Demonstrates modern Java interface features: default methods, private helper methods, and static factory methods."
        },
        {
          type: "table",
          title: "The Definitive Matrix: Abstract Class vs Interface",
          headers: ["Feature", "Abstract Class", "Interface (Java 8+)"],
          rows: [
            ["Multiplicity", "Single inheritance only (`extends OneClass`).", "Multiple implementation (`implements A, B, C`)."],
            ["State / Fields", "Can have instance fields (`private int age;`).", "ONLY `public static final` constants."],
            ["Constructors", "✅ YES (Has constructors for base state).", "❌ NO (Zero constructors allowed)."],
            ["Method Types", "Abstract, Concrete, Final, Static, Private.", "Abstract, Default, Static, Private (Java 9)."],
            ["Relationship", "Strong 'Is-A' taxonomy (Shared Identity).", "'Can-Do' capability contract (Shared Behavior)."],
            ["Speed of Evolution", "Easy to add concrete methods without breaking code.", "Can add `default` methods without breaking code."],
            ["Speed", "Slightly faster ($O(1)$ vtable jump).", "Fast ($O(1)$ itable jump with JIT inline caching)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Resolving Default Method Conflicts",
          code: "interface Alpha { default void run() { System.out.print(\"Alpha \"); } }\ninterface Beta { default void run() { System.out.print(\"Beta \"); } }\n\nclass ConflictResolver implements Alpha, Beta {\n    // MUST explicitly resolve diamond default method conflict!\n    @Override\n    public void run() {\n        Alpha.super.run(); // Calls Alpha's version\n    }\n}\n\nclass TestConflict {\n    public static void main(String[] args) {\n        new ConflictResolver().run();\n    }\n}",
          expectedOutput: "Alpha ",
          explanation: "When two interfaces provide conflicting default methods, the implementing class MUST override the method and explicitly choose or combine them."
        },
        {
          type: "dryRun",
          title: "Decision Framework: Should I Use an Abstract Class or an Interface?",
          iterations: [
            { step: 1, variables: { "Question": "Do you need to share mutable instance state or constructors?" }, description: "YES &rarr; Use ABSTRACT CLASS (Interfaces cannot hold instance fields)." },
            { step: 2, variables: { "Question": "Do you want unrelated classes to implement a common capability?" }, description: "YES &rarr; Use INTERFACE (`Comparable`, `Serializable`, `AutoCloseable`)." },
            { step: 3, variables: { "Question": "Do you need multiple inheritance of type?" }, description: "YES &rarr; Use INTERFACE (Java allows `implements A, B, C`)." },
            { step: 4, variables: { "Question": "Do you want to design clean public API contracts (e.g. Spring Service)?" }, description: "YES &rarr; Use INTERFACE (Enables mocking, dependency injection, and proxying)." }
          ]
        },
        {
          type: "warning",
          title: "Common Architectural Mistakes",
          items: [
            "**Overusing Default Methods to Turn Interfaces into Abstract Classes**: Interfaces should remain lightweight contracts; do not dump 500 lines of business logic into interface default methods.",
            "**Creating Abstract Classes for Pure Contracts**: If your abstract class has zero instance fields and zero constructors, convert it into an `interface` to allow multiple inheritance.",
            "**Interface Default Diamond Conflicts**: Forgetting to resolve duplicate default methods causes compile error: *class inherits unrelated defaults for method from types Alpha and Beta*."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Were Default Methods Added in Java 8?",
          traps: [
            {
              question: "Why did Java 8 introduce `default` methods in interfaces? What major problem did it solve in the Java standard library?",
              trap: "Thinking it was just to make interfaces act like abstract classes.",
              solution: "To provide **Non-Breaking API Evolution for Java 8 Lambdas and Streams**!\n• In Java 8, Oracle wanted to add `stream()`, `parallelStream()`, and `forEach()` to `java.util.Collection`.\n• If interfaces only supported abstract methods, adding `stream()` to `Collection` would have instantly **broken millions of custom collections in production code worldwide** (because every custom collection would fail compilation for not implementing `stream()`).\n• Default methods allowed Oracle to add `default Stream<E> stream()` directly to `Collection` with zero breaking changes!"
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "When must you choose an Abstract Class over an Interface in Java?",
          options: [
            "When you want to implement multiple inheritance",
            "When you need non-static instance fields or constructor initialization of base state",
            "When designing a functional interface for lambdas",
            "When you need public static methods"
          ],
          answer: 1,
          explanation: "Interfaces cannot hold instance variables or define constructors. If your design requires non-static fields or constructor execution, you MUST use an Abstract Class."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Use Abstract Classes for 'Is-A' relationships with shared state and constructors.",
            "Use Interfaces for 'Can-Do' capabilities across unrelated classes.",
            "Java 8 introduced `default` and `static` interface methods for non-breaking API evolution.",
            "Java 9 added `private` interface methods for internal helper code sharing.",
            "Conflicting default methods are resolved explicitly using `InterfaceName.super.method()`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 7: Advanced OOP, mastering nested/inner classes, static nested classes, local and anonymous inner classes, and advanced keywords."
        }
      ]
    }
  }
];
