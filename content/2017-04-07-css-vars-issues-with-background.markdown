---
date: 2017-04-07 13:20:31+00:00
description: This little doozey hit me, so I'm documenting incase anyone else has
  the same issue
slug: css-vars-issues-with-background
summary: I encountered a styling issue with CSS variables and button backgrounds while
  creating a custom element.  Setting a button's `background-color` to a CSS variable,
  even with values like `initial` or `inherit`, overrides the default button styling
  in Chrome.  A workaround involves getting the computed default background color,
  assigning it to the CSS variable, and then applying it back to the button's style.
tags:
- css
- variables
- custom elements
- web components
- styling
- buttons
- shadow dom
- chrome
- browser compatibility
- workaround
title: Issue with css variables and button background styling

---

I've been creating a `<share-button>` [custom
element](https://paul.kinlan.me/creating-a-share-button-web-component/) and
after I launched it, I noticed that something was funky with default button
styling. They were white instead of grey.

I needed to be able to dynamically let the developer style the button that was
in my Shadow DOM and to do that you have to use CSS Variables. In Chrome (at
least... I need to test other browsers.) there seems to be no way to have a
button with a `background-color` whose value is defined by a CSS Variable even
if the value of the CSS variable is 'initial', 'inherit', something undefined,
and have it appear as the default button. 

The instant you do anything with the background color it changes the `<button>`
to be non-natively styled.

For example:

```css
<style>
#button2 {
  --but2: initial;
  background-color: var(--but2);
}  
</style>
<button>Button 1</button>
<button id="button2">Button 2</button>
```
Demo: 

<style>
  #button2 {
    --but2: initial;
    background-color: var(\-\-but2);
  }  
</style>
<button>Button 1</button>
<button id="button2">Button 2</button>

Here is the image of it failing for me: 
<img src="/images/before.png">


There is a way around this. My colleague [Surma](https://dassur.ma/) suggested
that I should try and get the default computed styles, add that to the 
custom CSS variable and then apply that to the background-color.

It works, but it is hacky.

    <style>
      #button3 {
        --but3: initial;
      }  
    </style>
    <button>Button 1</button>
    <button id="button3">Button 3</button>
    <script>
      const defaultButtonStyle = window.getComputedStyle(button3);
      button3.style.setProperty('--but3', defaultButtonStyle.backgroundColor);
      button3.style.backgroundColor = 'var(--but3)';
    </script>

<div>
  <style>
    #button3 {
      --but3: initial;
    }  
  </style>
  <button>Button 1</button>
  <button id="button3">Button 3</button>
  <script>
    const defaultButtonStyle = window.getComputedStyle(button3);
    button3.style.setProperty('--but3', defaultButtonStyle.backgroundColor);
    button3.style.backgroundColor = 'var(--but3)';
  </script>
</div>

Here is the image of it working for me: 
<img src="/images/after.png">