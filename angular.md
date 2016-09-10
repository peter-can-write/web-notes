# Angular

Angular is a model-view-controller (MVC) JavaScript framework developed and
maintained by Google. The following sections define the various moving pieces of
an angular application.

## Expressions

Angular manipulates the DOM via *expressions*. Expressions take the form `{{
expression }}` and may be placed anywhere in HTML to be replaced by
angular. Inside an expression, we can use JavaScript-like syntax to access
variables and even perform some computations. The following differences between
the expression language and JavaScript exist:

* While the scope of any expression in JavaScript is always the global `window`
  (in the browser) or a function, in Angular, there is an explicit `$scope`
  object which holds the state of the environment in an expression.
* Expressions may not contain control flow like conditionals (`if`), loops or
  exceptions.
* You may not *declare* a function in an expression.
* You cannot use `new` in an expression.

Basically, you would typically have only *very simple* expressions, such as
calling a function or making some tiny adjustments to a value (`+ 1` or `*
2`). This is because expressions are placed in the *view*, which should delegate
any implementation logic to the *controller*, as per the MVC pattern.

However, expressions in angular support *filters*, which can transform data in
interesting ways. Filters are applied via their name, preceded by a pipe symbol
(`|`). For example, angular will automatically format date input for us
according to the current locale if we pipe our data through the `date` filter:

```JS
{{ some_data | date }}
```

Filters can be chained and take (optional) arguments. Arguments are supplied and
separated via colons:

```JS
{{ some_data | filter1 : arg1 : arg2 | filter2 : arg1 | ...}}
```

