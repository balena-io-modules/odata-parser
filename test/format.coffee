test = require './test'
assert = require 'assert'

test '/Categories?$format=application/atom+xml', 'OData', (result) ->
	it 'has a valid $format value', ->
		assert.equal(result.options.$format, 'application/atom+xml')
