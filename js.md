JavaScript

JavaScript is a programming language based on the ECMAScript standard used to
manipulate the DOM (document object model), the basic data structure of a
website.

http://stackoverflow.com/questions/912479/what-is-the-difference-between-javascript-and-ecmascript

## Setup

To embed a JavaScript file into an HTML document, such that it can
execute on that documents object model, you must use the `<script>` HTML
tag. This tag is not self-closing and may take JavaScript code directly within
the `<script></script>` environment. However, often, you will in fact link to a
JavaScript file via the `src` attribute of the tag. Optionally, you can also add
the `type="application/javascript"` attribute. More precisely, the `type`
attribute is optional in HTML5, but required in HTML4.

http://stackoverflow.com/questions/4243577/which-is-better-script-type-text-javascript-script-or-script-scr

## Basic Functions

### `confirm`

The `window.confirm("string")` method pops up a modal dialog (which doesn't let
the user access the website in the background) with a message (the `string`
argument) and two buttons: OK and cancel. The function returns true if the user
pressed OK, else false.

### `prompt`

The `window.prompt(message, placeholder)` function opens a dialog with an input box,
displaying the given `message` and `placeholder` text in the input box. It
returns the content as a string, if the user input any, else `null`.

## Syntax

Semi-colons are optional.

### Variables

