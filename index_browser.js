/* jshint proto: true, scripturl: true */

var objectCreate = Object.create;
var defineProperties = require('object-define-property').defineProperties;

// Contributed by Brandon Benvie, October, 2012
var createEmpty;
var supportsProto = Object.prototype.__proto__ === null;
if (supportsProto || typeof document === 'undefined') {
  createEmpty = function () {
    return { "__proto__": null };
  };
} else {
  // In old IE __proto__ can't be used to manually set `null`, nor does
  // any other method exist to make an object that inherits from nothing,
  // aside from Object.prototype itself. Instead, create a new global
  // object and *steal* its Object.prototype and strip it bare. This is
  // used as the prototype to create nullary objects.
  createEmpty = function () {
    var iframe = document.createElement('iframe');
    var parent = document.body || document.documentElement;
    iframe.style.display = 'none';
    parent.appendChild(iframe);
    iframe.src = 'javascript:';
    var empty = iframe.contentWindow.Object.prototype;
    parent.removeChild(iframe);
    iframe = null;
    delete empty.constructor;
    delete empty.hasOwnProperty;
    delete empty.propertyIsEnumerable;
    delete empty.isPrototypeOf;
    delete empty.toLocaleString;
    delete empty.toString;
    delete empty.valueOf;
    empty.__proto__ = null;

    function Empty() {}
    Empty.prototype = empty;
    // short-circuit future calls
    createEmpty = function () {
      return new Empty();
    };
    return new Empty();
  };
}

function create(prototype, properties) {
  var object;
  function Type() {}  // An empty constructor.

  if (prototype === null) {
    object = createEmpty();
  } else {
    if (typeof prototype !== "object" && typeof prototype !== "function") {
      // In the native implementation `parent` can be `null` OR *any*
      // `instanceof Object`  (Object|Function|Array|RegExp|etc) Use `typeof`
      // tho, b/c in old IE, DOM elements are not `instanceof Object` like
      // they are in modern browsers. Using `Object.create` on DOM elements
      // is...err...probably inappropriate, but the native version allows for
      // it.
      // same msg as Chrome
      throw new TypeError("Object prototype may only be an Object or null"); 
    }
    Type.prototype = prototype;
    object = new Type();
    // IE has no built-in implementation of `Object.getPrototypeOf`
    // neither `__proto__`, but this manually setting `__proto__` will
    // guarantee that `Object.getPrototypeOf` will work as expected with
    // objects created using `Object.create`
    object.__proto__ = prototype;
  }

  if (properties !== void 0) {
    defineProperties(object, properties);
  }

  return object;
}


if (!objectCreate) {
  module.exports = create;
} else {
  module.exports = require('./index');
}
