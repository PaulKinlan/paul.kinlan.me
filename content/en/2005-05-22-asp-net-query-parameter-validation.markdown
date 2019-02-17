---
slug: asp-net-query-parameter-validation
date: 2005-05-22
 
title: ASP.Net Query Parameter Validation
published: true
---
I have just been thinking about a subject that has always concerned me with ASP.Net.  By Default ASP.Net won't allow certain characters through on the querystring that could potentially cause security problems (such as Cross Site Scripting attacks).  The Developer has the opportunity to turn this feature off, but would be required to validate all the elements themselves.<p />I have just been thinking, wouldn't it be good if when a Page Class is defined you could provide some predicates that must be true for the page not to invalid.  For instance a developer could provide a list of all the accepted query parameters and their datatypes and the runtime will take car of validating it automatically.  I know you can have custom validators and the like but they must always be called via validate.<p />Wouldn't it be nice if you could do something like:<p /><code>[QueryParameterValidation(Text)]<br />protected TextBox inputName;<br />[QueryParameterValidation(Numeric)]<br />protected TextBox inputAge;<br /><br />[QuertParameterValidFields(inputName, inputAge)]<br />public class TestPage: Page<br />{<br />.....<br /></code><p />I am not too sure if this type of thing has been done before, or even if it has any advantages over CustomValidaters etc.<p />I just thought it might be quite handy, because you could seperate the types out so that a Text attribute wouldn't allow HTML/XML characters and it would remove this before the page is completely loaded.  So that once the developer sees the data it is HTML safe.<p />I will have more of a think about this :).<br />

