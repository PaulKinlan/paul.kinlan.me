---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
Philip Walton memiliki penyelarukan mendalam yang luar biasa terhadap API baru yang telah dikerjakan tim Chrome untuk memberi Anda (pengembang) kontrol atas cara merespons saat browser membongkar tab Anda.

> Application lifecycle is a key way that modern operating systems manage resources. On Android, iOS, and recent Windows versions, apps can be started and stopped at any time by the OS. This allows these platforms to streamline and reallocate resources where they best benefit the user.
> 
> On the web, there has historically been no such lifecycle, and apps can be kept alive indefinitely. With large numbers of web pages running, critical system resources such as memory, CPU, battery, and network can be oversubscribed, leading to a bad end-user experience.
> 
> While the web platform has long had events that related to lifecycle states &#x2014; like load, unload, and visibilitychange &#x2014; these events only allow developers to respond to user-initiated lifecycle state changes. For the web to work reliably on low-powered devices (and be more resource conscious in general on all platforms) browsers need a way to proactively reclaim and re-allocate system resources.
> 
> In fact, browsers today already do take active measures to conserve resources for pages in background tabs, and many browsers (especially Chrome) would like to do a lot more of this &#x2014; to lessen their overall resource footprint.
> 
> The problem is developers currently have no way to prepare for these types of system-initiated interventions or even know that they're happening. This means browsers need to be conservative or risk breaking web pages.
> 
> The Page Lifecycle API attempts to solve this problem by:
> 
> * Introducing and standardizing the concept of lifecycle states on the web.
> * Defining new, system-initiated states that allow browsers to limit the resources that can be consumed by hidden or inactive tabs.
> * Creating new APIs and events that allow web developers to respond to transitions to and from these new system-initiated states.
> * This solution provides the predictability web developers need to build applications resilient to system interventions, and it allows browsers to more aggressively optimize system resources, ultimately benefiting all web users.
> 
> The rest of this post will introduce the new Page Lifecycle features shipping in Chrome 68 and explore how they relate to all the existing web platform states and events. It will also give recommendations and best-practices for the types of work developers should (and should not) be doing in each state.


[Baca pos lengkap](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).

Komentar pertama saya adalah Anda harus membaca posting Philips. Itu luar biasa.

Pada seluler, Chrome bisa sangat agresif saat melekas (membekukan atau membuang) laman untuk menghemat sumber daya ketika pengguna tidak menggunakannya (misalnya, saat Anda menukar tab atau berpindah dari aplikasi Chrome di Android), ketika browser berlatar belakang Anda halaman sebagai pengembang Anda secara tradisional tidak memiliki pengetahuan tentang kapan hal ini terjadi sehingga Anda tidak dapat dengan mudah bertahan negara atau bahkan menutup sumber terbuka dan sama pentingnya saat aplikasi kembali menghidrasi ulang negara secara bersih. Ketika pengembang memiliki kontrol mereka dapat membuat pilihan yang lebih terinformasi, yang juga berarti bahwa peramban dapat lebih agresif dalam menghemat sumber daya di masa depan tanpa mempengaruhi pengalaman pengguna atau pengembang.

Akhirnya, diagram di bawah ini menjelaskan semuanya dengan sangat baik.

<figure><img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" /><figcaption> <a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">API Siklus Hidup Laman</a> </figcaption></figure>


