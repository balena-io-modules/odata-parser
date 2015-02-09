test = require './test'
assert = require 'assert'

filterString = [1..2000].map((i) -> 'id eq ' + i).join(' or ')
test '$filter=' + filterString, 'OData', (result) ->
	it 'A filter should be present', ->
		assert.notEqual(result.options.$filter, null)
