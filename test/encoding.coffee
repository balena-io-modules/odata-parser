test = require './test'
assert = require 'assert'

describe 'Encoding', ->
	test 'foo=hello%20world', 'OData', (result) ->
		it 'should equal hello world without the encoding', ->
			assert.equal(result.options.foo, 'hello world')

	test.raw '/some%20thing?foo=hello%20world', 'OData', (result) ->
		it 'should fail as we do not allow spaces in resource names', ->
			assert(result instanceof SyntaxError)
