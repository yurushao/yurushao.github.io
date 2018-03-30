---
layout: post
title: Mobile Advertising and Tracking Ecosystem
categories:
- Tech
tags:
- Privacy
- Paper
---

I recently read a paper that has been accepted into NDSS 2018. [This paper](https://www.haystack.mobi/papers/ndss18_ats.pdf) presents some interesting insights into the mobile advertising and tracking ecosystem and its stakeholders.

The authors developed automated methods to detect third-party advertising and tracking services (ATS) *at the traffic level*. User data were collected with [Lumen privacy monitor](https://play.google.com/store/apps/details?id=edu.berkeley.icsi.haystack), which is an Android app runs locally on the device and intercepts all network traffic over both WiFi and mobile network. It's essentially a VPN proxy that sits between apps and network interfaces. The app itself doesn't need root access, but it asks the user to grant it the VPN permission. In summary, with Lumen privacy monitor, the authors collected 8.5M flows from 14,599 apps to 40,533 unique fully-qualified domain names (FQDNs) with 13,454 unique second-level domains (SLDs). After classification, 2,121 ATSes (233 are previously unknown) and 730 ATS-capable services were identified. By characterizing ATS domains, the paper uncovers business relationships between service providers. **8/10 top organizations reserve the right to sell or share data with other organizations, while all of them reserve the right to share data with their subsidiaries.**


Third-party domains
===================

This paper makes a reasonable assumption that first-party domains are considered to be trusted by users when they install apps. Therefore, only third-party domains are in the scope of study. Two categories of third-party domains are defined:

1. ATS domains: ones that belong to  companies whose primary service is providing advertising and tracking services.
2. ATS-capable domains (ATS-C): domains that collect tracking information, but whose primary service is not specifically providing ads and analytics to app developers.

An example of ATS-C is a map API for collecting location data and other information to provide area maps and directions. It doesn’t necessarily rely on tracking users for monetizing their service. However, ATS-Cs can possibly later share data with other parties.


Domain classification
=====================
The goal of domain classification is to identify third-party domains, then identifying ATS-related domains (i.e., ATSes and ATS-Cs).

Existing ATS blacklists and URL categorization services both have limitations. Rather than completely relying them, the authors use them to train, test, and curate their domain classifier and results.
Their approach consists of three major steps: (1) identifying third-party domains, (2) classifying third-party domains to identify ATS domains (with manual validation of 200 domains), and (3) labeling domains that receive unique identifiers from user devices but were not identified in the previous step as ATS-C


Findings
========

**The mobile ATS ecosystem**


The paper reports that 292 parent organizations own nearly 2,000 ATS and ATS-C domains. Alphabet (Google's parent company) has penetration in over 73% of all measured apps with ownership of only 3.6% of all ATS/ATS-C domains. Domains belonging to the same organization are more likely to co-occur.
<!--
ATS domain co-occurrences
Jaccard similarity: JS(dom_a, dom_b) = (apps_a AND apps_b)/(apps_a OR apps_b)
-->

**Application characteristics**

The numbers of trackers: free apps with in-app purchases  > free apps > paid apps. Apps with in-app purchases may have more aggressive monetization strategies.
Games and educational apps are the two categories with the highest number of ATS/ATS-C domains
Cross-device tracking is widespread: 39% identified ATSes are present as third-parties in at least one of the Alexa top 1000 websites.

**Regulatory challenge**

ATS services in US have disproportionately higher access to ATS related data: 40% ATS servers are the end of 73% ATS-related flows. Flows of UIDs from nations in the European Union mostly go to US (89.27%) and China (4.02%).  They are likely to be the most impacted by the upcoming regulations.
