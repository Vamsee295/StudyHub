// OS Modules 1-3: Introduction, Processes, Threads
import { CourseLesson } from './types';

export const osIntroductionLessons: CourseLesson[] = [
  {
    id: "what-is-an-os",
    slug: "what-is-an-os",
    title: "What an Operating System Does",
    description: "The OS as resource manager and abstraction layer, the kernel, and user mode vs kernel mode.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "An operating system is the software layer between applications and hardware. It has two jobs:\n\n1. Resource manager: share the CPU, memory, disk and devices fairly and safely among many programs.\n2. Abstraction provider: give programs simple interfaces (files, processes, sockets) instead of raw disk sectors, CPU registers and network cards.\n\nThe kernel is the core of the OS that is always in memory and runs with full hardware privileges. Shells, desktop environments and system utilities sit on top of it."
        },
        {
          type: "list",
          title: "Core OS Responsibilities",
          items: [
            "**Process management**: create, schedule and terminate programs.",
            "**Memory management**: give each process its own address space and protect them from each other.",
            "**File system**: organize persistent data into files and directories.",
            "**Device / I/O management**: drivers, buffering, interrupts.",
            "**Protection and security**: users, permissions, isolation.",
            "**Networking**: sockets and protocol stacks."
          ]
        },
        {
          type: "text",
          title: "Dual-Mode Operation",
          content: "The CPU has a mode bit.\n\nKernel mode (mode bit 0): any instruction may run, including privileged ones (I/O, changing page tables, disabling interrupts).\nUser mode (mode bit 1): privileged instructions are blocked. Trying to run one causes a trap into the OS.\n\nApplications run in user mode. The only ways into kernel mode are system calls, interrupts and exceptions. This stops a buggy or malicious program from taking over the machine."
        },
        {
          type: "table",
          title: "Interrupt vs Trap",
          headers: ["", "Interrupt (hardware)", "Trap / exception (software)"],
          rows: [
            ["Caused by", "A device: timer, keyboard, disk finished, network packet", "The running instruction: a system call, divide by zero, invalid memory access"],
            ["Timing", "Asynchronous: can arrive at any moment", "Synchronous: caused by the current instruction"],
            ["Example", "The timer interrupt that lets the OS preempt a process", "`read()` system call, segmentation fault"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which of these must run in kernel mode?",
          options: ["Adding two numbers", "Calling a function in your own program", "Changing the page table base register", "Reading a local variable"],
          answer: 2,
          explanation: "Changing memory-mapping hardware is privileged. If user programs could do it, they could read any other process's memory."
        },
        {
          type: "takeaways",
          items: [
            "The OS manages resources and provides abstractions; the kernel is its privileged core.",
            "User mode vs kernel mode protects the system; system calls, interrupts and exceptions are the only ways into the kernel.",
            "Interrupts are asynchronous (from devices); traps are synchronous (from instructions)."
          ]
        }
      ]
    }
  },
  {
    id: "types-of-operating-systems",
    slug: "types-of-operating-systems",
    title: "Types of Operating Systems",
    description: "Batch, multiprogramming, multitasking, multiprocessing, real-time and distributed systems compared.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "OS Types",
          headers: ["Type", "Idea", "Goal", "Example"],
          rows: [
            ["Batch", "Jobs collected and run one after another with no interaction", "Throughput", "Early mainframes, payroll runs"],
            ["Multiprogramming", "Several jobs in memory; when one waits for I/O, the CPU switches to another", "CPU utilization", "Classic mainframe OSs"],
            ["Multitasking / time-sharing", "Multiprogramming plus fast switching with time slices, so every user feels the system responding", "Response time", "Linux, Windows, macOS"],
            ["Multiprocessing", "Two or more CPUs/cores share memory and run processes in parallel", "Throughput, reliability", "Any modern multicore OS"],
            ["Real-time (RTOS)", "Tasks must finish within strict deadlines", "Predictability", "Airbag controllers, pacemakers (FreeRTOS, VxWorks)"],
            ["Distributed", "Many networked machines appear as one system", "Scalability, fault tolerance", "Cluster OSs, distributed file systems"],
            ["Embedded / mobile", "Resource-constrained, power-aware", "Efficiency, battery life", "Android, firmware"]
          ]
        },
        {
          type: "text",
          title: "Hard vs Soft Real-Time",
          content: "Hard real-time: missing a deadline is a system failure (anti-lock brakes, flight control).\nSoft real-time: missing a deadline reduces quality but is tolerated (video streaming dropping a frame, online games)."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What's the difference between multiprogramming and multitasking?",
              trap: "Saying they are the same thing.",
              solution: "Multiprogramming switches jobs only when the running one blocks (for I/O), to keep the CPU busy. Multitasking adds timer-based preemption (time slices), so even CPU-bound programs take turns and interactive users get fast responses."
            },
            {
              question: "Is multiprocessing the same as multithreading?",
              trap: "Using the terms interchangeably.",
              solution: "Multiprocessing is about hardware: several CPUs. Multithreading is about software: several threads within one process. Threads can run in parallel only when there are multiple CPUs."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "A car's airbag controller must react within 10 ms every time. It needs a:",
          options: ["Batch OS", "Time-sharing OS", "Hard real-time OS", "Distributed OS"],
          answer: 2,
          explanation: "Missing the deadline is a catastrophic failure, which is the definition of hard real-time."
        },
        {
          type: "takeaways",
          items: [
            "Multiprogramming maximizes CPU use; multitasking adds time slices for responsiveness.",
            "Hard real-time: deadlines must never be missed; soft real-time: occasional misses are tolerable."
          ]
        }
      ]
    }
  },
  {
    id: "system-calls",
    slug: "system-calls",
    title: "System Calls",
    description: "How programs request OS services, the categories of system calls, and what happens during one.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A system call is the programmatic way a user program asks the kernel for a service it can't perform itself: reading a file, creating a process, sending network data.\n\nProgrammers usually call a library wrapper (printf → write, fopen → open, in the C standard library) rather than the raw system call."
        },
        {
          type: "code",
          title: "What Happens During read()",
          language: "text",
          code: "1. Program calls read(fd, buf, n)        (user mode, library wrapper)\n2. Wrapper puts the system-call number + arguments in registers\n3. Executes a trap instruction (syscall / int 0x80)\n4. CPU switches to kernel mode and jumps to the system-call handler\n5. Kernel validates the arguments, performs the I/O (may block the process)\n6. Return value placed in a register\n7. Return-from-trap: back to user mode, execution continues after the call",
          explanation: "Each system call costs a mode switch, which is why programs buffer I/O instead of calling write() for every single byte."
        },
        {
          type: "table",
          title: "Categories of System Calls",
          headers: ["Category", "Linux / UNIX examples", "Windows examples"],
          rows: [
            ["Process control", "`fork()`, `exec()`, `exit()`, `wait()`", "`CreateProcess()`, `ExitProcess()`"],
            ["File management", "`open()`, `read()`, `write()`, `close()`", "`CreateFile()`, `ReadFile()`"],
            ["Device management", "`ioctl()`, `read()`, `write()`", "`DeviceIoControl()`"],
            ["Information maintenance", "`getpid()`, `time()`", "`GetCurrentProcessId()`"],
            ["Communication", "`pipe()`, `shmget()`, `socket()`", "`CreatePipe()`"],
            ["Protection", "`chmod()`, `chown()`", "`SetFileSecurity()`"]
          ]
        },
        {
          type: "think",
          question: "Why can't a program simply call a kernel function directly like a normal function?",
          answerReveal: "Kernel code and data live in protected memory that user mode can't access, and kernel functions need privileged instructions. The trap instruction is the controlled gate: the CPU switches mode and jumps only to kernel-defined entry points, so a program can't jump into the middle of kernel code."
        },
        {
          type: "quickCheck",
          question: "Which is NOT a system call?",
          options: ["fork()", "open()", "printf()", "exit()"],
          answer: 2,
          explanation: "printf() is a C library function. It formats text in user space and then calls the write() system call."
        },
        {
          type: "takeaways",
          items: [
            "System calls are the API between user programs and the kernel, entered through a trap.",
            "Six categories: process, file, device, information, communication, protection.",
            "Library functions such as printf wrap system calls such as write."
          ]
        }
      ]
    }
  },
  {
    id: "kernel-architectures",
    slug: "kernel-architectures",
    title: "Kernel Architectures: Monolithic, Microkernel, Hybrid",
    description: "How OS components are organized, and the trade-off between speed and isolation.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "Kernel Designs",
          headers: ["Design", "Structure", "Pros", "Cons", "Examples"],
          rows: [
            ["Monolithic", "All OS services (scheduler, memory, file systems, drivers) in one big kernel address space", "Fast: services call each other directly", "A driver bug can crash the whole system; large and harder to maintain", "Linux, traditional UNIX"],
            ["Microkernel", "Kernel keeps only IPC, basic scheduling and memory; file systems and drivers run as user-space servers", "Isolation, reliability, easy to extend", "Slower: services talk through message passing", "MINIX 3, QNX, seL4"],
            ["Hybrid", "Microkernel-like structure, but many services kept in kernel space for speed", "A balance of the two", "Complexity", "Windows NT, macOS (XNU)"],
            ["Layered", "Strict layers; each uses only the layer below", "Easy to verify and debug", "Hard to define the layers; overhead", "THE OS (academic)"]
          ]
        },
        {
          type: "text",
          title: "Loadable Kernel Modules",
          content: "Linux is monolithic but modular: drivers and file systems can be loaded and unloaded at run time (lsmod, modprobe). That gives much of the flexibility of a microkernel without the message-passing cost, but modules still run in kernel space, so a buggy module can still crash the system."
        },
        {
          type: "quickCheck",
          question: "In which design does a crashing device driver least likely take down the whole OS?",
          options: ["Monolithic", "Microkernel", "Layered", "Batch"],
          answer: 1,
          explanation: "In a microkernel, drivers run as separate user-space processes, so a crash is contained and the driver can be restarted."
        },
        {
          type: "takeaways",
          items: [
            "Monolithic = fast but less isolated; microkernel = isolated but slower; hybrid = a compromise.",
            "Linux is monolithic with loadable modules; Windows and macOS are hybrids."
          ]
        }
      ]
    }
  }
];

