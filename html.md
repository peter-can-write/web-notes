# HTML

An HTML document is made up of opening and sometimes also closing tags. A tag is
denoted by angle brackets with some keyword between the brackets, i.e. `<tag>`.

## Important Tags and Notes

### DocType

The first tag of any HTML document should be the `<!DOCTYPE html>` tag. This is
not an HTML tag, but just a notification to the browser w.r.t. the type of
document you are passing it. In HTML 4, this was used to distinguish especially
between HTML and XHTML files. In HTML 5, there is only the HTML variant. In any
case, always prepend `<!DOCTYPE html>` to the top of your html document.

### Heading

There exist six heading tags, from `<h1>`, the largest heading, to `<h6>`, the
smallest heading.

### Anchor

Anchors use the `<a>` tag and define hyperlinks in an HTML document. They
reference a resource via the `href` *attribute*. An attribute is an addition to
an HTML tag that is given inside the brackets to specify some sort of
information. The href attribute may link to:

* An absolute URL, such as `http://example.com/index.html`
* A URL relative to the root of the website, such ass `index.html`
* A *fragment*, which is a link to a part of a website document and not a whole
  document in itself. For this, you can give certain elements of your website an
  `id` attribute and then reference that id in the `href` atttribute (and in
  CSS) via that id, prepended by a hash. For example, we may define a paragraph
  with an id `par`, i.e. `<p id="par">...</p>` and then create a hyperlink to
  that paragraph via `<a href="#par">...</a>`.
* Documents or services in other protocols, such as `ftp://`, `mailto:`, `file://`

Another important attribute you could add is the `rel` attribute, which tells
the browser what the *relation* of the current document is to the linked
file. For example, `rel="help"` tells the browser that the linked file has help
information available for the parent of the `<a>` element.

In HTML5 you can also, among other things, add the `download` attribute and
specify a file name. This will notify the browser that the linked resource
starts a download, while the file name is then the default name in the file
browser opened thereafter. If you leave the filename blank, the name of the
actual file is used.

Lastly, it may be useful to know of the `target` attribute, which tells the
browser in what context ("browsing context") to open the linked document. This
may be one of:

* `_self`: Open the link in the current context, i.e. window.
* `_blank`: Open the link in a new browser *tab* or *window*, depending on the
  user's (browser's) settings.

Resources:

* http://stackoverflow.com/questions/7857416/file-uri-scheme-and-relative-files
*
  http://stackoverflow.com/questions/11620698/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript
* http://stackoverflow.com/questions/12939928/make-a-link-open-a-new-window-not-tab

### Image

To display an image, one uses the `<img/>` self-closing tag. Its most important
attribute is the `src` attribute, which specifies a URI to an image. Another
important attribute is `alt`, with which you can specify a textual
representation of the image in case it fails to load. More precisely, omitting
this attribute indicates that the image is a *key* part of the content, while
leaving its argument blank (`alt=""`) tells the browser is not a key part of the
site and may be omitted, for example by non-visual (command-line) browsers.

### Figure

While an `<img>` tag creates a placeholder for an image and links an image
resource to that placeholder, the `<figure>` tag is of more structural nature
and allows the addition of a `<figcaption>...</figcaption>` caption nested
inside the figure tag (in which we also place the `<img>` tag). Moreover, it is
possible to group images side-by-side within the same figure and give them all
together a group caption:

```
<figure>
	<img src="foobar" alt="bla"/>
	<img src="barbaz"/>
	<figcaption>Two images, one caption.</figcaption>
</figure>
```

http://html5doctor.com/the-figure-figcaption-elements/

### Video

Before HTML5, there was no standard way of displaying a video. Rather, plugins
like flash had to be used. Since HTML5, there now exists the `<video>` tag with
an actual pure HTML5 implementation of a video player attached. The video tag
takes a `width` and `height` attribute in CSS pixels, as well as an optional
`src` attribute with a URL to a video file. As such, a basic video tag may look
like so:

```
<video width="300 px" height="500 px" src="/path/to/video"></video>
```

However, there exist many options (also for the `<audio>` tag). First of all, you
may in fact specify the source of the video via the `<source>` tag, which takes
the following attributes:

* `src="uri/to/video"`
* `type="video/<format>"` where format is one of `mp4`, `ogg` (Ogg Vorbis),
  `webm` (A web media format for audio and video sponsored by Google), i.e. a
  certain *codec*.

You can then specify multiple `<source>`s and the browser will proceed to pick
the most appropriate one. Moreover, after the `<source>`s you can add two more
types of content: `<track>` tags which specify text content for media, usually
subtitles (e.g. `<track kind="subtitles" srclang="en" label="English"
src="sub.en.vtt">`); and a textual representation of the video in case the
browser was not able to load any of the sources you specified.

