
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
