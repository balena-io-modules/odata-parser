test = require './test'
assert = require 'assert'

test = test.raw

test '/', 'OData', (result) ->
	it 'Service root should point to $serviceroot', ->
		assert.equal(result.resource, '$serviceroot')


test '/$metadata', 'OData', (result) ->
	it '$metadata should point to $metadata', ->
		assert.equal(result.resource, '$metadata')


test '/model', 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'model')


test '/model/child', 'OData', (result) ->
	it 'should fail, since a key needs to be specified for the first collection', ->
		assert(result instanceof SyntaxError)


test '/model(1)', 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'model')

	it 'should have the key specified for the source', ->
		assert.equal(result.key, '1')


test "/model('TextKey')", 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'model')

	it 'should have the key specified for the resource', ->
		assert.equal(result.key, 'TextKey')


test '/model(1)/child', 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'model')

	it 'should have the key specified for the resource', ->
		assert.equal(result.key, '1')

	it 'should have the child specified', ->
		assert.equal(result.property.resource, 'child')


test '/model(1)/child/grandchild', 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'model')

	it 'should have the key specified for the resource', ->
		assert.equal(result.key, '1')

	it 'should have the child specified', ->
		assert.equal(result.property.resource, 'child')

	it 'should have the grandchild specified', ->
		assert.equal(result.property.property.resource, 'grandchild')


test '/model(1)/$links/Child', 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'model')

	it 'should have the key specified for the resource', ->
		assert.equal(result.key, '1')

	it 'should have the link specified', ->
		assert.equal(result.link.resource, 'Child')


test '/method(1)/child?foo=bar', 'OData', (result) ->
	it 'should have the resource specified', ->
		assert.equal(result.resource, 'method')

	it 'The result should be addressed', ->
		assert.equal(result.key, '1')

	it 'should have the path specified', ->
		assert.equal(result.property.resource, 'child')

	it 'should have the argument specified', ->
		assert.equal(result.property.options.foo, 'bar')
