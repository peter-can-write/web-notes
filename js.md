# JavaScript

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

Note that you will often want to place the `<script>` tag at the end of the `<body>`, such that the JavaScript elements load after the website content and don't block their loading. This is necessary, as the browser will usually download, parse and execute JavaScript synchronously and block, which can hurt he user experience.

Resources:

* http://stackoverflow.com/questions/4243577/which-is-better-script-type-text-javascript-script-or-script-scr

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
`"a"`. However, an interesting thing we can only do with function expressions
assigned to variables is *lazy function definitions*. In this pattern, we
perform initialization of a function (in terms of contained local variables or
any first-class properties, or calling some other functions) when calling it the
first time, and then re-assign the variable to which the function expression is
bound to some other function:

```JS
var foo = function() {
	/* ... Initialization ... */
	// Reassign
	foo = function() { return 5; }
}
```

Note that this will only work exactly once, the first the function is called
(ever). Any references to the original function declared before the
re-assignment will also not point to the new function, of course. You could also
just return the local function, with the same result.

Resources:

* http://stackoverflow.com/questions/336859/javascript-function-declaration-syntax-var-fn-function-vs-function-fn

#### Arguments

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

Note that it may sometimes be useful to use `apply` and `call` on constructors. For this reason, consider returning `this` from inside the constructor, so you can do something like this:

```JS
var object = Constructor.apply({}, arguments);
```

#### Lambdas

Since ES6 you can use lambdas, here called *arrow functions*. They have the
following syntax:

```JS
(a, b, c, ...) => { /* body */ }
```

Or `a => { /* body */}` if you only have one parameter.

#### Currying

*Currying* a function is a concept from the domain of functional languages,
whereby we apply a function only *partially* to a subset of its required
arguments, yielding a new function that can later on accept more arguments
(along with the ones initially supplied when currying). For example, we may have
a function $f: \mathbb{N} \times \mathbb{N} \rightarrow \mathbb{N}: (x, y)
\mapsto x + y$. The concept of currying allows us to bind one or more of the
parameters of a function to values we specify beforehand. As such, we could bind
the $x$ argument of the function $f$ to the value $5$, yielding a new
uni-variate function taking just a single parameter, which is always added to
$5$ (as per the definition of the function).

In JavaScript, currying is enabled by closures. For example, the simplest thing
we could do is allow for currying of the first argument of a function that
otherwise would take two arguments:

```JS
function curry(fn, first) {
	return function(second) {
		return fn(first, second);
	}
}

function add(x, y) { return x + y; }

var addTo5 = curry(add, 5);

addTo5(1);
addTo5(3);
addTo5(7);
```

However, a more general currying function would make use of the generic `apply`
method provided by all function objects. It allows us to store all arguments
passed to the currying function in an array and later concatenate any further
arguments to those stored:

```JS
function curry(fn) {
	var slice = Array.prototype.slice,
		stored = slice.call(arguments, 1);

	return function() {
		var args = stored.concat(slice.call(arguments));
		return fn.apply(null, args);
	}
}

function foo(a, b, c, d) { return a + b + c + d; }

var bar = curry(foo, 1, 2);
bar(3, 4); // 10
bar(7, 8); // 18
```

### Binding

Another interesting topic concerning functions is *binding* them to an
object. Recall that when you have a function referring to `this` internally and
don't call it with object notation or the `new` keyword, `this` will point to
the global object. Imagine, however, that you want to pass a function that does
use `this` internally to another function as a callback. In that case, you would
want to *bind* an object to the function such that you can call it without that
object as a callback. We can implement such a function `bind`, which takes an
object and a function to which to bind that object like so:

```JS
function bind(instance, method) {
	return function () {
		return method.apply(instance, arguments)
	}
}
```

Here, we use `apply` rather than invoking the method on the instance directly so
we can pass the implied `arguments` to the method without knowledge of the
actual arguments. We can use it like so:

```JS
function Foo(x) { this.x = x; }
Foo.prototype.method = function () {
	console.log(this.x);
}

var instance = new Foo(5);

var bound = bind(instance, Foo.prototype.method);

bound(); // 5
```

