---
date: 2005-10-27
published: true
slug: amazon-web-service-api-soap-vs-rest
summary: I've been exploring the Amazon Web Service API, comparing its REST and SOAP
  interfaces.  Initial impressions suggest the REST API is significantly faster, especially
  compared to my experiences using the SOAP API with C# and Web References. However,
  it's worth noting that these observations aren't based on rigorous testing and the
  different environments (Windows Forms vs. a Linux server on a fast network) could
  be influencing the perceived performance difference.
tags:
- Amazon Web Services
- AWS
- API
- SOAP
- REST
- C#
- Web Services
- Performance
- Windows Forms
- Linux
title: Amazon Web Service API SOAP vs REST

---
I have just been playing with the Amazon Web service API REST interface and I must say that it seem remarkably quicker than using the SOAP API.  I am saying this without doing much testing, but when ever I did calls from C# using a Web Reference it always seemed to take a while to pull back the results, the REST API on the otherhand is far far quicker.<p />Thinking about it I am using two completly different systems, one was a Windows Forms application, the other is a Linux Server on an unbelivably fast network connection.<p />

