---
date: 2005-06-10
published: true
slug: changing-styles-with-the-times
summary: 'I''m exploring ways to dynamically change the layout and styles of my Avalon
  application at runtime, allowing users to switch between different UI themes.  I''m
  considering several approaches:

  1. **Stylesheets:**  Can styles be stored externally and loaded dynamically?  I''ve
  looked at DynamicResource but I''m unsure if it supports loading XAML from external
  files.

  2. **Dynamic XAML Loading:** Can I reload the XAML used by a window at runtime using
  LoadComponent? The _contentLoaded flag suggests this might not be possible.

  3. **Restart on Style Change:**  A simpler but less desirable option is to require
  the application to restart when the user changes the UI style.

  4. **Localization Analogy:**  Could the localization framework be adapted for loading
  different XAML files?  I''m unsure if there''s a connection between Resource Files
  and XAML resources.'
tags:
- Avalon
- XAML
- Styles
- DynamicResource
- LoadComponent
- Runtime
- UI
- Themes
- Localization
title: Changing Styles with the times

---
I have been thinking and looking into whether I should code up what I am thinking, I would like to pass it by you guys to see if it is possible or has been done before (or if there is an easier way).<p />Basically my thoughts have been these:In Avalon, is it possible to completely change the layout and styles at runtime such that I could have "n" different layouts to the same app, all of which are loaded as requested by the user? What I mean by completely change, is not only adjusting colours and graphical styling, but also adjusting ContentTemplates, HeaderTemplates and positioning in the Logical Tree. Would it be possible to have one "Style" that is based around, say, a DockPanel and another around a Grid Panel each can be loaded and alternated between at runtime, but have the Backend Business Logic remain untouched?<p />In essence I would like to switch from one XAML based front-end to another XAML based front end. Without affecting the application.<p />My First thought was, could I achieve this with a style sheet system, so I investigated the Styles property in Avalon and I couldn't determine if the styles could be stored in an external resource, such as a styles folder which contains all the different styles. Can the styles be stored in an external resource?<p />I did however see some threads (most specifically "<a href="http://groups.google.co.uk/group/microsoft.public.windows.developer.winfx.avalon/browse_thread/thread/1b8ee91ed124eb10/722bc16a41297caa?q=DynamicResource+winfx+how+do+i&amp;rnum=1&amp;hl=en#722bc16a41297caa">How Do I - Resource-Style Questions</a>") which pointed me towards &lt;button style="DynamicResource: "&gt;..&lt;/button&gt; I was thinking this would enable me to keep the logical tree static but just change things such as colours, widths and the visual tree of certain components based on configuration options. But I am not too sure if this is what I am aiming for. I could configure colours and widths etc, but I don't think they could be bound to XAML (i.e loaded from a file).<p />My second thought was can we change the XAML file that the system uses at runtime? I have noticed some code in InitializeComponent of the window which sets which compiled XAML file to use:<p /><blockquote class="posterous_medium_quote">public void InitializeComponent() {if (_contentLoaded) {return;}_contentLoaded = true;System.Uri resourceLocator =new System.Uri("Window1.baml",System.UriKind.RelativeOrAbsolute);System.Windows.Application.LoadComponent(this,resourceLocator);}</blockquote><p />Could I basically re-call LoadComponent at any point in the app to change the UI based on another BAML file that user specifies. I assume we are not able too because _contentLoaded seems to be there to catch cases like this where InitializeComponent gets called more than once.-Or-Thirdly, Could I just have the URI as an item that is read in at init time, and when the user wants to change their UI they have to restart the application.<p />Fourthly, I thought that localisation might be similar to what I need, each language is compiled into a Resource that can be built into the assembly or referenced externally. However due to my lack of experience I thought that there might be a correlation between a Resource File and the resources in a XAML file (Page.Resources/Application.Resources) but I have not been able to determine if they are one and the same thing or completely different. So I am not aware that I could reference the resources externally in a XAML file from a ResourceFile (see thought 1 ;) )

