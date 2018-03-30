---
layout: post
title: Macbook安装SSD
categories:
- Life
tags:
- Macbook
- SSD
---


最近从美国亚马逊海淘了一块SSD，Crucial M500 240G。加上运费共1250HKD，相比香港的价格（1400HKD左右）还是非常划算的。今天安装到了Macbook Pro （Mid 2012 13英寸）上，并完成了系统的迁移。

考虑到240G的容量有限，可能不够日常使用，所以需要保留原来500G的机械硬盘：系统和应用程序安装到SSD上，而home目录的一些数据，比如影音、下载的文件使用HDD存储。在淘宝上买了一个光驱位的硬盘架，这样就可以两块硬盘共存了。光驱和硬盘采用的都是SATA接口，读写速度上不会有区别，所以将SSD或者HDD安装到光驱位都可以（我直接将SSD放入硬盘架装到了光驱位）。

拆卸光驱比较麻烦，需要参考网上的拆机教程。SSD安装成功后重新启动系统，使用Disk Utility进行格式化，然后系统就会自动挂载它为第二块硬盘了。

下一步进行系统迁移：把系统从原来的HDD上克隆到SSD上，然后更改启动盘为SSD。

### 1. 克隆系统

使用了Carbon Copy Cloner这个app，操作起来非常方便。

![]({{"/assets/images/ccc.png"}})

左边选择HDD和需要克隆的目录，右边选择目标SSD。因为HDD中的数据量大于SSD的容量，所以对于home目录`/Users/username/`，仅同步其中的用户配置文件就可以了。克隆过程并不慢，我用了大约一小时。

### 2. 设置默认启动盘

接下来，在System Preference - Startup Disk中选择默认启动盘为SSD，重启会发现系统的启动速度变快了。

最后，可以将HDD中的系统删掉，仅用它来存储数据。关于SSD的优化可以参考：<a href="http://blog.jjgod.org/2010/04/17/macosx-ssd-tweaks/">http://blog.jjgod.org/2010/04/17/macosx-ssd-tweaks/</a>




