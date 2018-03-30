---
layout: post
title: Debian Font Configuration Warning
categories:
- Tech
tags:
- Linux
- Debian
- Troubleshooting
---

I've been learning to develop GUI applications for Debian with PyQt4 these days. When I ran the program in shell, two annoying warnings showed up.

    Fontconfig warning: "/etc/fonts/conf.d/65-droid-sans-fonts.conf", line 103: Having multiple values in <test> isn't supported and may not work as expected
    Fontconfig warning: "/etc/fonts/conf.d/65-droid-sans-fonts.conf", line 138: Having multiple values in <test> isn't supported and may not work as expected

As the warning messages hinted, to get rid of them I should convert multiple values in one `<test>` into multiple `<test>` tags, each of which only has one value. So I edited the file `/etc/fonts/conf.d/65-droid-sans-fonts.conf`.

# Before

    <test name="lang">
        <string>zh-cn</string>
        <string>zh-sg</string>
        <string>zh-hk</string>
        <string>zh-tw</string>
    </test>


# After

    <test name="lang">
        <string>zh-cn</string>
    </test>
    <test name="lang">
        <string>zh-sg</string>
    </test>
    <test name="lang">
        <string>zh-hk</string>
    </test>
    <test name="lang">
        <string>zh-tw</string>
    </test>

