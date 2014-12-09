assert = require 'assert'

module.exports = (test) ->
	describe '$filter', ->
		operandTest = (op, odataValue, value) ->
			if odataValue is undefined
				odataValue = 2
			if value is undefined
				value = odataValue
			test "$filter=Foo #{op} #{odataValue}", 'OData', (result) ->
				it 'A filter should be present', ->
					assert.notEqual(result.options.$filter, null)

				it "Filter should be an instance of '#{op}'", ->
					assert.equal(result.options.$filter[0], op)

				it 'lhr should be Foo', ->
					assert.equal(result.options.$filter[1].name, 'Foo')

				it "rhr should be #{value}", ->
					assert.equal(result.options.$filter[2], value)

		operandTest('eq')
		operandTest('ne')
		operandTest('gt')
		operandTest('ge')
		operandTest('lt')
		operandTest('le')

		operandTest('eq', 2.5)
		operandTest('eq', "'bar'", 'bar')
		operandTest('eq', "'%20'", ' ')
		operandTest('eq', true)
		operandTest('eq', false)
		operandTest('eq', null)


		do ->
			date = new Date()
			testFunc = (result) ->
				it 'A filter should be present', ->
					assert.notEqual(result.options.$filter, null)

				it "Filter should be an instance of 'eq'", ->
					assert.equal(result.options.$filter[0], 'eq')

				it 'lhr should be Foo', ->
					assert.equal(result.options.$filter[1].name, 'Foo')

				it 'rhr should be ' + date, ->
					assert.equal(result.options.$filter[2] - date, 0)

			isoDate = encodeURIComponent(date.toISOString())
			test "$filter=Foo eq date'#{isoDate}'", 'OData', testFunc
			test "$filter=Foo eq datetime'#{isoDate}'", 'OData', testFunc


	test '$filter=Price gt 5 and Price lt 10', 'OData', (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'and'", ->
			assert.equal(result.options.$filter[0], 'and')

		it 'Left hand side should be Price gt 5', ->
			lhs = result.options.$filter[1]
			assert.equal(lhs[0], 'gt')
			assert.equal(lhs[1].name, 'Price')
			assert.equal(lhs[2], 5)

		it 'Right hand side should be less than 10', ->
			rhs = result.options.$filter[2]
			assert.equal(rhs[0], 'lt')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2], 10)


	test '$filter=Price eq 5 or Price eq 10', 'OData', (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'or'", ->
			assert.equal(result.options.$filter[0], 'or')

		it 'Left hand side should be Price eq 5', ->
			lhs = result.options.$filter[1]
			assert.equal(lhs[0], 'eq')
			assert.equal(lhs[1].name, 'Price')
			assert.equal(lhs[2], 5)

		it 'Right hand side should be less than 10', ->
			rhs = result.options.$filter[2]
			assert.equal(rhs[0], 'eq')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2], 10)


	test '$filter=not Published', 'OData', (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'not'", ->
			assert.equal(result.options.$filter[0], 'not')


		it "value should be 'Published'", ->
			assert.equal(result.options.$filter[1].name, 'Published')


	test '$filter=not (Price gt 5)', 'OData', (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'not'", ->
			assert.equal(result.options.$filter[0], 'not')

		it 'Value should be Price gt 5', ->
			rhs = result.options.$filter[1]
			assert.equal(rhs[0], 'gt')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2], 5)


		test '$filter=Price add 5 gt 10', 'OData', (result) ->

			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it "Filter should be an instance of 'gt'", ->
				assert.equal(result.options.$filter[0], 'gt')

			it 'lhr should be Price add 5', ->
				rhs = result.options.$filter[1]
				assert.equal(rhs[0], 'add')
				assert.equal(rhs[1].name, 'Price')
				assert.equal(rhs[2], 5)

			it 'rhr should be 10', ->
				assert.equal(result.options.$filter[2], 10)


		test '$filter=Price sub 5 gt 10', 'OData', (result) ->
			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it "Filter should be an instance of 'gt'", ->
				assert.equal(result.options.$filter[0], 'gt')

			it 'lhr should be Price sub 5', ->
				rhs = result.options.$filter[1]
				assert.equal(rhs[0], 'sub')
				assert.equal(rhs[1].name, 'Price')
				assert.equal(rhs[2], 5)

			it 'rhr should be 10', ->
				assert.equal(result.options.$filter[2], 10)


		test '$filter=Price mul 5 gt 10', 'OData', (result) ->

			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it "Filter should be an instance of 'gt'", ->
				assert.equal(result.options.$filter[0], 'gt')

			it 'lhr should be Price add 5', ->
				lhs = result.options.$filter[1]
				assert.equal(lhs[0], 'mul')
				assert.equal(lhs[1].name, 'Price')
				assert.equal(lhs[2], 5)

			it 'rhr should be 10', ->
				assert.equal(result.options.$filter[2], 10)


		test '$filter=Price div Price mul 5 gt 10', 'OData', (result) ->
			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it "Filter should be an instance of 'gt'", ->
				assert.equal(result.options.$filter[0], 'gt')

			lexpr = result.options.$filter[1]

			it 'should be Price div {expr}', ->
				assert.equal(lexpr[0], 'div')
				assert.equal(lexpr[1].name, 'Price')


			it 'should be Price mul 5', ->
				assert.equal(lexpr[2][0], 'mul')
				assert.equal(lexpr[2][1].name, 'Price')
				assert.equal(lexpr[2][2], 5)

			it 'rhr should be 10', ->
				assert.equal(result.options.$filter[2], 10)


		test '$filter=(Price div Price) mul 5 gt 10', 'OData', (result) ->
			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it "Filter should be an instance of 'gt'", ->
				assert.equal(result.options.$filter[0], 'gt')

			lexpr = result.options.$filter[1]

			it 'should be {expr} mul 5', ->
				assert.equal(lexpr[0], 'mul')
				assert.equal(lexpr[2], 5)

			it 'should be {Price div Price}', ->
				assert.equal(lexpr[1][0], 'div')
				assert.equal(lexpr[1][1].name, 'Price')
				assert.equal(lexpr[1][2].name, 'Price' )

			it 'rhr should be 10', ->
				assert.equal(result.options.$filter[2], 10)

		methodTest = (args, argsTest) ->
			(methodName, expectFailure) ->
				test "$filter=#{methodName}(#{args}) eq 'cake'", 'OData', (result, err) ->
					if expectFailure
						it "Should fail because it's invalid", ->
							assert.notEqual(err, null)
					else if err
						throw err

					it 'A filter should be present', ->
						assert.notEqual(result.options.$filter, null)

					it "Filter should be an instance of 'eq'", ->
						assert.equal(result.options.$filter[0], 'eq')

					it 'lhs should be a call', ->
						assert.equal(result.options.$filter[1][0], 'call')

					it "lhs should be #{methodName} with correct args", ->
						assert.equal(result.options.$filter[1][1].method, methodName)
						argsTest(result.options.$filter[1][1].args)

					it 'rhs should be cake', ->
						assert.equal(result.options.$filter[2], 'cake')

		methodTestWithThreeArgs = methodTest "'alfred', Product, 2", (argsResult) ->
			assert.equal(argsResult[0], 'alfred')
			assert.equal(argsResult[1].name, 'Product')
			assert.equal(argsResult[2], 2)

		methodTestWithTwoArgs = methodTest "'alfred', Product", (argsResult) ->
			assert.equal(argsResult[0], 'alfred')
			assert.equal(argsResult[1].name, 'Product')

		methodTestWithOneArg = methodTest "'alfred'", (argsResult) ->
			assert.equal(argsResult[0], 'alfred')


		methodTestWithTwoArgs('substringof')
		methodTestWithTwoArgs('endswith')
		methodTestWithTwoArgs('startswith')
		methodTestWithOneArg('length')
		methodTestWithTwoArgs('indexof')
		methodTestWithThreeArgs('replace')
		methodTestWithTwoArgs('substring')
		methodTestWithThreeArgs('substring')
		methodTestWithOneArg('tolower')
		methodTestWithOneArg('toupper')
		methodTestWithOneArg('trim')
		methodTestWithTwoArgs('concat')
		methodTestWithTwoArgs('day')
		methodTestWithOneArg('hour')
		methodTestWithOneArg('minute')
		methodTestWithOneArg('month')
		methodTestWithOneArg('second')
		methodTestWithOneArg('year')
		methodTestWithOneArg('round')
		methodTestWithOneArg('floor')
		methodTestWithOneArg('ceiling')
		methodTestWithOneArg('isof')
		methodTestWithTwoArgs('isof')

		### Not sure about whether I want this or not - up to you but it's here
		methodTestWithThreeArgs('substringof', true)
		methodTestWithThreeArgs('endswith', true)
		methodTestWithThreeArgs('startswith', true)
		methodTestWithTwoArgs('length', true)
		methodTestWithThreeArgs('indexof', true)
		###


		lambdaTest = (methodName) ->
			test "$filter=child/#{methodName}(d:d/name eq 'cake')", 'OData', (result, err) ->
				if err
					throw err

				it 'A filter should be present', ->
					assert.notEqual(result.options.$filter, null)

				it 'Filter should be on the child resource', ->
					assert.equal(result.options.$filter.name, 'child')

				it 'where it is a lambda', ->
					assert.notEqual(result.options.$filter.lambda, null)

				it "of type '#{methodName}'", ->
					assert.equal(result.options.$filter.lambda.method, methodName)

				it "with the element identified by 'd'", ->
					assert.equal(result.options.$filter.lambda.identifier, 'd')

				it 'and an expression that is d/name', ->
					assert.equal(result.options.$filter.lambda.expression[1].name, 'd')
					assert.equal(result.options.$filter.lambda.expression[1].property.name, 'name')
					assert.equal(result.options.$filter.lambda.expression[1].property.property, null)

				it "'eq'", ->
					assert.equal(result.options.$filter.lambda.expression[0], 'eq')

				it "'cake'", ->
					assert.equal(result.options.$filter.lambda.expression[2], 'cake')

		lambdaTest('any')
		lambdaTest('all')

module.exports(require './test')
