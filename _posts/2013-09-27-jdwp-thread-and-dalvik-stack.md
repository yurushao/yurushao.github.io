---
layout: post
title: JDWP线程的启动与Dalvik栈 
categories: 
- Tech
tags: 
- Android
- Debug
---

## 1. JDWP线程

### 1.1 启动方式

Dalvik VM启动时的`server`和`suspend`这两个参数决定了jdwp线程的启动方式：

1. server=n suspend=n 直接尝试去连接`host:port`，失败了就放弃连接。
2. server=n suspend=y 同上，连接成功后会暂停VM的执行。
2. server=y suspend=n 等待debugger的主动连接。
3. server=y suspend=y 同上，debugger成功连接后会暂停VM执行。

从`zygote`进程派生的app的jdwp线程进行采用上面第三种方式启动。所以当从DDM (Dalvik Debug Monitor)中查看线程状态时，jdwp线程的会显示为Runnable.

![]({{"/assets/images/ddm_threads.png"}})

`Status`一栏表示线程的状态，守护线程的ID前面用星号(\*)标注。可能的状态有 \[1]：

+ running [?] - executing application code
+ sleeping - called Thread.sleep()
+ monitor - waiting to acquire a monitor lock
+ wait - in Object.wait()
+ native - executing native code
+ vmwait - waiting on a VM resource
+ zombie - thread is in the process of dying
+ init - thread is initializing (you shouldn't see this)
+ starting - thread is about to start (you shouldn't see this either)

[?] *文档中只有running而没有runnable状态，经过验证其实是一回事。*

从代码角度上分析，`vm/jdwp/JdwpMain.cpp`中的`jdwpThreadStart`是jdwp线程的启动入口。当为server模式时，会进入`dvmJdwpAcceptConnection`函数等待debugger的连接。

{% highlight C %}
static void* jdwpThreadStart(void* arg) 
{
	...
	 while (state->run) {
		...
        if (state->params.server) {
            /*
             * Block forever, waiting for a connection.  To support the
             * "timeout=xxx" option we'll need to tweak this.
             */
            if (!dvmJdwpAcceptConnection(state))
                break;
        } else {
			...
        }
        ...
    }
   	...
}
{% endhighlight %}
    
根据debugger与手机的连接方式不同，`dvmJdwpAcceptConnection`的具体实现也略有区别。当使用TCP方式通信时：

{% highlight C %}
static bool acceptConnection(JdwpState* state)
{
	...
	
	// loop to wait connection
    do {
        sock = accept(netState->listenSock, &addr.addrPlain, &addrlen);
        
        if (sock < 0 && errno != EINTR) {
            // When we call shutdown() on the socket, accept() returns with
            // EINVAL.  Don't gripe about it.
            if (errno == EINVAL)
                LOGVV("accept failed: %s", strerror(errno));
            else
                ALOGE("accept failed: %s", strerror(errno));
            return false;
        }
    } while (sock < 0);

	...
}
{% endhighlight %}

<br />

### 1.2 App如何防止自己被调试器attach

如果App想防止自己被调试器attach，暂时能想到两种可能的方式：

1. <b>在主线程中加载so，然后在so中使用`kill`系统调用给jdwp线程发送TERM或者QUIT信号。</b> 虽然`kill`接受的参数是进程的pid，但是传入线程的tid也没问题。查看当前进程的所有线程可以通过读取`/proc/self/task`目录的状态实现，目前还没发现可以通过Java代码准确获取tid的方法。不过经过测试，jwdp线程对QUIT信号没有反应，TERM信号会导致整个app进程被结束。

2. <b>新开一个线程伪装成debugger，这样会使别的debugger就无法再连接jdwp线程。</b> 此方法暂时还没测试，但是可能会需要root权限。

## 2. 通过调试能获得的数据

在没有调试信息的情况下，可以通过StackFrame获得寄存器，包括参数寄存器和局部变量的值。下面这张图说明了某个方法的栈布局：

![]({{"/assets/images/single_method_stack.png"}}){:width="300px"}

这个方法总共使用了5个寄存器，`in2`, `in1`, `in0`是方法的参数，占用了3个寄存器；局部变量占用了2个。这个结构与寄存器的p命名法和v命名法 \[2]是相对应的。

`breakSaveBlock`，记录的是break frame的地址，它的作用是能在方法返回或者异常发生时，定位和追踪异常。所以我们在异常产生时，可以通过`printStackTrace`打印当前栈的结构，追踪异常产生的位置。下面这张图 \[3]更加清晰地说明了这个过程。

![]({{"/assets/images/dalvik_stack_overview.png"}}){:width="700px"}

至于`saveBlock`，存储的就是帧指针。

要获取某个方法的寄存器数据，需要`threadID`和`frameID`以及寄存器的`index`，而且不需要调试信息 \[4]。

>Typically, this index can be determined for method arguments from the method signature without access to the 
>local variable table information.

## 3. 条件断点

Dalvik的代码的jdwp协议实现部分，并没提供对条件断点的支持。但是通过分析jdwp协议，可以从debugger的角度来实现。借助位置断点，获取被监控的寄存器数据，然后由debugger来判断条件是否满足。

不过要注意的是，Dalvik寄存器的值更新的时机。比如下面这种情况，监控v0，就应该把位置断点下在第二条指令处，因为`move-result`之前，v0的值并没有改变。

{% highlight smali %}
invoke-virtual {p1}, Landroid/view/MotionEvent;->getRawX()F

move-result v0
{% endhighlight %}

## 4. 参考资料

[4]: http://docs.oracle.com/javase/1.5.0/docs/guide/jpda/jdwp/jdwp-protocol.html#JDWP_StackFrame
[3]: http://www.kandroid.org/guide/developing/tools/ddms.html
[2]: http://myresearch-exe.blogspot.com/2010/10/threads-stack-management-in-dalvik-vm.html
[1]: http://code.google.com/p/smali/wiki/Registers

1. [http://code.google.com/p/smali/wiki/Registers] [1] 
2. [http://myresearch-exe.blogspot.com/2010/10/threads-stack-management-in-dalvik-vm.html] [2]
3. [http://www.kandroid.org/guide/developing/tools/ddms.html] [3]
4. [http://docs.oracle.com/javase/1.5.0/docs/guide/jpda/jdwp/jdwp-protocol.html#JDWP_StackFrame] [4]
