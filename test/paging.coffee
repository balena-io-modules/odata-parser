test = require './test'
assert = require 'assert'

test '$top=5&$skip=100', 'OData', (result) ->
	it 'top should be specified', ->
		assert.equal(result.options.$top, 5)
	it 'skip should be specified', ->
		assert.equal(result.options.$skip, 100)

test '$inlinecount=allpages', 'OData', (result) ->
	it 'inline should be specified', ->
		assert.equal(result.options.$inlinecount, 'allpages')

test '$inlinecount=none', 'OData', (result) ->
	it 'inline should be specified', ->
		assert.equal(result.options.$inlinecount, 'none')

test '$inlinecount=flibble', 'OData', (result) ->
	it 'inline should be specified', ->
		assert.equal(result.options.$inlinecount, '')
