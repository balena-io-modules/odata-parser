test = require './test'
assert = require 'assert'

test '/resource?$top=5&$skip=100', 'OData', (result) ->
	it 'top should be specified', ->
		assert.equal(result.options.$top, 5)
	it 'skip should be specified', ->
		assert.equal(result.options.$skip, 100)

test '/resource?$inlinecount=allpages', 'OData', (result) ->
	it 'inline should be specified', ->
		assert.equal(result.options.$inlinecount, 'allpages')

test '/resource?$inlinecount=none', 'OData', (result) ->
	it 'inline should be specified', ->
		assert.equal(result.options.$inlinecount, 'none')

test '/resource?$inlinecount=flibble', 'OData', (result) ->
	it 'inline should be specified', ->
		assert.equal(result.options.$inlinecount, '')
