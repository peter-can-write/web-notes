# CSS

Cascading Style Sheets (CSS) are used to style plain HTML web pages.

## Anatomy of CSS

CSS files, a.k.a. stylesheets, consist of *rules*. In turn, a CSS rule is
composed of the following basic elements:

* A *selector*, which selects a specific part of an HTML document to style.
* *Properties*, which are style keys that identify certain style "knobs" one can
  turn, such as the color of an element.
* *Values*, which give a property (key) a concrete value, such as the color
  `red` for the `color` property, which modifies a website's text font color.

Moreover, you may use `/* ... */` for comments.

## Colors

There exist multiple ways to specify colors in a CSS document. Often, they will
specify a color in RGB coordinates, with each color component being in a range
from 0 to 255. More specifically, you have the following options:

* Color names: There are 140 standard web colors with names you can refer to in
  text, such as `red`, `blue` or `green`.
* Hexadecimal RGB values: Colors are specified as a string of six hex values,
  representing the three R, G, B color components with two hex digits, i.e. 8
  bits each. This string is then preceded by a hash. For example, red would be
  `#FF0000`. Moreover, there exists a shorthand notation of only three hex
  digits, where each hex digit, when expanded, is simply repeated. That is,
  `#123` would be expanded to `#112233`.
* RGB values: The `rgb` "function" can be used to specify the RGB coordinates in
  decimal numbers, e.g. `rgb(0, 128, 0)` for a green tone.
* RGBA: Like RGB, but with an *alpha* channel which specifies the transparency
  (opacity) of the color on a fractional range from 0 to 1, where 0 means full
  transparency and 1 full opacity, i.e. the color is *opaque*. For RGBA, you can
  use the `rgba(R, G, B, A)` function.
* HSL: The Hue, Saturation, Lightness color model, which represents colors on a
  cylinder. The hue parameter is a degree from 0 to 360, with certain degree
  specifying certain color tones, such as red at 0, green at 120 and blue
  at 240. The saturation (going from the center outwards in the cylindrical
  model) specifies how full the color is (similar to opacity) and is specified
  as a percentage value, from `0%` to `100%` (literally with the percent
  character). Lastly, the lightness meausures how bright the color is, from `0%`
  being pitch black (for any hue) and `100%` being pure white (for any color),
  with tones of the color in between. You use the `hsl(H, S, L)` function for
  HSL colors.
* HSLA: Like HSL, but again with an alpha channel.

Resources:

* http://www.w3schools.com/cssref/css_colors.asp
https://en.wikipedia.org/wiki/HSL_and_HSV

## Screen Size Terminology

There are many different terms associated with screen size, resolution, pixel
density and more. These are explained in the following paragraphs.

* *Screen size*: The absolute width and height of your screen in a normalized
  metric such as a centimeter or inch.
* *Screen density*: The number of pixels in a normalized, fixed unit square,
  such as a centimeter squared. Often measured in *dpi*, which stands for *dots
  (pixels) per inch*.
* *Screen resolution*: The number of pixels available in the entire screen,
  which calculates itself from the screen size (squared inches) times the screen
  density (pixels per squared inch).

Resources:

*
  http://stackoverflow.com/questions/22397030/difference-between-screen-size-and-screen-density-in-android
*

## Selectors

There exist many additional options to specify a selector in CSS, rather than
just a plain tag such as `p` or class such as `.class`. These are the more
interesting variants:

* `a, b`: selects both `a` and `b` tags at the same time.
* `a b`: selects any `b` nested inside an `a` tag, any any level (recursively)
  in the DOM.
* `a > b`: selects any `b` that is a *direct child* of an `a` tag. That is, it
  may be nested inside an `a` tag, but with no intermediate tags between the `a`
  and `b` tags. For example, this applies to `<a><b></b></a>` but not
  `<a><c><b></b></c></a>`.
* `a + b`: selects the first (adjacent) sibling tag `b` placed immediately
  *after* an `a` tag. This would apply to `<a></a><b></b>`.
* `a ~ b`: selects all following siblings of a tag `a`. That is, it acts like
  `+` but applies not only to the first adjacent sibling, but all adjacent
  siblings.
* `[attribute]`: selects all elements with the specified attribute set.
* `[key=value]`: selects all elements wit the specified attribute set to the
  given value.

Note that there is special syntax for *chaining* classes. That is, if you want to apply styles only to elements that are in class `.a` *and* class `.b`, then you must use `.a.b` as your selector:

```html
<a href="google.com" class="foo bar baz"></a>
```

```css
.foo.bar.baz {
  color: black;
}
```

## Properties

### `background-size`

The background-size property adjusts the dimensions of a background image. The
possible values are:

