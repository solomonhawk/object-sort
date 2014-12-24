var objs = require('../lib/object-sort');
var sort = objs.factory;

// some fake data
var data = require('./data.json');

// set up some sorting types, supplying the value getter function
var types = {
  name    : 'name',
  hp      : function(o) { return o.stats.hp; },
  speed   : function(o) { return o.stats.speed; },
  attack  : function(o) { return o.stats.attack; },
  defense : function(o) { return o.stats.defense; },
  types   : function(o) { return (typeof o.types == 'array') ? o.types.sort()[0] : o.types; }
};

// apply the type definitions
objs.configure(types);

// convenience
var t = objs.types;

// make a new sorter
var pokemonSorter = sort(data.pokemon);

// chain methods to get the result you need
var sortedByAttackInDescendingOrderAndGroupedByHp = pokemonSorter
  .sort(t.sort.attack)
  .order(t.order.descending)
  .group(t.sort.hp)
  .getValue()