In ES5, a similar function already exists ready for use:
`Function.prototype.bind`. This function actually combines the concept of
binding an instance to a method with currying, as discussed before. It takes an
instance to bind a method too, as well as any number of arguments to pass to the
function when called later:

```JS
var bound = Foo.method.bind(instance, 1, 2, 3);
bound();
```

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

You can `throw` more or less any kind of object you want. However, the standard
idiom for error objects is to have a `name` (static) property containing the
name of the exception (e.g. `"FooError"`) and a `message` property, containing a
textual explanation of the cause or nature of the exception. As such, for custom
errors, you can either define your own classes and then `throw FooError('asdf')`
(with or without `new`, both work), or simply throw an object literal:

```JS
if (badness) {
	throw {
		name: 'BadnessError',
		message: 'Badness occurred, run!'
	};
}
```

## Types

JavaScript supports the following data types, among others:

* `String`
* `Boolean`
* `Number`
* `Object`
* `Array`
* `Date`

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
changes to elements inside the object. The function `Object.seal()`, on the
other hand, only prevents modification of the `Object`, not the elements inside
the `Object`. That is, you may not add elements, but still change the ones in
the object.

Iteration can be achieved via a range loop like in Java, where the loop returns
the keys of the object (in unspecified order, of course):

```JS
for (var key in object) {
	console.log(object[key])
}
```

Note that in ES5, you can use `Object.keys(object)` to retrieve an array of all
keys in the object (only those in the object itself, i.e. `hasOwnProperty`
returns true for all returned keys).

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
  defaults to a comma.
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

### Regular Expressions

JavaScript has native support for regular expressions, which you can create in
two ways: via the `RegExp` class or regular expression *literals*. The latter is
obviously a lot more exciting. A regex literal is created by enclosing a regular
expression between forward slashes, like so `/<regexp>/<flags>`, where `<flags>`
is a combination of the following three characters (if any):

* `g`: Match globally, i.e. multiple times and not just a single time.
* `m`: Match over multiple lines, not just a single line. Without this flag, `^`
  and `$` match the beginning and end of the entire string, not every
  line (respectively). With the `m` flag, `^` denotes the start of each line and
  `$` the end of each line, delimited by newlines or carriage returns.
* `i`: Case-insensitive match (regular expressions are case-sensitive by
  default).

Note that the JavaScript regular expression engine does not support lookbehind
references. Other than that, you can use regular expressions for functions like
`String.prototype.replace`, which returns a new string:

```JS
var s = "foObar";
console.log(s.replace(/o{:2}b?/gi, '1')); // f1ar
```

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
* `Element.setAttribute(key, value)`: Sets the given attribute. *Use it to add new attributes!*. Pass an empty string as `value` to set a boolean attribute.
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

Modern browsers provide jQuery-like selector APIs that allow more advanced queries on the DOM than `getElementById` or `getElementsByClassName`. More precisely, the `Document.querySelector()` and `Document.querySelectorAll()` methods allow you to query the DOM w.r.t. any valid CSS selectors. `querySelector` returns the first matching result, `querySelectorAll` returns a `NodeList` of all matching results. You can also pass more than one selector (like in pure CSS) by separating them with commas:

```JS
<div class="user-panel main"><input name="login"></div>

var element = document.querySelector("div.user-panel.main input[name=login]");
```

Resources:

* http://www.w3schools.com/js/js_htmldom_document.asp

### Remarks

There are some important remarks to be made about DOM manipulation and access. The DOM is actually one of the most expensive data structures to access. Because many web applications need to manipulate it quite a bit, DOM access can become a bottleneck. As such, here are some guidelines for DOM manipulation:

1. Avoid DOM access in loops.
2. Assign DOM references (especially deeply nested ones) to local references.
3. Use *selector APIs*.
4. Cache the *length* property of `HTMLCollection`s.

Regarding the first, this means that you wouldn't want to access the DOM, especially through expensive queries and long property chains, within a loop. Rather, according to (2), it's a better idea to cache the property and perform *bulk updates*. For example, we would always want to replace the following loop:

```JS
for (var i = 0; i < 100; i += 1) {
  document.getElementById("result").innerHTML += i + ", ";
}
```