export const processLessons: CourseLesson[] = [
  {
    id: "process-and-pcb",
    slug: "process-and-pcb",
    title: "Process, Memory Layout and the PCB",
    description: "Program vs process, the four sections of a process's memory, and what the Process Control Block stores.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Program vs Process",
          content: "A program is a passive file on disk (an executable). A process is a program in execution: code plus its current activity (program counter, registers, open files, memory).\n\nOne program can be running as many processes at once. Three open Chrome windows can mean three separate processes running the same code."
        },
        {
          type: "code",
          title: "Process Memory Layout",
          language: "text",
          code: "High address  +------------------+\n              |      Stack       |  local variables, function frames (grows down)\n              |        |         |\n              |        v         |\n              |                  |\n              |        ^         |\n              |        |         |\n              |       Heap       |  malloc / new (grows up)\n              +------------------+\n              |  Data (globals)  |  initialized + uninitialized (BSS) globals/statics\n              +------------------+\n Low address  |   Text (code)    |  machine instructions, read-only\n              +------------------+",
          explanation: "Infinite recursion overflows the stack. Memory leaks grow the heap."
        },
        {
          type: "table",
          title: "Process Control Block (PCB)",
          headers: ["Field", "Purpose"],
          rows: [
            ["Process ID (PID), parent PID", "Identity"],
            ["Process state", "New, ready, running, waiting, terminated"],
            ["Program counter", "Address of the next instruction"],
            ["CPU registers", "Saved during a context switch"],
            ["Scheduling info", "Priority, queue pointers, CPU time used"],
            ["Memory-management info", "Page table base, segment limits"],
            ["Accounting info", "CPU time, limits"],
            ["I/O status", "Open file table, allocated devices"]
          ]
        },
        {
          type: "quickCheck",
          question: "Where is a variable declared inside a function (not static) stored?",
          options: ["Text segment", "Data segment", "Heap", "Stack"],
          answer: 3,
          explanation: "Local (automatic) variables live in the function's stack frame and disappear when the function returns."
        },
        {
          type: "takeaways",
          items: [
            "A process is a running program: code + data + stack + heap + its CPU state.",
            "The PCB is the kernel's record of a process; context switches save to and restore from it."
          ]
        }
      ]
    }
  },
  {
    id: "process-states-and-schedulers",
    slug: "process-states-and-schedulers",
    title: "Process States, Queues and Schedulers",
    description: "The five-state model, suspended states, and long-, short- and medium-term schedulers.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Five-State Model",
          language: "text",
          code: "  New --admitted--> Ready --dispatch--> Running --exit--> Terminated\n                     ^  ^                |   |\n                     |  +---interrupt----+   |\n                     |   (time slice over)   |\n                     |                       | I/O or event wait\n                     +--I/O done-- Waiting <-+",
          explanation: "Only Running → Waiting is caused by the process itself (it asks for I/O). Waiting → Running is never a direct transition: the process goes back to Ready first."
        },
        {
          type: "table",
          title: "The Three Schedulers",
          headers: ["Scheduler", "Decides", "Runs", "Controls"],
          rows: [
            ["Long-term (job scheduler)", "Which new jobs are admitted into memory (New → Ready)", "Rarely", "Degree of multiprogramming, and the mix of CPU- and I/O-bound jobs"],
            ["Short-term (CPU scheduler)", "Which ready process runs next (Ready → Running)", "Very often (milliseconds)", "CPU allocation"],
            ["Medium-term (swapper)", "Which processes to swap out to disk and back in", "Occasionally", "Memory pressure (suspended states)"]
          ]
        },
        {
          type: "text",
          title: "Suspended States",
          content: "When memory is tight, the medium-term scheduler swaps a process out to disk:\nReady → Ready-Suspended, and Waiting → Waiting-Suspended.\nWhen it is swapped back in, it returns to Ready or Waiting. This gives the seven-state model."
        },
        {
          type: "text",
          title: "CPU-Bound vs I/O-Bound",
          content: "A CPU-bound process (video encoding) does long computations and has long CPU bursts. An I/O-bound process (text editor, web server) does short CPU bursts between waiting for I/O. A good long-term scheduler admits a mix of both, so neither the CPU nor the devices sit idle."
        },
        {
          type: "quickCheck",
          question: "Which transition is NOT possible in the five-state model?",
          options: ["Running → Ready", "Waiting → Ready", "Waiting → Running", "Ready → Running"],
          answer: 2,
          explanation: "A waiting process whose I/O finishes moves to Ready and must wait to be dispatched again."
        },
        {
          type: "takeaways",
          items: [
            "States: new, ready, running, waiting, terminated (+ two suspended states).",
            "Long-term: admission; short-term: CPU dispatch; medium-term: swapping."
          ]
        }
      ]
    }
  },
  {
    id: "context-switching",
    slug: "context-switching",
    title: "Context Switching",
    description: "What is saved and restored when the CPU switches processes, and why switches are expensive.",
    estimatedMinutes: 12,
    content: {
      sections: [
        {
          type: "text",
          title: "What Happens",
          content: "A context switch is the CPU moving from one process (or thread) to another:\n1. A timer interrupt, system call or I/O wait enters the kernel.\n2. The kernel saves the current process's registers, program counter and stack pointer into its PCB.\n3. The scheduler picks the next process.\n4. The kernel loads that process's saved state from its PCB and switches the memory mapping (page-table base register).\n5. Execution resumes where that process left off."
        },
        {
          type: "list",
          title: "Why Switches Are Costly",
          items: [
            "**Pure overhead**: no user work happens during the switch (typically microseconds).",
            "**Cache and TLB pollution**: the new process's data isn't cached; switching address spaces often flushes the TLB.",
            "**Thread switches are cheaper** than process switches within the same process, because the address space stays the same."
          ]
        },
        {
          type: "think",
          question: "If a context switch takes 1 ms and the Round Robin time quantum is 4 ms, what fraction of CPU time is wasted on switching?",
          answerReveal: "Each cycle is 4 ms of work plus 1 ms of switching, so 1/5 = 20% is overhead. That's why quanta are much larger than switch times (typically 10-100 ms against microsecond switches)."
        },
        {
          type: "quickCheck",
          question: "Where is a process's state saved during a context switch?",
          options: ["In the TLB", "In its Process Control Block", "On the disk swap area", "In the ready queue"],
          answer: 1,
          explanation: "Registers, the program counter and other CPU state are saved in the PCB and restored from it later."
        },
        {
          type: "takeaways",
          items: [
            "A context switch saves state to one PCB and loads it from another.",
            "It is pure overhead, plus cache and TLB misses afterwards; thread switches are cheaper than process switches."
          ]
        }
      ]
    }
  },
  {
    id: "process-creation-fork",
    slug: "process-creation-fork",
    title: "Process Creation: fork(), exec(), wait(), Zombies and Orphans",
    description: "How UNIX creates processes, counting fork() outputs, and the zombie and orphan states.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "fork() Basics",
          language: "c",
          code: "#include <stdio.h>\n#include <unistd.h>\n#include <sys/wait.h>\n\nint main() {\n    pid_t pid = fork();          // one process calls it, two return from it\n    if (pid < 0) {\n        perror(\"fork failed\");\n    } else if (pid == 0) {\n        // child: fork() returned 0\n        execlp(\"ls\", \"ls\", \"-l\", NULL);   // replace child's image with ls\n    } else {\n        // parent: fork() returned the child's PID\n        wait(NULL);              // wait for the child to finish\n        printf(\"Child done\\n\");\n    }\n    return 0;\n}",
          explanation: "fork() duplicates the process (copy-on-write in practice). exec() replaces the current program with a new one. wait() collects the child's exit status."
        },
        {
          type: "dryRun",
          title: "Counting Processes",
          iterations: [
            { step: "fork(); fork(); fork(); printf(\"hi\");", variables: { "Processes": "2 × 2 × 2 = 8", "\"hi\" printed": "8 times" }, description: "Each fork doubles the number of processes that execute the following code." },
            { step: "for (i = 0; i < n; i++) fork();", variables: { "Total processes": "2^n", "Child processes created": "2^n − 1" }, description: "With n = 4: 16 processes in total, 15 of them new children." },
            { step: "if (fork() && fork()) fork();", variables: { "Total": "4 processes" }, description: "Short-circuit evaluation: the first child gets 0 from the first fork(), so && stops and it skips the rest. The parent calls the second fork(); that child also gets 0 and skips. Only the parent reaches the third fork(). Parent + 3 children = 4." }
          ]
        },
        {
          type: "table",
          title: "Zombie vs Orphan",
          headers: ["", "Zombie process", "Orphan process"],
          rows: [
            ["What", "Child has finished, but the parent hasn't called wait()", "Parent finished while the child is still running"],
            ["State", "Dead, but its PCB entry and exit status remain", "Still alive"],
            ["Handled by", "The parent calling wait(); if the parent dies, init/systemd reaps it", "Adopted by init (PID 1) or a subreaper, which reaps it later"],
            ["Problem", "Too many zombies use up process-table slots", "Usually harmless"]
          ]
        },
        {
          type: "quickCheck",
          question: "How many times is \"hello\" printed? fork(); fork(); printf(\"hello\");",
          options: ["2", "3", "4", "8"],
          answer: 2,
          explanation: "Two forks give 2^2 = 4 processes, and each one prints once."
        },
        {
          type: "takeaways",
          items: [
            "fork() returns 0 in the child and the child's PID in the parent.",
            "n sequential forks → 2^n processes (2^n − 1 children).",
            "Zombie = finished but not reaped; orphan = parent died first and init adopts it."
          ]
        }
      ]
    }
  },
  {
    id: "inter-process-communication",
    slug: "inter-process-communication",
    title: "Inter-Process Communication (IPC)",
    description: "Shared memory vs message passing, pipes, message queues, sockets and signals.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Why IPC?",
          content: "Processes have separate address spaces, so they can't read each other's variables. IPC mechanisms let cooperating processes exchange data and coordinate (for example, a shell piping ls into grep, or a browser's tab processes talking to its main process)."
        },
        {
          type: "table",
          title: "The Two Models",
          headers: ["", "Shared memory", "Message passing"],
          rows: [
            ["How", "A memory region is mapped into both processes", "The kernel copies messages between processes (send / receive)"],
            ["Speed", "Fastest: no kernel involvement after setup", "Slower: a system call and a copy per message"],
            ["Synchronization", "The programmer must add it (semaphores, mutexes)", "Built in"],
            ["Best for", "Large data, the same machine", "Small messages, distributed systems"]
          ]
        },
        {
          type: "table",
          title: "IPC Mechanisms",
          headers: ["Mechanism", "Notes"],
          rows: [
            ["Pipe (anonymous)", "One-way byte stream between related processes, e.g. `ls | grep txt`"],
            ["Named pipe (FIFO)", "Has a name in the file system; unrelated processes can use it"],
            ["Message queue", "Kernel-managed queue of typed messages"],
            ["Shared memory", "`shmget` / `mmap`; needs explicit synchronization"],
            ["Socket", "Works within one machine or over a network; the basis of client-server apps"],
            ["Signal", "Asynchronous notification with no data, e.g. SIGKILL, SIGINT (Ctrl+C)"]
          ]
        },
        {
          type: "quickCheck",
          question: "Two processes on the same machine must exchange large video frames as fast as possible. Best choice?",
          options: ["Signals", "Shared memory", "Message queue", "Named pipe"],
          answer: 1,
          explanation: "Shared memory avoids copying data through the kernel. Add a semaphore or mutex to coordinate access."
        },
        {
          type: "takeaways",
          items: [
            "Shared memory is fastest but needs synchronization; message passing is simpler and safer.",
            "Pipes are one-way; sockets work across a network; signals carry no data."
          ]
        }
      ]
    }
  }
];