Furthermore, there are additional attributes you can add to the `video` tag
itself, for example `autoplay` (starts the video as soon as possible),
`controls` which adds controls for playing, pausing and forwarding the
video. Also, you can specify a thumbnail via the `poster="url"` attribute, which
will be shown before the first frame of the video, i.e. before the user presses
play.

### Meta Tags

There are various meta tags which we can add to our HTML page. These meta tags
are not visible by the user, but tell the web browser and other services such as
search engines information about our website. The most important meta tags are:

* `<title>...</title>`: The title of your webpage, used by the browser and by
  search engines to identify or describe your site. This is what Google will
  name your page in its search listing.
* `<meta charset="utf-8">`: Use the UTF-8 character set to render the
  website. This is the HTML5 equivalent of `<meta http-equiv="Content-Type"
  content="text/html; charset=utf-8">`.
* `<meta name="description" content="An awesome website bla bla">`: A longer
  description of your website, as displayed by a search engine.
* `<meta name="keywords" content="foo, bar, baz">`: Keywords describing your website.

### Links

The `<link>` tag is responsible for linking an HTML document to some other kind
of resource, often a stylesheet. This tag takes a MIME `type` attribute such as
`text/css`, `rel` attribute to specify a relationship between the current
document and linked resource. This relationship is often `stylesheet` for CSS
files, but many other options, such as `help` for help files, exist. Also, for
favicons, you will often have a `link` tag with the `rel="icon"` attribute
set. Note, however, that for apple devices you must use `apple-touch-icon`
rather than `icon` as the relationship value. Lastly, it's often a good idea to add the `media="screen"` attribute to specify that the linked file is suitable for display on screens, as opposed to `media="print"`.

### MIME

MIME stands for *Multipurpose Internet Mail Extensions* and is a standard
specified by IANA for description of a media or content type. It is a two-part
identifier of a media format that may be transmitted over the internet. Each
MIME type consists of a *type* and a *subtype* and optionally parameters. The
type is a broad identifier of the type of media, while the subtype specializes
the type. In detail, a MIME type's format is `type/subtype
[; parameters]`. Currently, the following media types are allowed:

* `application`: Often followed by `/json` or `/x-www-form-urlencoded`.
* `audio`: For audio data, followed by the file extension, like `/mp3` or
  `/wav`.
* `example`:
* `image`: For image data, followed by an image extension like `/jpg`.
* `message`
* `model`
* `multipart`: Often for form input, followed `/form-data`.
* `text`: Often `/html` or `/css`.
* `video`: Like `audio`, followed by a video format specifier like `/mp3`.

https://en.wikipedia.org/wiki/Media_type

### Unicode

There are three ways to insert a unicode character into your HTML document: via
its name, in decimal or in hexadecimal. Either way, such a *character entity*,
as they are called, always begins with an ampersand character (`&`) and ends
with a semicolon. If the character entity is specified in decimal or
hexadecimal, the ampersand is followed by a hash symbol (`#`). Then these three
ways exist to display the spades glyph:

* `&spades;`
* `&#9824;`
* `&x2660;`

https://dev.w3.org/html5/html-author/charref

### `data-*` Attributes

HTML5 introduced `data-*` attributes, which allow you do add custom attributes
to any HTML tag to query and manipulate those elements. For example like so:

```HTML
<a data-foo="bar">Link</a>
```

And then:

```CSS
[data-foo="bar"] {
	color: red;
}
```

or

```JS
var a = []
var collection = document.getElementsByTagName('p');
for (var i = 0, length = collection.length; i < length; ++i) {
  var element = collection[i];
    if (element.hasAttribute('data-bar')) {
	    a.push(element);
	}
}

console.log(a[0].innerHTML);
```

### `<select>`

HTML5 adds a `<select>` tag for drop down boxes, to which you can add options
via the `<option>` tag. Each option should contain some text to
display. Optionally, `<option>` can have a `value` attribute to specify some
value to be selected other than the internal text:

```HTML
<select>
	<option>First</option>
	<option>Second</option>
	<option>Third</option>
</select>
```

### `<input>`

The `<input>` tag is used for form input, most often used inside the `<form>` tag. The input can take on many forms, such as buttons (legacy, use `<button>`) now, text, checkboxes and more. Inputs in a form are usually sent via POST requests to the web server. It has the following interesting attributes:

* `type`: Specifies the type of input it is, such as `button`, `text`, `checkbox` or others.
* `name`: The name (key) for the input in the form data transmitted.
* `value`: An initial value, e.g. for a text field. It is required for radio and checkboxes.
* `placeholder`: For text input, grayed out text as a hint to the user.
