assert = require 'assert'

module.exports = (test) ->
	describe 'Count', ->
		test '$count', 'OData', (result) ->
			it 'count should be specified', ->
				assert.equal(result.options.$count, '*')
		
		test '$count=true', 'OData', (result) ->
			it 'count should be specified', ->
				assert.equal(result.options.$count, '*')

		test '$count=*', 'OData', (result) ->
			it 'count should be specified', ->
				assert.equal(result.options.$count, '*')