export const threadLessons: CourseLesson[] = [
  {
    id: "threads-vs-processes",
    slug: "threads-vs-processes",
    title: "Threads vs Processes",
    description: "What a thread shares with its process, what it owns, and why threads are lighter.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A thread is the smallest unit of execution that can be scheduled on a CPU. A process can contain many threads, all running inside the same address space.\n\nExample: a word processor might use one thread for typing, one for spell-check and one for auto-save, all working on the same document in memory."
        },
        {
          type: "table",
          title: "Shared vs Private",
          headers: ["Shared by all threads of a process", "Private to each thread"],
          rows: [
            ["Code (text) section", "Thread ID"],
            ["Data section (globals)", "Program counter"],
            ["Heap", "Register set"],
            ["Open files, signal handlers", "Stack"]
          ]
        },
        {
          type: "table",
          title: "Process vs Thread",
          headers: ["", "Process", "Thread"],
          rows: [
            ["Creation cost", "High: new address space, page tables, PCB", "Low: just a stack and a thread control block (TCB)"],
            ["Context switch", "Expensive: address-space switch, TLB flush", "Cheap within the same process"],
            ["Communication", "Needs IPC", "Directly through shared memory"],
            ["Isolation", "One crash doesn't affect the others", "One thread's crash (e.g. a segfault) kills the whole process"]
          ]
        },
        {
          type: "warning",
          title: "The Price of Sharing",
          items: [
            "Threads share data, so they can race on it. Without synchronization, two threads incrementing a shared counter lose updates.",
            "Debugging multithreaded code is hard because bugs depend on timing and may not show up on every run."
          ]
        },
        {
          type: "quickCheck",
          question: "Which is NOT shared between threads of the same process?",
          options: ["Heap", "Global variables", "Open files", "Stack"],
          answer: 3,
          explanation: "Each thread has its own stack (and registers and program counter), so it can call functions independently."
        },
        {
          type: "takeaways",
          items: [
            "Threads share code, data, heap and files; each has its own stack, registers and program counter.",
            "Threads are cheaper to create and switch, but need synchronization and give weaker isolation."
          ]
        }
      ]
    }
  },
  {
    id: "user-vs-kernel-threads",
    slug: "user-vs-kernel-threads",
    title: "User-Level vs Kernel-Level Threads and Threading Models",
    description: "Who manages threads, the many-to-one / one-to-one / many-to-many models, and their trade-offs.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "User vs Kernel Threads",
          headers: ["", "User-level threads", "Kernel-level threads"],
          rows: [
            ["Managed by", "A thread library in user space", "The OS kernel"],
            ["Kernel knows about them?", "No: the kernel sees one process", "Yes"],
            ["Switching", "Very fast: no system call", "Slower: needs kernel mode"],
            ["One thread blocks on I/O", "The whole process blocks", "Only that thread blocks"],
            ["True parallelism on multicore", "No (with many-to-one)", "Yes"]
          ]
        },
        {
          type: "table",
          title: "Threading Models",
          headers: ["Model", "Mapping", "Pros / cons", "Used by"],
          rows: [
            ["Many-to-one", "Many user threads → 1 kernel thread", "Cheap, but one blocking call blocks everything and there's no parallelism", "Early Java green threads"],
            ["One-to-one", "Each user thread → its own kernel thread", "True parallelism; creating many threads is costly", "Linux pthreads, Windows, Java platform threads"],
            ["Many-to-many", "M user threads multiplexed over N kernel threads", "Flexible and scalable, but complex", "Go goroutines, Java virtual threads (conceptually)"]
          ]
        },
        {
          type: "code",
          title: "Creating Threads in Java",
          language: "java",
          code: "public class Demo {\n    public static void main(String[] args) throws InterruptedException {\n        Runnable task = () ->\n            System.out.println(\"Running in \" + Thread.currentThread().getName());\n\n        Thread t1 = new Thread(task, \"worker-1\");\n        Thread t2 = new Thread(task, \"worker-2\");\n        t1.start();   // start(), not run(): run() would execute in the main thread\n        t2.start();\n        t1.join();    // wait for both to finish\n        t2.join();\n    }\n}",
          explanation: "The two lines may print in either order. Thread scheduling is up to the OS."
        },
        {
          type: "quickCheck",
          question: "In the many-to-one model, one thread makes a blocking read() system call. What happens?",
          options: ["Only that thread blocks", "The entire process blocks", "The kernel creates a new thread", "The call fails"],
          answer: 1,
          explanation: "The kernel sees only one schedulable entity, so when it blocks, every user thread mapped onto it stops."
        },
        {
          type: "takeaways",
          items: [
            "User threads: fast but invisible to the kernel; kernel threads: real parallelism, higher cost.",
            "Linux and Windows use one-to-one; Go and virtual threads multiplex many onto few."
          ]
        }
      ]
    }
  },
  {
    id: "multithreading-benefits-and-issues",
    slug: "multithreading-benefits-and-issues",
    title: "Multithreading: Benefits, Concurrency vs Parallelism, Thread Pools",
    description: "Why programs use threads, Amdahl's law, and practical patterns such as thread pools.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "list",
          title: "Benefits of Multithreading",
          items: [
            "**Responsiveness**: the UI thread stays responsive while a background thread works.",
            "**Resource sharing**: threads share memory without IPC.",
            "**Economy**: creating and switching threads is cheaper than for processes.",
            "**Scalability**: work spreads across CPU cores."
          ]
        },
        {
          type: "text",
          title: "Concurrency vs Parallelism",
          content: "Concurrency: several tasks make progress over the same period. On one core they take turns (interleaving).\nParallelism: several tasks run at the same instant on different cores.\n\nConcurrency is about structure (dealing with many things); parallelism is about execution (doing many things at once). You can have concurrency without parallelism, but not the reverse."
        },
        {
          type: "text",
          title: "Amdahl's Law",
          content: "If a fraction S of a program is serial, the maximum speedup with N cores is:\nSpeedup ≤ 1 / (S + (1 − S) / N)\n\nExample: S = 0.25 (25% serial), N = 4 cores: 1 / (0.25 + 0.75/4) = 1 / 0.4375 ≈ 2.29×. Even with infinitely many cores, the limit is 1 / 0.25 = 4×. The serial part sets the ceiling."
        },
        {
          type: "text",
          title: "Thread Pools",
          content: "Creating a thread per request (for example, per web request) wastes time and can exhaust memory under load. A thread pool keeps a fixed set of worker threads that take tasks from a queue. Java's ExecutorService, web servers and database connection handling all use this pattern."
        },
        {
          type: "quickCheck",
          question: "A program is 40% serial. What is the maximum possible speedup with unlimited cores?",
          options: ["1.67×", "2.5×", "4×", "Unlimited"],
          answer: 1,
          explanation: "1 / S = 1 / 0.4 = 2.5×. The serial part can't be sped up."
        },
        {
          type: "takeaways",
          items: [
            "Concurrency = interleaved progress; parallelism = simultaneous execution.",
            "Amdahl's law: the serial fraction limits speedup to 1/S.",
            "Use thread pools instead of a thread per task."
          ]
        }
      ]
    }
  }
];
