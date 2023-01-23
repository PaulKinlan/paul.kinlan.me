---
slug: google-search-directory-explorer-c-
date: 2006-04-01
 
title: "Google Search: Directory explorer c#"
published: true
---
A visitor to my site was looking for "directory explorer c#".  I know they wouldn't have found what they wanted, they would have found my <a href="http://www.kinlan.co.uk/tag%20directory">tag directory</a> instead.  Hopefully this post might rectify this in the future.<p />The first thing I think when I saw this query was, does this person mean ASP.Net Internet Directory browsing or do they mean a Win32 application for browsing directories in the System.IO namespace.<p />I am presuming the latter, because the former can be configure in IIS without any c#.<p />In .Net there is a whole bevy of File and Directory functionality.  Mostly all the functions are static Methods so you can do things such as:File.Exist("c:\\test.txt");which will return a boolean if test.txt exists on the c:\ drive.<p />You can get a list of directories by calling Directory.GetDirectories("C:\\"); which will return a string array of directories directly underneath the C: drive.<p />I hope this quick blog helps anyone popping by my site.<p />