* A length in a certain metric, e.g. `px`, `cm` or `em`.
* A perecentage, relative to the dimensions of the parent of the element.
* The height and width of the image separately, space separated, with either
  value (individually) being:
  - `auto`: Fit flexibly to contain *children*.
  - A length in pixels, centimeters or another unit of measurement.
* The `contain` keyword, which *letterboxes* the image relative to its
  *parent*. That is, it will be scaled as large as possible w.r.t. to the
  image's height relative to the parent's height, while preserving the
  width-height ratio. That is, there may be blank spaces to the left and right
  of the image, filled with the background color. You may need to specify
  `background-repeat: no-repeat` to ensure that the blank space is not filled
  with a (maybe clipped) repetition of the image, if you wanted the blank
  space.
* The `cover` keyword, which fills the parent element in such a way that there
  are no blank spaces, while possibly clipping the image (as if it were to
  continue outside the containing elemnt).

http://stackoverflow.com/questions/15943009/difference-between-css-height-100-vs-height-auto

### URLs

For certain CSS properties, such as images, you may want to specify paths or
URLs. You do so with the `url` function, to which you can pass a file URL to
load. Like so, we can, for example, specify a background image for an HTML class
`foo`:

```CSS
.foo {
	background-image: url();
}
```

The URL inside the `url()` function call may be singly or double quoted, or not
quoted at all. Moreover, the URL may be relative rather than an absolute
hyperlink. If so, it is relative to the stylesheet and not the linked HTML file
(since many HTML files may link to the same stylesheet).

### `@import`

CSS has the `@import` *directive*, which allows you to include the contents of another CSS file into the current one. It takes a URL and literally includes everything from that file into the current one:

```css
@import url('/path/to/file.css');
```

Moreover, you may append a media query list to only conditionally include the file:

```css
@import url('/path/to/file.css') screen and (orientation:landscape);
```

### `display`

With the `display` property, we can specify how HTML elements should be aligned
relative to each other. More precisely, there are three most common values for
the `display` property:

* `block`: With `block`, we specify that an element with this property and
  value should be rendered on a line separate to others. As such, it can have a
  width, height and margin. They *force* a line break after them.
* `inline`: Conversely, `display: inline` would make an element appear inline,
  side-by-side, next to other elements. Such an element can have no width,
  height or vertical margin (only `margin-left` and `margin-right`).
* `inline-block`: Makes an inline element behave like a block, in the sense that
  content flows around it, as if it were one big element. Most importantly, such
  elements can then have a `height`, `width` and vertical margin. This is useful
  to have elements behave like blocks, while being able to place them
  side-by-side.

By default, there exist the following conditions:

* Headings, paragraphs, and unordered list elements and especially `div`s are
  implicitly block-level, i.e. they force a line-break.
* Images, anchors and `span`s are implicitly `inline`.

*
  http://stackoverflow.com/questions/8969381/what-is-the-difference-between-display-inline-and-display-inline-block
* http://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block?noredirect=1&lq=1

### `position`

The `position` keyword enables the use of `relative` positioning, among other
positioning schemes. Basically, the `position` property controls the location of
an element relative to *where it would normally be placed*. The possible values
for `position` are:

* `static`, which effectively does nothing and places an element exactly where
  it would usually be.
* `relative`, which enables `top`, `bottom`, `left` and `right`
  properties. These properties act similar to margin specifiers, but reserve
  space for the element's original location. That is, if we set `position:
  relative` and `top: 10px`, that will keep reserve the space the element would
  normally have occupied, but nevertheless move the element down by 10 pixels,
  taking up even more space.
* `absolute`, which makes the element take up no space on its own. Rather, the
  element is positioned relative to its nearest positioned ancestor (with the
  `position` positioned set and not set to `static`) or the initial container
  (`<body>`) if no such ancestor exists.
* `fixed`, leaves the element positioned in its original location, taking up no
  space as the rest of the page flows "through" it. This is especially useful
  for "sticky" `div`s such as headers or footers.

## Media Queries

Media Queries are a CSS feature that allow you to query properties about the device on which your website is being viewed on and conditionally define certain CSS rules. For this, you use the `@media` directive, followed by zero or more expressions, expressed as media features (such as width, height or orientation) that each evaluate to a boolean value and that you can combine using boolean operators. The operators allowed are `and`, the comma as an `or` and lastly `not`. For example:

```css
@media (min-width: 500px), handheld and (orientation: landscape) {
  /* ... */
}
```

This query will match if the width of the device with which the content is being viewed is at least 500 pixels, or the `handheld` feature is defined, and the orientation must be in landscape mode (as opposed to portrait). Other media features include:

* `width`
* `height`
* `resolution`
* `color` (the number of bits per color).

Reference is [here](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).
