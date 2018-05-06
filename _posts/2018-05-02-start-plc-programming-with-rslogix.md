---
layout: post
title: Learn PLC Programming with RSLogix Emulate 500
categories:
- Tutorial
tags:
- PLC
---

A programmable logic controller (PLC), or programmable controller is an industrial digital computer which has been ruggedized and adapted for the control of manufacturing processes, such as assembly lines, or robotic devices, or any activity that requires high reliability control and ease of programming and process fault diagnosis [1].

[OpenPLC](http://www.openplcproject.com/) is good for hobbyists and for research purposes. In this post, I'm using Rockwell Automation products, which are closer to what people use in real factories.

1. RSLogix Emulate 500 ([download][Emulate500]): the PLC emulator software.
2. RSLogix Micro Starter Lite w/o RSLinx ([download][RSLogixMicro]): the tool for writing PLC programs with ladder logic.
3. RSLinx Classic Lite ([download][RSLinxClassicLite]): for communications among Rockwell networks and devices.

Configure Driver
================

RSLinx Classic Lite comes with a bunch of different drivers. By configuring the emulator driver we let our working PC know how to communicate with the emulator. 


![]({{"/assets/images/20180502/RSLinx_configure_driver.gif"}})


Write a Simple Program
======================

![]({{"/assets/images/20180502/simple_ladder_logic.gif"}})


Set Up the Emulator
==================

We assign ```1``` to the emulator's ```Station #```, as ```0``` has been taken by the PC.

![]({{"/assets/images/20180502/start_emulator.gif"}})

After the emulator is set up, RSLinx is able to detect it.

![]({{"/assets/images/20180502/emulator_ready.png"}})


Download Program to PLC
=======================

![]({{"/assets/images/20180502/download_to_plc.gif"}})

By toggling the input ```I:0/0```, the output bit ```O:0/0``` changes accordingly.


[Emulate500]: https://compatibility.rockwellautomation.com/Pages/MultiProductFindDownloads.aspx?crumb=112&mode=3&refSoft=1&versions=50059
[RSLogixMicro]: https://compatibility.rockwellautomation.com/pages/search.aspx?crumb=117&q=RSLogix%20Micro%20Starter%20Lite%20w/o%20RSLinx%20EN
[RSLinxClassicLite]: https://compatibility.rockwellautomation.com/Pages/MultiProductFindDownloads.aspx?crumb=112&mode=3&refSoft=1&versions=51543
[PlcProfVideo]: https://www.youtube.com/watch?v=t9JoLjiwjtw


References
==========

[1] https://en.wikipedia.org/wiki/Programmable_logic_controller
[2] https://www.youtube.com/watch?v=t9JoLjiwjtw