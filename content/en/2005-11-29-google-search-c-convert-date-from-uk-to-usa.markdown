---
slug: google-search-c-convert-date-from-uk-to-usa
date: 2005-11-29
 
title: "Google Search: c# convert date from uk to usa"
published: true
---
One of the searches that came from Google to my site asked the following "c# convert date from uk to usa".<p />Now I don't really know exactly what the user was asking for, but I presume it is something fairly simple.  The way that I would convert a UK date into a US date is as follows.<p />Read in the UK date, short format/long format whatever into a DateTime field.  The output the date time using a US locale. <p />The following code works in vs2005.<p />CultureInfo cultEnGb = new CultureInfo("en-GB");CultureInfo cultEnUs = new CultureInfo("en-US");DateTime dtGb = Convert.ToDateTime(textBox1.Text, cultEnGb.DateTimeFormat);textBox2.Text = dtGb.ToString(cultEnUs.DateTimeFormat.ShortDatePattern);<p />It reads in the date and tries to load the text as a UK Date from the first textbox and then it uses the US locale to output the string into the second textbox.<p />

