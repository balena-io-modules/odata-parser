test = require './test'
assert = require 'assert'

test '/resource?$orderby=Property', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have the property specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'Property')

test '/resource?$orderby=PropertyOne,PropertyTwo', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have the first property specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
	it 'sort options have the second property specified', ->
		assert.equal(result.options.$orderby.properties[1].name, 'PropertyTwo')


test '/resource?$orderby=PropertyOne desc', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have the property specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
	it 'sort options have the property ordering specified', ->
		assert.equal(result.options.$orderby.properties[0].order, 'desc')


test '/resource?$orderby=PropertyOne%20desc', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have the property specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
	it 'sort options have the property ordering specified', ->
		assert.equal(result.options.$orderby.properties[0].order, 'desc')


test '/resource?$orderby=PropertyOne asc', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have the property specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
	it 'sort options have the property ordering specified', ->
		assert.equal(result.options.$orderby.properties[0].order, 'asc')

test '/resource?$orderby=PropertyOne asc,PropertyTwo desc', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have property one name specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
	it 'sort options have property one ordering specified', ->
		assert.equal(result.options.$orderby.properties[0].order, 'asc')
	it 'sort options have the property two name specified', ->
		assert.equal(result.options.$orderby.properties[1].name, 'PropertyTwo')
	it 'sort options have the property two ordering specified', ->
		assert.equal(result.options.$orderby.properties[1].order, 'desc')

test '/resource?$orderby=PropertyOne/SubProperty', 'OData', (result) ->
	it 'sort options are present on the result', ->
		assert.notEqual(result.options.$orderby, null)
	it 'sort options have property one name specified', ->
		assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne')
	it "sort options have property one's sub property specified", ->
		assert.equal(result.options.$orderby.properties[0].property.name, 'SubProperty')
