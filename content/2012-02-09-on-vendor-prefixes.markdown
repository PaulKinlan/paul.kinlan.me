---
slug: on-vendor-prefixes
date: 2012-02-09
 
title: On Vendor Prefixes
published: true
---
<p>There is a lot of <a href="http://lists.w3.org/Archives/Public/www-style/2012Feb/0313.html">chatter about Mozilla considering</a> implementing some webkit specific prefixes - I encourage everyone to read "<a href="https://wiki.mozilla.org/Platform/Layout/CSS_Compatibility#questions_and_methodology">Platform/Layout/CSS compatibility</a>"</p>
<p />
<div>My <strong>personal</strong> take on this is "great" and I am glad they have the guts to start the conversation, but in my eyes it should only happen IFF the vendor is going to choose to stop supporting their existing prefix and start supporting the other parties prefix as what they agree to be the way they want the standard to move.&nbsp;</div>
<p />
<div>I know a lot of people who targeted mobile saw that the audience they needed to target were using almost exclusively a WebKit based browser and thus chose that as <em>the</em> platform to target. &nbsp;If the mobile device you want to target or your customers want you to target is pretty much a single choice then web developers naturally gravitate to the browser that is most popular and for a long time in the case of iPhone etc, WebKit was (up until recently) your only web platform you had to develop for.</div>
<p />
<div><a href="http://remysharp.com/2012/02/09/vendor-prefixes-about-to-go-south">Remy Sharp's</a> blog post is a good summary of the situation, but I don't agree with most of the propos<span style="font-family: arial, helvetica, sans-serif;">ed browser solutions. &nbsp;</span></div>
<p />
<div><span style="font-family: arial, helvetica, sans-serif;">To Quote:</span></div>
<blockquote class="gmail_quote" style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0.8ex; border-left-width: 1px; border-left-color: #cccccc; border-left-style: solid; padding-left: 1ex;">Browsers need to:
<ul>
<li>Fucking drop experimental prefixes. It's unacceptable and a disservice to the developers working with your browser. You need to give timelines to dropping these things.</li>
</ul>
<ul>
<li>Non-production ready browsers should support experimental prefixes,&nbsp;production ready releases&nbsp;should not. If it's Chrome 16 - the stable version - experimental support should not be baked in. The properties should be full available&nbsp;without&nbsp;the prefix.</li>
</ul>
</blockquote>
<div>
<div>On dropping vendor prefixes, yes but only if they commit to move to another one. &nbsp;The whole gradient syntax winded me up no end - if at this point WebKit had chosen to name it consistently with the -moz implementation and prefixed it so then we could have started to completely drop the old syntax that IMO would have been better. &nbsp;At the same time though we should be educating developers about the tooling available to make the vendor prefixing become a non-story (in most cases).</div>
<p />
<div>I had a little chuckle about "production ready browsers" - I don't think this is sensible or feasible given the update cycles of browser and that developers want what they have chosen to implement to look ace in the browsers that they have chosen to make it look awesome in. &nbsp;If you have platform features that no other browser is going to support either now in the near future then we need to have a way to not have them in the base "namespace" - putting them in there is going to cause more problems.</div>
<p />
<div>Anyway, these are my thoughts and can be and sometimes are hogwash - my motto is "don't hate, advocate" - and as Remy says&nbsp;"As developers we need to better educate." to which I whole heartedly agree.</div>
</div>