Variables are declared with the `var` keyword, followed by a name. In JS, like
in Java or Python, variables are references to objects, rather than storing the
actual object themselves. Unlike in Python, you need not make global variables
explicitly visible in a scope via the `global` keyword. Rather, all names are
considered either global or local to the entire function scope, regardless of
any nested block in which the variable may be declared. That is, even if you
declare a variable with `var` inside a for loop within a function, it will be
visible outside that block, anywhere in the function, but not globally. The
reason why is that braces (`{...}`) don't actually start a new scope, like in
C++. Only functions start new scopes (which may be nested inside
functions). Note that if you forget (or don't add) the `var` keyword before a
declaration, and that variable has not yet been declared, it will implicitly
declare a *global* variable. If a value is not assigned to `var` immediately, it
takes on the type and value of `undefined.`

In the ECMAScript (ES) 6 standard, there exist two further keywords next to
`var`: `const` and `let`. The former is like `final` in Java, specifying that a
variable may not be rebound to a new value. The latter, `let`, is like `var`,
but is visible only within the current block. This is especially useful for loop
variables, or generally any variable that you will want to use specifically
within a block and not want to be seen outside. `const` variables also have
block scope, like `let`. However, ES6 is not yet supported by all browsers (IE).

```JS
function a() {
	{
		var y = 7;
		let z = 3;
		const a = 9;

		a = z; // Error, cannot rebind
	}

	y; // Visible
	z; // Undefined
}

y; // Undefined
z; // Undefined
```

Note that underscores and the dollar sign (`$`) are valid identifiers. That's
why `$(...)` in JQuery is not actually any special syntax. `$` is actually the
name of the function used to select elements in the DOM.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const

### Functions

There are two different ways to define a function in JavaScript: *function
declarations* and *function expressions*. Let us first look at the former. A
function declaration is performed via the `function` keyword, followed by the
name of the function and its argument names. There are not types to declare, as
JS is a dynamic scripting language without static types. This looks like so:

```
function foo(first, second) {
	console.log(first + second);
}

foo(1, 2);
```

The second way to define a function is via a function expression. In this way,
the function is actually made anonymous, simply by omitting the name, and
assigned to a variable:

```
var foo = function(first, second) {
	console.log(first + second);
}

foo(1, 2);
```

The difference between these two is mainly one of visibility. A function
declaration will be visible within its scope, even before it was
declared. Meanwhile, a function expression is declared on the spot and as such
it may be referenced only after it was created (like a regular variable):

```
foo(); // Error, foo is not a function (note: var foo; is hoisted!)
bar(); // OK

var foo = function() {};
function bar() {}

foo(); // OK
bar(); // OK
```

Function expression remain invisible even if they are *named function
expressions*, like `var f = function foo() {}`, which is also valid
syntax. However, do note that the scope of the function declaration also limits
its visibility:

```
a(); // OK
b(); // Error

function a() {
	b(); // OK

	function b() {

	}

	b(); // OK
}

a(); // OK
b(); // Error
```

Note also that once you have declared a function, you can nevertheless assign it
to a variable as an alias (reference to the function):

```
function a() { }
var b = a;
```

Also, a declared function has an assigned name property: `a.name` returns
`"a"`.

http://stackoverflow.com/questions/336859/javascript-function-declaration-syntax-var-fn-function-vs-function-fn

Inside functions, you can access the arguments passed via the `arguments`
object, which is implicitly available within every function. This `arguments`
object has an array-like interface and has one entry for each argument:

```JS
function foo(a, b) {
	arguments[0] === a; // true
	arguments[1] === b; // true
}
```

A quirky aspect of the language is also that if you want to declare an anonymous
function and call it directly, you must put it in parantheses:

```JS
(function(arg){ ... })();
```

All arguments in JavaScript are *optional*. Any argument that is not passed will
be `undefined` (for fuck's sake). In ES6, arguments can have default values with
the same `argument=default` syntax as in Python. Pre ES6, you must check if the
argument's type is `undefined` (or simply if the value is `undefined`):

```JS
function foo(argument) {
	argument = (typeof argument === 'undefined') ? <default-value> : argument;
	// or
	argument = argument ==== undefined ? <default-value> : argument;
}
```

#### Closures

Functions have closures like in Python. This means that local (and global)
variables in the enclosing scope of a function's declaration will be remembered
("stored") by the function when returned from its local scope:


```JS
function foo() {
	var x = 0;
	function bar() {
		console.log(++x);
	}
	return bar;
}

var bar = foo();
bar(); // 1
bar(); // 2
```

Note that `this` does not stay part of a closure! `this` is bound to the caller
object when invoked via `obj.method` notation, but is otherwise bound to the
global object. In a browser, this "global object" is the `window` instance. As
such, if you return a function from a function, don't expect `this` to work
inside that returned function (in the sense of referencing the enclosing
function object). Rather, you must declare a new local variable like `var self =
this`, which does stay in the returned functions closure:

```JS
function Foo() {
	this.x = 5;
	var self = this;
	return function() { console.log(self.x); }
}
```

There is one tricky situation that can happen with closures: circular
references. Say we want to assign a function to `Element.onclick` that can be
called without any arguments but nevertheless keeps state in its
closure. Consider this code to solve this problem:

```JS
function assignOnClick(element, arg1, arg2) {
	element.onclick = function() {
		/* Use arg1, arg2 */
	}
}
```

Here, the anonymous function will keep `arg1` and `arg2` in its closure, so that
we can ues these arguments and nevertheless assign a function to `onClick` that
takes no parameters at all. However, note also that `element` will stay in the
closure of the function, while of course `element` will have a reference to the
anonymous function via the `onclick` property. As you can see, we have circular
references between the anonymous function and `element`, preventing garbage
collection. The solution is to define the function in a new function scope
without `element`:

```JS
function assignOnClick(element, arg1, arg2) {
	element.onclick = noCyclesPlease(arg1, arg2);
}

function noCyclesPlease(arg1, arg2) {
	return function() {
	    /* Use arg1, arg2 */
	}
}
```

Resources:

* http://stackoverflow.com/questions/111102/how-do-javascript-closures-work?rq=1
*
  http://stackoverflow.com/questions/9644044/javascript-this-pointer-within-nested-function
* https://google.github.io/styleguide/javascriptguide.xml

#### `call` and `apply`

All functions have `call` and `apply` methods. Both allow a function to be
called with a specified `this` object, i.e. an object to which `this` will be
bound to within the function. As such, `object.function(arg1, arg2, ...)` is
equivalent to `object.function.call(object, arg1, arg2, ...)`. This is
especially useful to chain constructors. `apply` has the interesting semantics
of allowing arguments that would normally be comma-separated to be passed as a
plain array. For example, we can replace `Math.max(1, 2, 3, 4, 5)` with
`Math.max.apply(null, [1, 2, 3, 4, 5])`, where we pass `null` as the argument
`this` binds to, since we don't care about `this` here. This is especially
useful for large arrays (though note that there exists a hard-coded limit on the
number or parameters of a function).

#### Lambdas

Since ES6 you can use lambdas, here called *arrow functions*. They have the
following syntax:

```JS
(a, b, c, ...) => { /* body */ }
```

Or `a => { /* body */}` if you only have one parameter.

### `with`

The `with` statement expands the scope of an object to the current
namespace. More precisely, `with(object) { }` will expand the `object`'s
namespace into the namespace of the following block by placing the namespace of
the `object` at the __head__ of the scope chain. This means that any undefined
reference will *first* look inside `object`'s namespace, and then
outside. Furthermore, declaring any variable inside the block that collides with
a property of the object will in fact redecalre the object's member rather than
defining a new local variable. It can be used like so:

```JS
var x;

with(Math) {
	x = sin(0) + cos(1);
}
```

However, `with` is deprecated and not even allowed in strict mode.

Resources:

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

### Hoisting

In JavaScript, there exists the concept of *hoisting*. For function
declarations, we have already seen what hoisting is: a function declaration (not
expression!) of the form `function <name>() {}` is callable even before its
declaration in code. For variables, this is a little different. The way it is
different is that for variables, only their *declaration* is visible before the
actual declaration in code, not the *initialization*:

```JS
function() {
	console.log(x); // undefined!
	var x = 5;
	console.log(x); // 5
}
```

Due to hoisting, the interpreter will implicitly transform this to the following
equivalent code:

```JS
function() {
	var x;
	console.log(x);
	x = 5;
	console.log(x);
}
```

This differs from function declarations, where not only the function's
declaration, but also *definition* is hoisted. This can cause problems when
reusing variable names, which only idiots would do:

```JS
var x = 69;

function() {
	console.log(x); // undefined, not 69!!!!
	var x = 5;
	console.log(x); // 5
}
```

Note how due to hoisting, the global declaration will be overshadowed, even
though one would expect that the first printed line would be the global value of
`x`, i.e. `69`. However, because of hoisting, the above code is equivalent to:

```JS
var x = 69;

function() {
	var x;
	console.log(x);
	x = 5;
	console.log(x);
}
```

which, as you can see, redeclares the variable `x` with an `undefined` value.

http://adripofjavascript.com/blog/drips/variable-and-function-hoisting

### Equality

There are two different types of equality operators in JavaScript: `==` and
`===`. They are different in the sense that `==` may perform *type coercion*,
i.e. it may cast types implicitly while checking for equality. Meanwhile, `===`
will never cast types. As such, `===` will return true between two values iff
they are of the same type and the same value. However, `==` will return true
between two values if they are of the same type and same value (like `===`), but
additionally if the equality can be achieved via a cast of either or both
argument. As such, `0 == '0'` will return true, while `0 === '0'` will not. The
corresponding negations are `!=` and `!==`.

It is best practice to always use `===` and `!==` and perform any conversion
yourself, as the rules for type coercion are complicated and not always
intuitive, with many fuckups.

http://stackoverflow.com/questions/359494/which-equals-operator-vs-should-be-used-in-javascript-comparisons

### `undefined` and `null`

There exist two special keywords in JavaScript, `undefined` and `null`. The
former is the type *and value* of a variable that has not yet been assigned,
such as simply `var foo;`. Meanwhile, `null` is a (primitive) value, that may
explicitly be assigned to a variable. A variable with value `null` is of
`object` type (for whatever reason), which can be retrieved via the `typeof`
operator, which returns the type of a variable as a string representation. An
variable of `undefined` type will cast to any value of any type. As such,
`undefined == null` holds true, while `undefined === null` does not.

http://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript

### Exceptions

You can throw custom "exceptions" via the `throw` keyword, which lets you
propagate strings, numbers, booleans or objects up the call stack. Then, like in
Python, you have `try`, `catch` and `finally` blocks to catch these
exceptions. Like in Python, `finally` will execute code regardless of whether or
not an exception was actually thrown.

## Types

JavaScript supports the following data types:

* `String`
* `Boolean`
* `Number`
* `Object`
* `Array`

The following paragraphs discuss these data types and their syntax in further
detail. All of these data types are also functions (with the first letter
capitalized), that cast to their respective type (like in Python).

### `String`

The `String` data type in JS is an *immutable* type and supports UTF-8 encoded
unicode. Strings may be declared with single or double quotes, like in
Python. There is no multi-line string syntax. You must either concatenate them
(careful, they are immutable!) or escape newlines with backslashes. In the
latter case, you must not indent the consequent lines (that will count as inline
whitespace):

```
var s = "a" +
        "b" +
		"c";

var t = "a\
b\
c";
```

The Google Style Guide recommends concatenation.

The following functions of the `String` type are of interest:

* `charAt(index)`, which acts like `[index]` (which is also available for
  strings).
* `charCodeAt(index)`, which returns the decimal unicode code point of the
  character at the given index.
* `includes(substrings)`, performs a *case-sensitive* substring search.
* `endsWith(character)` and `startsWith(character)`, like in Python.
* `match(regex)` and `search(regex)`, like `re.match()` and `re.search()`. Note
  that character classes must be escaped.
* `replace(regexp, replacement)`, acts like `re.sub`, replacing all matches for
  the given regular expression with the replacement, which may either be a
  string or a function returning a string. This function supplied must take the
  following arguments:
  - The complete matched substring.
  - A variable number of group arguments, which must correspond to the number of
    capturing groups defined in the regular expression.
  - The index offset of the match within the string.
  - The whole string being examined.
* `slice(begin, end)`: slices like `[begin:end]` in Python. Negative indices
  work like in Python (from the back).
* `substr(star, length)`: returns a substring starting at the given offset and
  the given length from that offset.
* `trim()`/`trimLeft()`/`trimRight()`: removes whitespace like in Python.
* `split(separator [, limit])` splits the string at the given separator, or
  until the `limit` (a number) of split elements has been reached.

### `Boolean`

The `Boolean` datatype has the `true` and `false` literals (constants). Note
that like in Python, certain expressions implicitly convert to Boolean (useful
in conditions). The following all evaluate to `false` in boolean expressions:

* `null`
* `undefined`
* `''` (the empty string)
* `0` (the number)

But be careful, because these are all true:

* '0' (the non-empty string)
* [] (__the empty array__)
* {} (__the empty object__)

### `Number`

The `Number` data type represents any numeric data type as 64-bit
double-precision floating point values. That is, there exists no integral type
like `int` or `short`. All numbers are floats.

The `Number` type has some constants defined, like in Java:

* `Number.MAX_VALUE`
* `Number.MIN_VALUE`
* `Number.POSITIVE_INFINITY`
* `Number.NEGATIVE_INFINITY`

Moreover, there exists the `Number.NaN` (or simply `NaN`) constant. `NaN`
compares unequal to all other values, including itself. As such, `x === x` will
hold false iff `x` is `NaN`. Alterantively, there exists the global
`isNaN(number)` function will will check if a number is not-a-number. NaN can be
created, for example, when dividing zero by zero (while dividing any other
number by zero yields `Infinity`, another global constant like `NaN`).

https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/isNaN

### `Object`

`Object`s behave like dictionaries in Python and have a very similar
syntax. Object keys are always strings, even if they must be coerced (cast). An
object is declared with braces, and quotes on keys can be omitted (they will be
intepreted as strings anyway). However, when referencing them via the subscript
operator `[]`, quotes are always necessary. Furthermore, next to `object[key]`,
the `object.key` syntax is also valid and behaves identically. Most importantly,
objects may be heterogenous, i..e contain values of several differint types.

```JS
var dict = { foo:"bar", baz: 1, bar: function(){} };
```

Note how an object can also hold functions, which we can access and call
intuititvely via the `object.function()` syntax. This is the basis for how
object oriented programming works in JavaScript, as we will see later.

Adding elements works like in Python, simply via the `object['key'] = value`
syntax. Note how the key must be quoted. This also works with the dot notation,
i.e. `object.key = value` will also add a value. Deletion works via the `delete`
keyword, which behaves like the `del` keyword in Python. That is, `delete
object['key']` or `delete object.key` will delete a key. Note that deletion does
not actually free the memory of the referenced object. It just deletes *the
reference* to the object, which may or may not result in garbage collection
afterwards (depending on whether or not other references still point to the
object).

JavaScript has the `in` keyword to check for inclusion of a key in a dictionary:
`5 in {5: 7}` returns `true`, `'a' in { b: 123 }` returns `false`.

Two interesting "static" methods `Object`s have are `Object.seal(object)` and
`Object.freeze(object)`. The latter returns a copy of an object that is
effectively immutable in the sense that freezing an object disallows further
keys to be added (to the returned, frozen copy), as well as preventing any
changes to elements inside the object. `seal()`, on the other hand, only
prevents modification of the `Object`, not the elements inside the
`Object`. That is, you may not add elements, but still change the ones in the
object.

Iteration can be achieved via a range loop like in Java, where the loop returns
the keys of the object (in unspecified order, of course):

```JS
for (var key in object) {
	console.log(object[key])
}
```

### `Array`

Arrays in JavaScript are declared via the bracket (`[]`) syntax just like in
Python. You can then access elements via their numeric index using the subscript
operator. To add elements to the back of the array, you can use the `push()`
method. Furthermore, JavaScript also allows you to simply assign to out-of-range
indices to add new elements. As such, `array.push(element)` is the same as
`array[array.length] = element`. Do note, however, that pushing to an
out-of-range index that is not the next free spot, i.e. any index past
`array.length`, will fill the space between the last valid element and the new
element with *empty* slots of *undefined type*. This can be used to "reserve"
space.

Deletion can be done the wrong way and the right way. The wrong way uses
`delete` in a way that would only work for objects, not arrays. For arrays,
`delete array[index]` will in fact not remove that element from the array and
shift elements to the right of the index one over. Much rather, it will simply
set the element to `undefined`. The correct way is to use the `splice()`
method. This method takes at least two arguments, with no upper bound. The first
argument is an index at which to start changing the array. The second argument
is the number of elements to delete. All further (variadic) arguments are new
elements that will be inserted at the index specified by the first argument,
after the deletion (second argument). As such, `array.splice(index, 1)` will
delete exactly one element at the given index.

Iteration is a tricky thing with arrays. One would be quick to use the `for
... in` loop like for objects. However, the order of iteration is in fact
*undefined* (or rather, implementation defined) for this kind of loop. As such,
a plain old for-loop is always the better solution.

A few other interesting methods of arrays are:

* `length`: Arrays have a `.length` attribute, like strings.
* `pop()`: Removes an element from the *back* of the array, if any. If the array
  was empty, this method returns that last element, else it returns `undefined`.
* `join(separator)`, which joins the elements of an array with the given
  separator string, like `separator.join(list)` would in Python. The separator
  defaults to a comma and must thus not be passed if the comma is fine as a
* `shift()`: Removes and returns the *first* element of the array, if any
  exists.
* `slice(begin, end)`: Slices an array like in Python. Also like in Python, both
  arguments are optional and simply calling `array.slice()` is a nice way to get
  a *shallow* copy of an array. If the `end` is not provided, `end` is taken as
  the length of the array (i.e. all elements starting at `begin`).
* `concat(arrray)`: Adds the elements of another array, like `extend()` in
  Python.
* `reverse()`: Reverses an array *in-place* and returns it.
* `unshift(element)`: Adds an element to the front of the array.
* `indexOf(element [, start])`: Performs a linear search for the given element
  and returns the first index. Optionally, it starts at the index given by the
  second argument (which may be negative, with Python semantics for negative
  indices).
* `filter(function)`: Returns a new array containing only the elements that
  match the given predicate.
* `reduce(function [, initialValue])`: Performs the typical functional reduction
  on an array. The callback function should take four arguments:
  - `previousValue`: If an `initialValue` was provided, then `previousValue` is
    initially equal to that value. Else it is the element at index zero. For all
    subsequent iterations, it is the value returned from the previous invocation
    of the callback.
  - `currentValue`: The new value over which the current iteration is passing.
  - `currentIndex`: The associated current index.
  - `array`: The array over which the `reduce` function is operating.
  Usually, you will just want to use the `previousValue` and `currentValue` to
  return the next value.
* `reduceRight(function [, initialValue])`: like `reduce`, but goes from right
  to left.
* `map(function)`: The functional `map`, which takes a value and returns a new
  value.
* `sort([function])`: Sorts an array as *strings* (for fuck's sake), i.e. by
  casting values to strings (as such [5, 198] will sort to [198, 5], because
  "198" < "5" lexicographically). Thus you must pass a predicate, which should
  compare values like in Java (+1, 0, -1).
* `forEach(function)`: Applies some function iteratively to each element.
* `every` and `some`: like `std::all_of` and `std::any_of`.

### `Date`

JavaScript includes a built-in data type to represent dates: `Date`. It has two
important constructors:

* One taking the number of milliseconds since the epoch.
* Another taking year, month and optionally day, hour, minute, second and
  millisecond arguments.

You can then basically access, i.e. read and write to those members. Moreover,
the `Date` prototype has a `now()` method, which returns the number of
milliseconds since the epoch.

## Strict Mode

Since ECMAScript 5, you can add `"use strict";` to the top of any script or
function block to enable *strict mode*. This enables some additional checks by
the parser. For example, it disallows declaration of any variable without the
`var` keyword, which would normally declare a new global variable, even though
this is usually not desired. Also, it disallows reusing the same name for
arguments multiple times, i.e. `function foo(bar, bar) { }`, which was
previously allowed.

http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

## DOM Manipulation

Browsers organize webpages as *document object models* (*DOM*) in a tree
structure. The root of the tree is the *window*, followed by the *document*
node. Then follow all HTML tags, starting with `<html>`, then `<head>`, `<body>`
and so on, all contained in a JS object. With JavaScript, we can manipulate the
DOM and add, delete and change elements and their attributes.

You access the DOM via the global `document` object. This object has certain
methods associated, such as the `getElementById()` method. This function takes
an ID string and returns the corresponding HTML object, if defined. More
precisely, the returned object is an `HTMLElement`, which has properties such
as:

* `Element.innerHTML`: The HTML elements contained within the element as a *string*.
* `Element.id`: The ID of the element.
* `Element.className`: The space separated string of classes defined for the
  element.
* `Element.classList`: An array-like collection of the classes of the type (like
  splitting the `className`).
* `Element.attributes`: The attributes of the element, returned as a
  `NamedNodeMap` with dictionary-like access via `getNamedItem()` and
  `setNamedItem()`.
* `Element.hasAttribute(key)`: Checks if the element has the given attribute
  set.
* `Element.setAttribute(key, value)`: Sets the given attribute.
* `Element.getAttribute(key)`: Gets the given attribute.
* `Element.attribute`: Accesses the given attribute (with dot notation) for
  reading and writing.
* `Element.style.property`: Accesses the style property of the element.
* `Element.childNodes`: Returns an array-like collection of the child nodes of
  an element.
* `Node.nodeValue`: Like `innerHTML` for `TextNodes`.

And more specifically to access the tree relative to an element:

* `Element.parentNode`
* `Element.childNodes[nodeIndex]`
* `Element.firstChild`
* `Element.lastChild`
* `Element.nextSibling`
* `Element.previousSibling`

Next to `getElementById`, other properties of `document` are:

* `document.getElementsByTagName(tag)`: Returns all elements in the DOM with the
  given tag as an `HTMLCollection` with an array-like interface.
* `document.getElementsByClassName(tag)`: Returns all elements in the DOM with
  the given class attribute set, again as an `HTMLCollection`.
* `document.anchors`: Returns all `<a>` tag elements.
* `document.images`: Returns all `<img>` tag elements.
* `document.title`: Returns the contents of the `<title>` tag in the `<head>`
  section of the document.
* `document.body`: Returns the `<body>` element of the document.
* `document.documentElement`: Returns the entire HTML document as an `Element`
  (e.g. with `innerHTML` holding everything inside `<html>` tags).
* `document.write(html string)`: Writes the HTML given as a string directly to
  the HTML stream (as a child of `<body>`). If not written in an inline
  `<script>`, the document must first be cleared with `document.open()` and then
  closed with `document.close()`.

You can add elements to the DOM via the following functions on any element, such
as `document.body`:

* `document.createElement(tagName)`: Creates a new DOM Node (element) with the
  given tag name (a string, such as `"div"`).
* `document.createTextNode(text)`: Creates a new text node (just plain text)
  which you could add to a node. This would be like modifying its `innerHTML`.
* `Element.removeChild(element)`: Removes a child element from a node in the
  DOM.
* `Element.appendChild(element)`: Appends an element to the children of a node
  in the DOM.
* `Element.insertBefore(newElement, referenceElement)`: Inserts the `newElement`
  as a sibling at the index of the `referenceElement`, thus pushing all elements
  starting at `referenceElement` one index up.
* `Element.replaceChild(newElement, oldElement)`: Replaces the `oldElement`
  child of a node in the DOM with the `newElement`.

Note that the DOM is a *live* data structure. This means that if you add a node
or remove a node from it, this will be reflected *immediately* in the DOM.

Resources:

* http://www.w3schools.com/js/js_htmldom_document.asp

### Events

HTML and JavaScript have a very nice event-listening mechanism built
in. There are two ways of doing this: inline in HTML or out-of-line, purely in
JavaScript. Either way, the idea is, given some event in the user agent
(browser), for example a click or hover on an element, we want to execute some
piece of JavaScript code.

Inline, this would work via an *attribute* like `onclick="<code>"`. The `<code>`
would then be some JavaScript code, meaning either a small amount of inline code
or a function call to some bigger piece of code (most often the latter). For
example, we could create a button and change the color of a `<div>`:

```HTML
<body>
<div id="foo" style="width: 100px; height: 100px;">Foo!</div>
<button onclick="myFunction();">Click me!</button>

<script>
	function myFunction() {
		document.getElementById("foo").style['background-color'] = red;
	}
</script>
</body>
```

As usual, this is also possible directly from JavaScript:

```JS
element.onclick = myFunction;
```

All events in th browser are associated with some *event object*. This object
contains useful information about the event, such as the key code of a pressed
key in case of a `onkeydown` event (see below). There are two ways to access
this event object: the standard way and the IE way. The standard way is to
access an `event` argument that is automatically suppplied to the callback
function. The non-standard way is to accesss the global `window.event` object
provided by the browser (especially IE). As such, the best way to retrieve and
access an event is like so:

```
element.onevent = function(event) {
	event = event || window.event;
};
```

Taking advantage of the fact that `undefined` values evaluate to `false`.

Other possible events are:

* `onmouseover`: Triggered when the user moves the mouse over an element.
* `onmouseout`: Triggered when the user moves the mouse away from an element.
* `onmousedown`: Triggered when the user clicks an element. When the user
  releases the mouse key, the `onclick` event triggers.
* `ondblclick`: Triggered on a double-click on an element.
* `onload`: Triggered when an element loads (at the very start).
* `onscroll`: Trigered when the user scrolls the scrollbar.
* `oncopy`: Triggered when the user copies the content of an element (e.g. input
  box).
* `onpaste`: Triggered on paste events.
* `ondrag`: Triggered when the user drags an item. This must be enabled via the
  `draggable="true"` attribute.
* `ondrop`: Triggered when the user drops an item.
* `onoffline`: Triggered when the user goes offline.
* `onkeydown`: Triggered when the user presses a key. You can retrieve the key
  code via the corresponding event object.

Next to the `on...` attributes all HTML object have, there exists a second way
to add an event listener for a certain event. Most importantly, you may notice
that with the `on...` attributes, we can register one and only one callback. The
second way to register a callback actually allows more than one function to be
registered: `addEventListener`. This JavaScript method takes three arguments:

1. `event`: A string describing the event, like `click`. More precisely,
   wherever we used `on<event>` as an attribute, we leave out the `on` prefix.
2. `function`: The callback function, taking the event parameter.
3. `useCapture`: A boolean that determines whether to use event *bubbling* or
   *capturing*. The difference is in the order of callbacks when many are
   registered in a nested manner. That is, if both an element and that element's
   parent have a callback registered for the same event, then if `useCapture` is:
   - `false`, the inner-most callback will be called first (that of the child).
   - `true`, the call order goes from the outside to the inside, i.e. the parent
     callbacks first and child callbacks after.

`addEventListener` can be used to add as many event listeners as you want. IE
does not provide this function, but rather the `attachEvent` function, which
differs only in the fact that the first argument must be preceded by the `on`
prefix. It also has no third `useCapture` argument (bubbles by default). This
leads to the following cross-browser code to add an event listener:

```JS
function addEvent(element, eventName, callback, useCapture) {
	useCapture = (useCapture === undefined) ? false : useCapture;
	if (element.attachEvent) {
		// IE code
		element.attachEvent('on' + eventName, callback);
	} else {
		element.addEventListener(eventName, callback, useCapture);
	}

}
```

Resources:

* http://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick

## Object-Oriented Programming

JavaScript has object-oriented programming concepts on the basis of *prototypal*
inheritance, following the prototype software pattern. In this pattern,
inheritance is achieved through objects rather than classes. Note either way
that object-oriented programming is just a pattern in JavaScript and not an
actual language construct built in directly like in C++ or Java. The basic idiom
is described in the following paragraphs.

Classes are defined solely through their constructor in JavaScript (or at least,
in this idiom). As such, we can define a new class `Foo` as a function. Then,
inside, we declare members (properties/attributes) using the `this` keyword,
which is bound to the function. For this, it is important to understand that
functions are *first-class* citizens in JavaScript, on which all else is built
up on. This may look like so:

```JS
function Foo() {
	this.x = 6;
	this.y = 9;
}
```

This is how you would declare member variables. Note that these members will be
visible publicly, as JavaScript has in itself no concept of access
specifiers. The closest we can come to this is local variables within the
constructor, whose scope is bounded by the function block. However, we will only
be able to access these local variables within the constructor or any functions
defined in that constructor.

*Methods* are added to a "class" via its *prototype*. Every object in JavaScript
has an associated prototype object. More precisely, there exist two concepts of
a *prototype*. There is a hidden, internal prototype object that is not
accessible in any standard way (`__proto__` gives non-standard access in some
environments), and an externally *visible* prototype member, which every
*function* has but not every object. The hidden prototype is what gives rise to
the *prototype chain*, which allows symbol resolution similar to how it is
enabled by an inheritance graph. The visible prototype member of a function is
the object we can modify to configure this hidden prototype.

These two prototype objects come together in form of the `new` keyword, which
gives special semantics to a function (constructor) call. When we write `var foo
= new Foo()`, the following things happen:

1. A new, *empty* object is created.
2. The hidden prototype member of the object is bound to the visible prototype
   object of the constructor.
3. `this` is bound to the new object.
4. The constructor executes on `this`, i.e. the empty object, to initialize it.
5. The new object is returned and assigned to the variable, unless the function
   returns something, in which case that return value is returned.

The important distinction to make is that functions have a hidden prototype
member and a visible one, while object only have hidden ones, which bind to the
visible prototypes of their constructor. Note also that the hidden prototype
member of all functions is bound to the `Function.prototype` member and is thus
unchangeable and uninteresting. Also note that by default, every function has a
visible prototype member which is bound to an object with a `constructor`
property and nothing else. This `constructor` property points back to the
function.

Given this description of prototypes, we can discuss how we can define methods
for classes. We do so by adding them to the *visible prototype member* of the
function, like so:

```JS
Foo.prototype.method = function(a, b) { return this.x + a + b + this.y; }
```

or by assigning a new object to the `prototype` member entirely, in which case
we have to re-assing the `constructor` member:

```JS
Foo.prototype = {
	constructor: Foo,
	method: function(a, b) { return this.x + a + b + this.y; }
}
```

Note how we assign the `constructor` member to the function (the constructor)
itself.

### Inheritance

Given these tools, we can now investigate how we would implement inheritance in
JavaScript. There are two parts to this: we must call the parent constructor in
the child constructor, and link the child's prototype to the parent.

The first thing, calling the parent constructor, is done via the `call` method
of any function object. The special thing about this method is that it takes an
object that is then bound to `this`. As such, if we have a superclass `Bar` for
our class `Foo`, we would call the parent constructor like so:

```JS
function Foo() {
	Bar.call(this, arg1, arg2, ...);
	this.x = ...;
	...
}
```

Then, we link the prototypes. This is done by assigning
`Object.create(Bar.prototype)` to `Foo.prototype`. Here, `Object.create` does
the following (basically):

```JS
function create(object) {
	// New empty constructor
	function F() { }
	F.prototype = object;
	return new F();
}
```

leading to the following line:

```JS
Foo.prototype = Object.create(Bar.prototype);
```

What `Object.create` does is create a new, empty class and assign the prototype
of that empty class to the prototype of our parent. By returning a new instance
of that empty type, this object, which will become `Foo`'s prototype object,
will have its hidden prototype member bound to `Bar's` prototype. This gives us
two things:

* A new, empty prototype object for `Foo`, to which we can assign methods.
* A link to the parent prototype, used for call resolution.

When we create a new `Foo` object, its prototype chain will look like so:

```

          PROTOTYPE
 [ Bar ] ----------> [ Bar.prototype ]
		                   ^
		                   |
		                   | PROTOTYPE
		                   |
        PROTOTYPE
[ Foo ] ---------> [ Foo.prototype ]
```

Now, when we access a member of `Foo`, the engine will first check the `Foo`
instance itself, then its linked `Foo.prototype`, then its prototype
`Bar.prototype` and so on, until the last object has not set any prototype
explicitly. In that case, the prototype is still the initial object with the
`constructor` member set to the constructor. This object, which is not the
result of a function instantation, in turn, then has a default hidden prototype
member pointing to `Object.prototype`, which is just `null` (as such an object
like `{}` has a `null` hidden prototype).

There is just one thing missing: the `constructor` member. Note how in
`Object.create`, the new empty object `new F()` will not have a `constructor`
member, while the default visible prototype object of every function does. This
property is useful just for reflection. Nevertheless, you should set it, in case
you do want to access the constructor polymorphically. As such, after setting
the prototype, you should set the `Foo.prototype.constructor` member manually to
`Foo`.

This leaves you with:

```JS
function Bar(x) {
	this.x = x;
}

function Foo() {
	Bar.call(this, 6);
	this.y = 7;
}

Foo.prototype = Object.create(Bar.prototype);
Foo.prototype.constructor = Foo;
```
Note that when you enumerate an object via a `for ... in ` loop, you are also
enumerating the members it inherits from its prototype. To prevent this, you may
want to uset he `Object.prototype.hasOwnProperty` method (and cache it) to check
if the object you are enumerating actually contains a given property, or whether
it comes from somewhere up the prototype chain:

```JS
var hasOwn = Object.prototype.hasOwnProperty;
for (var i in myobject) {
	if (hasOwn.call(myobject, i)) {
	/* ... */
	}
}
```

Resources:

*
  https://stackoverflow.com/questions/8453887/why-is-it-necessary-to-set-the-prototype-constructor
* http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
*
  http://stackoverflow.com/questions/1646698/what-is-the-new-keyword-in-javascript
* https://zeekat.nl/articles/constructors-considered-mildly-confusing.html

## Modules

Like classes, modules are a pattern in JavaScript, not a language
feature. However, like classes, they are useful and we should discuss
them. Modules in JS are based on functions and function closures. Basically, the
idea is to create a new scope in an anonymous function declaration, such that we
can use "private" variables inside the module and then return anything outside.

More precisely, we will have an anonymous function take a module parameter,
which we can pass around to multiple files to add to the same module. This can
look like so:

```JS
var module = (function(m) {

	// We can model private members like so
	// Note, however, that this we won't be able to access
	// other members if we keep the load order of module files
	// entirely unspecified. So if we want global private state,
	// we'll need to make sure that is loaded first
	m._privateMember = 5; // or m.private.member

	// Local members that will definitely be invisible to the outside
	// But remain module-visible (for this file) because of the closure
	var localMember = 7;

	// A member we add to the module
	m.publicMember = { foo: "bar" };

	return m;

// If the module is defined already, use it, else create a new module object.
// Note this allows for asynchronous, out-of-order loading of modules
// Unless we require some state in the module first, in which case
// you might want to load some files first.
})(module || {});
```

This also allows for submodules, of course. Note how we wrap the function
declaration in parantheses. The reason why is that we actually want an anonymous
function and call it directly. However, any statement that starts with
`function` is interpreted as a function declaration, which can never be
anonymous.

http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
