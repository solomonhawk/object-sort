jest.dontMock('../index');
jest.dontMock('invariant');

var behavesLikeSorter = function(s) {
  expect(s.sort).toBeDefined();
  expect(s.order).toBeDefined();
  expect(s.group).toBeDefined();
  expect(s.getValue).toBeDefined();
  expect(s.reset).toBeDefined();
}

describe('object-sort', function() {
  it('provides a factory function for creating sorters', function() {
    jest.dontMock('../util/index');

    var objs = require('../index');

    var s = objs.factory([{ name: 'foo' }]);

    expect(objs.factory).toBeDefined();
    expect(typeof objs.factory).toEqual('function');
    behavesLikeSorter(s);
  });

  it('provides a configuration function for declaring behavior', function() {
    var objs = require('../index');

    expect(typeof objs.configure).toEqual('function');
  });

  it('takes an array of objects and returns a sorter object', function() {
    var objs = require('../index');
    var sort = objs.factory;

    var bad1  = {};
    var bad2  = [];
    var good1 = [{},{},{}];
    var good2 = [[{},{}],[{}]];

    var inputs  = [bad1, bad2, good1, good2];
    var outputs = ['toBeDefined', 'toBeDefined', 'toBeUndefined', 'toBeUndefined'];

    testEach(inputs, outputs);

    function testEach(values, expectations) {
      values.map(function(value, i) {
        try       { var s = sort(value); }
        catch (e) { expect(e.message)[expectations[i]](); }
        return s && behavesLikeSorter(s);
      });
    }
  });

  it('saves the original list as this.originalList', function() {
    var objs = require('../index');
    var sort = objs.factory;

    var initialValue = [{ name: 'foo' }];
    var s = sort(initialValue);

    behavesLikeSorter(s);
    expect(s.originalList).toEqual(initialValue);
    expect(s.getOriginalValue()).toEqual(initialValue);
  });

  it('resets this.lastValue to this.originalList when getValue is called', function() {
    var objs = require('../index');
    var sort = objs.factory;

    objs.configure({ name: 'name' });

    var initialValue = [{ name: 'bar' }, { name: 'foo' }];
    var s = sort( initialValue);

    expect(s.lastValue).toBeDefined;
    expect(s.lastValue).toBe(initialValue);
    expect(s.sort(objs.types.sort.name).getValue()).not.toBe(initialValue);
    expect(s.lastValue).toBe(initialValue)
  });

  describe('after being configured..', function() {
    var objs, sort, s, t;

    var types = {
      name : 'name',
      hp   : function(o) { return o.stats.hp; }
    };

    var data = [
      { name: 'foo', stats: { hp: 18 } },
      { name: 'bar', stats: { hp: 30 } },
      { name: 'baz', stats: { hp: 18 } },
      { name: 'qux', stats: { hp: 23 } },
      { name: 'zam', stats: { hp: 41 } }
    ];

    var dataSortedByName = [
      { name: 'bar', stats: { hp: 30 } },
      { name: 'baz', stats: { hp: 18 } },
      { name: 'foo', stats: { hp: 18 } },
      { name: 'qux', stats: { hp: 23 } },
      { name: 'zam', stats: { hp: 41 } }
    ];

    var dataSortedByHp = [
      { name: 'baz', stats: { hp: 18 } },
      { name: 'foo', stats: { hp: 18 } },
      { name: 'qux', stats: { hp: 23 } },
      { name: 'bar', stats: { hp: 30 } },
      { name: 'zam', stats: { hp: 41 } }
    ];

    var dataSortedByHpDescending = [
      { name: 'zam', stats: { hp: 41 } },
      { name: 'bar', stats: { hp: 30 } },
      { name: 'qux', stats: { hp: 23 } },
      { name: 'foo', stats: { hp: 18 } },
      { name: 'baz', stats: { hp: 18 } }
    ];

    var dataGroupedByHp = [
      [
        { name: 'foo', stats: { hp: 18 } },
        { name: 'baz', stats: { hp: 18 } }
      ],
      [{ name: 'qux', stats: { hp: 23 } }],
      [{ name: 'bar', stats: { hp: 30 } }],
      [{ name: 'zam', stats: { hp: 41 } }]
    ];

    var dataUngrouped = [
      { name: 'foo', stats: { hp: 18 } },
      { name: 'baz', stats: { hp: 18 } },
      { name: 'qux', stats: { hp: 23 } },
      { name: 'bar', stats: { hp: 30 } },
      { name: 'zam', stats: { hp: 41 } }
    ];

    beforeEach(function() {
      objs = require('../index');
      sort = objs.factory;

      objs.configure(types);

      s = sort(data);
      t = objs.types;
    });

    it('can sort items given a configured sort type', function() {
      expect(s.sort(t.sort.name).getValue()).toEqual(dataSortedByName);
      expect(s.sort(t.sort.hp).getValue()).toEqual(dataSortedByHp);
    });

    it('can order items given a configured order type', function() {
      var list = s.sort(t.sort.hp).order(t.order.descending).getValue();
      expect(list).toEqual(dataSortedByHpDescending);
    });

    it('can group items given a configured sort type', function() {
      expect(s.group(t.sort.hp).getValue()).toEqual(dataGroupedByHp);
    });

    it('can ungroup a grouped list', function() {
      expect(s.group(t.sort.hp).lastValue).toEqual(dataGroupedByHp);
      expect(s.ungroup().getValue()).toEqual(dataUngrouped);
    });
  });
});