with

```JS
var contents = "";
for (var i = 0; i < 100; ++i) {
  contents += i + ", ";
}
document.getElementsById('result').innerHTML += contents;
```

Or, along the lines of (2), the following

```JS
var padding = document.getElementById("result").style.padding,
    margin = document.getElementById("result").style.margin;
```

should be replaced by

```JS
var style = document.getElementById("result").style,
    padding = style.padding,
    margin = style.margin;
```

As mentioned, batch updates are always a good idea, as you only need to update the live DOM tree once. For this, the `documentFragment` class can come in handy. It is basically a lightweight node you can attach other nodes to, to link an entire small tree into the DOM, rather than each child individually. For example:

```JS
var fragment = document.createDocumentFragment();
var p = document.createElement('p');
var t = document.createTextNode('first paragraph');
p.appendChild(t);
fragment.appendChild(p);

p = document.createElement('p');
t = document.createTextNode('second paragraph');
p.appendChild(t);
fragment.appendChild(p);

document.body.appendChild(fragment);
```

Lastly, note that it is often a good idea to retrieve a node in the DOM, clone it with `Node.cloneNode()`, work on it "offline" and then replace the original node in the live tree:

```JS
var node = document.getElementById('node'),
    copy = node.cloneNode();

copy.appendChild(document.createElement('p')))

node.parentNode.replaceChild(copy, node);
```

## Events

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

* `onmouseenter`: Triggered when the user moves from a parent element over the element (i.e. only from the outside, not from other elements inside).
* `onmouseover`: Triggered when the user moves the mouse over an element, either from a parent or from a child (i.e. from anywhere)
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

### Performance Enhancements for Long-Running Scripts

Imagine you have some heavy, long-running JavaScript code that is consuming large amounts of time resources and blocking your browser from loading other elements, to the detriment of the user experience. How do you solve this? There are multiple ways.

### Timeouts

The first idea is to break your code into chunks and delay their execution. You can do this with the `window.setTimeout` function, which takes a function to execute after a certain delay, specified in milliseconds, and optionally any number of parameters to pass to the function. It returns a global `timeoutID` to identify the timer, such that you can cancel the timeout using `window.clearTimeout(timeoutID)`.

```JS
// Execute after one second
window.setTimeout(function() {
  /* ...  */
}, 1000);

// Execute after two seconds
window.setTimeout(function() {
  /* ...  */
}, 1000);
```

### Web Workers

*Web Workers* are an advanced and relatively new multi-threading technique available in modern browsers (e.g. IE10+). To use it, you instantiate a new `Worker` instance, which takes the URL of a script to execute in a background thread. The thread will then proceed to execute the JavaScript in that file:

```JS
var worker = new Worker('some_code.js'); // Executes immediately
```

The Web Worker API also provides methods for communication of any kind of data between threads. For this, you can use the `worker.postMessage()` function either from inside the worker, to send a message to the caller, or from the caller side, to send a message to the worker. The other side can then subscribe to these messages via the `worker.onmessage` callback property:

```JS
// some_code.js
postMessage('foo');
postMessage(1);

// main.js
var worker = new Worker('some_code.js');
worker.onmessage = function(event) {
  console.log(event.data);
}
```

Note how the callback we pass for the `onmessage` event takes an `event` argument. This object is of type `MessageEvent`, and thus has properties such as `data`, which is the most important one as it contains whatever the other side posted; but also `origin` and others. Next to the `onmessage` event, there exists also `onerror`, which is called for any exceptional (error) condition inside the worker and takes an error `Event` as its argument.

### Lazy Loading

JavaScript scripts are executed when the browser parses a `<script>` tag. As such, if we can define ourselves when the `<script>` for a given piece of JavaScript code is added to the DOM, we can, in fact, determine ourselves when a script should be loaded and executed. This simple pattern can be implemented in various ways, which we will discuss next.

The simplest way is to simply dynamically add a `<script>` tag to the `<head>` section of our HTML document when we need it. For this, we create a new script element and set its `src` attribute to the file we want to load. Upon seeing this tag, the browser will make a new request to the server to ask for the script, which is executed *only then*:

