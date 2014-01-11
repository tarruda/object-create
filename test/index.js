var assert = require('assert');
var create = require('../index_browser');


describe('created child object', function() {
  var obj = { foo: 5 }, child;


  beforeEach(function() {
    child = create(obj, {
      foo: { value: 3, enumerable: true },
      bar: { value: 4, enumerable: true }
    });
  });


  it('should have prototype set to obj', function() {
    assert(obj.isPrototypeOf(child));
  });


  it('should contain defined properties', function() {
    assert.equal(3, child.foo);
    assert.equal(4, child.bar);
  });
});
