# jQuery Accessible Accordion System, using <abbr title="Accessible Rich Internet Application">ARIA</abbr>

===========================
## Demo

A demo page is here: http://a11y.nicolas-hoffmann.net/accordion/ 

It can be included for one, two accordion systems or more in a page.

<p>This jQuery plugin will transform a simple list of  <code>hx</code> and <code>div</code>’s into a <strong>fantastic-shiny accordion system</strong>, using <abbr title="Accessible Rich Internet Application">ARIA</abbr>.</p>
===========================
```
<div class="js-accordion" data-accordion-prefix-classes="your-prefix-class">
 <h2 class="js-accordion__header">First tab</h2>
 <div class="js-accordion__panel">
   here the content of 1st tab<br><br>
   <a href="#">pweet</a><br><br>
   plop
 </div>
 
 <h2 class="js-accordion__header" data-accordion-opened="true">Second tab</h2>
 <div class="js-accordion__panel">
   here the content of 2nd tab<br><br>
   <a href="#">pweet</a><br><br>
   plop
 </div>
 
 <h2 class="js-accordion__header">Third tab</h2>
 <div class="js-accordion__panel">
   here the content of 3rd tab<br><br>
   plop
 </div>
 
 <h2 class="js-accordion__header">Fourth tab</h2>
 <div class="js-accordion__panel">
   here the content of 4th tab<br><br>
   <a href="#">pweet</a><br><br>
   plop
 </div>
</div>
```
===========================
## How it works

Basically:

- each ```js-accordion__header``` is duplicated to ```your-prefix-class__title``` into accordion contents, before being replaced by a button ```your-prefix-class__header```
- each ```js-accordion__panel``` gets a class ```your-prefix-class__panel```
- Once the HTML markup is set up, all ARIA attributes are added to make the link between accordion buttons and accordion contents, to know which one is related to which other.
- Keyboard shortcuts of ARIA Design Pattern for accordions are added, and you can easily navigate and use it.

===========================
## Keyboard

Keyboard navigation is supported, based on ARIA DP (http://www.w3.org/TR/wai-aria-practices/#accordion):

__If you focus in the accordion "buttons"__
- use Up/Left to put focus on previous accordion button,
- use Down/Right to put focus on next accordion button
- use Home to put focus on first accordion button (wherever you are in accordion buttons)
- use End to put focus on last accordion button (wherever you are in accordion buttons)


__If you focus in a accordion content__
- use Ctrl Up/left to Set focus on the carrousel button for the currently displayed carrousel tab
- use Ctrl PageUp to Set focus on the previous carrousel button for the currently displayed carrousel tab
- use Ctrl PageDown to Set focus on the next carrousel button for the currently displayed carrousel tab
 
And strike space or return on an accordion button to open/close it

__New: if you focus on next/prev buttons__
- use Ctrl Up to set focus on the accordion button for the currently displayed accordion content
- use Ctrl PageUp to set focus on the previous accordion button for the currently displayed accordion content
- use Ctrl PageDown to set focus on the next accordion button for the currently displayed accordion content


__Warning__: Ctrl+PageUp/PageDown combination could activate for some browsers a switch of browser tabs. Nothing to do for this, as far as I know (if you have a solution, let me know).

===========================
## Bonuses

__Content opened by default__

If you want to have an accordion content opened by default, just add the attribute ```data-accordion-opened="true"``` on a hx, example:
```
<h2 class="js-accordion__header" data-accordion-opened="true">
 Second tab
</h2>
```

__Other options__

The ARIA Design Pattern for accordions (http://www.w3.org/TR/wai-aria-practices/#accordion) allows to have several accordion panels opened at the same time (which is shown by the attribute ```aria-multiselectable="true"```). However, you might need to avoid this for design purposes or client request. To do this, you may set this attribute on the accordion container: ```data-accordion-multiselectable="none"```. Example:

```<div class="js-accordion" data-accordion-multiselectable="none" …>```

This option will set up ```aria-multiselectable="false"``` and the plugin will allow only one panel to be opened at the same time.


Enjoy.

<img src="http://www.nicolas-hoffmann.net/bordel/chuck-norris1.jpg" alt="Chuck Norris approved this" />