```JS
var script = document.createElement('script');
script.src = '/path/to/file.js'
document.documentElement.firstChild.appendChild(script);
```

where `document.documentElement` is the `<html>` tag and its first child (usually) the `<head>` tag. Note that theoretically, we don't always know if we have a `<head>` tag, so the safest checkpoint we have is any `<script>` tag, since we know we must have at least the `<script>` tag in which the code lives that we are currently executing. As such, this is safer:

```JS
// or querySelector('script');
var anchor = document.getElementsByTagName('script')[0];
anchor.parentNode.insertBefore(script, anchor);
```

Of course, we must ask when we add the script tag to the document at all. For this, we have two options. For one, we can simply add it when the page loads for the first time. This can be achieved via the `window.onload` event:

```JS
window.onload = function() {
  /* load and append script */
}
```

However, another option would be to be even lazier and only load certain scripts for certain events, such as a button-press. For this, we can define a `require()` function that takes the file path of a script to load and a callback function to execute as soon as that script has loaded (to initialize some page-specific things, for example):

```JS
function require(file, callback) {
  var anchor = document.getElementsByTagName('script')[0],
      script = document.createElement('script');

  // Default
  callback = callback || function() {};

  // IE
  script.onreadystatechange = function() {
    if (script.readyState === 'loaded' || script.readyState === 'complete') {   
      script.onreadystatechange = null;
      callback();
    }
  }

  // Others
  script.onload = callback;

  // Dynamically add the script
  script.src = file;
  anchor.parentNode.insertBefore(script, anchor);
}
```

and then:

```JS
var button = document.getElementsById('my-button');
button.onclick = function() {
  require('my-script.js')
}
```


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
itself. The reason why we don't add methods to the function class (constructor)
directly via the `this` reference (which would be totaly possible and fine), is
that this would imply the instantiation (declaration) of a whole new copy of the
method for each `new` instance. By adding the method to the prototype, we only
ever declare one such function, which will nevertheless be accessible to each
instance of the class through the prototype chain.

### Omitting `new`

What happens when you call a constructor function, but without prepending the
`new` keyword? Well, you still call the function, however `this` will point to
the global object (`window` in browsers) rather than the current object, as you
intended. As a result, you get a big mess. To solve this, you can use the
following pattern: Inside the constructor, first check if `this` is `instanceof`
the constructor you are calling. If not, then the function must have been called
without `new` (in mistake), so you re-invoke it with `new` from within the
constructor (possibly forwarding any arguments) and return the object directly:

```JS
function Foo(argument) {
	if (!(this instanceof Foo)) {
		// Foo() was called instead of new Foo()
		return new Foo(argument);
	}

	this.bar = ...;
}
```

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
want to use the `Object.prototype.hasOwnProperty` method (and cache it) to check
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

### Holy Grail Pattern

We can combine the patterns and methods we saw for creating and inheriting
classes in "holy grail" function that does it all. This means, given some
constructor, we can create a function that will inherit that constructor from
another constructor and do all the boilerplate for us. As such, it will perform
the tasks of `Object.create`, reset the constructor inside the prototype and
finally also give our constructor a pointer to its super-constructor
(super-class). This function looks like so:

```JS
var inherit = (function() {
  // The static function declaration kept
  // in the closure of the returned function
  var proxy = function () { }
  return function(child, parent) {
    // Connect the empty proxy object's prototype with the parent's prototype
    proxy.prototype = parent.prototype;

    // Create a new empty proxy instance as our prototype
    child.prototype = new proxy();

    // Set the uber (super) member to point to the parent's prototype
    child.uber = parent.prototype;

    // Have the prototype's constructor property point back to the constructor
    child.prototype.constructor = child;
  }
})();
```

We can extend this to a full class-constructor, i.e. a function that creates a
class for us and optionally extends it from some parent class:

