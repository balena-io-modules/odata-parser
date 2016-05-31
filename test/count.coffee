assert = require 'assert'
pathtest = require('./test').raw


module.exports = (test) ->
	describe 'Count', ->
		test '$count=true', 'OData', (result) ->
			it 'count option should be specified with value true', ->
				assert.equal(result.options.$count, 'true')

		pathtest '/model/$count', 'OData', (result) ->
			it 'should have the count specified', ->
				assert.equal(result.count, 1)

		pathtest '/model(1)/child/$count', 'OData', (result) ->
			it 'should have the count specified for the child', ->
				assert.equal(result.property.count, 1)

		pathtest '/model(1)/$links/child/$count', 'OData', (result) ->
			it 'should have the count specified for the linked child', ->
				assert.equal(result.link.count, 1)

		pathtest '/model?$orderby=child/$count', 'OData', (result) ->
			it 'should have the count specified for the resource', ->
				assert.equal(result.count, 1)