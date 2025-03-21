---
title: "Jeremy Keith: Adactio: Journal—Command and control"
date: 2025-03-21T21:46:38.938Z
link: https://adactio.com/journal/21803
---
Link: [Adactio: Journal—Command and control](https://adactio.com/journal/21803)

> I’ve been banging on for a while now about how much I’d like a declarative option for the Web Share API. I was thinking that the type attribute on the button element would be a good candidate for this (there’s prior art in the way we extended the type attribute on the input element for HTML5).

I'm fully aligned with Jeremey on this one, there's a heap of commands and actions that a user invokes in the browser that should be more accessible from the client and be able to be invoked without JavaScript.

Turns out there is work being done around this area for `dialog` and `popover` elements, with scoping for more elements in the future.

> Things have been rolling along and invoketarget has now become the command attribute (there’s also a new commandfor attribute that you can point to an element with an ID). Here’s a list of potential values for the command attribute on a button element.
>
> Right now they’re focusing on providing declarative options for launching dialogs and other popovers. That’s already shipping.

More details about what Jeremy is talking about can be found in this [developer.chrome.com](https://developer.chrome.com/blog/command-and-commandfor#the_command_and_commandfor_pattern) article.

I agree with where Jeremy wants to see this head, as the article says "We welcome community input—if you have suggestions don't hesitate to file an issue on the [Open UI Issue Tracker](https://github.com/openui/open-ui/issues/new)."

Maybe we can get `button command="bookmark"`... I joke... kinda... we used to have an API for this back in the day and while I don't think we would want an API to your bookmarks, I could see a world where a lot of the Fediverse's issues could be solved with a few more declarative commands.