---
date: 2006-03-08
published: true
slug: google-search-c-finding-the-locale
summary: This post discusses how to determine a user's locale in C#. For ASP.NET applications,
  the `Request.UserLanguages` array provides the user's preferred languages, with
  the first element being the primary locale.  This can be used to set the thread's
  culture using `CultureInfo.CreateSpecificCulture()`.  In Windows Forms or services,
  the current culture can be accessed via `Thread.CurrentThread.CurrentCulture` and
  several properties like `TwoLetterISOLanguageName` or `DisplayName` allow retrieval
  of locale information.
tags:
- c#
- locale
- culture
- asp.net
- winforms
- globalization
- internationalization
- localization
- threading
title: 'Google Search: C#, Finding the Locale'

---
I have had a search against my site for finding the User Locale in C#.<p />There are a couple of ways that this can be done.  If you are using ASP.Net you can look at the Request.UserLanguages string array to see what preferences they have set up.  The first locale in the array should be the locale that they normally work.  Obviously this is browser dependent and user configuration dependent.<p />Using this information you could then set the threads culture (so that all comparisons etc are performed with the correct culture awareness) using the following piece of code:<p />Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(Request.UserLanguages[0]);<p />If it is a Winform or Service you could get the Current Culture just by inspecting the either:Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName;orThread.CurrentThread.CurrentCulture.ThreeLetterISOLanguageName;orThread.CurrentThread.CurrentCulture.ThreeLetterWindowsLanguageNameorThread.CurrentThread.CurrentCulture.EnglishName;orThread.CurrentThread.CurrentCulture.DisplayName;<p />

