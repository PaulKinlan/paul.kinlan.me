---
slug: iterating-accross-a-users-links-in-c-
date: 2005-04-17
 
title: Iterating Accross A Users Links in c#
published: true
---
One thing I have been looking at recently is how to access the Users Internet Explorer Favorites.<p />I managed to find two resources somewhere, one was c# to find the favorites and the other was VB.Net code which parse the *.Url file.<p />I have the code below (tv is a Tree view on a form):<br /><div class="CodeRay">
  <div class="code"><pre>...DirectoryInfo di = new DirectoryInfo( System.Environment.GetFolderPath(  Environment.SpecialFolder.Favorites ));EnumerateFavorites(di);...</pre></div>
</div>
<p />The above code will get the directory information about a users Favorites. The Static vairable "Environment.SpecialFolder" contains some other very usefull locations. My Computer, My Network etc.... I think :)<p /><br /><div class="CodeRay">
  <div class="code"><pre>private void EnumerateFavorites(DirectoryInfo dii){    tv.Nodes.Add(dii.FullName);    int i = tv.Nodes.Count-1;    foreach(DirectoryInfo dI in dii.GetDirectories())    {                 EnumerateFavorites(dI);    }    foreach(FileInfo fi in dii.GetFiles())    {        string URL = GetUrlFromLinkFile(fi.FullName);        tv.Nodes[i].Nodes.Add(URL);         }}private string GetUrlFromLinkFile(string file){    StreamReader sr = null;    string content;    if(!file.EndsWith('.url'))        return '';     try    {        sr = new StreamReader(file);        content = sr.ReadToEnd();    }    finally    {        if(sr != null)            sr.Close();    }    if(content.Length == 0)        return '';    int startI = content.IndexOf('URL=');    if(startI == -1)        return '';    startI += 4;    int endI = content.IndexOf(    Environment.NewLine, startI + 1);    return content.Substring(startI, endI -startI);}</pre></div>
</div>
<p />What appears above is code that will Recursivly iterate into any Folders that the user has defined for their Favorites. Some futher code will also parse the .URL.<p />The *.URL file is a basic text file (much like the AutoRun.inf file). One line starts URL=kinlan.co.uk etc. The function <span style="color: #3366ff;">GetUrlFromLinkFile</span><span style="color: #000000;">, parse this information and returns it as a string.</span><p />If I find the resources where I got this from I will give the credit where it is due.<p />One thing that is not available in the *.URL is the text that appears in the Internet Explorer Favorites menu.  For example [www.microsoft.com](http://www.microsoft.com) might appear as "Microsoft" in the Favorite menu.  If anyone knows how to do this in c# let me know (I would be greatful).  I have a feeling that it might be something to do with IShellLink, but I am not too sure, nor am I any good with Interop [at the moment, I will have to learn]

