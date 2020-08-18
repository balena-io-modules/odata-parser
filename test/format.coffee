assert = require 'assert'

module.exports = (test) ->
	describe '$format', ->
		test '$format=application/atom+xml', (result) ->
			it 'has a valid $format value', ->
				assert.equal(result.options.$format, 'application/atom+xml')
		test '$format=json;metadata=minimal', (result) ->
			it 'has a valid $format value', ->
				assert.deepEqual(result.options.$format, { type: 'json', metadata: 'minimal' })
		test '$format=json;odata.metadata=none', (result) ->
			it 'has a valid $format value', ->
				assert.deepEqual(result.options.$format, { type: 'json', metadata: 'none' })
