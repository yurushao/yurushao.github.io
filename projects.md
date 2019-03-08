---
layout: default
title: Projects
---


## Inconsistent security policy enforcement

We detect inconsistencies in access control policy enforcement in the Android framework. We design and build a tool that compares permissions enforced on different code paths and identifies the paths enforcing weaker or no permissions. Our methodology does not require security policies, which are non-trivial to learn, and it targets only on the enforcement.

## Unix domain sockets security

We conduct the first systematic study in understanding the security properties of the usage of Unix domain sockets by both Android apps and system daemons as IPC channels, especially for cross-layer communications between the Java and the native layers.

## Diehard apps

We propose the Application Lifecycle Graph (ALG), a novel modeling approach to describing system-wide app lifecycle. We develop a lightweight runtime framework that utilizes ALG to realize fine-grained app lifecycle control, with a focus on restricting diehard apps that abuse entry points to automatically start up and game the priority-based memory management mechanism to evade being killed.

## Software-defined control (SDC)

SDC is a framework for the rapid reconfiguration of smart manufacturing systems in response to changing demands or factory conditions, supply networks, or customer needs. SDC abstracts the low-level functionality of the factory floor in a control plane that hosts a central controller. A set of applications (e.g., anomaly detection, quality control) provide the central controller with the necessary information to detect changes in the system, evaluate alternative configurations, and make recommendations for reconfiguration that can be rapidly deployed to the factory floor. Compared to other reconfiguration frameworks, SDC provides advantages in flexibility, compatibility with prevailing automation technologies, and the ability to monitor system performance. Since the manufacturing system is allowed to function with or without the central controller, SDC is strictly value-add and it may be turned off if reconfiguration is not desired.
 

## Application and data-driven SDN controller design

Existing SDN controllers commonly adopt an event-driven model that minimizes southbound communication and control-plane overhead. This model satisfies most existing SDN applications’ goals to maximize data plane performance while still being able to programmatically control with a decent level of visibility. However, as network composition becomes more heterogeneous with NFV and IoT, such model can be insufficient for future applications that rely more on data analysis and intelligent decision making. In this paper, we present our findings in a case study on smart manufacturing systems, which have highly heterogeneous device compositions, and applications that are much less throughput hungry or latency sensitive than network applications but require a lot more data for (real-time) decision making. We share the insights we gain that help us design a new Application and Data-Driven (ADD) model for SDN controllers. We build a proof-of-concept ADD controller based on this model and develop two applications to showcase its new capabilities.