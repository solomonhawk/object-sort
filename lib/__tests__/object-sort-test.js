jest.dontMock('../index');

describe('object-sort', function() {
  it('provides a factory function for creating sorters', function() {
    jest.dontMock('../util/index');

    var objs = require('../index');

    var s = objs.factory([1, 2, 3]);

    expect(objs.factory).toBeDefined();
    expect(typeof objs.factory).toEqual('function');
    expect(s.sort).toBeDefined();
    expect(s.order).toBeDefined();
    expect(s.group).toBeDefined();
    expect(s.getValue).toBeDefined();
    expect(s.reset).toBeDefined();
  });

  it('provides a configuration function for declaring behavior', function() {
    var objs = require('../index');

    expect(typeof objs.configure).toEqual('function');
  });

  it('takes an array of objects and returns a sort instance', function() {
    var objs = require('../index');

    var badData1 = {};
    var badData2 = [];

    var goodData = [
      { name: 'qux' },
      { name: 'bar' },
      { name: 'foo' }
    ];
  });

  it('saves the original list as this.originalList', function() {
    var objs = require('../index');

  });

  it('resets this.lastValue to this.originalList when getValue is called', function() {
    var objs = require('../index');

  });

  describe('after being configured..', function() {
    it('can sort items given a configured sort type', function() {
      var objs = require('../index');

    });

    it('can order items given a configured order type', function() {
      var objs = require('../index');

    });

    it('can group items given a configured sort type', function() {
      var objs = require('../index');

    });
  });
});
