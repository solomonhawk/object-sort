var objs = require('../dist/object-sort');
var sort = objs.factory;

// some fake data
var pokemon = require('./data.json');

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
var pokemonSorter = sort(pokemon);

// chain methods to get the result you need
pokemonSorter
  .sort(t.sort.attack)
  .order(t.order.descending)
  .group(t.sort.hp)
  .getValue()
  // => sorted by attack in descending order and grouped by hp

pokemonSorter
  .sort(t.sort.name)
  .group(t.sort.types)
  .tap(function(value) {
    // do something with the value
  })
  .ungroup()
  .sort(t.sort.hp)
  .order(t.order.descending)
  .tap(function(value) {
    // do something with the value
  })
  .reset() // revert to the original list
  ...

