object-sort
===========

Sort objects by properties with a chainable API.

# WIP


## API

#### configure(types = {})

`types` is an object who's keys represent sort types and who's values are
functions that, when supplied with the object, will return the value of the
field of interest for that sort type.

e.g.

```json
var types = {
  name: function(o) { return o.name }
}
```

For properties that exist in the root level of the object, you may choose to supply a string that matches the key instead of a function (like the one above.)

```json
var types = {
  name: 'name'
}
```

After calling configure, the Sort object's `types` property will be updated and
should be used as constants for the different methods of applying sorting
(and ordering/grouping.)

Access these properties with `Sort.types.sort` and `Sort.types.order`.


#### factory(list = [])

Calling the factory function will return a `Sort` object who's `originalList` property is set to the initial array (argument) and that has access to all the `Sort` API methods.


#### sort(type = CONSTANT)

Sorts the current list according to the given sort type constant.)

The only argument to `sort` is a constant that represents the key to lookup the
sort method. This should be passed a reference to one of the constants created
after calling `Sort.configure`.


#### order(type = CONSTANT)

Reorders the current list according to the given order type constant.)

The only argument to `order` is a constant that represents the key to lookup the order method. This should be passed a reference to one of the default order constants `Sort.types.order.ascending` or `Sort.types.order.descending`.


#### group(type = CONSTANT)

Groups the current list according to the given sort type constant.)

The only argument to `group` is a constant that represents the key to lookup the value getter method. This should be passed a reference to one of the sort constants.


## Example

#### Sample Data

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
