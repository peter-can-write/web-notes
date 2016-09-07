# SASS

SASS stands for *syntactically awesome stylesheets* and is a CSS pre-compiler that adds some syntactic sugar to regular CSS, such as variables, inheritance and functions.

It is important to note that there are two syntaxes in SASS. There is a
white-space oriented, indent-based syntax that replaces braced scopes with
indented scopes. This syntax is called plain *SASS*. Then there is also *SCSS*, which is compatible with CSS. That is, every CSS file is valid SCSS, but not SASS. Nor is every (or probably any) SCSS file, and definitely not any SASS file, valid SASS.

This is SASS:

```sass
selector:
  property: value
```

And this SCSS (here even valid CSS):

```scss
selector {
  property: value;
}
```

## Comments

First of all, CSS supports multiline comments (like CSS) with `/* ... */`, but also single-line comments with `//`.

## Nesting

One of SASS's most core features is *nesting*, which references a number of concepts. For one, it means you can *nest selectors* and SASS will automatically unnest them upon compilation. That is, this regular *CSS* snippet that you may write:

```css
div {
  color: black;
}

div p {
  background-color: green;
}
```

can, in SCSS, be written as:

```scss
div {
  color: black;
  p {
    background-color: green;
  }
}
```

Additionally, it is possible to reference the parent selector from within its own scope, which is useful for adding pseudo classes or suffixes. For this, you can use the `&` operator, which references the selector in the current scope. That is, however nested you are, `&` always means "the current selector", i.e. the inner-most. As such, the following SCSS snippet:

```scss
div {
  a {
    &:hover {
      color: red;
    }
    &-foo {
      font-family: serif;
    }
  }
}
```

is compiled to:

```css
div a:hover {
  color: red;
}

div a-foo {
  font-family: serif;
}
```

Lastly, another nesting feature provided by SASS is property nesting. We know that in CSS, many properties are in "namespaces" like `font-`. For this, SCSS allows us to use `font` like a selector and then reference its "members" inside. For this, you must append a colon to the namespace, like `font:`. Therefore, the following SCSS snippet:

```scss
div {
  font: {
    color: red;
    weight: bold;
  }
}
```

is compiled to:

```css
div {
  font-color: red;
  font-weight: bold;
}
```

## Variables

One of the most essential things SASS brings is the possibility to define and use *variables*. This is quite a big deal, as you can now change things like theme colors, fonts and other values you use in more than one place by only modifying a variable, rather than all occurrences in all files! A variable is defined and then referenced very simply using a dollar sign:

```scss
$foo: 300px;
div {
  width: $foo;
  height: $foo;
}
```

Note that variables in SASS use underscores and hyphens interchangeably. That is, `$foo-bar` is the exact same thing as `$foo_bar`.

It is also possible to only conditionally assign to a variable in the case that it does not exist yet. For this, use the `!default` flag at the end of a variable definition. If the variable already exists, it will not be re-defined, else it is defined on-the-spot like a regular variable:

```scss
$foo: 5 !default; // 5 if doesn't exist yet, else old value
```

Moreover, you can actually use variables in property names, comments and selectors using the `#{}` operator, which takes a variable name and expands it to a string. For example, given the variable `$foo: 'yolo'`, we can compile the following SCSS code:

```scss
// #{$foo}
#{$foo}-bar {
  #{$foo}: 5;
}
```

into this CSS code:

```css
// yolo
yolo-bar {
  yolo: 5;
}
```

### Data Types

Variables may be any of a number of data types, which are:

* Numbers, like `10` or `20px` (so also all numbers with units).
* Strings, with or without quotes.
* Booleans, either `true` or `false`.
* Colors, like `#ff00ff` or `rgb(1, 2, 3)`.
* `null`
* Lists, separated by spaces or commas. Lists is how SASS represents sequences like `4px solid black`, as commonly used for borders.
* Maps, using the `(key: value, key: value)` syntax.

Let's look further at lists and maps.

#### Lists

An example for a list variable would be

```scss
$foo: 1, 2, 3;
// same as
$foo: 1 2 3;
```