```JS
function createClass(Parent, properties) {
  var hasOwn = Object.prototype.hasOwnProperty;

  function Child () {
    // The parent class (uber) may not be defined
    if (Child.uber && hasOwn.call(Child.uber, '__construct')) {
      Child.uber.__construct.apply(this, arguments);
    }

    // We may omit the __construct method from the properties
    if (hasOwn.call(Child.prototype, '__construct')) {
      Child.prototype.__construct.apply(this, arguments);
    }
  }

  // Inherit from Object by default
  Parent = Parent || Object;

  function Proxy() { }
  Proxy.prototype = Parent.prototype;
  Child.prototype = new Proxy();
  Child.uber = Parent.prototype;
  Child.prototype.constructor = Child;

  for (var key in properties) {
    if (hasOwn.call(properties, key)) {
      Child.prototype[key] = properties[key];
    }
  }

  return Child;
}

// Pass the class to inherit from
// And an object containing the members to give to the prototype
var Child = createClass(null, {
  __construct: function(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  },

  getA: function () {
    return this.a;
  }
});

var child = new Child(1, 2, 3);
console.log(child.getA()); // 1
```

Note how we make use of the holy grail pattern to inherit the class. Also, to
specify that we don't want to extend any class at all, we can simply pass
`null`, such that the function will pick `Object` as the superclass by
default. This is perfect, since we'll nevertheless want an empty prototype
object. In the above pattern, we use custom `__construct` methods to do the
actual object initialization. The naming is arbitrary and not important.

### Prototypal Inheritance

It is worth discussing how the prototype mechanism was originally intended to be
used for the plain, basic prototype design pattern. In this pattern, we inherit
objects from other objects. As such, given some object `foo`, we would
protypically inherit from it by creating a new constructor that has its
`prototype` member set to `foo` and create a new object from that constructor
immediately. If you recall, this is what `Object.create` does:

```JS
function inheritPrototypically(base)(base) {
	function newObject() {}
	newObject.prototype = base;
	return new newObject();
}

var child = inheritPrototypically(base);
```

### Static Members

It is important to understand that everything in JavaScript is an object, even
functions. As such, the concept of static variables or functions is a very
simple one: you just add a property to the function object!

```JS
function Foo() {}

Foo.myStaticFunction() = function() {
	/* ... */
}

Foo.myStaticVariable = 5;
```

Note, however, that these static members will be accessible only from `Foo` and
not any inherited classes. For this, you would have to simply add them to the
prototype of `Foo`, yielding the same semantics but allowing inheritance of
properties. However, in that case you could no longer access the static method
via the `Foo.method` syntax. You would, in essence, simply be adding a method to
each instance that does not operate on non-static data.

It it interesting to note that when you call a static method, i.e. one that is a
property of the Function itself (the constructor), `this` will be bound to the
function, not to any instance. This is relevant when you want to have the
semantics of being able to call a static method `foo` on both the class and the
instance, like in Java or C++. This can be achieved simply by setting a
reference to the static method in the prototype of the class. In that case (and
probably any case), simply avoid using `this` inside the static method.

Private static members can be achieved via closures when creating the
constructor function. In this pattern, we would assign the constructor to the
result of an immediate function, in which we declare local variables and
ultimately return a constructor function. The local variables would be contained
in the closure of the returned constructor and thus act as private
members. Moreover, because all instances would hold a reference to the same
closure, these private variables would be static. For example, we may want to
give each instance of a class `Elephant` we create a unique, constant ID. We can
achieve this like so (taking advantage of the fact that primitive types are deep
copied, like in Java):

```JS
var Elephant = (function() {

	// The private static member
	var counter = 0;

	// The actual constructor
	return function() {
		this.id = counter++;
	};
})();

var a = new Elephant(); // a.id = 0
var b = new Elephant(); // b.id = 1
```

Resources:

* http://stackoverflow.com/questions/7694501/class-static-method-in-javascript

### Private Members

JavaScript in itself has no notion of access specifiers for its classes' members
(i.e. function properties). However, we can model private members (like many
things) through functions and closures. The simplest way you can think of this
is to simply keep local variables in the constructor and then add member
functions to `this` that can later on access these private variables, while
outside parties cannot:

```JS
function Foo() {
	var private = 5;
	this.method = function() {
		/* Access private member */
	}
}

var foo = new Foo();
foo.method(); // Accesses the private member
foo.private   // undefined
```

