---
date: 2005-09-05
published: true
slug: the-failures-of-my-first-ajax-application-par
summary: This blog post, the third in a series about my first AJAX application, focuses
  on the disastrous visual design.  While the functionality is there, the UI is frankly
  terrible. I've realized my design skills are lacking, and though I have a vision,
  I struggle to bring it to life visually. The problem is that the application's logic
  is tightly coupled to the UI.  Moving forward, I need to decouple these components.  The
  next version will have a UI-agnostic data structure that the UI can interrogate.  This
  separation will allow me to work on the AJAX framework, business logic, and UI independently.
tags:
- ajax
- javascript
- ui
- design
- usability
- web development
- software development
- architecture
- loose coupling
title: 'The Failures of my first AJAX Application: Part 3'

---
This is the third installment of my Failures of my First AJAX application and it is titled "It looked absolutly terrible!!"<p />If you take a look at my [application](http://www.kinlan.co.uk/AjaxExperiments/AjaxTag) you will see that it looks diabolical.  I realised about five minutes into my experimentation that I really need to improve my design skills.  I thouhgt initially that it might have been the tools I was using, but as the old saying goes "A bad worker blames his tools".  <p />I then realised that whilst I am quite good at programming, I sometimes lack the designers eye; that is to say I have a vision but not the skills to implement the final vision.<p />I can conceptualize the code easily and the implementation, it is just the UI that lets everything down.<p />The reason that this was the case is that the implementation of the software was highly dependant on the UI.  The UI drove the application code.  The next version of the software should be highly UI agnostic.  The code that calls the web services, should not rely on the HTML elements, rather it should rely on the data structures present in the application.  The UI should interrogate these data structures to determine what information to display.<p />In essence, the next version of the application should be tierd better.  The UI and the Logic (Business Logic if you like) should be loosly coupled together.  I should be able to change the Logic without affecting the page and likewise, I should be able to change the UI without having to alter the AJAX logic etc.<p />This would allow me to concerntrate my efforts on indiviudal parts of the application at any one time.  So I can develope an AJAX framework, the business logic and the UI all independantly of each other.<p />

