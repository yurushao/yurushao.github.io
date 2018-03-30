---
layout: post
title: Root已死？
categories:
- Tech
tags:
- Rooting
- Android
---

Android 4.3带来很多新特性，在安全方面有三点值得关注：

1. 内核层使用SELinux增强了应用程序沙盒的安全性，以应对潜在的系统漏洞
2. 限制App的setuid操作。对于从zygote派生出的进程，<code>/system</code>分区被挂载为<code>nosuid</code>，使这些进程无法执行setuid程序（比如用来提权的su），减少因root带来的安全隐患
3. 引入Linux Capabilities，zygote和ADB会主动放弃一些特权能力，这样zygote启动的app和从ADB shell中启动的程序的能力都被限制了

对Superuser和su有所了解的童鞋看到第二点，应该不难发现，目前使用的root管理机制在Android 4.3上行不通了，因为目前的提权方式依赖<code>/system</code>分区中设置了<code>setuid</code>属性的su程序，因此主流的Superuser/su组合无法在4.3上正常工作。不过Chainfire很快就针对4.3更新了SuperSU，原理<del>大概</del>是开一个root权限的daemon，其他app需要执行的root命令都交由这个daemon来执行。

CM的Steve Kondik在G+上发了一篇短文——[*The Death of Root*](https://plus.google.com/100275307499530023476/posts/BDVgeKMWaf4)，翻译如下：

Android 4.3新增了一些非常必要的安全特性，包括对<code>/system</code>分区中setuid程序的限制，对进程能力的限制（windflyer注：指Capabilities）。在这样的条件下，即使你得到了高权限，你也做不了什么。我一直使用ADB shell的root权限，目前这种方法依然行得通。

当我需要使用root时，我会对系统进行修改来安全地达到我的目的。我可以理解在stock ROMs中获得root权限的必要性，因为你能做的太有限了，没有root权限就无法对系统进行真正的改造和改进。

Koushik Dutta和Chainfire正在研究在4.3上保证root权限正常使用的方法，但是我觉得这会对系统的安全性造成影响，我们得考虑更好的解决方法。未来我非常感兴趣的是：在CM中通过framework扩展和导出相关API来消除对root的需求。

一些需要root的场景有：

+ 防火墙和网络软件，可能会需要使用raw sockets
+ 管理DNS解析
+ 通过sysfs控制内核

即使不暴露root，以上也都能实现，而且是非常安全的实现方式。

如果你使用CM或者其他第三方ROM，你使用root来做什么？

（完）

接下来是非常多的用户回复，总结起来大家使用root权限的目的主要有：

1. Backing up apps' private data
2. Kernel management (overclocking, controlling CPU governors, better battery life)
3. Tethering (sharing Internet)
6. Hacking (Terminal, DroidSheep, blocking ads, removing bloatware)
8. Feeling freedom （强迫症？）

这里还有一段来自xda developer TV的视频（需翻墙），也是关于为什么需要root：[This Is Why XDA-Developers.com Roots Android](https://www.youtube.com/watch?v=czTkHe7-lXw&feature=youtube_gdata_player)

随着Android的升级，很多之前需要root才能实现的功能已经被集成到系统中了。比如，以前截屏需要root，现在系统自带截屏功能了；以前需要root才能删除运营商内置的“垃圾”软件，现在你可以直接在app设置中禁用掉它们；以前需要root才能把手机作为无线AP分享网络，现在Android也内建了这个功能……我们有理由认为，用户对root的需求，能为Google丰富Android的功能提供参考。

个人认为，随着Android的进化，普通用户对root的需求应该会越来越不那么强烈。但是对于Hackers/Geeks/Developers/强迫症患者来说，root无疑是必不可少的。

__参考资料__：

1. [http://developer.android.com/about/versions/jelly-bean.html](http://developer.android.com/about/versions/jelly-bean.html)
2. [http://source.android.com/devices/tech/security/enhancements43.html](http://source.android.com/devices/tech/security/enhancements43.html)
3. [http://www.androidpolice.com/2013/07/25/root-on-android-4-3-is-still-a-bit-broken-but-chainfires-supersu-works-and-heres-why/](http://www.androidpolice.com/2013/07/25/root-on-android-4-3-is-still-a-bit-broken-but-chainfires-supersu-works-and-heres-why/)
