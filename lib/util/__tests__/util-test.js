jest.dontMock('../index');

var samplePropDefForA = {
  value: 'a',
  writable: true,
  enumerable: true,
  configurable: true
}

describe('util', function() {
  it('can provide default object property attributes', function() {
    var util = require('../index');

    var def = util.defaultObjectProp('a');
    expect(def).toEqual(samplePropDefForA);
  });

  it('can normalize values by sorting arrays and returning the first value', function() {
    var util = require('../index');

    var value = [3, 2, 1];
    var normalized = util.normalizeValue(value);
    expect(normalized).toEqual([1, 2, 3]);
    expect(normalized).toEqual(value.sort());
  });

  it('can search for object keys', function() {
    var util = require('../index');

    var o = { foo: 1, bar: 2, baz: 3 };

    var fooKey = util.objectKeysContain(o, 'foo');
    var bazKey = util.objectKeysContain(o, 'baz');
    var quxKey = util.objectKeysContain(o, 'qux');

    expect(fooKey).toBeTruthy()
    expect(bazKey).toBeTruthy()
    expect(quxKey).toBeFalsy()
  });

  it('can identify basic types', function() {
    var util = require('../index');

    var types = [
      function() {}, // function
      {},            // object
      123,           // number
      "foo",         // string
      []             // array
    ];

    var methods = [
      util.isFunction,
      util.isObject,
      util.isNumeric,
      util.isString,
      util.isArray
    ];

    var results = types.map(function(type) {
      return methods.map(function(method) {
        return method(type);
      });
    });

    var truthTable = [
      [true, false, false, false, false],
      [false, true, false, false, false],
      [false, false, true, false, false],
      [false, false, false, true, false],
      [false, false, false, false, true]
    ];

    expect(results).toEqual(truthTable);
  });

  it.only('can call toString', function() {
    var util = require('../index');

    var number = 12345;
    var func   = function() {};
    var object = {};
    var array  = [];

    expect(util.toStr(number)).toEqual("[object Number]");
    expect(util.toStr(func)).toEqual("[object Function]");
    expect(util.toStr(object)).toEqual("[object Object]");
    expect(util.toStr(array)).toEqual("[object Array]");
  });
});
