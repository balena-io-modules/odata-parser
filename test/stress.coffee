test = require './test'
assert = require 'assert'

describe 'Stress Testing', ->
	ids = [1..2000]
	filterString = ids.map((i) -> 'id eq ' + i).join(' or ')
	test '$filter=' + filterString, ids, (result) ->
		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)
