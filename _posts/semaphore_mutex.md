# Semaphore v.s. Mutex

很多新手会对semaphore和mutex的区别产生疑问。网络上最常被引用的一种说法是：

> A mutex is really a semaphore with value 1

这种说法是错误的，导致了很多人的迷惑和误解。

## 信号量 Semaphore

1965年，荷兰的计算机科学家Edsger Dijkstra提出了二元信号量（binary semaphore）的概念，来解决并发中的资源竞争问题。他的非常朴素的想法是，在操作系统中使用一对函数调用来指示进入/离开*临界区*（critical region）。这个想法通过对一种特殊的系统资源——信号量的获取/释放来实现。在他最初的工作中，Dijkstra使用了符号P和V来表示这两种操作（from the Dutch words Prolagen (P), a neologism coming from To try and lower, and Verhogen (V) To raise, To increase）。

在这个模型中，第一个task执行到`P(S)`（S表示semaphore）进入了临界区。当这个task在临界区中时，如果发生了上下文切换，另一个task也调用`P(S)`，那么第二个task（以及其他后续的task）都会被操作系统阻止进入临界区，进入等待状态。然后第一个task调用`V(S)`来表明它离开了临界区，第二个task将被允许进入临界区。

Dijkstra's的信号量被另一个荷兰人进行了改进。Dr. Carel S. Scholten提出信号量可以拥有一个大于一的初始值，这样就可以使临界区中资源的数量多于一个。例如，一个可计数的信号量能够用来管理停车场中的停车位。初始值设置成可用的停车位数量，每当一个车位被占用时计数值减一，当计数值减到0时，下一个想要获得信号量的task将会被挂起（它必须等到有可用的停车位）。当释放信号量（一个汽车离开了停车场）时计数值加一。

Scholten的信号量被称作*General or Counting Semaphore*， Dijkstra的信号量为*Binary Semaphore*。

然而，信号量有一些缺陷，可能会导致以下问题：

1. Accidental release
2. Recursive deadlock
3. Task-Death deadlock
4. Priority inversion
5. Semaphore as a signal

这些问题都在运行时发生所以很难重现，因此调试起来非常困难。

### Accidental release

这个问题产生的原因主要是代码编写中出现了错误，信号量没有被正确的获得和释放。

计数信号量被当作二元信号量使用时（初始值设置为1），这种问题将导致两个task同时进入临界区。每次存在bug的代码得到执行，计数值将会增加，那么其他的task将会进入。这是计数信号量被用作二元信号量时的固有缺陷。

### Recursive deadlock

如果一个task试图锁住一个已经上锁的信号量，就会发生递归死锁。一般来说，这种情况经常在库函数或者递归函数中发生。MySQL的bug数据库中有一个这样的例子：Bug #24745 InnoDB semaphore wait timeout/crash – deadlock waiting for itself

### Task-Death deadlock

如果一个拥有信号量的task死亡了或者被终止了，会有什么后果？如果不能检测这种情况，所有正在等待的的task将永远都无法获得信号量从而进入死锁。为了一定程度上解决这个问题，普遍的做法是在获得信号量的函数调用中指定一个可选的超时时间。

### Priority Inversion

大部分RTOS使用了优先级驱动的抢占调度算法。每个task拥有一个优先级，抢占调度中，低优先级的task释放CPU，使高优先级的task得以运行，这是构建一个实时操作系统的核心理念。优先级反转是指高优先级的task被低优先级的task挂起。

### Semaphore as a Signal

同步（Synchronization）这个词经常被错误地用于表示互斥（mutual exclusion）。根据定义，同步是：

> To occur at the same time; be simultaneous

一般来说，task之间的同步是指一个task在继续执行前，等待另外一个task的通知。还有一种情况是每个task都可能进入等待状态。互斥是一种保护机制，与此有很大不同。但是，这种错误的使用导致计数信号量可以被用于单向同步：初始化一个信号量，计数值为0。

需要注意的是，P和V并不是在同一个task中成对出现的。在这个例子中，假设Task1调用了`P(S)`它将被挂起。当Task2之后调用`V(S)`时，单向同步发生了，两个task都进入就绪状态（高优先级的task先运行）。不过，这种对信号量的误用是存在问题的，会导致调试起来非常困难，并可能导致accidental release类型的问题，因为单独的V(S)调用（不与P(S)配对）现在被编译器认为是合法的。

## 互斥体 Mutex

为了解决信号量存在的问题，1980年提出了一种新的概念——互斥（Mutual Exclusion的缩写）。互斥与二元信号量在原理上是相似的，但有一个很大的不同：属主，这就意味着如果一个task获得了互斥体，只有这个task可以释放这个互斥体。如果某个task试图释放另一个task的互斥体，将会触发错误导致操作失败。一个没有属主的“互斥体”不能被称为互斥体。

The concept of ownership enables mutex implementations to address the problems discussed in part 1:

Accidental release
Recursive deadlock
Task-Death deadlock
Priority inversion
Semaphore as a signal

Accidental Release
As already stated, ownership stops accidental release of a mutex as a check is made on the release and an error is raised if current task is not owner.

Recursive Deadlock
Due to ownership, a mutex can support relocking of the same mutex by the owning task as long as it is released the same number of times.

Priority Inversion
With ownership this problem can be addressed using one of the following priority inheritance protocols:

[Basic] Priority Inheritance Protocol
Priority Ceiling Protocol
The Basic Priority Inheritance Protocol enables a low-priority task to inherit a higher-priorities task’s priority if this higher-priority task becomes blocked waiting on a mutex currently owned by the low-priority task. The low priority task can now run and unlock the mutex – at this point it is returned back to its original priority.

The details of the Priority Inheritance Protocol and Priority Ceiling Protocol (a slight variant) will be covered in part 3 of this series.

Death Detection
If a task terminates for any reason, the RTOS can detect if that task current owns a mutex and signal waiting tasks of this condition. In terms of what happens to the waiting tasks, there are various models, but two doiminate:

All tasks readied with error condition;
Only one task readied; this task is responsible for ensuring integrity of critical region.
When all tasks are readied, these tasks must then assume critical region is in an undefined state. In this model no task currently has ownership of the mutex. The mutex is in an undefined state (and cannot be locked) and must be reinitialized.

When only one task is readied, ownership of the mutex is passed from the terminated task to the readied task. This task is now responsible for ensuring integrity of critical region, and can unlock the mutex as normal.

Mutual Exclusion / Synchronisation
Due to ownership a mutex cannot be used for synchronization due to lock/unlock pairing. This makes the code cleaner by not confusing the issues of mutual exclusion with synchronization.

Caveat
A specific Operating Systems mutex implementation may or may not support the following:

Recursion
Priority Inheritance
Death Detection



## 参考

1. [Mutex vs. Semaphores – Part 1: Semaphores](http://blog.feabhas.com/2009/09/mutex-vs-semaphores-%E2%80%93-part-1-semaphores/)
2. [Mutex vs. Semaphores – Part 2: The Mutex](http://blog.feabhas.com/2009/09/mutex-vs-semaphores-%E2%80%93-part-2-the-mutex/)