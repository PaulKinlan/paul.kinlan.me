---
date: 2006-11-18
published: true
slug: why-i-love-wse-3-0
summary: I'm really enjoying working with WSE 3.0, especially its policy mechanism.  It
  allows for Aspect Oriented Programming (AOP) through SoapFilters, enabling me to
  add functionality like security, auditing, and exception handling via configuration
  rather than hardcoding it into my web service.  This keeps my service code clean
  and maintainable. I demonstrated this with a simple example of an OrderService,
  comparing the cleaner policy-based approach to a more complex, hardcoded alternative.
  The policy configuration significantly simplifies adding and managing cross-cutting
  concerns.
tags:
- WSE 3.0
- Web Services Enhancements
- AOP
- Aspect Oriented Programming
- SoapFilters
- Policy Configuration
- Security
- Auditing
- Exception Handling
- .NET
- C#
- Web Services
title: Why I love WSE 3.0

---
<p>I have been using WSE 3.0 for a while now and I really like it.  I really like the policy mechanism in the WSE, it affords me a kind of AOP (aspect orientated programming) that I am really starting to get into.   For instance I have made a lot of SoapFilters recently, some handy, some just for tests, but each of them allow me to add an aspect of functionality into the webservice that I am creating in a configuration and not a design time.  If I want security, just add a policy line in the XML config, if I want auditing another line, if I want exception shielding another line.   All of these aspects of the system I am creating can be added at deployment time thus leaving my web service code clean and simple.</p> <p>An example, pseudo code: </p><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; float: none; padding-bottom: 0px; margin: 0px; padding-top: 0px;">
<div class="CodeRay">
  <div class="code"><pre></pre></div>
</div>

<div>
Code highlighting produced by Actipro CodeHighlighter (freeware)http://www.CodeHighlighter.com/--><span style="color: #000000;">[Webservice]</span><span style="color: #0000FF;">public</span><span style="color: #000000;"> </span><span style="color: #0000FF;">class</span><span style="color: #000000;"> OrderService{    [WebMethod]    [Policy(ServerPolicy)]    </span><span style="color: #0000FF;">public</span><span style="color: #000000;"> OrderList SubmitOrders(OrderList input)    {        </span><span style="color: #0000FF;">return</span><span style="color: #000000;"> OrderListRepository.InsertNewOrders(input);    }}</span>
</div>
</div><p>And a policy file (not an actual file that would work in this example) would say:</p><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; float: none; padding-bottom: 0px; margin: 0px; padding-top: 0px;">
<div class="CodeRay">
  <div class="code"><pre></pre></div>
</div>

<div>
Code highlighting produced by Actipro CodeHighlighter (freeware)<a href="http://www.CodeHighlighter.com/">http://www.CodeHighlighter.com/</a><p />--><span style="color: #0000FF;">&lt;</span><span style="color: #800000;">Policy</span><span style="color: #0000FF;">&gt;</span><span style="color: #000000;">    </span><span style="color: #0000FF;">&lt;</span><span style="color: #800000;">add </span><span style="color: #FF0000;">type</span><span style="color: #0000FF;">="Security"</span><span style="color: #FF0000;"> MustHaveRole</span><span style="color: #0000FF;">="Add"</span><span style="color: #0000FF;">/&gt;</span><span style="color: #000000;">    </span><span style="color: #0000FF;">&lt;</span><span style="color: #800000;">add </span><span style="color: #FF0000;">type</span><span style="color: #0000FF;">="Auditing"</span><span style="color: #FF0000;"> </span><span style="color: #0000FF;">/&gt;</span><span style="color: #000000;">    </span><span style="color: #0000FF;">&lt;</span><span style="color: #800000;">add </span><span style="color: #FF0000;">type</span><span style="color: #0000FF;">="ExceptionSheilding"</span><span style="color: #FF0000;"> </span><span style="color: #0000FF;">/&gt;</span><span style="color: #000000;"></span><span style="color: #0000FF;">&lt;/</span><span style="color: #800000;">Policy</span><span style="color: #0000FF;">&gt;</span>
</div>
</div><p>This service code and policy file model is so much cleaner and simpler than what you would have to write if you didn't have an AOP style policy system:</p><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; float: none; padding-bottom: 0px; margin: 0px; padding-top: 0px;">
<p />

<div>
Code highlighting produced by Actipro CodeHighlighter (freeware)<a href="http://www.CodeHighlighter.com/">http://www.CodeHighlighter.com/</a><p />--><span style="color: #000000;">[Webservice]</span><span style="color: #0000FF;">public</span><span style="color: #000000;"> </span><span style="color: #0000FF;">class</span><span style="color: #000000;"> OrderService{<p />    [WebMethod]    [Policy(ServerPolicy)]    </span><span style="color: #0000FF;">public</span><span style="color: #000000;"> OrderList SubmitOrders(OrderList input)    {        </span><span style="color: #0000FF;">try</span><span style="color: #000000;">        {            </span><span style="color: #0000FF;">if</span><span style="color: #000000;">(User.IsInRole(</span><span style="color: #000000;">"</span><span style="color: #000000;">Add</span><span style="color: #000000;">"</span><span style="color: #000000;">) </span><span style="color: #000000;">&amp;&amp;</span><span style="color: #000000;"> User.IsAuthenticated)            {                OrderListRepository.InsertNewOrders(input);                Log.Audit(Success);            }            </span><span style="color: #0000FF;">else</span><span style="color: #000000;">            {                Log.Error(SecurityError);            }            }        </span><span style="color: #0000FF;">catch</span><span style="color: #000000;">(RepositoryException ex)        {            </span><span style="color: #0000FF;">throw</span><span style="color: #000000;"> SheildedException(ex, </span><span style="color: #000000;">"</span><span style="color: #000000;">Problem in Repository</span><span style="color: #000000;">"</span><span style="color: #000000;">);        }        </span><span style="color: #0000FF;">catch</span><span style="color: #000000;">(Exception ex)        {            </span><span style="color: #0000FF;">throw</span><span style="color: #000000;"> SheildedException(ex, </span><span style="color: #000000;">"</span><span style="color: #000000;">Unkown Exception</span><span style="color: #000000;">"</span><span style="color: #000000;">);        }    }}</span>
</div>
</div><p>Now tell me which code you would like to maintain! :)</p><p> </p><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; padding-bottom: 0px; margin: 0px; padding-top: 0px;">Tags: <a href="http://www.kinlan.co.uk/tag/asp.net" rel="tag">asp.net</a>, <a href="http://www.kinlan.co.uk/tag/WSE" rel="tag">WSE</a>, <a href="http://www.kinlan.co.uk/tag/WSE3" rel="tag">WSE3</a>, <a href="http://www.kinlan.co.uk/tag/c#" rel="tag">c#</a>, <a href="http://www.kinlan.co.uk/tag/.net" rel="tag">.net</a>, <a href="http://www.kinlan.co.uk/tag/webservice" rel="tag">webservice</a>
</div>