Interestingly, SASS provides a number of *functions* that can be applied to lists. For example, given two list variables, we can join them to one list using the `join($list1, $list2 [, $separator])` function. Other interesting functions include:

* `nth($list, $index)`: Accesses the $n$-th member of the list.
* `append($list, $value [, $separator])`: Appends the `value` to the `list`.
* `index($list, $value)`: Returns the index of the `value` in the `list`, or `null` if the value is not contained in the list.

It is important to note that __indexing starts at 1 in SASS__. For example, `index(4px solid red, solid)` returns `2`.

#### Maps

Next to lists, SASS also provides maps (dictionaries) to associate values with keys. These cannot actually be converted to plain CSS objects, although every map is a list of pairs (lists of two elements) when fully expanded (i.e. `key1: value1, key2: value2` expands to `key1 value1, key2 value2`). However, they are nevertheless useful for general dictionary-like mapping of keys and values for use in SASS scripting. Below is an example of a map in SASS:

```scss
$foo: (a: 1, b: 2);
```

We can then access and operate on this map using the following functions:

* `map-get($map, $key)`: returns the value for the given `key` int he `map`, or `null` if no such `key` is present in the map.
* `map-merge($map1, $map2)`: Joins two maps. If `map2` contains a key that is also present in `map1`, the one from `map2` will be taken.
* `map-remove($map, $keys...)`: Removes one or more keys from the given `map`.
* `map-keys($map)`: Returns a list of the keys in the map.

## Operators

SASS supports all regular binary (`+, -, *, /`) and unary (`-x`) operators one knows from regular programming languages, as well as relational operators (`<, <=, ==, >, >=`) that evaluate to booleans. For numbers, addition and subtraction always preserve the unit. That is, `3px + 5px == 8px`. However, multiplication produces square-units (`3px * 5px == 15px^2`) For division, it is important to note that `/` is an actual operator in CSS, used for separating numbers. As such, `/` will only be interpreted as a division operator if the arguments are SASS variables (`$a / $b`) or the expression is evaluated in parentheses (`(5 / 2)px`). For strings, only the plus operator is defined, as concatenation.

Interestingly, performing any operation on colors performs the operation component-wise. For example, `#deadbe + #f123aa = #(de + f1)(ad + 23)(be + aa)`. Also element-wise operations between colors and plain numbers are supported: `#deadbe * 2 = #(de * 2)(ad * 2)(be * 2)`. However, note that you will most often want to use one of the may functions SASS defines for colors, such as `transparentize($color, $amount)`, which makes a color lighter by the specified amount (as a percentage between $0$ and $1$).

Lastly, SASS (like CSS) also has boolean `and, or` and `not` operators.

## Directives

SASS has a number of additional directives like `@import` or `@media` in CSS. These are used for inheritance, mixins and control-flow.

### `@import`

Like CSS, SASS has an `@import` directive, which includes files. It will only be interpreted by SASS if you include a `.sass` or `.scss` file, or leave out an extension all together. Otherwise, it's kept as a plain CSS directive:

```scss
@import "foo.scss"
// or
@import "foo"
```

### `@extend`

The `@extend` directive in SASS allows you to add the rules of one selector to that of another selector, such that you can achieve inheritance in CSS. For example, you can define rules for a `.error` class, but then want some slightly different styling for a `.serious-error`. Since every serious error *is-an* error, inheritance fits well here. Now, in regular CSS, we would usually just have every element we want to be in the `.serious-error` class also be in the `.error` class. Then we would define rules for `.error` and special rules for `.serious-error`. However, this has the drawback of having to add the `.error` class to every `.serious-error`. This is where SASS's `@extend` directive comes in useful, like so:

```scss
.error {
  color: red;
}

.serious-error {
  @extend .error; // extend some selector, here `.error`
  background-color: red;
}
```

Essentially, SASS will simply compile this in a way that all rules you define for the parent class will also be defined for the child class, using the `,` operator:

```css
.error, .serious-error {
  color: red;
}

.serious-error {
  background-color: red;
}
```

