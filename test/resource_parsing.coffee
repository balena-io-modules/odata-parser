test = require('./test').raw
assert = require 'assert'

describe 'Resource Parsing', ->
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

	test '/model/$count/$count', 'OData', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	test '/model/$count', 'OData', (result) ->
		it 'should have the count specified', ->
			assert.equal(result.count, true)

	test '/model(1)/child/$count', 'OData', (result) ->
		it 'should have the count specified for the child', ->
			assert.equal(result.property.count, true)

	test '/model(1)/$links/child/$count', 'OData', (result) ->
		it 'should have the count specified for the linked child', ->
			assert.equal(result.link.count, true)

	test '/model/$count?$filter=id gt 5', 'OData', (result) ->
		it 'should have the count specified', ->
			assert.equal(result.count, true)

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		it 'lhr should be id', ->
			assert.equal(result.options.$filter[1].name, 'id')

		it 'rhr should be 5', ->
			assert.equal(result.options.$filter[2], 5)

	test '/model/$count?$filter=id eq 5 or id eq 10', 'OData', (result) ->
		it 'should have the count specified', ->
			assert.equal(result.count, true)

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'or'", ->
			assert.equal(result.options.$filter[0], 'or')

		it 'Left hand side should be id eq 5', ->
			lhs = result.options.$filter[1]
			assert.equal(lhs[0], 'eq')
			assert.equal(lhs[1].name, 'id')
			assert.equal(lhs[2], 5)

		it 'Right hand side should be eq 10', ->
			rhs = result.options.$filter[2]
			assert.equal(rhs[0], 'eq')
			assert.equal(rhs[1].name, 'id')
			assert.equal(rhs[2], 10)

	test ['FilterByExpression', 'foo eq $INVALID'], 'ProcessRule', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	test ['FilterByExpression', "foo eq 'valid'"], 'ProcessRule', (filter) ->
		it "Filter should be an instance of 'eq'", ->
			assert.equal(filter[0], 'eq')

		it 'lhr should be foo', ->
			assert.equal(filter[1].name, 'foo')

		it "rhr should be 'valid", ->
			assert.equal(filter[2], 'valid')

