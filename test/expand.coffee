assert = require 'assert'

# We default to testing 1 level of expand options, this can be increased to test multiple levels
module.exports = testExpands = (test, nested = 1) ->
	describe '$expand', ->
		test '$expand=Products/Suppliers', (result) ->
			it 'has an $expand value', ->
				assert.notEqual(result.options.$expand, null)
			it 'has a resource of Products', ->
				assert.equal(result.options.$expand.properties[0].name, 'Products')
			it 'has a child path of Suppliers', ->
				assert.equal(result.options.$expand.properties[0].property.name, 'Suppliers')

		test '$expand=Products,Suppliers', (result) ->
			it 'has an $expand value', ->
				assert.notEqual(result.options.$expand, null)
			it 'has a resource of Products', ->
				assert.equal(result.options.$expand.properties[0].name, 'Products')
			it 'has a resource of Suppliers', ->
				assert.equal(result.options.$expand.properties[1].name, 'Suppliers')

		test '$expand=Products/$count', (result) ->
			it 'has an $expand value', ->
				assert.notEqual(result.options.$expand, null)
			it 'has a resource of Products', ->
				assert.equal(result.options.$expand.properties[0].name, 'Products')
			it 'has count defined', ->
				assert.equal(result.options.$expand.properties[0].count, true)

		if nested > 0
			testExpandOption = (test, input, optArgs..., expectation) ->
				test "$expand=Products(#{input})", optArgs..., (result) ->
					it 'has an options property', ->
						assert.notEqual(result.options, null)
					it 'has an $expand value', ->
						assert.notEqual(result.options.$expand, null)
					it 'has a resource of Products', ->
						assert.equal(result.options.$expand.properties[0].name, 'Products')
					expectation(result.options?.$expand?.properties?[0])

				test "$expand=Products/Suppliers(#{input})", optArgs..., (result) ->
					it 'has an options property', ->
						assert.notEqual(result.options, null)
					it 'has an $expand value', ->
						assert.notEqual(result.options.$expand, null)
					it 'has a resource of Products', ->
						assert.equal(result.options.$expand.properties[0].name, 'Products')
					it 'has a child path of Suppliers', ->
						assert.equal(result.options.$expand.properties[0].property.name, 'Suppliers')
					expectation(result.options?.$expand?.properties?[0].property)

				test "$expand=Products,Suppliers(#{input})", optArgs..., (result) ->
					it 'has an options property', ->
						assert.notEqual(result.options, null)
					it 'has an $expand value', ->
						assert.notEqual(result.options.$expand, null)
					it 'has a resource of Products', ->
						assert.equal(result.options.$expand.properties[0].name, 'Products')
					it 'has a resource of Suppliers', ->
						assert.equal(result.options.$expand.properties[1].name, 'Suppliers')
					expectation(result.options?.$expand?.properties?[1])

			testExpandOptionCount = (test, input, optArgs..., expectation) ->
				test "$expand=Products/$count(#{input})", optArgs..., (result) ->
					it 'has an options property', ->
						assert.notEqual(result.options, null)
					it 'has an $expand value', ->
						assert.notEqual(result.options.$expand, null)
					it 'has a resource of Products', ->
						assert.equal(result.options.$expand.properties[0].name, 'Products')
					it 'has count defined', ->
						assert.equal(result.options.$expand.properties[0].count, true)
					expectation(result.options?.$expand?.properties?[0])

			nestedExpandTest = testExpandOption.bind(null, test)
			nestedExpandTest.skip = testExpandOption.bind(null, test.skip)
			nestedExpandTest.only = testExpandOption.bind(null, test.only)

			nestedCountTest = testExpandOptionCount.bind(null, test)
			nestedCountTest.skip = testExpandOptionCount.bind(null, test.skip)
			nestedCountTest.only = testExpandOptionCount.bind(null, test.only)

			for nestedTest in [ nestedExpandTest, nestedCountTest]
				require('./filterby')(nestedTest)
				require('./format')(nestedTest)
				require('./orderby')(nestedTest)
				require('./paging')(nestedTest)
				require('./select')(nestedTest)
				require('./count')(nestedTest)
				testExpands(nestedTest, nested - 1)

testExpands(require './test')