You can extend from multiple selectors, and have arbitrarily long inheritance chains.

### Control Flow

SASS supports some control-flow primitives like `if` and `for`, which we will discuss in the following paragraphs.

#### `if`

There are two options for conditionally including rules in your SASS files. The first is the `if(condition, if_so, else)` function, which takes an expression evaluating to a boolean as its first argument and branches to return its second or third argument depending on the value of the boolean:

```scss
color: if (true, red, blue); // red
color: if (blue, red, blue); // blue
```

Alternatively, you can use the `@if` directive, which is followed by an expression evaluating to a boolean, followed by a scope that is conditionally included:

```scss
@if 1 + 1 == 2 {
  color: red;
}
```

Such expressions may be followed by `@else if` and `@else` statements:

```scss
@if 1 > 2 {
  color: red;
} @else if 1 > 3 {
  color: blue;
} @else {
  color: black;
}
```

#### `for`

SASS also has support for iteration over a sequence or range. For this, it has two syntaxes:

1. `@for $var from <start> through <end>`
2. `@for $var from <start> to <end>`

Where the former *will include* the `<end>`, while the second will only iterate up to, but *not including* `<end>`. These `<start>` and `<end>` expressions can be integer literals or variables, but must evaluate to integers. When `<start>` is greater than `<end>`, the loop will decrement rather than increment. This can be used like so, for example:

```scss
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
```

which will compile to:

```css
.item-1 { width: 2em * 1; }
.item-2 { width: 2em * 2; }
.item-3 { width: 2em * 3; }
```

#### `each`

The `@each` directive acts more like an iterator directive. It iterates over a list or map using the `@each $var in <list or map> { }` synax. For a list, we can iterate like so:

```scss
@each $i in 1, 2, 3 {
  /* ... */
}
```

Moreover, it's possible to expand elements in a list if they are lists themselves (like in Python):


```scss
@each $i, $j in (1, 2), (3, 4) {
  /* ... */
}
```

Since maps are stored as lists of pairs, this also how you would iterate over a map:

```scss
@each $key, $value in (a: 1, b: 2) {
  /* ... */
}
```

### `while`

The `@while` directive loops until a condition is not met:

```scss
$i: 5
@while $i > 0 {
  .item-#{$i} { color: red; }
  $i: $i - 1;
}
```

is compiled to:

```css
.item-5 { color: red; }
.item-4 { color: red; }
.item-3 { color: red; }
.item-2 { color: red; }
.item-1 { color: red; }
```

### Mixins

Another important feature in SASS is *mixins*, which are basically macros/functions. Rather than having to form complex inheritance hierarchies, with mixins, you can simply define macros, with or without arguments, and include them wherever you want.

You define mixins using the `@mixin` directive and any arguments prefixed by the dollar sign:

```scss
@mixin foo($a, $b) {
  color: $a;
  background-color: $b;
}
```

#### Variadic Mixins

Variable (variadic) arguments are allowed too, by appending an ellipsis to the parameters. Only the last one may be variadic and it will swallow up all arguments not bound to positional parameters before the variadic one. You can use them just like other variables, as they are simply expanded (to a list):

```scss
@mixin foo($a, $b, $args...) {
  color: $a;
  background-color: $b;
  font-family: $args;
}
```

To include a mixin in another SASS rule, simply use the `@include` directive and pass arguments, if any, in parentheses:

```scss
div {
  @include foo(1, 2, 3, 4);
}
```

which will expand the mixin like a macro, on-the-spot. You can also pass lists to mixins by expanding them, again using an ellipsis. That is, given some `$list: 1, 2, 3`, we can call a function `f` taking three arguments with `f($list...)`.

### Functions

We already saw that SASS provides a number of useful built-in functions for a variety of different use cases. Fortunately, it is very simple to define your own functions too. For this, simply use the `@function` directive, which should have some `@return` statement inside:

```scss
@function square($x) {
  @return $x * $x;
}
```

The syntax is essentially like for `@mixin`s, except for the `@return` directive. As such, functions can also take variadic arguments, suffixed by an ellipsis.
