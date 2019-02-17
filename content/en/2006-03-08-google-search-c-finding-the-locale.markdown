---
slug: google-search-c-finding-the-locale
date: 2006-03-08
 
title: "Google Search: C#, Finding the Locale"
published: true
---
I have had a search against my site for finding the User Locale in C#.<p />There are a couple of ways that this can be done.  If you are using ASP.Net you can look at the Request.UserLanguages string array to see what preferences they have set up.  The first locale in the array should be the locale that they normally work.  Obviously this is browser dependent and user configuration dependent.<p />Using this information you could then set the threads culture (so that all comparisons etc are performed with the correct culture awareness) using the following piece of code:<p />Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(Request.UserLanguages[0]);<p />If it is a Winform or Service you could get the Current Culture just by inspecting the either:<br />Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName;<br />or<br />Thread.CurrentThread.CurrentCulture.ThreeLetterISOLanguageName;<br />or<br />Thread.CurrentThread.CurrentCulture.ThreeLetterWindowsLanguageName<br />or<br />Thread.CurrentThread.CurrentCulture.EnglishName;<br />or<br />Thread.CurrentThread.CurrentCulture.DisplayName;<p />

