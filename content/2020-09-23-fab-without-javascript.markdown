---
slug: fab-without-javascript
date: 2020-09-23T10:55:20.479Z
title: FAB without JavaScript
link: ''
tags: [material design, css]
---

Just after my daughter was born we needed a simple way to track "Baby Habits" (Read: Eat, Poop, Wee, Sleep, and maybe a bit of Vom). During my baby duties when the baby was asleep I built [Akachan.app](https://akachan.app/) to help us keep on top of things.

I wanted this app to load instantly, and given that JavaScript is one of the biggest contributors to a slow page load, I gave myself the challenge to build Akachan as a SPA without client-side JS (more in another post), which for the most part I was able to do this with traditional POST's and a hefty amount of Service Worker logic.

There was one challenge, I wanted a Material Design like Floating Action Button (FAB) in my page that gave you the ability to quickly add any of the babies activities, but without adding any additional JavaScript.

<figure><video src="/videos/2020-09-23-fab-without-javascript-0.mp4" alt="Floating Action Button in action" controls></video></figure>

All of the solutions I could find required client-side JavaScript to function and I didn't want that, so I built one without any.

The solution was to have a 'menu' with an id of "add-nav" and then to use two anchors (one for the open state and one for the closed state) with an href of #add-nav and #remove-nav, and then using how the browser manages anchor based navigation by managing the visibility of the anchors and menus with CSS and the ":target" selector.

### HTML

```HTML
<nav id="add-nav">
  <a href="/feeds/new" title="Add a feed">🍼</a>
  <a href="/sleeps/new" title="Add a Sleep">💤</a>
  <a href="/poops/new" title="Add a Poop">💩</a>
  <a href="/wees/new" title="Add a Wee">⛲️</a>
</nav>

<a href="#remove-nav">
  <img src="/images/icons/ui/remove_white_18dp.svg" alt="" />
</a>
<a href="#add-nav" title="Add">
  <img src="/images/icons/ui/add_white_18dp.svg" alt="" />
</a>
```

### CSS

```CSS
footer > a[href~="#add-nav"] {
  display: flex;
  box-shadow: none;
}

footer > a[href~="#remove-nav"] {
  display: flex;
}

footer nav:target ~ a[href~="#add-nav"] {
  display: none;
}

footer nav {
  display: none;
}

footer nav:target {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 3.5em;
  right: 1em;
  font-size: 2em;
  padding: 0.1em 0.3em;
}

footer nav:target a {
  display: flex;
  text-shadow: hsla(218, 20%, 63%, 1) 0px 0px 0px;
  text-decoration: none;
  background-color: white;
  color: transparent;
  border-radius: 50%;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  width: 1.3em;
  height: 1.3em;
  justify-content: center;
  align-content: center;
  margin-top: 0.5em;
  padding: 0.1em;
}
```

### How this works

It was fun getting this to work, and it's nice to see that it's just plain HTML and CSS combined with the browsers state.

Both anchors are positioned on top of each other, with an initial "add-nav" element positioned visible, and remove-nav hidden.

1. When the nav element is the target (after the user clicks the add-nav anchor) the menu is displayed (nav:target selectors). We also then hide the "add-nav" anchor and display "remove-nav" anchor.
1. When the user clicks the "remove-nav" anchor there is no matching target element, so the DOM state is reverted and the CSS hides the menu and re-displays the "add-nav" anchor.

### Trade offs

It's not without issues, because we are using the browser navigation, each time you click the FAB it will add a navigation to the history stack. On one hand this is good, it means you can dismiss the FAB with a backwards navigation, but on the other hand if you spam the FAB, it will create a lot of navigations. There's no solution without adding JS, I would love a `a rel="replace"` option on anchors so that we could navigate to an id in the page without creating a history item.

### Conclusion

There are some things that I need to clear up, when the menu opens it would be nice to have some animations, but it was a lot fun creating this and it's great to see how far you can get with just pure HTML and CSS in building rich and interactive applications.

If you have any suggestions, please let me know what can be done to improve this.

I would also love to see what people can do without layering more and more JS. If you have any other HTML and CSS only UI interactions, then I would love to see them.

FAB.
