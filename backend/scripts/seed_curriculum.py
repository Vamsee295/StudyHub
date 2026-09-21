import sys
import os
import asyncio
import uuid
import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.models.learning import LearningSubject, LearningModule, LearningTopic
from sqlalchemy.future import select

# The initial curriculum structure
CURRICULUM = [
    {
        "name": "Programming Fundamentals",
        "slug": "programming-fundamentals",
        "description": "Master core programming concepts, memory models, pointers, and I/O semantics.",
        "icon": "TerminalSquare",
        "category": "Foundation",
        "display_order": 1,
        "modules": [
            {
                "title": "PROGRAMMING BASICS",
                "slug": "programming-basics",
                "description": "Learn about programming basics",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 1,
                "topics": [
                    {
                        "title": "What is Programming?",
                        "slug": "what-is-programming",
                        "description": "Learn the fundamentals of What is Programming?.",
                        "content": "{\"concept\": \"This lesson covers What is Programming?.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for What is Programming?\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of What is Programming??\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 1
                    },
                    {
                        "title": "Programming Languages",
                        "slug": "programming-languages",
                        "description": "Learn the fundamentals of Programming Languages.",
                        "content": "{\"concept\": \"This lesson covers Programming Languages.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Programming Languages\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Programming Languages?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 2
                    },
                    {
                        "title": "High-Level vs Low-Level Languages",
                        "slug": "high-level-vs-low-level-languages",
                        "description": "Learn the fundamentals of High-Level vs Low-Level Languages.",
                        "content": "{\"concept\": \"This lesson covers High-Level vs Low-Level Languages.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for High-Level vs Low-Level Languages\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of High-Level vs Low-Level Languages?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 3
                    },
                    {
                        "title": "Compiler vs Interpreter",
                        "slug": "compiler-vs-interpreter",
                        "description": "Learn the fundamentals of Compiler vs Interpreter.",
                        "content": "{\"concept\": \"This lesson covers Compiler vs Interpreter.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Compiler vs Interpreter\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Compiler vs Interpreter?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 4
                    },
                    {
                        "title": "Source Code, Compilation & Execution",
                        "slug": "source-code,-compilation-execution",
                        "description": "Learn the fundamentals of Source Code, Compilation & Execution.",
                        "content": "{\"concept\": \"This lesson covers Source Code, Compilation & Execution.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Source Code, Compilation & Execution\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Source Code, Compilation & Execution?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 5
                    },
                    {
                        "title": "Syntax vs Semantics",
                        "slug": "syntax-vs-semantics",
                        "description": "Learn the fundamentals of Syntax vs Semantics.",
                        "content": "{\"concept\": \"This lesson covers Syntax vs Semantics.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Syntax vs Semantics\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Syntax vs Semantics?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 6
                    }
                ]
            },
            {
                "title": "VARIABLES & DATA TYPES",
                "slug": "variables-data-types",
                "description": "Learn about variables & data types",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 2,
                "topics": [
                    {
                        "title": "Variables",
                        "slug": "variables",
                        "description": "Learn the fundamentals of Variables.",
                        "content": "{\"concept\": \"This lesson covers Variables.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Variables\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Variables?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 7
                    },
                    {
                        "title": "Constants",
                        "slug": "constants",
                        "description": "Learn the fundamentals of Constants.",
                        "content": "{\"concept\": \"This lesson covers Constants.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Constants\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Constants?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 8
                    },
                    {
                        "title": "Primitive Data Types",
                        "slug": "primitive-data-types",
                        "description": "Learn the fundamentals of Primitive Data Types.",
                        "content": "{\"concept\": \"This lesson covers Primitive Data Types.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Primitive Data Types\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Primitive Data Types?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 9
                    },
                    {
                        "title": "int",
                        "slug": "int",
                        "description": "Learn the fundamentals of int.",
                        "content": "{\"concept\": \"This lesson covers int.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for int\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of int?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 10
                    },
                    {
                        "title": "long",
                        "slug": "long",
                        "description": "Learn the fundamentals of long.",
                        "content": "{\"concept\": \"This lesson covers long.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for long\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of long?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 11
                    },
                    {
                        "title": "float & double",
                        "slug": "float-double",
                        "description": "Learn the fundamentals of float & double.",
                        "content": "{\"concept\": \"This lesson covers float & double.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for float & double\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of float & double?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 12
                    },
                    {
                        "title": "char",
                        "slug": "char",
                        "description": "Learn the fundamentals of char.",
                        "content": "{\"concept\": \"This lesson covers char.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for char\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of char?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 13
                    },
                    {
                        "title": "boolean",
                        "slug": "boolean",
                        "description": "Learn the fundamentals of boolean.",
                        "content": "{\"concept\": \"This lesson covers boolean.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for boolean\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of boolean?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 14
                    },
                    {
                        "title": "String",
                        "slug": "string",
                        "description": "Learn the fundamentals of String.",
                        "content": "{\"concept\": \"This lesson covers String.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for String\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of String?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 15
                    },
                    {
                        "title": "Type Conversion",
                        "slug": "type-conversion",
                        "description": "Learn the fundamentals of Type Conversion.",
                        "content": "{\"concept\": \"This lesson covers Type Conversion.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Type Conversion\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Type Conversion?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 16
                    },
                    {
                        "title": "Type Casting",
                        "slug": "type-casting",
                        "description": "Learn the fundamentals of Type Casting.",
                        "content": "{\"concept\": \"This lesson covers Type Casting.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Type Casting\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Type Casting?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 17
                    },
                    {
                        "title": "Widening Conversion",
                        "slug": "widening-conversion",
                        "description": "Learn the fundamentals of Widening Conversion.",
                        "content": "{\"concept\": \"This lesson covers Widening Conversion.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Widening Conversion\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Widening Conversion?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 18
                    },
                    {
                        "title": "Narrowing Conversion",
                        "slug": "narrowing-conversion",
                        "description": "Learn the fundamentals of Narrowing Conversion.",
                        "content": "{\"concept\": \"This lesson covers Narrowing Conversion.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Narrowing Conversion\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Narrowing Conversion?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 19
                    }
                ]
            },
            {
                "title": "OPERATORS & EXPRESSIONS",
                "slug": "operators-expressions",
                "description": "Learn about operators & expressions",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 3,
                "topics": [
                    {
                        "title": "Arithmetic Operators",
                        "slug": "arithmetic-operators",
                        "description": "Learn the fundamentals of Arithmetic Operators.",
                        "content": "{\"concept\": \"This lesson covers Arithmetic Operators.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Arithmetic Operators\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Arithmetic Operators?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 20
                    },
                    {
                        "title": "Relational Operators",
                        "slug": "relational-operators",
                        "description": "Learn the fundamentals of Relational Operators.",
                        "content": "{\"concept\": \"This lesson covers Relational Operators.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Relational Operators\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Relational Operators?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 21
                    },
                    {
                        "title": "Logical Operators",
                        "slug": "logical-operators",
                        "description": "Learn the fundamentals of Logical Operators.",
                        "content": "{\"concept\": \"This lesson covers Logical Operators.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Logical Operators\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Logical Operators?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 22
                    },
                    {
                        "title": "Assignment Operators",
                        "slug": "assignment-operators",
                        "description": "Learn the fundamentals of Assignment Operators.",
                        "content": "{\"concept\": \"This lesson covers Assignment Operators.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Assignment Operators\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Assignment Operators?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 23
                    },
                    {
                        "title": "Increment & Decrement",
                        "slug": "increment-decrement",
                        "description": "Learn the fundamentals of Increment & Decrement.",
                        "content": "{\"concept\": \"This lesson covers Increment & Decrement.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Increment & Decrement\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Increment & Decrement?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 24
                    },
                    {
                        "title": "Ternary Operator",
                        "slug": "ternary-operator",
                        "description": "Learn the fundamentals of Ternary Operator.",
                        "content": "{\"concept\": \"This lesson covers Ternary Operator.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Ternary Operator\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Ternary Operator?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 25
                    },
                    {
                        "title": "Operator Precedence",
                        "slug": "operator-precedence",
                        "description": "Learn the fundamentals of Operator Precedence.",
                        "content": "{\"concept\": \"This lesson covers Operator Precedence.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Operator Precedence\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Operator Precedence?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 26
                    },
                    {
                        "title": "Expressions",
                        "slug": "expressions",
                        "description": "Learn the fundamentals of Expressions.",
                        "content": "{\"concept\": \"This lesson covers Expressions.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Expressions\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Expressions?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 27
                    }
                ]
            },
            {
                "title": "INPUT & OUTPUT",
                "slug": "input-output",
                "description": "Learn about input & output",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 4,
                "topics": [
                    {
                        "title": "Standard Input",
                        "slug": "standard-input",
                        "description": "Learn the fundamentals of Standard Input.",
                        "content": "{\"concept\": \"This lesson covers Standard Input.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Standard Input\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Standard Input?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 28
                    },
                    {
                        "title": "Scanner",
                        "slug": "scanner",
                        "description": "Learn the fundamentals of Scanner.",
                        "content": "{\"concept\": \"This lesson covers Scanner.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Scanner\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Scanner?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 29
                    },
                    {
                        "title": "Reading Multiple Values",
                        "slug": "reading-multiple-values",
                        "description": "Learn the fundamentals of Reading Multiple Values.",
                        "content": "{\"concept\": \"This lesson covers Reading Multiple Values.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Reading Multiple Values\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Reading Multiple Values?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 30
                    },
                    {
                        "title": "Output Formatting",
                        "slug": "output-formatting",
                        "description": "Learn the fundamentals of Output Formatting.",
                        "content": "{\"concept\": \"This lesson covers Output Formatting.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Output Formatting\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Output Formatting?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 31
                    },
                    {
                        "title": "Console Programs",
                        "slug": "console-programs",
                        "description": "Learn the fundamentals of Console Programs.",
                        "content": "{\"concept\": \"This lesson covers Console Programs.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Console Programs\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Console Programs?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 32
                    }
                ]
            },
            {
                "title": "CONTROL FLOW",
                "slug": "control-flow",
                "description": "Learn about control flow",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 5,
                "topics": [
                    {
                        "title": "if",
                        "slug": "if",
                        "description": "Learn the fundamentals of if.",
                        "content": "{\"concept\": \"This lesson covers if.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for if\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of if?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 33
                    },
                    {
                        "title": "if-else",
                        "slug": "if-else",
                        "description": "Learn the fundamentals of if-else.",
                        "content": "{\"concept\": \"This lesson covers if-else.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for if-else\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of if-else?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 34
                    },
                    {
                        "title": "else-if",
                        "slug": "else-if",
                        "description": "Learn the fundamentals of else-if.",
                        "content": "{\"concept\": \"This lesson covers else-if.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for else-if\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of else-if?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 35
                    },
                    {
                        "title": "Nested Conditions",
                        "slug": "nested-conditions",
                        "description": "Learn the fundamentals of Nested Conditions.",
                        "content": "{\"concept\": \"This lesson covers Nested Conditions.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Nested Conditions\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Nested Conditions?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 36
                    },
                    {
                        "title": "switch",
                        "slug": "switch",
                        "description": "Learn the fundamentals of switch.",
                        "content": "{\"concept\": \"This lesson covers switch.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for switch\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of switch?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 37
                    },
                    {
                        "title": "for Loop",
                        "slug": "for-loop",
                        "description": "Learn the fundamentals of for Loop.",
                        "content": "{\"concept\": \"This lesson covers for Loop.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for for Loop\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of for Loop?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 38
                    },
                    {
                        "title": "while Loop",
                        "slug": "while-loop",
                        "description": "Learn the fundamentals of while Loop.",
                        "content": "{\"concept\": \"This lesson covers while Loop.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for while Loop\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of while Loop?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 39
                    },
                    {
                        "title": "do-while Loop",
                        "slug": "do-while-loop",
                        "description": "Learn the fundamentals of do-while Loop.",
                        "content": "{\"concept\": \"This lesson covers do-while Loop.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for do-while Loop\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of do-while Loop?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 40
                    },
                    {
                        "title": "Nested Loops",
                        "slug": "nested-loops",
                        "description": "Learn the fundamentals of Nested Loops.",
                        "content": "{\"concept\": \"This lesson covers Nested Loops.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Nested Loops\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Nested Loops?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 41
                    },
                    {
                        "title": "break",
                        "slug": "break",
                        "description": "Learn the fundamentals of break.",
                        "content": "{\"concept\": \"This lesson covers break.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for break\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of break?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 42
                    },
                    {
                        "title": "continue",
                        "slug": "continue",
                        "description": "Learn the fundamentals of continue.",
                        "content": "{\"concept\": \"This lesson covers continue.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for continue\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of continue?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 43
                    }
                ]
            },
            {
                "title": "FUNCTIONS / METHODS",
                "slug": "functions-methods",
                "description": "Learn about functions / methods",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 6,
                "topics": [
                    {
                        "title": "What is a Method?",
                        "slug": "what-is-a-method",
                        "description": "Learn the fundamentals of What is a Method?.",
                        "content": "{\"concept\": \"This lesson covers What is a Method?.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for What is a Method?\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of What is a Method??\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 44
                    },
                    {
                        "title": "Method Declaration",
                        "slug": "method-declaration",
                        "description": "Learn the fundamentals of Method Declaration.",
                        "content": "{\"concept\": \"This lesson covers Method Declaration.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Method Declaration\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Method Declaration?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 45
                    },
                    {
                        "title": "Parameters",
                        "slug": "parameters",
                        "description": "Learn the fundamentals of Parameters.",
                        "content": "{\"concept\": \"This lesson covers Parameters.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Parameters\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Parameters?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 46
                    },
                    {
                        "title": "Arguments",
                        "slug": "arguments",
                        "description": "Learn the fundamentals of Arguments.",
                        "content": "{\"concept\": \"This lesson covers Arguments.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Arguments\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Arguments?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 47
                    },
                    {
                        "title": "Return Values",
                        "slug": "return-values",
                        "description": "Learn the fundamentals of Return Values.",
                        "content": "{\"concept\": \"This lesson covers Return Values.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Return Values\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Return Values?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 48
                    },
                    {
                        "title": "void Methods",
                        "slug": "void-methods",
                        "description": "Learn the fundamentals of void Methods.",
                        "content": "{\"concept\": \"This lesson covers void Methods.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for void Methods\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of void Methods?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 49
                    },
                    {
                        "title": "Scope",
                        "slug": "scope",
                        "description": "Learn the fundamentals of Scope.",
                        "content": "{\"concept\": \"This lesson covers Scope.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Scope\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Scope?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 50
                    },
                    {
                        "title": "Local Variables",
                        "slug": "local-variables",
                        "description": "Learn the fundamentals of Local Variables.",
                        "content": "{\"concept\": \"This lesson covers Local Variables.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Local Variables\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Local Variables?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 51
                    },
                    {
                        "title": "Method Overloading",
                        "slug": "method-overloading",
                        "description": "Learn the fundamentals of Method Overloading.",
                        "content": "{\"concept\": \"This lesson covers Method Overloading.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Method Overloading\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Method Overloading?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 52
                    },
                    {
                        "title": "Pass-by-Value",
                        "slug": "pass-by-value",
                        "description": "Learn the fundamentals of Pass-by-Value.",
                        "content": "{\"concept\": \"This lesson covers Pass-by-Value.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Pass-by-Value\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Pass-by-Value?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 53
                    },
                    {
                        "title": "Recursion Fundamentals",
                        "slug": "recursion-fundamentals",
                        "description": "Learn the fundamentals of Recursion Fundamentals.",
                        "content": "{\"concept\": \"This lesson covers Recursion Fundamentals.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Recursion Fundamentals\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Recursion Fundamentals?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 54
                    }
                ]
            },
            {
                "title": "ARRAYS & STRINGS",
                "slug": "arrays-strings",
                "description": "Learn about arrays & strings",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 7,
                "topics": [
                    {
                        "title": "Arrays",
                        "slug": "arrays",
                        "description": "Learn the fundamentals of Arrays.",
                        "content": "{\"concept\": \"This lesson covers Arrays.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Arrays\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Arrays?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 55
                    },
                    {
                        "title": "Array Indexing",
                        "slug": "array-indexing",
                        "description": "Learn the fundamentals of Array Indexing.",
                        "content": "{\"concept\": \"This lesson covers Array Indexing.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Array Indexing\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Array Indexing?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 56
                    },
                    {
                        "title": "Array Traversal",
                        "slug": "array-traversal",
                        "description": "Learn the fundamentals of Array Traversal.",
                        "content": "{\"concept\": \"This lesson covers Array Traversal.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Array Traversal\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Array Traversal?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 57
                    },
                    {
                        "title": "Updating Arrays",
                        "slug": "updating-arrays",
                        "description": "Learn the fundamentals of Updating Arrays.",
                        "content": "{\"concept\": \"This lesson covers Updating Arrays.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Updating Arrays\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Updating Arrays?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 58
                    },
                    {
                        "title": "Searching Arrays",
                        "slug": "searching-arrays",
                        "description": "Learn the fundamentals of Searching Arrays.",
                        "content": "{\"concept\": \"This lesson covers Searching Arrays.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Searching Arrays\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Searching Arrays?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 59
                    },
                    {
                        "title": "Multidimensional Arrays",
                        "slug": "multidimensional-arrays",
                        "description": "Learn the fundamentals of Multidimensional Arrays.",
                        "content": "{\"concept\": \"This lesson covers Multidimensional Arrays.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Multidimensional Arrays\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Multidimensional Arrays?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 60
                    },
                    {
                        "title": "Strings",
                        "slug": "strings",
                        "description": "Learn the fundamentals of Strings.",
                        "content": "{\"concept\": \"This lesson covers Strings.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Strings\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Strings?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 61
                    },
                    {
                        "title": "String Traversal",
                        "slug": "string-traversal",
                        "description": "Learn the fundamentals of String Traversal.",
                        "content": "{\"concept\": \"This lesson covers String Traversal.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for String Traversal\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of String Traversal?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 62
                    },
                    {
                        "title": "String Methods",
                        "slug": "string-methods",
                        "description": "Learn the fundamentals of String Methods.",
                        "content": "{\"concept\": \"This lesson covers String Methods.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for String Methods\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of String Methods?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 63
                    },
                    {
                        "title": "String Immutability",
                        "slug": "string-immutability",
                        "description": "Learn the fundamentals of String Immutability.",
                        "content": "{\"concept\": \"This lesson covers String Immutability.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for String Immutability\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of String Immutability?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 64
                    }
                ]
            },
            {
                "title": "COLLECTION BASICS",
                "slug": "collection-basics",
                "description": "Learn about collection basics",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 8,
                "topics": [
                    {
                        "title": "ArrayList",
                        "slug": "arraylist",
                        "description": "Learn the fundamentals of ArrayList.",
                        "content": "{\"concept\": \"This lesson covers ArrayList.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for ArrayList\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of ArrayList?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 65
                    },
                    {
                        "title": "HashSet",
                        "slug": "hashset",
                        "description": "Learn the fundamentals of HashSet.",
                        "content": "{\"concept\": \"This lesson covers HashSet.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for HashSet\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of HashSet?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 66
                    },
                    {
                        "title": "HashMap",
                        "slug": "hashmap",
                        "description": "Learn the fundamentals of HashMap.",
                        "content": "{\"concept\": \"This lesson covers HashMap.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for HashMap\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of HashMap?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 67
                    },
                    {
                        "title": "List vs Set vs Map",
                        "slug": "list-vs-set-vs-map",
                        "description": "Learn the fundamentals of List vs Set vs Map.",
                        "content": "{\"concept\": \"This lesson covers List vs Set vs Map.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for List vs Set vs Map\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of List vs Set vs Map?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 68
                    },
                    {
                        "title": "Choosing the Correct Collection",
                        "slug": "choosing-the-correct-collection",
                        "description": "Learn the fundamentals of Choosing the Correct Collection.",
                        "content": "{\"concept\": \"This lesson covers Choosing the Correct Collection.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Choosing the Correct Collection\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Choosing the Correct Collection?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 69
                    }
                ]
            },
            {
                "title": "MEMORY, REFERENCES & ERRORS",
                "slug": "memory,-references-errors",
                "description": "Learn about memory, references & errors",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 9,
                "topics": [
                    {
                        "title": "Stack vs Heap",
                        "slug": "stack-vs-heap",
                        "description": "Learn the fundamentals of Stack vs Heap.",
                        "content": "{\"concept\": \"This lesson covers Stack vs Heap.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Stack vs Heap\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Stack vs Heap?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 70
                    },
                    {
                        "title": "References",
                        "slug": "references",
                        "description": "Learn the fundamentals of References.",
                        "content": "{\"concept\": \"This lesson covers References.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for References\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of References?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 71
                    },
                    {
                        "title": "null",
                        "slug": "null",
                        "description": "Learn the fundamentals of null.",
                        "content": "{\"concept\": \"This lesson covers null.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for null\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of null?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 72
                    },
                    {
                        "title": "Mutable vs Immutable",
                        "slug": "mutable-vs-immutable",
                        "description": "Learn the fundamentals of Mutable vs Immutable.",
                        "content": "{\"concept\": \"This lesson covers Mutable vs Immutable.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Mutable vs Immutable\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Mutable vs Immutable?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 73
                    },
                    {
                        "title": "Reference Aliasing",
                        "slug": "reference-aliasing",
                        "description": "Learn the fundamentals of Reference Aliasing.",
                        "content": "{\"concept\": \"This lesson covers Reference Aliasing.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Reference Aliasing\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Reference Aliasing?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 74
                    },
                    {
                        "title": "Syntax Errors",
                        "slug": "syntax-errors",
                        "description": "Learn the fundamentals of Syntax Errors.",
                        "content": "{\"concept\": \"This lesson covers Syntax Errors.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Syntax Errors\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Syntax Errors?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 75
                    },
                    {
                        "title": "Runtime Errors",
                        "slug": "runtime-errors",
                        "description": "Learn the fundamentals of Runtime Errors.",
                        "content": "{\"concept\": \"This lesson covers Runtime Errors.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Runtime Errors\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Runtime Errors?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 76
                    },
                    {
                        "title": "Logical Errors",
                        "slug": "logical-errors",
                        "description": "Learn the fundamentals of Logical Errors.",
                        "content": "{\"concept\": \"This lesson covers Logical Errors.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Logical Errors\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Logical Errors?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 77
                    },
                    {
                        "title": "Exceptions",
                        "slug": "exceptions",
                        "description": "Learn the fundamentals of Exceptions.",
                        "content": "{\"concept\": \"This lesson covers Exceptions.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Exceptions\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Exceptions?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 78
                    },
                    {
                        "title": "try-catch",
                        "slug": "try-catch",
                        "description": "Learn the fundamentals of try-catch.",
                        "content": "{\"concept\": \"This lesson covers try-catch.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for try-catch\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of try-catch?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 79
                    },
                    {
                        "title": "finally",
                        "slug": "finally",
                        "description": "Learn the fundamentals of finally.",
                        "content": "{\"concept\": \"This lesson covers finally.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for finally\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of finally?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 80
                    },
                    {
                        "title": "throw / throws",
                        "slug": "throw-/-throws",
                        "description": "Learn the fundamentals of throw / throws.",
                        "content": "{\"concept\": \"This lesson covers throw / throws.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for throw / throws\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of throw / throws?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 81
                    },
                    {
                        "title": "Debugging",
                        "slug": "debugging",
                        "description": "Learn the fundamentals of Debugging.",
                        "content": "{\"concept\": \"This lesson covers Debugging.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Debugging\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Debugging?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 82
                    }
                ]
            },
            {
                "title": "PROBLEM SOLVING",
                "slug": "problem-solving",
                "description": "Learn about problem solving",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 10,
                "topics": [
                    {
                        "title": "Problem Decomposition",
                        "slug": "problem-decomposition",
                        "description": "Learn the fundamentals of Problem Decomposition.",
                        "content": "{\"concept\": \"This lesson covers Problem Decomposition.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Problem Decomposition\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Problem Decomposition?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 83
                    },
                    {
                        "title": "Input \u00e2\u2020\u2019 Process \u00e2\u2020\u2019 Output",
                        "slug": "input-\u00e2\u2020\u2019-process-\u00e2\u2020\u2019-output",
                        "description": "Learn the fundamentals of Input \u00e2\u2020\u2019 Process \u00e2\u2020\u2019 Output.",
                        "content": "{\"concept\": \"This lesson covers Input \\u00e2\\u2020\\u2019 Process \\u00e2\\u2020\\u2019 Output.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Input \\u00e2\\u2020\\u2019 Process \\u00e2\\u2020\\u2019 Output\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Input \\u00e2\\u2020\\u2019 Process \\u00e2\\u2020\\u2019 Output?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 84
                    },
                    {
                        "title": "Dry Runs",
                        "slug": "dry-runs",
                        "description": "Learn the fundamentals of Dry Runs.",
                        "content": "{\"concept\": \"This lesson covers Dry Runs.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Dry Runs\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Dry Runs?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 85
                    },
                    {
                        "title": "Tracing Variables",
                        "slug": "tracing-variables",
                        "description": "Learn the fundamentals of Tracing Variables.",
                        "content": "{\"concept\": \"This lesson covers Tracing Variables.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Tracing Variables\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Tracing Variables?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 86
                    },
                    {
                        "title": "Pseudocode",
                        "slug": "pseudocode",
                        "description": "Learn the fundamentals of Pseudocode.",
                        "content": "{\"concept\": \"This lesson covers Pseudocode.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Pseudocode\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Pseudocode?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 87
                    },
                    {
                        "title": "Edge Cases",
                        "slug": "edge-cases",
                        "description": "Learn the fundamentals of Edge Cases.",
                        "content": "{\"concept\": \"This lesson covers Edge Cases.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Edge Cases\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Edge Cases?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 88
                    },
                    {
                        "title": "Brute Force Thinking",
                        "slug": "brute-force-thinking",
                        "description": "Learn the fundamentals of Brute Force Thinking.",
                        "content": "{\"concept\": \"This lesson covers Brute Force Thinking.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Brute Force Thinking\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Brute Force Thinking?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 89
                    },
                    {
                        "title": "Optimization Thinking",
                        "slug": "optimization-thinking",
                        "description": "Learn the fundamentals of Optimization Thinking.",
                        "content": "{\"concept\": \"This lesson covers Optimization Thinking.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Optimization Thinking\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Optimization Thinking?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 90
                    },
                    {
                        "title": "Time Complexity",
                        "slug": "time-complexity",
                        "description": "Learn the fundamentals of Time Complexity.",
                        "content": "{\"concept\": \"This lesson covers Time Complexity.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Time Complexity\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Time Complexity?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 91
                    },
                    {
                        "title": "Space Complexity",
                        "slug": "space-complexity",
                        "description": "Learn the fundamentals of Space Complexity.",
                        "content": "{\"concept\": \"This lesson covers Space Complexity.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Space Complexity\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Space Complexity?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 92
                    },
                    {
                        "title": "Big-O Basics",
                        "slug": "big-o-basics",
                        "description": "Learn the fundamentals of Big-O Basics.",
                        "content": "{\"concept\": \"This lesson covers Big-O Basics.\", \"whyItMatters\": \"Understanding this is crucial for building a strong foundation in Java.\", \"howItWorks\": \"This is a basic placeholder for how it works.\", \"javaExample\": \"public class Main {\\n    public static void main(String[] args) {\\n        // Example for Big-O Basics\\n    }\\n}\", \"lineByLine\": [\"public class Main { // Defines the class\"], \"commonMistakes\": [\"Syntax errors\", \"Logical errors\"], \"quickCheck\": {\"question\": \"What is the main purpose of Big-O Basics?\", \"options\": [\"A core concept\", \"A syntax error\", \"A runtime feature\", \"None of the above\"], \"answer\": 0, \"explanation\": \"It is a core concept of programming.\"}, \"practice\": \"Try writing your own example.\"}",
                        "estimated_minutes": 15,
                        "display_order": 93
                    }
                ]
            }
        ]
    },
    {
        "name": "Object-Oriented Programming (OOP)",
        "slug": "oop",
        "description": "Deep dive into OOP pillars, SOLID design principles, and clean architecture patterns.",
        "icon": "Box",
        "category": "Architecture",
        "display_order": 2,
        "modules": [
            {
                "title": "OOP Core Concepts",
                "slug": "oop-core",
                "description": "Encapsulation, inheritance, polymorphism, and abstraction.",
                "difficulty": "Intermediate",
                "estimated_minutes": 120,
                "display_order": 1,
                "topics": [
                    {
                        "title": "Classes & Objects",
                        "slug": "classes-objects",
                        "description": "Defining and instantiating objects.",
                        "content": "{\"overview\": \"Java is an OOP language.\", \"concepts\": [\"Class definition\", \"Object instantiation\"], \"code\": \"Car myCar = new Car();\"}",
                        "estimated_minutes": 30,
                        "display_order": 1
                    },
                    {
                        "title": "Inheritance & Polymorphism",
                        "slug": "inheritance-polymorphism",
                        "description": "Extending classes and overriding methods.",
                        "content": "{\"overview\": \"Reusing code through inheritance.\", \"concepts\": [\"extends keyword\", \"Method overriding\"], \"code\": \"class Dog extends Animal {}\"}",
                        "estimated_minutes": 45,
                        "display_order": 2
                    }
                ]
            }
        ]
    },
    {
        "name": "SQL & Relational Foundations",
        "slug": "sql",
        "description": "Construct efficient queries, relational algebra, and schema design.",
        "icon": "Database",
        "category": "Persistence",
        "display_order": 3,
        "modules": [
            {
                "title": "SQL Fundamentals",
                "slug": "sql-fundamentals",
                "description": "Basic queries and data retrieval.",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 1,
                "topics": [
                    {
                        "title": "SELECT, WHERE, ORDER BY",
                        "slug": "select-where",
                        "description": "Retrieving and filtering data.",
                        "content": "{\"overview\": \"Basic SQL retrieval.\", \"concepts\": [\"SELECT\", \"WHERE clause\"], \"code\": \"SELECT * FROM users;\"}",
                        "estimated_minutes": 20,
                        "display_order": 1
                    }
                ]
            }
        ]
    },
    {
        "name": "Data Structures & Algorithms (DSA)",
        "slug": "dsa",
        "description": "Master arrays, linked lists, trees, and graphs for technical interviews.",
        "icon": "Code2",
        "category": "Core CS",
        "display_order": 4,
        "modules": [
            {
                "title": "Arrays & Strings",
                "slug": "arrays-strings",
                "description": "Fundamentals of array manipulation and string algorithms.",
                "difficulty": "Intermediate",
                "estimated_minutes": 120,
                "display_order": 1,
                "topics": [
                    {
                        "title": "Two Pointers Technique",
                        "slug": "two-pointers",
                        "description": "Solving array problems with two pointers.",
                        "content": "{\"overview\": \"A technique to optimize array problems.\", \"concepts\": [\"Opposite directional\", \"Same directional\"], \"code\": \"while(left < right) {}\"}",
                        "estimated_minutes": 30,
                        "display_order": 1
                    },
                    {
                        "title": "Sliding Window",
                        "slug": "sliding-window",
                        "description": "Finding subarrays optimizing certain constraints.",
                        "content": "{\"overview\": \"A technique for subarray problems.\", \"concepts\": [\"Fixed window\", \"Variable window\"], \"code\": \"for(int right=0; right<n; right++) {}\"}",
                        "estimated_minutes": 40,
                        "display_order": 2
                    }
                ]
            }
        ]
    },
    {
        "name": "Database Management Systems (DBMS)",
        "slug": "dbms",
        "description": "Learn transactional safety, write-ahead logging (WAL), distributed concurrency protocols, and indexing algorithms.",
        "icon": "Database",
        "category": "Backend Internals",
        "display_order": 5,
        "modules": [
            {
                "title": "Transactions & Indexing",
                "slug": "transactions-indexing",
                "description": "ACID properties, B+ trees, and transaction isolation.",
                "difficulty": "Intermediate",
                "estimated_minutes": 90,
                "display_order": 1,
                "topics": [
                    {
                        "title": "ACID Properties & Isolation",
                        "slug": "acid-isolation",
                        "description": "Understanding database transactions.",
                        "content": "{\"overview\": \"ACID guarantees data validity.\", \"concepts\": [\"Atomicity\", \"Consistency\", \"Isolation\", \"Durability\"], \"code\": \"\"}",
                        "estimated_minutes": 30,
                        "display_order": 1
                    }
                ]
            }
        ]
    },
    {
        "name": "Operating Systems & Concurrency",
        "slug": "operating-systems",
        "description": "Understand CPU scheduling, process virtualization, multi-threading synchronization primitives, and virtual memory.",
        "icon": "Server",
        "category": "Systems Core",
        "display_order": 6,
        "modules": [
            {
                "title": "Processes & Memory",
                "slug": "processes-memory",
                "description": "Processes, threads, scheduling, and paging.",
                "difficulty": "Intermediate",
                "estimated_minutes": 90,
                "display_order": 1,
                "topics": [
                    {
                        "title": "Processes vs Threads",
                        "slug": "processes-threads",
                        "description": "Understanding execution units.",
                        "content": "{\"overview\": \"OS concepts for concurrency.\", \"concepts\": [\"Process control block\", \"Thread state\"], \"code\": \"\"}",
                        "estimated_minutes": 30,
                        "display_order": 1
                    }
                ]
            }
        ]
    },
    {
        "name": "Computer Networks & Protocols",
        "slug": "computer-networks",
        "description": "Master the OSI and TCP/IP stacks, TLS 1.3 handshake mechanics, DNS resolution, and TCP flow control.",
        "icon": "Network",
        "category": "Infrastructure",
        "display_order": 7,
        "modules": [
            {
                "title": "Network Protocols",
                "slug": "network-protocols",
                "description": "TCP/IP, HTTP, TLS, and DNS protocols.",
                "difficulty": "Intermediate",
                "estimated_minutes": 90,
                "display_order": 1,
                "topics": [
                    {
                        "title": "TCP 3-Way Handshake",
                        "slug": "tcp-handshake",
                        "description": "Establishing reliable connections.",
                        "content": "{\"overview\": \"TCP uses SYN, SYN-ACK, ACK to negotiate connections.\", \"concepts\": [\"SYN\", \"ACK\", \"Sequence Numbers\"], \"code\": \"\"}",
                        "estimated_minutes": 25,
                        "display_order": 1
                    }
                ]
            }
        ]
    },
    {
        "name": "Quantitative Aptitude",
        "slug": "aptitude",
        "description": "Improve problem-solving speed for preliminary screening rounds.",
        "icon": "Calculator",
        "category": "Aptitude",
        "display_order": 8,
        "modules": [
            {
                "title": "Number Systems",
                "slug": "number-systems",
                "description": "LCM, HCF, remainders.",
                "difficulty": "Beginner",
                "estimated_minutes": 60,
                "display_order": 1,
                "topics": [
                    {
                        "title": "LCM and HCF",
                        "slug": "lcm-hcf",
                        "description": "Finding least common multiples.",
                        "content": "{\"overview\": \"Math fundamentals.\", \"concepts\": [\"LCM\", \"HCF\"], \"code\": \"\"}",
                        "estimated_minutes": 20,
                        "display_order": 1
                    }
                ]
            }
        ]
    }
]