However, this pattern has the drawback of having to add the method to `this`,
meaning every method we add will have to be re-created for each new
object. Nevertheless, this is fine and in fact the only way to achieve private
access for instance-level properties. Note that when have a *private* member
like `private`, any method which has access to such a *private* member, like
`method`, is called a *priviledged* method.

Another pattern which denies access to certain members in the outside world adds
private members to the prototype, making them a sort of private static
members. For this, we use the immediate function pattern like so:

```JS
function foo(/* ... */) { /* ... */ }

foo.prototype = (function() {
	var private = 5;
	return {
		constructor: foo,
		method: function(value) { return private + value; }
	};
})();
```

or so:

```JS
(function() {
	var private = 5;
	foo.prototype.method = function(value) { return private + value; }
})();
```

Which doesn't require us to return the entire prototype object each time.

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

Another pattern for modules is to use an *immediate object*, which is basically
an object literal with some initialization method we call immediately:

```JS
var module = ({
	a: 1,
	b: 2
	c: function() { ... }

	init: function() {
		// Access to this because the method is called on an object
		this.foo = 7;
		/* ... */

		return this;
	}
}).init();
```

Note that the point of this pattern is not necessarily to create a re-usable and
extendable module, but rather a contained scope. Regarding the syntax, we must
wrap the object literal (the braces) in parantheses, as it will otherwise be
interpreted as a block, as if for a `while` or `if` block.

Resources:

* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

### Module Privacy

There is one pattern, called the *revealing module* pattern, which can help give
mdodules a little more privacy and prevent users of the module from
unnecessarily or accidentally breaking things. The basic idea is to never add
members to the module, but only references to internally defined, private
variables. As such, modifying any property of the module (e.g. a function
reference) by, say, setting it to `null`, would only set the internal reference
to `null` and not the actual internal function. This could be done like so:

```JS
var module = (function(m) {
	var privateVariable = 5;

	function publicMethod(x, y) { return x + y; }

	m.method = publicMethod;

	return m;

})(module || {});
```

Note that when not adding to an existing module, but just returning a new one
(via an object literal), it may be a good idea to `Object.freeze` it:

```JS
var module = (function(m) {
	var variable = 5;

	function publicMethod(x, y) { return x + y; }

	return Object.freeze({
		method: publicMethod
	});
})();
```

The point of all of this is that now, when the user is stupid and does
`module.method = null`, this will never actually set the actual function defined
in the function closure to `null`. Thus, other methods depending on the
definition of the function will not be affected by this modification. With
`Object.freeze`, we disallow such a change entirely.

## AJAX

AJAX stands for *asynchronous javascript and XML* and is a programming technique more than a standard. Its basic idea is to make HTTP requests from client-side JavaScript to the server, for example to retrieve new images for a slideshow or any other kind of data that doesn't require to reload the page. Also, the transferred data definitely need not be XML, but can be JSON (most common today) or any other data format, given you have an appropriate library. In modern JavaScript, AJAX is handled mainly through `XMLHttpRequest` objects, which we will investigate in the paragraphs below.

### XMLHttpRequest

`XMLHttpRequest` objects are the core of AJAX in JavaScript today. They allow for asynchronous HTTP requests to a server, from client-side JavaScript. There are three main steps to sending such a request:

1. Create a new request object.
2. Setup a callback function to be executed on a state change w.r.t. the request, e.g. when the response is ready.
3. Specify the HTTP method and destination.
4. Send the request.

The hassle starts with (1), as Internet Explorer, obviously, has an entirely different mechanism for AJAX before IE7. As such, when we want to create a new request object, we'll have to use code following this pattern:

```JS
var request;
if (window.XMLHttpRequest) { // IE7 and other browsers
  request = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE6 and older
  request = new ActiveXObject('Microsoft.XMLHTTP');
} else {
  throw {
      name: "RequestError",
      message: "Could not find object to create request with!"
  };
}
```

Next, we have to setup our callback function for state changes. We speak of *state changes*, because there are several states in a request-response cycle. First, let's see how we register a function. For this, we assign the `onreadystatechange` property to a callback of our choosing, which takes no arguments. Inside, we can query the request object's `readyState` to see if it's value is 4, which means *complete* (i.e. ready to be inspected). Other values include:

