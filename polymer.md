# Polymer

Polymer is a frontend library built by Google and based on the WebComponents standard. It is similar to Angular in how it lets you define custom HTML elements, but dissimilar in two points:

1. The elements you create follow the [WebComponents](http://webcomponents.org/) standard.
2. Polymer is only that, while Angular is much more. Angular does routing, services, XHR support and other more complex things, while Polymer is only for components.

## Basics

First, let's discuss some basic, infrastructural concepts related to Polymer and the modern HTML features on which it builds.

### `import`

First of all, Polymer makes use of the [`rel="import"`](https://www.html5rocks.com/en/tutorials/webcomponents/imports/) feature supported by newer browsers. Basically, this import relationship tells the browser to load the HTML contents of the `src` in a `link` tag and make it available via JavaScript. Imagine, for example, you have some file `foo.html` that you want to include in your `index.html` page. You can do this like so:

`foo.html`:
```HTML
<div class="foo">Hello, World!</div>
```

`index.html`:
```HTML
<head>
  <link rel="import" href="foo.html">
</head>
<body>
  <script>
    const link = document.querySelector('link[rel="import"]')
    const content = link.import.querySelector('.foo');
    document.body.appendChild(content.cloneNode(true));
  </script>
</body>
```

What you see here is that we included a `link` with the `rel="import"` attribute, pointing to the file we want to import. This only "registers" or *loads* the file, but does not actually include its HTML or anything. It only makes it available via the `import` attribute on the element. As such, we queried for that element and retrieved the loaded document via a query. We then cloned the content and added to our DOM.

Note that the browser will actually only ever `import` a given source once, so you could use `import` in multiple `link`s in multiple places, but the content would only ever be loaded once. That's why we clone the contents of the import, so that other places can also use it, unmodified. You can also add the `async` attribute to import asynchronously.

### `template`

Another new HTML feature that Polymer makes use of is `template`s. `template` is a new tag, that tells the browser that the HTML in its contents are only to be registered and stores, but not to be parsed or evaluated. This allows us to load the template HTML, modify it by setting `src`s or editing `innerText`s, and then including it ourselves. This plays well together with `import`. As such, we may want to write:

`foo.html`
```HTML
<template id="my-template">
  <img alt="My image">
</template>
```

Note how we do not give the image tag a `src`. That is because we only want to use it as a *template*, so we can do something like:

`index.html`
```HTML
<head>
  <link rel="import" href="foo.html">
</head>
<body>
  <script>
    const link = document.querySelector('link[rel="import"]')
    const template = link.import.querySelector('#my-template');
    const content = document.importNode(template.content, true);

    content.querySelector('img').src = 'cats.com/cat.png';

    document.body.appendChild(content);
  </script>
</body>
```

Here we import the template like we did in the section on `import`. However, we make use of the `document.importNode` method, which can copy a node from an external document. Since we're importing a new document, this works here. We pass `true` to specify that the copy be deep. Also note that we access the contents of the template using `content`, which is defined on the `template` element. Then, we "render our template" by setting the `src` of the image and finally include the image.

## Polymer Element

You can and should put each polymer element you will want to define in its own file. The basic structure of a polymer element will then look like so:

```HTML
<dom-module id="name-of-element">
  <style>
  :host {
    /* ... */
  }
  </style>
  <template>
    <div>Your element's HTML goes here.</div>
  </template>
  <script>
  Polymer({
    is: 'name-of-element'
  })
  </script>
</dom-module>
```

The `dom-module` is the basic container of a polymer element (it used to be called `polymer-element`). The, we used the `template` tag described above to define our element. Because this element will live in a *local DOM* (*shadow DOM*), whose styles and scripts are locally scoped (like a scoped document fragment), we must define our styles inline. Also, we include a `<script>` to define our element using the `Polymer` function, whose most basic attribute is `is`, where we pass the name of the element, which should also be the ID of the `dom-module` tag.

## Events

Polymer has event-handling built in and provides various intuitive event-handling APIs. For one, you can define event handlers on your entire host element. However, you can also add a listener (handler) to any element (tag) inside your custom element, either via identifying them through their IDs or via special attributes.

First, let's look at what events Polymer has. Most importantly, Polymer tries to unify events between mobile and desktop. For each event, the `event` object has a `detail` object, which contains more relevant properties that can be retrieved. Note that these are defined next to the regular browser events, which you may still use. This leads to the following events:

* `down`: Finger/button went down. `event.details` properties include:
          + `x`: clientX coordinate
          + `y`: clientY coordinate
          + `sourceEvent`: the original DOM event that caused the action.
* `up`: Finger/button went up. `event.details` properties include:
          + `x`: clientX coordinate
          + `y`: clientY coordinate
          + `sourceEvent`: the original DOM event that caused the action.
* `tap`: Finger/button went down and back up. `event.details` properties include:
          + `x`: clientX coordinate
          + `y`: clientY coordinate
          + `sourceEvent`: the original DOM event that caused the action.
* `track`: Sent while finger/button is down and moving. `event.details` properties include:
          + `state`: A string indicating the tracking state. One of:
            - `start`
            - `track`
            - `end`
          + `x`: clientX coordinate
          + `y`: clientY coordinate
          + `dx`: Change in pixels horizontally since first track event.
          + `dy`: Change in pixels vertically since first track event.
          + `ddx`: Change in pixels horizontally since last track event.
          + `ddy`: Change in pixels vertically since last track event.
          + `hover()`: Returns the element currently under the mouse (while dragging)

See [here](https://www.polymer-project.org/1.0/docs/devguide/gesture-events) for more documentation on this.

The first way to register a listener is then to register one on the host element (the one you are defining). You do so by mapping event names (including but not limited to the above) to functions in a `listeners` object:

```HTML
<dom-module id="x-custom">
  <template>
    <div>Tappable</div>
    <div>Tappable</div>
    <div id="special">Special</div>
  </template>
  <script>
  Polymer({
    is: 'x-custom',
    listeners: {
      tap: 'regularTap',
      'special.tap': 'specialTap'
    },
    regularTap: function(e) { alert('Thank you for tapping'); }
    specialTap: function(e) { alert('Thank you especially for tapping'); }
  })
  </script>
</dom-module>
```

As you can see here, we map the `tap` event to the `regularTap` function. This will be called when any element inside the host (the element in the `dom-module` we are defining) is tapped (clicked). However, you can also see that we can be more specific and activate events only for certain elements. We do so by giving the element of focus an ID and then mapping a string following the schema `'<id>.<event>'` to the listener. Note how we then define the listeners on the object we pass to Polymer directly.

The other way to register a handler avoids giving each "special" element an ID. In this method, you simply register the event handler with `on-<event>="<handler>"`, like so:

```HTML
<dom-module id="x-custom">
  <template>
    <button on-tap="handleTap">Kick Me</button>
  </template>
  <script>
    Polymer({
      is: 'x-custom',
      handleTap: function() {
        alert('Ow!');
      }
    });
  </script>
</dom-module>
```

Notice the `lower-case-with-dashes` to `camelCase` mapping that happens, just like in Angular.

### Custom Events

Lastly, we can also `fire` our own custom events. This is done simply with the `fire` function on the `this` object. It takes the name of the event to fire and an object that will be available as `event.detail` on any handler (even outside Polymer):

```HTML
<dom-module id="x-custom">
  <template>
    <button on-click="handleClick">Kick Me</button>
  </template>
  <script>
    Polymer({
      is: 'x-custom',
      handleClick: function(e) {
        this.fire('kick', {kicked: true})
      }
    });
  </script>
</dom-module>

<x-custom></x-custom>

<script>
  document.querySelector('x-custom').addEventListener('kick', function(e) {
    console.log(e.detail.kicked); // true
  })
</script>
```

### Additional Listeners

There are some additional listeners you can add to the constructor object you pass to Polymer to listen for certain state changes on the Polymer element. The full list is [here](https://www.polymer-project.org/1.0/docs/devguide/registering-elements). The most important one is `ready`, which you can call to configure your object once is created. This would be the place for "additional configuration" of your object, where you can access nodes via `this.$` (see blow).

## Element Access

Polymer automatically registers all *statically* defined elements on the `this.$` object, available within the object you pass to the `Polymer` function. This means that any element with an `id` (known at parse-time) will be accessible as `this.$.<id>` and return the element with that ID. Any dynamically created elements, such as those by `dom-repeat` and `dom-if`, are available via the `this.$$(<selector>)` function, which queries the element's local tree. Basically, `this.$$` is a reference to `Polymer.dom(this.root).querySelector` which queries the local DOM.

```HTML
<dom-module id="x-custom">
  <template>
    Hello World from <span id="name"></span>
  </template>
  <script>
    Polymer({
      is: 'x-custom',
      ready: function() {
        // Sets the contents of the <span> to "x-custom"
        this.$.name.textContent = this.tagName;
      }
    });
  </script>
</dom-module>
```

### Data Binding

Like Angular, Polymer includes mechanisms for exchanging data between parts of the DOM. For this, Polymer has the concepts of *attribute-binding*, *property-binding* as well as *one-way-binding* and *two-way-binding*. These different possibilities basically affect either the left side (`key`) or right side (`value`) in a `key=value` assignment on an HTMLl tag.

First, for the left side:

* *Property-binding* is when you write `key=value`. This will assign the `value` to the `key` *property*, __that you defined in your constructor__.
* *Attribute-binding* is when you write `key$=value`. This will assign the value not to a Polymer property, but simply to the HTML attribute. For example, if you wanted to set the `href` attribute, you would write `href$=`, since `href=` would imply the presence of an `href` key in the `properties` object you gave Polymer.

Then, on the right side, you have:

* *Two-way-binding*: Here, you write the name of a property in double curly brackets: `key="{{propertyName}}"`. This will update whatever is on the left to the "interpolated" (in Angular lingo) value of `propertyName`. Because this binding is two-way, any change of the value of the `key` attribute here would be reflected on the `property`. Because the data type you set in the Polymer configuration determines the type of the property here, the property itself must always be quoted in the HTML.
* *One-way-binding*: This method uses double square brackets: `key="[[propertyName]]"`. It allows `key` to take on and reflect the value of `propertyName`, but `propertyName` will not be changed if the attribute avlue of `key` changes.

Note that you cannot do much logic in the interpolation expressions. You can only pass a name, or negate it with `!`.

### Control Flow

Like Angular, Polymer also includes some simple control flow primitives. More precisely, you can conditionally include an element with `dom-if` or repeat it with `dom-repeat`.

### `dom-if`

The simple `is="dom-if"` attribute on an element will include the element only if the accompanying `if="{{value}}"` attribute has a truthy value. This is updated live, but in a way such that the element is only rendered the first time the `{{value}}` becomes true, and then only hidden via `display: none` (or similar). That is, elements are not removed and then re-rendered when the value becomes true again, for performance reasons of course.

```HTML
<dom-module id="user-page">
  <template>
    All users will see this:
    <div>{{user.name}}</div>

    <template is="dom-if" if="{{user.isAdmin}}">
      Only admins will see this.
      <div>{{user.secretAdminStuff}}</div>
    </template>
  </template>

  <script>
    Polymer({
      is: 'user-page',
      properties: {
        user: Object
      }
    });
  </script>
</dom-module>
```

### `dom-repeat`

For repetitions, the basic setup includes having a `template` with an `is="dom-repeat"` attribute as well as `items="{{sequence}}"`. This will basically iterate over the `sequence` and make two variables available in the scope of the template: `item` and `index`. The latter is the index in the sequence, the former is the current element selected from the sequence.  This lets you write code like this:

```HTML
<dom-module id="employee-list">
  <template>
    <div>Employees: </div>
    <template is="dom-repeat" items="{{employees}}">
      <div># {{index}}</div>
      <div>First name: {{item.first}}</div>
      <div>Last name: {{item.last}}</div>
    </template>
  </template>
  <script>
    Polymer({
      is: 'employee-list',
      ready: function() {
        this.employees = [
          {first: 'Bob', last: 'Smith'},
          {first: 'Sally', last: 'Johnson'}
        ];
      }
    });
  </script>
</dom-module>
```

When you add an event listener to something inside a `dom-repeat` template, the event fired will have an `event.model` property that is equal to the `item` of the element on which the event was registered. As such, you can access anything you would access on `item` inside the template, as `event.model` in your listener.

You can also add a `filter` function using the `filter` attribute. The filter function, which you define on the Polymer object, should take an element and return a boolean.

### Observers

Polymer allows you to register observers for properties, that are called whenever the property's value changes. To do so, very simply include an `observer: <function>` attribute on the property definition:


```HTML
<dom-module id="my-element">
  <template>
    <input type="text" name="thing">{{thing}}</input>
  </template>
  <script>
  Polymer({
    is: 'my-element',
    properties: {
      thing: {
        type: String,
        observer: 'inputChange'
      }
    },
    inputChange: function(newValue, oldValue) {
      if (newValue != oldValue) {
        alert('Input changed!');
      }
    }
  });
  </script>
</dom-module>
```
