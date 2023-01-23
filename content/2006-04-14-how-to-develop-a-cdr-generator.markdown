---
slug: how-to-develop-a-cdr-generator
date: 2006-04-14
 
title: How to develop a CDR generator
published: true
---
My Final Year project covered Telecoms fraud.  It included a call detail record generator.<p />I have had a fair few queries about this, mostly around how to develop a CDR tool.<p />Whilst I have only ever seen one CDR file.  I did do a fair amount of research around the subject and I found out quite a bit.<p />Firstly, I choose to store the least amount of data that I could get away with.  The data that I chose was:<ul>
<li>Caller (source)</li>
<li>Callee (destination)</li>
<li>Call Type (local, national etc)</li>
<li>Start Time</li>
<li>Duration</li>

</ul><p />With those 5 parameters you can work out the cost of the call and you can also work out a lot of other statistics.<p />To generate a CDR I had to configure a lot of models, high user, low users, business users etc.  Each of these models had different parameters.  The parameters were attributes such as:<ul>
<li>The average cost and STDEV of a local call</li>
<li>The average number and STDEV of local calls</li>
<li>The average cost and STDEV of a PRS call</li>
<li>The average number and STDEV of PRS calls</li>
<li>The average cost and STDEV of a national call</li>
<li>The average number and STDEV of National calls</li>
<li>The times most likely to make a call: 8am -5 pm for a business as an example</li>

</ul><p />When you have all these parameters you can get a random number generate to randomly pick values that fall within the bounds set by the model.<p />When the model generator is finished you should have a spread of customers that fit the model described.<p />Using this data you can then simulate your network in whatever manner you need.<p />How you determine the parameters of the model, is upto you because you know the data that you are trying to model.<p />

