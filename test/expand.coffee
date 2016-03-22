assert = require 'assert'

# We default to testing 1 level of expand options, this can be increased to test multiple levels
module.exports = testExpands = (test, nested = 1) ->
	describe '$expand', ->
		test '$expand=Products/Suppliers', 'OData', (result) ->
			it 'has an $expand value', ->
				assert.notEqual(result.options.$expand, null)
			it 'has a resource of Products', ->
				assert.equal(result.options.$expand.properties[0].name, 'Products')
			it 'has a child path of Suppliers', ->
				assert.equal(result.options.$expand.properties[0].property.name, 'Suppliers')

		test '$expand=Products,Suppliers', 'OData', (result) ->
			it 'has an $expand value', ->
				assert.notEqual(result.options.$expand, null)
			it 'has a resource of Products', ->
				assert.equal(result.options.$expand.properties[0].name, 'Products')
			it 'has a resource of Suppliers', ->
					assert.equal(result.options.$expand.properties[1].name, 'Suppliers')

		if nested > 0
			testExpandOption = (test, input, entry, expectation) ->
				test "$expand=Products(#{input})", entry, (result) ->
					it 'has an options property', ->
						assert.notEqual(result.options, null)
					it 'has an $expand value', ->
						assert.notEqual(result.options.$expand, null)
					it 'has a resource of Products', ->
						assert.equal(result.options.$expand.properties[0].name, 'Products')
					expectation(result.options?.$expand?.properties?[0])
			nestedTest = testExpandOption.bind(null, test)
			nestedTest.skip = testExpandOption.bind(null, test.skip)
			nestedTest.only = testExpandOption.bind(null, test.only)

			require('./filterby')(nestedTest)
			require('./format')(nestedTest)
			require('./orderby')(nestedTest)
			require('./paging')(nestedTest)
			require('./select')(nestedTest)
			testExpands(nestedTest, nested - 1)

testExpands(require './test')
