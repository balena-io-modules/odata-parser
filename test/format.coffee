assert = require 'assert'

module.exports = (test) ->
	describe '$format', ->
		test '$format=application/atom+xml', (result) ->
			it 'has a valid $format value', ->
				assert.equal(result.options.$format, 'application/atom+xml')
