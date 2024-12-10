---
date: 2005-11-29
published: true
slug: google-search-c-convert-date-from-uk-to-usa
summary: This post addresses the Google search query \"c# convert date from uk to
  usa.\" It provides a C# code snippet using `CultureInfo` and `DateTime` to convert
  a date string formatted according to UK conventions into a US date format.  The
  code takes the date string from a textbox, parses it using the UK culture settings
  (`en-GB`), and then formats the resulting `DateTime` object according to US culture
  settings (`en-US`) before outputting it to another textbox.
tags:
- c#
- date
- time
- format
- conversion
- uk
- usa
- culture
- locale
- datetime
- globalization
- internationalization
- .net
- csharp
- google search
title: 'Google Search: c# convert date from uk to usa'

---
One of the searches that came from Google to my site asked the following "c# convert date from uk to usa".<p />Now I don't really know exactly what the user was asking for, but I presume it is something fairly simple.  The way that I would convert a UK date into a US date is as follows.<p />Read in the UK date, short format/long format whatever into a DateTime field.  The output the date time using a US locale. <p />The following code works in vs2005.<p />CultureInfo cultEnGb = new CultureInfo("en-GB");CultureInfo cultEnUs = new CultureInfo("en-US");DateTime dtGb = Convert.ToDateTime(textBox1.Text, cultEnGb.DateTimeFormat);textBox2.Text = dtGb.ToString(cultEnUs.DateTimeFormat.ShortDatePattern);<p />It reads in the date and tries to load the text as a UK Date from the first textbox and then it uses the US locale to output the string into the second textbox.<p />