* 0: *UNSENT*, which means the request has been created, but not opened yet.
* 1: *OPENED*, when the request has been opened but not sent yet.
* 2: *HEADERS_RECEIVED*, when `send()` has been called and the response *headers* have been received.
* 3: *LOADING*, when the response body is being received.
* 4: *DONE*, when the entire, complete body is ready for inspection, or an error occurred.

Note that the names of these states are different in Microsoft  ([Reference](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)). Assuming the names above, you can use the `XMLHttpRequest` constants for each state, e.g. `XMLHttpRequest.DONE`, to make your checks. However, for cross-browser compatibility, the numbers may be a better option (`4` will always indicate a fully received reponse).

```JS
request.onreadystatechange = function() {
  if (request.readyState !== 4) return;
  if (request.status !== 200) {
    alert('Error! Status code: ' + request.status);
    return;
  }

  alert('Response well received!');

  /* ... */

  return;
}
```

Note how the request object has a `status` property. Other interesting properties you can read or write before or after the request (possibly to get information about the response) include:

* `statusText`: A human-readable message associated with the status (e.g. `'OK'`).
* `timeout`: A timeout in milliseconds for the request.
* `abort()`: which aborts the request after it has been sent. This changes the `readystate` of the request to 0 (UNSENT), without firing a `readystatechanged` event.

Next, we deal with creating and sending the request. For this, we use two methods: `open()` and `send()`. The former configures the request, the latter sends it. Let's look at `open()` first. It takes the following parameters:

* `method`: A string describing the HTTP method, such as `'GET'` or `'POST'`.
* `url`: A string describing the URL for the request.
* `async`: A boolean indicating whether or not the request should be asynchronous, defaulting to `true`.

Note especially that there is restriction on the request target URL, enforced by all browsers, that it must point to the same domain. That is, you cannot make HTTP requests to any other domain (`domain.tld`) other than your own. This is for security purposes. For alternatives and workarounds, see [here](https://developer.mozilla.org/En/HTTP_access_control).

```JS
request.open('GET', 'my-domain.io/foo/bar/baz', true);
```

Lastly, the `send()` method sends off the request. Its only optional parameter is any data you want to send with the request, such as for `POST` requests. For this, `send()` can, for example, take URL parameters in the `key=value&key=value` format, or form data. Note that you will often want to configure the content type in the header via `XMLHttpRequest.setRequestHeader('Content-Type', '<type>')`, where `<type>` may be `application/x-www-form-urlencoded`, for example:

```JS
request.send('key=value&foo=bar');
```

Note that with `XMLHttpRequest.setRequestHeader(key, value)` we can set any
key-value header pair. Inside our state-change handler, we naturally wait for
the response to be received and completed. Once the response has been
well-received, we can access it via the `response` property of our request. This
is the raw data the peer sent, which could be a string, an array, json or
anything else (depending on the content-type header). Moreover, the
`responseText` contains the response as a string, irrespective of its actual
type, while `responseType` tells what the type of the response data is (e.g.
`'json'`):


```JS
request.onreadystatechange = function () {
  if (request.readystate !== XMLHttpRequest.DONE) return;
  if (request.status !== 200) {
    alert('Error! Status code: ' + request.status);
    return;
  }

  console.log(request.responseType); // e.g. 'json'
  console.log(request.response); // e.g. { "foo": 5 }
}
```

## Patterns

### Initialization-Time Branching

Often, we may want to test for availability of certain properties or functions
on different browsers, systems and environments. For example, there may be three
ways of adding an event listener for some UI event in a browser, depending on
the concrete browser in which an event was fired. In such a situation, we
basically have two ways of *branching* depending on some condition: every time
we call a function, or once when initializing (defining) the function. The first
option could look like so:

```JS
var utility = {

	addListener: function(element, eventName, callback) {
		// Check if `Element.addEventListener` is available
		if (typeof element.addEventListener === 'function') {
			element.addEventListener(eventName, callback, false);
		} else if (typeof element.attachEvent === `function`) { // IE
			element.attachEvent('on' + eventName, callback);
		} else { // Older Browsers
			element['on' + eventName] = callback;
		}
	}
};
```

However, we would need to branch depending on the browser environment each time
we call the function, even though it would be clear from the very first time
already. As such, the better and more efficient pattern is to perform this
branching at initialization time:

```JS
var utility = {}

if (typeof window.addEventListener === 'function') {
	utility.addListener = function(element, eventName, callback) {
		element.addEventListener(eventName, callback, false);
	}
} else if (typeof window.attachEvent === `function`) {
   utility.addListener = function(element, eventName, callback) {
		   element.attachEvent('on' + eventName, callback);
	}
} else { // Older Browsers
	utility.addListener = function(element, eventName, callback) {
		   element['on' + eventName] = callback;
	}
}
```

Another way to do this would be:

```JS
var utility = {
	addListener: (function() {
		if (/* condition */) return foo;
		else return bar;
	})()
}
```

### Sandboxing

The *sandboxing* pattern allows us to combine many modules into an isolated
environment, rather than adding them all to one and only one global object. The
basic idea is the following:

* We have a set of modules, which allow assignment of their variables and
  methods to arbitrary objects, simlar to how we implemented modules above.
* We assign collect all modules available to us in a static property of a
  `Sandbox` class, which will allow us to later select a number of these modules
  as necessary.
* We create a `Sandbox` constructor, which takes a set of dependencies (modules)
  as well as a callback function making use of the modules' functionality (like
  `angular.controller`).

