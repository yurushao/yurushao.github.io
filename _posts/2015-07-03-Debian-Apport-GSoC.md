---
layout: post
title: New Features of Debian Apport
categories:
- Tech
tags:
- Linux
- Debian
- GSoC
---

Apport intercepts program crashes, collects debugging information about the crash and runtime, and sends it to bug trackers. It also offers the user to report a bug about a package, with again collecting as much information about it as possible.

I'm working on the improvement of Apport in Debian this summer. So far, a few new features has been implemented.

1. Ensure only one instance of `apport-notifyd` is running
2. Invoke `apport-retrace` to install absent debug symbols
3. Leverage system cache to save bandwith
4. Integrate Apport with Debian BTS


# 1. One apport-notifyd Instance


Previously, `apport-notifyd` notification daemon does not have the ability to shutdown by itself. Thus if the user logs out of his desktop session and then logs back in, he will have more than one instances of the daemon. This will result in multiple apport popups when a crash occurs.

Now `apport-notifyd` can detect if there has already been a notification daemon running. If not it will start a new one, otherwise it quits silently.

# 2. Install Debug Symbols

Sometimes Apport fails to report a crash due to the lack of debugging symbols in the crashed package or its dependencies. When this happens, Apport will prompt a message dialog, telling the user to install absent debug symbols. We added an _install_ button in the dialog, which can let the user install debug symbols immediately, without starting `apport-retrace` manually.

![]({{"/assets/images/20150703_install_debug_symbols.png"}})

-> Fig 1. Click "Install" to install debug symbols <-

# 3. Leverage System Cache

`apport-retrace` downloads/installs the necessary packages and debug symbols. It used to download all required packages direclty from Debian servers.

The cache folder `/var/cache/apt` contains debian packages downloaded by `apt-get`. It's very likely that packages `apport-retrace` wants to download have existed in `/var/cache/apt`. For such packages we don't need to download them again -- just make copies. This will save bandwith and shorten the waiting time.

# 4. Integrate Debian BTS

Debian has a bug tracking system (BTS) in which we file details of bugs reported by users and developers. Each bug is given a number, and is kept on file until it is marked as having been dealt with.

We've integrated Debian BTS into Apport. Before reporting a bug of the crashed package users can browse existing bug reports fetched from Debian BTS. They don't need to report it again if the bug has alreadly been reported by someone else! 

![]({{"/assets/images/20150703_apport_main.png"}})

-> Fig 2. Click "Existing Reports" to view reported bugs <-

![]({{"/assets/images/20150703_existing_reports.png"}})

-> Fig 3. All existing bug reports <-

<img src="/assets/images/20150703_report_details.png" />

-> Fig 4. Display details of one bug report <-
