object-sort
===========

A configurable, chainable API for sorting lists of objects.

# WIP

===

## API

### configure(types = {})

`types` is an object who's keys represent sort types and who's values are functions that, when supplied with the object, will return the value of the property of interest for that sort type.

e.g.

Given this object structure:
```json
{
  "name": "foo",
  "role": "bar",
  "stats": {
    "hp": 21,
    "xp": 3913
  }
}
```

You might define sort types as such:
```javascript
var types = {
  name: function(o) { return o.name; },
  role: function(o) { return o.role; },
  hp: function(o) { return o.stats.hp; },
  xp: function(o) { return o.stats.xp; }
}
```

For properties that exist at the root level of the object, you may choose to supply a string that matches the property name instead of a function. Instead of what is written above, you may write the shorter version:

```javascript
var types = {
  name: 'name',
  role: 'role',
  hp: function(o) { return o.stats.hp; },
  xp: function(o) { return o.stats.xp; }
}
```

After calling configure, the Sort object's `types` property will reflect the given rules and should be used as constants for the different methods of applying sorting (and ordering/grouping.)

Access these properties with `Sort.types.sort` and `Sort.types.order`.

e.g.

```javascript
var objs   = require('object-sort');
var sorter = objs.factory;

// configure types
var types  = { name: 'name' };
objs.configure(types);

// create a sorter
var s = sorter(list);

// call the sort method passing in a sort type constant
s.sort(objs.types.sort.name)
```

===

### Sort.factory(list = [])

Calling the factory function will return a `Sort` object who's `originalList` property is set to the initial array (argument) and that has access to all the `Sort` API methods.

===

### instance.sort(type = CONSTANT)

Sorts the current list according to the given sort type constant.

The only argument to `sort` is a constant that represents the key to lookup the sort method. This should be passed a reference to one of the constants created after calling `Sort.configure`.

===

### instance.order(type = CONSTANT)

Reorders the current list according to the given order type constant.

The only argument to `order` is a constant that represents the key to lookup the order method. This should be passed a reference to one of the default order constants `Sort.types.order.ascending` or `Sort.types.order.descending`.

===

### instance.group(type = CONSTANT)

Groups the current list according to the given sort type constant.

The only argument to `group` is a constant that represents the key to lookup the value getter method. This should be passed a reference to one of the sort constants.

===

## Example

### Sample Data

```json
[
  {
    "id": 4,
    "name": "Charmander",
    "types": "fire",
    "species": "lizard",
    "stats": {
      "hp": 39
    }
  },
  {
    "id": 7,
    "name": "Squirtle",
    "types": "water",
    "species": "turtle",
    "stats": {
      "hp": 44
    }
  },
  {
    "id": 1,
    "name": "Bulbasaur",
    "types": ["grass", "poison"],
    "species": "seed",
    "stats": {
      "hp": 45
    }
  },
  {
    "id": 3,
    "name": "Fooasaur",
    "types": ["pimp", "baller"],
    "species": "thug",
    "stats": {
      "hp": 45
    }
  }
]
```