async def seed_curriculum():
    async with AsyncSessionLocal() as session:
        print("Starting curriculum seed...")
        
        # Check if already seeded to prevent duplication
        res = await session.execute(select(LearningSubject).limit(1))
        if res.scalars().first():
            print("Curriculum already exists. Clearing old data...")
            # We can delete all or skip. For testing, we'll clear and recreate.
            subjects_res = await session.execute(select(LearningSubject))
            for s in subjects_res.scalars().all():
                await session.delete(s)
            await session.commit()
            print("Old data cleared.")

        # Insert subjects, modules, topics
        for s_data in CURRICULUM:
            subject = LearningSubject(
                id=str(uuid.uuid4()),
                name=s_data["name"],
                slug=s_data["slug"],
                description=s_data["description"],
                icon=s_data["icon"],
                category=s_data["category"],
                display_order=s_data["display_order"]
            )
            session.add(subject)
            
            for m_data in s_data["modules"]:
                module = LearningModule(
                    id=str(uuid.uuid4()),
                    subject_id=subject.id,
                    title=m_data["title"],
                    slug=m_data["slug"],
                    description=m_data["description"],
                    difficulty=m_data["difficulty"],
                    estimated_minutes=m_data["estimated_minutes"],
                    display_order=m_data["display_order"]
                )
                session.add(module)
                
                for t_data in m_data["topics"]:
                    topic = LearningTopic(
                        id=str(uuid.uuid4()),
                        module_id=module.id,
                        title=t_data["title"],
                        slug=t_data["slug"],
                        description=t_data["description"],
                        content=t_data["content"],
                        estimated_minutes=t_data["estimated_minutes"],
                        display_order=t_data["display_order"]
                    )
                    session.add(topic)
                    
        try:
            await session.commit()
            print("Curriculum seeded successfully!")
        except Exception as e:
            await session.rollback()
            print(f"Failed to seed curriculum: {e}")

if __name__ == "__main__":
    asyncio.run(seed_curriculum())
