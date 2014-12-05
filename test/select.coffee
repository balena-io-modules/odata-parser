test = require './test'
assert = require 'assert'

test '/Categories?$select=category/person', 'OData', (result) ->
	it 'has a $select value', ->
		assert.notEqual(result.options.$select,null)
	it 'resource is category', ->
			assert.equal(result.options.$select.properties[0].name, 'category')
	it 'property is person', ->
			assert.equal(result.options.$select.properties[0].property.name, 'person')

test '/Categories?$select=category/person,animal', 'OData', (result) ->
	it 'has a $select value', ->
		assert.notEqual(result.options.$select,null)
	it 'resource is category', ->
			assert.equal(result.options.$select.properties[0].name, 'category')
	it 'property is person', ->
			assert.equal(result.options.$select.properties[0].property.name, 'person')
	it 'resource has animal', ->
			assert.equal(result.options.$select.properties[1].name, 'animal')

test '/Categories?$select=*', 'OData', (result) ->
	it 'has a $select value', ->
		assert.notEqual(result.options.$select,null)
	it 'property name is *', ->
			assert.equal(result.options.$select, '*')
