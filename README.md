## odata-parser

[![npm version](https://badge.fury.io/js/%40balena%2Fodata-parser.svg)](https://badge.fury.io/js/%40balena%2Fodata-parser)

An OData parser written in OMeta.

OData is a protocol build on top of REST and HTTP, it's goal is to provide a uniform and reliable way to access and navigate resources.  
For a full specification of the protocol refer to this [link](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part1-protocol/odata-v4.0-errata02-os-part1-protocol-complete.html)


This module is a part of the [odata-compiler](https://github.com/balena-io-modules/odata-compiler)

The parser takes an input string representing the odata request and returns an object `{tree, binds}` if the parse is successful.

Imagine wanting the access a resource which is stored at as a depth two child of some other resource, the corresponding odata query would be something like `/parent/child/granchild`  
This string is parsed into a tree where every intermediate resource is a node, each node contains the following properties

+ **resource:** The name of resource  
+ **key:** An object containing the integer index at which the bind for the resource, if any, can be found  
+ **link:** A reference to a child node if specified via the `$links` option  
+ **property:** A reference to a child node if present  
+ **count:** A boolean value representing if the `$count` option was specified for the resource  
+ **options:** An object containing any other query options specified in the odata request

The binds array contains all the reference to primitive values contained in the odata request, example of such primitive values are: Reals, Booleans, Dates, Text, ecc.  
These binds are stored in the binds array and are referenced in the tree by the integer index where the bind resides in this array.

### Examples
**input:** /model

**output:**

```
{ tree:
   { resource: 'model',
     key: undefined,
     link: undefined,
     property: undefined,
     count: undefined,
     options: undefined }
```
**input:** /model(1)/child

**output:**
```
{ tree:
   { resource: 'model',
     key: { bind: 0 },
     link: undefined,
     property:
      { resource: 'child',
        key: undefined,
        link: undefined,
        property: undefined,
        count: undefined,
        options: undefined },
     count: undefined,
     options: undefined },
  binds: [ [ 'Real', 1 ] ] }
```

**input:** /model/$count?$filter=id gt 5

**output:**
```
{ tree:
   { resource: 'model',
     key: undefined,
     link: undefined,
     property: undefined,
     count: true,
     options: { '$filter': [ 'gt', { name: 'id', property: undefined }, { bind: 0 } ] } },
  binds: [ [ 'Real', 5 ] ] }
```

### Tests

Tests can be found under the `test/` folder, to run the whole suite use 
`npm test`
