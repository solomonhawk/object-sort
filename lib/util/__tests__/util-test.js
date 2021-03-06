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

  it('can normalize values by sorting arrays', function() {
    var util = require('../index');

    var arrayOf3   = [3, 1, 4];
    var normalized = util.normalizeValue(arrayOf3);

    expect(normalized).toEqual([1, 3, 4]);
    expect(normalized).toEqual(arrayOf3.sort());
  });

  it('returns the first value if array length is 1 when normalizing array values', function() {
    var util = require('../index');

    var arrayOf1   = [2];
    var normalized = util.normalizeValue(arrayOf1);

    expect(normalized).toEqual(2);
    expect(normalized).toEqual(arrayOf1[0]);
  })

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

  // a valid parameter is a non-empty array of objects
  // or a non-empty array of non-empty arrays of objects
  it('can check that a value is a valid factory parameter', function() {
    var util = require('../index');

    var badData1  = [[],{}];
    var badData2  = [];
    var badData3  = {};
    var goodData1 = [{},{}];
    var goodData2 = [[{}],[{},{}]];

    expect(util.isArrayOfObjects(badData1)).toBeFalsy();
    expect(util.isArrayOfObjects(badData2)).toBeFalsy();
    expect(util.isArrayOfObjects(badData3)).toBeFalsy();
    expect(util.isArrayOfObjects(goodData1)).toBeTruthy();

    expect(goodData2.every(util.isArrayOfObjects)).toBeTruthy();
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

  it('provides a utility for flattening arrays', function() {
    var util = require('../index');

    var nestedArray = [[1],[2],[3, 4]];
    var expectedResult = [1, 2, 3, 4];

    expect(util.flatten(nestedArray)).toEqual(expectedResult);
  });

  it('provides a proxy for Object.prototype.toString', function() {
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
