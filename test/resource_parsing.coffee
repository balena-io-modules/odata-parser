resourceTest = require('./test')
test = resourceTest.raw
assert = require 'assert'
{ expect } = require 'chai'

checkResource = (result, expected) ->
	expect(result)
	.to.have.property 'resource'
	.that.equals expected

checkKeyBind = (result) ->
	it 'should have the key specified for the source', ->
		expect(result)
		.to.have.property 'key'
		.that.has.property 'bind'
		.that.equals 0

checkKeyParam = (result, paramAlias) ->
	it 'should have the key specified for the source', ->
		expect(result)
		.to.have.property 'key'
		.that.has.property 'bind'
		.that.equals paramAlias

describe 'Resource Parsing', ->
	test '/', (result) ->
		it 'Service root should point to $serviceroot', ->
			checkResource(result, '$serviceroot')


	test '/$metadata', (result) ->
		it '$metadata should point to $metadata', ->
			checkResource(result, '$metadata')


	test '/model', (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')


	test '/model/child', (result) ->
		it 'should fail, since a key needs to be specified for the first collection', ->
			expect(result).to.be.an.instanceof SyntaxError


	test '/model(1)', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')
		checkKeyBind(result)

	test "/model('TextKey')", ['TextKey'], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')
		checkKeyBind(result)


	test '/model(@id)?@id=1', null, null, { '@id': 1 }, (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')
		checkKeyParam(result, '@id')

	test "/model(@id)?@id='TextKey'", null, null, { '@id': 'TextKey' }, (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')
		checkKeyParam(result, '@id')


	test '/model(1)/child', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		checkKeyBind(result)

		it 'should have the child specified', ->
			assert.equal(result.property.resource, 'child')


	test '/model(1)/child/grandchild', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		checkKeyBind(result)

		it 'should have the child specified', ->
			assert.equal(result.property.resource, 'child')

		it 'should have the grandchild specified', ->
			assert.equal(result.property.property.resource, 'grandchild')


	test '/model(1)/$links/Child', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		checkKeyBind(result)

		it 'should have the link specified', ->
			assert.equal(result.link.resource, 'Child')


	test '/method(1)/child?foo=bar', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'method')

		checkKeyBind(result)

		it 'should have the path specified', ->
			assert.equal(result.property.resource, 'child')

		it 'should have the argument specified', ->
			assert.equal(result.property.options.foo, 'bar')

	test '/model/$count/$count', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	test '/model/$count', (result) ->
		it 'should have the count specified', ->
			assert.equal(result.count, true)

	test '/model(1)/child/$count', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		checkKeyBind(result)

		it 'should have the count specified for the child', ->
			assert.equal(result.property.count, true)

	test '/model(1)/$links/child/$count', [1], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		checkKeyBind(result)

		it 'should have the count specified for the linked child', ->
			assert.equal(result.link.count, true)

	test '/model/$count?$filter=id gt 5', [5], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		it 'should have the count specified', ->
			assert.equal(result.count, true)

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		it 'lhr should be id', ->
			assert.equal(result.options.$filter[1].name, 'id')

		it 'rhr should be $0', ->
			assert.equal(result.options.$filter[2].bind, 0)

	test '$1', [['ContentReference', '1']], (result) ->
		it 'should bind resource to Content-ID 1', ->
			assert.equal(result.resource, result.key)

		checkKeyBind(result)

	test '$1/child', [['ContentReference', '1']], (result) ->
		it 'should bind resource to Content-ID 1', ->
			assert.equal(result.resource, result.key)

		checkKeyBind(result)

		it 'should have the child specified', ->
			assert.equal(result.property.resource, 'child')

	test '/model/$count?$filter=id eq 5 or id eq 10', [5, 10], (result) ->
		it 'should have the resource specified', ->
			checkResource(result, 'model')

		it 'should have the count specified', ->
			assert.equal(result.count, true)

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'or'", ->
			assert.equal(result.options.$filter[0], 'or')

		it 'Left hand side should be id eq $0', ->
			lhs = result.options.$filter[1]
			assert.equal(lhs[0], 'eq')
			assert.equal(lhs[1].name, 'id')
			assert.equal(lhs[2].bind, 0)

		it 'Right hand side should be eq $1', ->
			rhs = result.options.$filter[2]
			assert.equal(rhs[0], 'eq')
			assert.equal(rhs[1].name, 'id')
			assert.equal(rhs[2].bind, 1)

	test ['FilterByExpression', 'foo eq $INVALID'], ['$INVALID'], 'ProcessRule', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	test ['FilterByExpression', "foo eq 'valid'"], ['valid'], 'ProcessRule', (filter) ->
		it "Filter should be an instance of 'eq'", ->
			assert.equal(filter[0], 'eq')

		it 'lhr should be foo', ->
			assert.equal(filter[1].name, 'foo')

		it 'rhr should be $0', ->
			assert.equal(filter[2].bind, 0)

	resourceTest '$select=', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	resourceTest '$expand=', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	resourceTest '$orderby=', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	resourceTest '$expand=test($select=)', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	resourceTest '$expand=test($expand=)', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)

	resourceTest '$expand=test($orderby=)', (result) ->
		it 'should fail because it is invalid', ->
			assert(result instanceof SyntaxError)
