
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

  // Dependency-inject (could also just add the modules,
  // rather than evaluate its members on `this`)
  for (var i = 0, length = modules.length; i < length; ++i) {
    Sandbox.modules[modules[i]](this);
  }

  callback(this);
}

Sandbox.prototype = {
  constructor: Sandbox,
  staticVariable: 5,
  staticMethod: function(value) { return value + 1; }
};

Sandbox.modules = {
  foo: function(module) {
    module.foo = 5;
  },

  bar: function(module) {
    module.bar = function() { console.log("Hello, World!"); }
  }
};

function Parent() {
}

Parent.prototype.__construct = function (a) {
  this.a = a;
};

function Child (a, b, c) {
  this.b = b;
  this.c = c;
}

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

function createClass(Parent, properties) {
  var hasOwn = Object.prototype.hasOwnProperty;

  function Child () {
    if (Child.uber && hasOwn.call(Child.uber, '__construct')) {
      Child.uber.__construct.apply(this, arguments);
    }
    if (hasOwn.call(Child.prototype, '__construct')) {
      Child.prototype.__construct.apply(this, arguments);
    }
  }

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

var Child = createClass(null, {
  __construct: function(a, b, c) {
    this.b = b;
    this.c = c;
  },

  getA: function () {
    return this.a;
  }
});

var child = new Child(1, 2, 3);
console.log(child.getA()); // 1
