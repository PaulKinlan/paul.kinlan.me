---
date: 2005-05-22
published: true
slug: asp-net-query-parameter-validation
summary: 'I''ve been pondering an ASP.Net security concern: while it blocks potentially
  harmful querystring characters by default, turning this off puts the onus of validation
  on developers.  I''m exploring the idea of a declarative approach to query parameter
  validation, where developers define predicates (like data types) for expected parameters
  within the Page Class definition itself.  This could simplify validation and ensure
  data is HTML-safe before reaching the developer. This would streamline validation
  compared to using custom validators. I''m considering the benefits and implementation
  details of such an approach.'
tags:
- asp.net
- security
- validation
- querystring
- parameters
- cross-site scripting
- xss
- html encoding
- custom validators
- page class
title: ASP.Net Query Parameter Validation

---
I have just been thinking about a subject that has always concerned me with ASP.Net.  By Default ASP.Net won't allow certain characters through on the querystring that could potentially cause security problems (such as Cross Site Scripting attacks).  The Developer has the opportunity to turn this feature off, but would be required to validate all the elements themselves.<p />I have just been thinking, wouldn't it be good if when a Page Class is defined you could provide some predicates that must be true for the page not to invalid.  For instance a developer could provide a list of all the accepted query parameters and their datatypes and the runtime will take car of validating it automatically.  I know you can have custom validators and the like but they must always be called via validate.<p />Wouldn't it be nice if you could do something like:<p /><code>[QueryParameterValidation(Text)]protected TextBox inputName;[QueryParameterValidation(Numeric)]protected TextBox inputAge;[QuertParameterValidFields(inputName, inputAge)]public class TestPage: Page{.....</code><p />I am not too sure if this type of thing has been done before, or even if it has any advantages over CustomValidaters etc.<p />I just thought it might be quite handy, because you could seperate the types out so that a Text attribute wouldn't allow HTML/XML characters and it would remove this before the page is completely loaded.  So that once the developer sees the data it is HTML safe.<p />I will have more of a think about this :).

