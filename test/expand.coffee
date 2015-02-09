test = require './test'
assert = require 'assert'

test '$expand=Products/Suppliers', 'OData', (result) ->
	it 'has an $expand value', ->
		assert.notEqual(result.options.$expand, null)
	it 'has a resource of Products', ->
		assert.equal(result.options.$expand.properties[0].name, 'Products')
	it 'has a child path of Suppliers', ->
		assert.equal(result.options.$expand.properties[0].property.name, 'Suppliers')

test '$expand=Products,Suppliers', 'OData', (result) ->
	it 'has an $expand value', ->
		assert.notEqual(result.options.$expand, null)
	it 'has a resource of Products', ->
		assert.equal(result.options.$expand.properties[0].name, 'Products')
	it 'has a resource of Suppliers', ->
			assert.equal(result.options.$expand.properties[1].name, 'Suppliers')
