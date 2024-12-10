---
date: 2005-10-24
published: true
slug: re-ping-part-iii-adventures-in-socket-program
summary: I've posted another update to my ICMP ping tutorial series on MSDN Blogs.  This
  installment focuses on crucial aspects like calculating checksums and serializing
  packets into byte arrays for transmission.  While we haven't started sending data
  over the wire, understanding these concepts is vital for the next steps. Check out
  the post for more detail.
tags:
- ICMP
- ping
- socket programming
- C#
- .NET
- System.Net
- networking
- checksum
- serialization
- tutorial
title: 'RE: Ping Part III: Adventures in Socket programming using System.Net'

---
There has been another update to the [ICMP ping tutorial](http://blogs.msdn.com/feroze_daud/archive/2005/10/24/484260.aspx).  Still nothing on the wire yet, but this is all the important information such as check summing.  Check it out it is a very good series so far. <p />Keep up the good work Feroze.<blockquote>In this part, we will write a routine to calculate the checksum of the packet, and a routine to serialize the packet into a byte array. Recall from [PartII](http://blogs.msdn.com/feroze_daud/archive/2005/10/23/483976.aspx) that the request and reply packets have a particular encoding on the wire. We will have to write a routine that will encode the packet into a byte array, so that the array can be sent on the wire.</blockquote><i>[Via [MSDN Blogs](http://blogs.msdn.com/feroze_daud/archive/2005/10/24/484260.aspx)]</i><p />