Other [built-in filters](https://code.angularjs.org/1.5.8/docs/api/ng/filter) include:

* `number:precision`: Formats numbers (e.g. infinity to the unicode character)
  and takes a decimal `precision` argument to determine the number of digits
  after the comma to round to.
* `currency:symbol:precision`: Formats a currency value with an optional symbol
  (else provided by the locale) and decimal precision (like number).
* `lowercase`: Lowercases a string.
* `uppercase`: Uppercases a string.
* `limitTo:number:firstIndex`: Limit the number of elements coming from an
  array or similar sequence. The `number` of elements must be supplied as the
  second argument, the `firstIndex` optionally as the second. If `number` is
  negative, the limit (and iteration) is from right to left.

## Modules

A module packs together many important features of a web application. An
*application* may have one or more *modules*, each responsible for some part of
an application. However, often, you will have only one module. First of all, let
us discuss applications. You create a new Angular application by placing the
`ng-app` attribute in a top-level HTML tag, usually `<html>` or `<body>`. The
value of this property should be the name of your application:

```
<html ng-app="my-application">
</html>
```

Now, we can discuss modules. You create a module programmatically, in
JavaScript, via the `angular.module` function. This function takes the name of
the module and a list of dependency modules (that we may have defined ourselves
or downloaded as a library). Once we have a module, we can add controllers and
other angular elements to the module. For this, we store the module in a
variable:

```
var app = angular.module('myApplication', []);
```

## Controllers

A controller is responsible for the business logic (how data is stored, loaded,
exchanged and transformed) of an application. We can add many controllers to a
module and we'll typically have one for each *view* (page). A controller is
always associated with a *scope*, which is an execution environment in angular,
to which any variable or data of a controller will be bound. Scopes may inherit
from each other via nesting, and if so, they inherit prototypically.

A controller in angular is defined in two ways: in the template (HTML) and in
JavaScript. In the model, we add the `ng-controller="<name>"` directive to an
HTML element we want to bind the controller's scope to (and recursively to the
element's children). Often, this will be the `<body>` tag:

```HTML
<html ng-app="my-application">
	<head>
	</head>
	<body ng-controller="MyController as control">
	</body>
</html>
```

As the value of the `ng-controller` attribute we specify the name of the
controller (which we'll define in code later). Moreover, we give the controller
an alias via the `<controller> as <alias>` syntax, which will be available to us
(in expressions) in the entire `<body>` section. Then, you register and
initialize the controller in code via the `module.controller` method, which
takes the name of the controller and an array of two things: a name for the
scope and a constructor function, inside which we can add properties and methods
to the scope. This could look like so:

```HTML
app.controller('MyController', ['$scope', function($scope) {
	$scope.foo = 5;
	$scope.bar = function(x) { return x + 1; };
}]);
```

In the template (view) we can then access the properties of the `$scope`
directly within expressions:

```HTML
<body ng-controller="MyController">
	{{ foo + bar(5); }}
</body>
```

Alternatively, we can also add the properties to the controller itself via
`this` rather than add it to the `$scope`. In that case, we must qualify the
names (although we can use an alias like above):

```JS
app.controller('MyController', function() {
	this.foo = 5;
});
```

and then:

```HTML
<body ng-controller="MyController as c">
	{{ c.foo + c.bar(5); }}
</body>
```

## Directives

Directives are special markers you can place on HTML elements that allow Angular
to reference, access and manipulate the DOM at those specific points. More
specifically, you can register markers on tag names, attributes, comments or
class names that tell Angular's HTML compiler to attach certain behavior to a
given HTML element via event listeners. Also, sometimes, Angular can even
manipulate and change the DOM via directives.

Directives generally follow the CSS class naming convention of
names-separated-by-dashes. For example, the `ng-model="foo"` attribute will
attach a listener on an HTML element, often an `<input>` tag, that will
associate the contents of the tag with a property in the current scope
(i.e. `$scope.property`).

There are four kinds of directives, which exist pre-built for certain use cases
by Angular, but which, most importantly, you an also define yourself. As such,
Angular can be seen as a pre-compiler for an HTML document that allow powerful
extensions to regular HTML. The four kinds of directives are:

* Tag Directives: `<my-dir></my-dir>`
* Attribute Directives: `<span my-dir="exp"></span>`
* Comment Directives: `<!-- directive: my-dir exp -->`
* Class Directives: `<span class="my-dir: exp;"></span>`

You will most often want to use the first two, i.e. tag and attribute
directives, as they have all the necessary functionality. Attribute directives
allow arguments.

### Built-In Directives

Some common and useful built-in directives are:

* `ng-app="<name of app>"`: The attribute directive you use to initialize your
  Angular application.
* `ng-repeat="<iterator> in <sequence>"`: An attribute directive that tells
  Angular to dynamically replicate an element for every
  element of a sequence property, e.g. an array. For example, we could have a
  `$scope.array = [1, 2, 3]` property and some HTML like this: `<div ng-repeat="i in array"><p> {{ i }} </p></div>`. This would add and resolve (i.e. perform
  template substitution) for each element in the array. When using `ng-repeat`,
  some special variables become visible in the repeated template scope:
  - `$index`: Holds the current index of iteration as a number ($0$ to $n - 1$).
  - `$start`: Boolean that evaluates to true if `$index === 0`.
  - `$last`: Boolean that evaluates to true if `$index === sequence.length - 1`.
  - `$even`/`$odd`: Boolean that evaluates to true if the index is even or odd.
* `ng-click="<JavaScript>"`: Allows registering a piece of JavaScript code for
  event listening (like `onclick`).
* `ng-init="key=value; key=value; ..."` Allows initialization of a set of values
  within a scope (just use the controller constructor).
* `ng-model="<name>"`: Binds an input, select or textarea element to a property in the current scope. This is especially useful for `<input>` tags.
* `ng-bind="<name>"`: Replaces the innerHTML of an element with the given
  *expression*. It is equivalent to using `{{ expression }}` inside the tags.

### Custom Directives

The power of Angular comes from the ability to create custom directives,
associated with however complex code you want. You create a directive by
registering one to your module via the `directive` method, which takes the name
of the directive and a (factory) function, which does nothing else than return
an object with information about the directive (e.g. what kind of directive it
is). For this, it is often wise and good practice to prefix your directive names
into your own "namespace", such as `foo-my-directive` and
`foo-my-directive2`. This prevents collisions in future versions of HTML or
Angular, where either standard or angular-specific tags may appear (that's why
all Angular tags have the `ng` prefix). Either way, you would declare an Angular
directive like so:

```JS
app.directive('myDirective', function() {
	return {
		/* stuff */
	};
});
```

We will now discuss what the `/* stuff */` is. The most basic property of this
returned object will be some HTML we want to insert into the element associated
with the directive. This can be done in three ways:

1. By directly inlining HTML code as a value to the `template` property:
   `template: "<p>smell</p>"`
2. By specifying a URL to an HTML file to include via the `templateUrl`
   property:
   `templateUrl: "path/to/file.html"`
3. By specifying a function that takes two arguments and returns the url of the
   HTML file as the value of `templateUrl`. This is like option (2), but we can
   make use of the two arguments:
   - `element`: The element on which the template was called. Note that the
     compiler invokes this function (and retrieves the URL) only once, the first
     time it encounters a directive of this kind in your view. As such, don't
     think you'll be able to do something for *each* element with this
     directive.
   - `attributes`: The attributes of the element in an object.
   ```JS
   return {
	templateUrl: function(element, attributes) {
		return attributes.foo + '-file-2016.html'
	}
   };
   ```

By default, a registered directive will match attribute directives and tag
directives. To match class or comment directives, we must use the `restrict`
option. This property in the returned objects takes a string that specifies what
kinds of directives to match. More specifically, the string may contain any of
the following four characters:

* `'A'` - only matches attribute directives.
* `'E'` - only matches tag directives.
* `'C'` - only matches class directives.
* `'M'` - only matches comment directives.

We can select multiple of these as a string: `restrict: "ACE"` would match
attribute, class and tag directives. The `E` stands for *element* directive,
another name for tag directives.

Besides inserting custom HTML, we can also pass argument to a directive via
attributes. For this, we must create a new *isolate scope*. An isolate scope is
a scope created specifically for a directive, isolated entirely from its outside
environment (scope). This isolation is two-way: no variables defined for the
scope (we'll see how) will ever be visible outside the directive's environment,
but also no variables defined outside the scope of the directive (e.g. in the
scope of the controller, initialized in the corresponding constructor) will be
visible inside the directive. That said, the way we define a variable and
associated attribute for a directive is via the `scope` property of the returned
object in the factory function of our directive. This `scope` property is an
object that maps variable names we wish to have access to within the directive's
scope to attribute names. The simplest thing we can do in this `scope` object is
to map a variable name to a string of the form `"=<attribute-name>"`. This will
make the key available in the isolated scope. For example:

```JS
app.directive('myFoo', function(){
	return {
		restrict: 'E',
		scope: {
          foo: "=bar"
		}
	};
});
```

and then

```HTML
<my-foo bar="asdf"> {{ foo }} </my-foo>
```

where `{{ foo }}` will resolve to `"asdf"`. Note that if we do not use a `scope`
property, the directive will simply inherit the parent scope. We should clarify
the `=` a bit further, as there are actually three ways of specifying a property
of the isolated scope:

* `=<optional name>`: Creates a bi-directional binding between the enclosing,
  parent scope and the isolated directive scope. This means that if you
  actually pass the name of a property of the parent scope as the value of this
  attribute, then you get a reference to that attribute and can modify it. If
  you do so, you change the value in the directive scope *and* in the parent
  scope (it is a reference to that parent scope's value). You cannot use Angular
  expressions (`{{...}}`) in this mode. Note that whatever you pass will be interpreted as a property in the parent scope. You cannot pass constants! Use `@` for that.
* `@<optional name>`: Creates a uni-directional binding between the interpolated
  string passed as the value and the directive. That is, you *can* use an
  expression like `foo="{{ bar }} baz"` and you will get the interpolated
  (parsed and template-substituted) string as a variable in the directive
  scope. There is no binding to the parent at all.
* `&<optional name>`: Allows you to bind a function in the directive's isolated
  scope to a function in the parent's scope. For example, if we use `foo: '&'`
  as a property inside the `scope`, we can then pass `foo="bar(arg)"` as an
  attribute to the directive. Then, in the template we define for the directive,
  we have access to this function and can call it via a special
  syntax. Basically, we reference it via `foo`, but then have to pass an object
  which maps arguments to the functions to local values in the directive's
  scope. For example, if we have a variable local to the directive called `baz`,
  we can call the function from the parent scope via `foo({arg: baz})`.

Furthermore, setting `scope: true` will simply (prototypically) inherit all variables from the parent scope, while setting `scope: {}` will create an isolated, empty scope ([reference](http://stackoverflow.com/questions/24528388/what-is-the-difference-between-scope-and-scopetrue-inside-directive)). Other properties we can give the returned object are:

* `priority`: a metric to tell the Angular compiler what directives to inspect
  first. By default, this value is zero. Higher priority directives are compiled
  before lower-priority ones.
* `link`: Links a JavaScript function to execute for the element associated with
  a given directive. This function can take the following parameters:
  - The current `scope` object.
  - The `element` of the directive.
  - The `attributes` of the element as an object.
* `transclude`: which you can set to true or false. Which one depends on whether
  or not you have content inside the directive. If `transclude` is `false`
  (default), the directive will replace everything that was previously inside
  the directive (with the contents of `template` or `templateUrl`). To prevent
  that from happening, you should set `transclude` to `true` and add
  `<ng-transclude></ng-transclude>` to your template. The whatever you had
  inside the directive before will replace those tags.

## Services

In Angular, services are small, modular singleton objects that can be
dependency-injected across Angular components (controllers, services or
filters). There exist many built-in services, which are prefixed by a dollar
sign. For example, the `$http` service lets you perform HTTP requests to a
server. Other services built into Angular are:

* `$timeout(function, time)`: Calls the `function` after `time` milliseconds.
* `$interval(function, time, count)`: Calls the `function` repeatedly after `time`
   milliseconds, at most `count` times. If `count` is `undefined` or zero, loops
   indefinitely.
* `$log`: Provides some logging functionality to log errors, warning or simple
  messages to the browser console, if present.
* `$animate`: Used for animation on the DOM.
* `$location`: Which allow inspection and manipulation of the URL.

To use these services, you specify them when declaring a component. Just like we
used to declare the `scope` variable to add properties to a controller's scope,
we can now have more dependencies. Again we would specify them before the
service function and then take them as arguments in that service function.

To declare your own service which you can reuse across your components, you have
several options. All of these depend on the `$provide` service, which is the
most basic interface for creating a service. More precisely, there are three
elements to the creation of a service:

* A *service provider*, which are functions responsible for creating (providing)
  a service.
* A *service factory*, which is the actual factory function of a provider
  responsible for returning the service instance. This function is always (at
  the core) the `$get`method of the service provider.
* The actual *service instance*, which is the service used by components in
  angular and is returned by the service factory of the service provider.

As such, the core way of creating a service would be to register one via the
`module.provider(name, provider)` method, which takes the `name` of the provider
and the provider instance. The `name` will subsequently be available as
`<name>Provider`, i.e. the `Provider` suffix is added automatically. The
provider can be one of two things: an object or a constructor function. Either
way, it must have a `$get` property, which is the service factory. When called,
this function must return the service instance, whatever that is.

Furthermore, there exist convenience functions that take care of easing the
registration of a new service. There are two most important variants: the
`factory` and `service` methods. The former basically allows setting the
function that is assigned to `$get` in the service provider, while `service`
goes even further in allowing you to specify the instance constructor directly,
as if by calling `provider.$get()` or invoking the factory function given to
`module.factory()`. That is, to the `service` function you pass a constructor,
which will be instantiated with `new` by the provider. Additionally, there exist
the `constant` and `value` functions, which are just called to return plain
values, as if by passing a function like `function() { return 5; }` to the
`module.factory` method. Note then, that the `value` providers cannot be
injected into providers (only other components).

The point of all this is that with the `provider` function, we can have state
outside of the factory method (`$get`) to actually configure the factory. This
configuration can be done in the `module.config` function. In practice, you will
most often want to use either `factory` or `service`. The former if you want to
return an object, the latter if you want to return a class instance. Once you
have defined a service, you can dependency-inject it:

```
app.controller('MyController',
['$scope', '$http', 'myService', function($scope, $http, myService) {
	/* Do something with myService */
}]);
```

Resources:

* http://stackoverflow.com/questions/15666048/angularjs-service-vs-provider-vs-factory

## Filters

We have already seen how filters work and how they can help us with
expressions. The nice thing is that we can also define our own filters, to be
used in `pipe` expressions like `limitTo` or `upperCase`. Registering such a
filter is very easy. We simply pass the name of our filter and a factory
function to the `module.filter` method. The factory function we pass should
return the filter, which takes the input value as its first argument and any
other arguments we wish to process as subsequent parameters:

```JS
app.filter('squareAdd', function() {
	return function(input, number) {
		number = number || 0;
		return (input * input) + number;
	};
});
```

Now we can use it like so:

```HTML
<p> {{ 5 | squareAdd:1 }}</p>
```

which will resolve to 26.

## HTTP

Angular provides the `$http` service, which is a wrapper around the
`XMLHttpRequest` method, used to make HTTP requests to a server to retrieve
backend data and process it in JavaScript. As a service, you can
dependency-inject it into your controller. Then, you pass it a request and it
will give you back a response, to which you can react.

The basic usage pattern involves invoking the `$http` service (a first-class
function), which takes a single argument and returns a promise. That single
argument is an object defining some configuration parameters, which must be at
least the HTTP method and URL to perform the method at. Furthermore, you may
pass the following parameters, among others:

* `data`: A string or object to send with the request, e.g. for POST or PUT
  methods.
* `timeout`: A timeout in milliseconds for the request.
* `headers`: An object of headers to pass along with the request.
* `params`: Parameters as an object, for a GET request (`?key=value&key=value`).

However, for simplicity, the `$http` object also has utility methods for common
HTTP methods like:

* `$http.get(url [, config])`: Performs a GET request to the given URL.
* `$http.post(url, data [, config])`. Performs a POST request to the given URL,
  with the given data.
* `$http.delete(url [, config])`. Performs a DELETE request to the given URL.

The returned object will be a *promise*, which is a datatype defined in the `$q`
service. Its most important method is `then`, which takes three callbacks:

1. `successCallback`: A function to invoke on success of the request.
2. `errorCallback`: A function to invoke when an error ocurred in the
   request. This callback is optional. If you don't specify it, you will not be
   notified of the error.
3. `notifyCallback`: A function to invoke when the call wishes to notify you of
   the methods progress. For this, the called function must manually call
   `notify`, if it so wishes. So this is entirely optional and the documentation
   must be consulted if any intermediary notification is performed at all.

To any of these callbacks, a response object is returned. This response object
contains:

* `config`: The object used to generate the request (passed to `$http`).
* `data`: The response data, as a string or object.
* `status`: The status code number of the response.
* `headers`: A function which can be called with the name of a header to
  retrieve the associated header value string.
* `statusText`: A human-readable message associated with the status code.

## Selection

You can fill dropdown boxes with Angular using the `<select>` HTML5 tag and
the `ng-options` attribute. This `ng-options` attribute takes a Python-like
comprehension over some sequence in the current scope, that may be a string *or
an object*. We could also just `ng-repeat` an `<option>`, but then we could not
select an object. With `ng-options`, we can display a member of an object, but
then have the object itself be selected. For example, with this data:

```JS
var data = [
	{ a: 1, b: 2 },
	{ a: 3, b: 4}
];
```

We can use Angular like so to create a nice dropdown menu:

```HTML
<select ng-model="selectedObject" ng-options="x.<what-to-show> for x in
data"></select>

<h1>The selected value is {{ selectedObject.someProperty}} </h1>
```

For plain strings, it works the same way.

## Routing

Angular allows for the development of *single page applications*. This means
that it has built-in view routing on the *client side*. This is like server-side
routing with Flask, but done entirely on the client side, in the browser. This
also means that there is less network traffic, as the page does not have to be
reloaded at all (just once).

The routing functionality of Angular is built into a separate *service* called
`ngRoute`, which you must dependency-inject at the beginning, when initializing
your module. You then perform the actual routing inside the `module.config`
function, which is called exactly once, when loading the module at the very
start. We can then associate a few things with a *route*, which is basically a
relative URL. Among others these parameters include:

* An HTML template URL, via `templateUrl`.
* A `controller` name (as string) to associate with the route (to handle the
  business logic just for that route).
* A route to `redirectTo`.
* Dependencies to inject into the controller, via `resolve`.

So how does this look in code? Well, we must do two things: first, insert the
necessary HTML and then write the actual routing code. The first is very easy to
do. We must simply insert he `ng-view` tag with no contents wherever we want the
current view to be rendered, for example:

```HTML
<body>
<ng-view></ng-view>
</body>
```

takes care of it all. Then, the routing:

```JS
var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home.html',
			controller: 'HomeController'
		})
		.when('/foo', {
			templateUrl: 'foo.html',
			controller: 'FooController'
		})
		.when('/bar', {
			templateUrl: 'bar.html',
			controller: 'BarController'
		})
		.otherwise({
			redirectTo: '/'
		});
});
```

We use the `$routeProvider.when` method to associate a URL with some
configuration information. Note also how, at the end, we route all URLs that
don't match `/`, `/foo` or `/bar` back to `/` with the `redirectTo` function. We
could then basically define a whole new HTML page for each view and have a whole
new controller for each page, which means a new scope and new variables.

Resources:

* http://www.w3schools.com/angular/angular_routing.asp

## Events

Angular provides registration of event listeners similar to how this is possible
in plain JavaScript. the one difference is that with Angular's listeners, we can
actually access the model (scope). Here are some examples of events we can
listen for:

* `ng-click`: Triggered when the user clicks an element.
* `ng-change`: Triggerd as soon as a user changes the contents of an input field.
* `ng-copy`: Triggered when the user copies the contents of an element to the clipboard.
* `ng-focus`: Triggered when an element gets focus.
* `ng-keydown`: Triggered when the user presses a key (down).

For example, we could register the following code for the `ng-click` event:

```JS
app.controller('myController', ['$scope', function($scope) {
	$scope.count = 0;
}]);

<button ng-click="++count"></button>
```

Note how we access the model's property `count` without specifying braces. We
have perfectly fine access to it like so. We can also call a handler function:

```JS
app.controller('myController', ['$scope', function($scope) {
	$scope.count = 0;
	$scope.handler = function() { $scope.count++; };
}]);

<button ng-click="handler()"></button>
```

It's also possible to retrieve the event object associated with the event. This
event object is actually a jQuery event object, which provides lots of useful
properties to query about the event. To get access to this object, we can pass
the special `$event` object provided by Angular to our handler:

```JS
app.controller('myController', ['$scope', function($scope) {
	$scope.count = 0;
	$scope.handler = function(event) { console.log(event.pageX); };
}]);

<button ng-click="handler($event)"></button>
```

Note that we will often want to connect these events to Angular's DOM
manipulation functionality, provided by `ng-show`. This property, `ng-show`,
takes a boolean and shows (`true`) or hides (`false`) an element depending on
its value. For example, we could change some internal boolean property on an
`ng-click` event, which we simply assign as the value of the `ng-show`
attribute to another element.

```JS
app.controller('myController', ['$scope', function($scope) {
	$scope.show = false;
}]);

<button ng-click="show = !show"></button>
<img src="img.png" ng-show="show"/>
```

Resources:

* http://www.w3schools.com/angular/angular_events.asp

### The `$digest` cycle

Whenever we speak of events, we usually speak of model changes -- updates to our application's state. For example, we may have some model variable in our scope (`$scope.variable`), that we change when the user clicks a button. One question we may have at this point relates to the expressions we may have set up in our view that listen for changes to that variable. That is, if we have some expression `{{ variable }}` and the `variable` changes, how does Angular know to update the inner HTML of that expression?

This is where the `$digest` cycle comes in. For any given `scope`, calling `scope.$digest` will check for changes on any model variables in that scope. However, first, let us review how we can even watch for changes at all. Of course this is always possible through Angular's built-in directives. However, to do so manually, we may use the `scope.$watch` function. This function takes an expression which evaluates to the value (variable) that should be watched. Most often, this will be simply a string containing the name of that variable. However, it could also be a function. Furthermore, the `$watch` function takes a listener function that is called with the new and old value every time the value of the variable changes. Lastly, you may pass a boolean `true` (default is `false`) if variable changes should be determined via object equality (using angular.equals) rather than reference equality (using `===`):

```JS
$scope.variable = 5;
$scope.$watch('variable', function(newValue, oldValue) {
  /* ... */
});

// or

$scope.$watch(
  function() { return $scope.variable; },
  function(newValue, oldValue) {
  /* ... */
});
```

So now we know how we can manually setup a listener on a model variable. However, the question remains when it will be called. As mentioned, this depends on the `$scope.$digest` function. When it is called, all variables in the model (for which listeners have been setup) will be inspected for changes. If a change occurred, the corresponding listener is executed. As such, if we manually change our model in a listener not setup with an Angular directive (e.g. with a simple `onclick=` rather than `ng-click`), we would have to manually `$digest` our scope again. In fact, when we do so, we'll probably want to call `$scope.$apply` rather than `$scope.$digest`, as the former calls `$digest` on the root scope (`$rootScope`), such that any changes are propagated through the whole DOM. For example, if you setup a timeout manually using `setTimeout` (rather than using the `$timeout` service, which handles digesting for you), you would want to call `$apply()` to update your views.

More precisely, there are two forms of `$apply`: one taking no argument, that simply calls `$digest` on the root scope and one that takes the function (possibly) producing the change. In that second case, `$apply` will wrap the all in a `try ... catch` block and forward messages to the `$exceptionHandler` service. Then, after the function you pass executes, the actual `$apply` (with no arguments) will be called:

```JS
setTimeout(function() {
  $scope.$apply(function() {
    /* ... Any updates ... */
  });
}, 2000);
```

This will run a digest cycle after the inner function (passed to `$apply`) has been evaluated. The other possibility is:

```JS
setTimeout(function() {
  function() { /* ... */ }
  $scope.apply();
}, 2000);
```

What you really only need to know is that there is such a thing as a `$digest`
cycle and that it is critical to Angular's mechanism for updating the view
w.r.t. the model. Moreover, it should be mentioned that for every call to
`$digest`, your model is not only inspected for changes once. The reason why is
that listeners may themselves cause updates to the model. As such, the digest
cycle involves at least two variable inspections: one when first called and one
after all listeners (watcher) have been evaluated. Also, you should know how and why to call `$apply` when implementing your own listeners: `$apply` for global changes, `$digest` for local changes to the current scope and its children (but not its parents).

Resources:

* https://www.sitepoint.com/understanding-angulars-apply-digest/
* http://www.jstips.co/en/angularjs-digest-vs-apply/
* https://docs.angularjs.org/api/ng/type/$rootScope.Scope