This gives us the following possible implementation:

```JS
function Sandbox() {
  var args = Array.prototype.slice.call(arguments),
      callback = args.pop(),
      modules = (args[0] && typeof args[0] === 'string') ? args : args[0];

  assert(Array.isArray(modules));

  // Transparently ensure the user called `Sandbox()` with `new`
  if (!(this instanceof Sandbox)) {
    return new Sandbox(modules, callback);
  }

  // Add properties that you think all sandbox instances should have
  this.foo = 5;

  // Passings '*' as a module name should mean "all modules"
  if (modules[0] === '*') {
    modules = Object.keys(Sandbox.modules);
  }

  for (var i = 0, length = modules.length; i < length; ++i) {
    Sandbox.modules[modules[i]](this);
  }

  callback(this);
}
```

This way, we can create new sandboxed and dependency-injected environments simply by calling the `Sandbox` constructor. Note that we can also nest environments in callbacks, though these nested environments will be entirely isolated from their surrounding sandboxes (a better approach would do it like Angular and pass the dependencies as arguments, so that you could access them from nested sandboxes). We can also add static properties and methods to the prototype:

```JS
Sandbox.prototype = {
  constructor: Sandbox,
  staticVariable: 5,
  staticMethod: function(value) { return value + 1; }
};

```

Lastly, we specify the modules like so (for this pattern):

```JS
Sandbox.modules = {
  foo: function(module) {
    module.foo = 5;
  },

  bar: function(module) {
    module.bar = function() { console.log("Hello, World!"); }
  }
};
```

Resources:

* http://stackoverflow.com/questions/11187582/javascript-sandbox-pattern-example-implementation

### Testing for Undefined

There are several ways you can check for the existence or non-existence of a
certain property in an object. For example, you will often want to query the
global object to see if a certain function `foo` is present. Here are some ways
to do so:

1. If you want to check if a value has been declared or defined, i.e. if it is
   present at all, even if its value is undefined (it is was only declared), use
   the `in` operation to check for object inclusion:
   ```JS
   var foo;
   "foo" in window; // true
   "bar" in window; // false
   ```

2. To check if a value is defined and has a non-undefined value, you can use the
   `typeof <variable> === "undefined"` check. This will always work, *even if
   the value was not declared at all*, which is what you will most often be
   interested in when checking if you can use some symbol.

3. As an alternative to (2), you can use `<variable> === undefined`, where
   `undefined` is the global `undefined` value. However, this will only work if
   `<variable>` has been declared! Also, before ES5, `window.undefined` (which
   is what you reference with `undefined`) could be overriden to something else,
   like `window.undefined = "foo"`, which would obviously ruin your checks.

So the best way is to use (2) when you want to know if you can use a property.
