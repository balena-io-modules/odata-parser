assert = require 'assert'
{ expect } = require 'chai'
_ = require 'lodash'

module.exports = (test) ->
	describe '$filter', ->
		operandTest = (op, odataValue, value) ->
			if odataValue is undefined
				odataValue = 2
			if value is undefined
				value = odataValue
			binds = []
			if value? and not _.isObject(value)
				binds.push(value)
			test "$filter=Foo #{op} #{odataValue}", binds, (result) ->
				it 'A filter should be present', ->
					expect(result.options.$filter).to.exist

				it "Filter should be an instance of '#{op}'", ->
					expect(result.options.$filter[0]).to.equal(op)

				it 'lhr should be Foo', ->
					expect(result.options.$filter[1]).to.have.property('name').that.equals('Foo')

				if odataValue is null or _.isObject(value)
					it "rhr should be #{value}", ->
						expect(result.options.$filter[2]).to.deep.equal(value)
				else
					it 'rhr should be a bind', ->
						expect(result.options.$filter[2]).to.have.property('bind').that.equals(0)

			test "$filter=#{odataValue} #{op} Foo", binds, (result) ->
				it 'A filter should be present', ->
					expect(result.options.$filter).to.exist

				it "Filter should be an instance of '#{op}'", ->
					expect(result.options.$filter[0]).to.equal(op)

				if odataValue is null or _.isObject(value)
					it "lhr should be #{value}", ->
						expect(result.options.$filter[1]).to.deep.equal(value)
				else
					it 'lhr should be a bind', ->
						expect(result.options.$filter[1]).to.have.property('bind').that.equals(0)

				it 'rhr should be Foo', ->
					expect(result.options.$filter[2]).to.have.property('name').that.equals('Foo')

		operandTest('eq')
		operandTest('ne')
		operandTest('gt')
		operandTest('ge')
		operandTest('lt')
		operandTest('le')

		operandTest('eq', 2)
		operandTest('eq', -2)
		operandTest('eq', 2.5)
		operandTest('eq', -2.5)
		operandTest('eq', "'bar'", 'bar')
		operandTest('eq', "'%20'", ' ')
		operandTest('eq', "'()'", '()')
		operandTest('eq', "''''", "'")
		operandTest('eq', true)
		operandTest('eq', false)
		operandTest('eq', null)

		duration = (obj) ->
			result =
				negative: false
				day: undefined
				hour: undefined
				minute: undefined
				second: undefined
			for key, value of obj
				result[key] = value
			return result

		operandTest('eq', "duration'-P1D'", duration(negative: true, day: 1))
		operandTest('eq', "duration'+P1D'", duration(day: 1))
		operandTest('eq', "duration'P1D'", duration(day: 1))
		operandTest('eq', "duration'PT1H'", duration(hour: 1))
		operandTest('eq', "duration'PT1M'", duration(minute: 1))
		operandTest('eq', "duration'PT1.1S'", duration(second: 1.1))
		operandTest 'eq', "duration'-P1DT2H3M4.5S'", duration
			negative: true
			day: 1
			hour: 2
			minute: 3
			second: 4.5


		do ->
			date = new Date()
			testFunc = (result) ->
				it 'A filter should be present', ->
					assert.notEqual(result.options.$filter, null)

				it "Filter should be an instance of 'eq'", ->
					assert.equal(result.options.$filter[0], 'eq')

				it 'lhr should be Foo', ->
					assert.equal(result.options.$filter[1].name, 'Foo')

				it 'rhr should be a bind', ->
					assert.equal(result.options.$filter[2].bind, 0)

			isoDate = encodeURIComponent(date.toISOString())
			test "$filter=Foo eq date'#{isoDate}'", [['Date', date.getTime()]], testFunc
			test "$filter=Foo eq datetime'#{isoDate}'", [['Date Time', date.getTime()]], testFunc


	test '$filter=Price gt 5 and Price lt 10', [5, 10], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'and'", ->
			assert.equal(result.options.$filter[0], 'and')

		it 'Left hand side should be Price gt $0', ->
			lhs = result.options.$filter[1]
			expect(lhs[0]).to.equal('gt')
			expect(lhs[1]).to.have.property('name').that.equals('Price')
			expect(lhs[2]).to.have.property('bind').that.equal(0)

		it 'Right hand side should be less than $1', ->
			rhs = result.options.$filter[2]
			assert.equal(rhs[0], 'lt')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2].bind, 1)


	test '$filter=Price eq 5 or Price eq 10', [5, 10], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'or'", ->
			assert.equal(result.options.$filter[0], 'or')

		it 'Left hand side should be Price eq $0', ->
			lhs = result.options.$filter[1]
			assert.equal(lhs[0], 'eq')
			assert.equal(lhs[1].name, 'Price')
			assert.equal(lhs[2].bind, 0)

		it 'Right hand side should be less than $1', ->
			rhs = result.options.$filter[2]
			assert.equal(rhs[0], 'eq')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2].bind, 1)


	test '$filter=Published', (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "value should be 'Published'", ->
			assert.equal(result.options.$filter.name, 'Published')


	test '$filter=not Published', (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'not'", ->
			assert.equal(result.options.$filter[0], 'not')

		it "value should be 'Published'", ->
			assert.equal(result.options.$filter[1].name, 'Published')


	test '$filter=not (Price gt 5)', [5], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'not'", ->
			assert.equal(result.options.$filter[0], 'not')

		it 'Value should be Price gt $0', ->
			rhs = result.options.$filter[1]
			assert.equal(rhs[0], 'gt')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2].bind, 0)


	test '$filter=Price in (1, 2, 3)', [1, 2, 3], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'in'", ->
			assert.equal(result.options.$filter[0], 'in')

		it 'lhr should be Price', ->
			assert.equal(result.options.$filter[1].name, 'Price')

		it 'rhr should be [ $1, $2, $3 ]', ->
			assert.equal(result.options.$filter[2][0].bind, 0)
			assert.equal(result.options.$filter[2][1].bind, 1)
			assert.equal(result.options.$filter[2][2].bind, 2)

	test '$filter=Price in ((1), ((2)), (((3))))', [1, 2, 3], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'in'", ->
			assert.equal(result.options.$filter[0], 'in')

		it 'lhr should be Price', ->
			assert.equal(result.options.$filter[1].name, 'Price')

		it 'rhr should be [ $1, $2, $3 ]', ->
			assert.equal(result.options.$filter[2][0].bind, 0)
			assert.equal(result.options.$filter[2][1].bind, 1)
			assert.equal(result.options.$filter[2][2].bind, 2)

	test "$filter=Price in ('a', 'b', 'c')", ['a', 'b', 'c'], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'in'", ->
			assert.equal(result.options.$filter[0], 'in')

		it 'lhr should be Price', ->
			assert.equal(result.options.$filter[1].name, 'Price')

		it 'rhr should be [ $1, $2, $3 ]', ->
			assert.equal(result.options.$filter[2][0].bind, 0)
			assert.equal(result.options.$filter[2][1].bind, 1)
			assert.equal(result.options.$filter[2][2].bind, 2)


	test '$filter=Price add 5 gt 10', [5, 10], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		it 'lhr should be Price add $0', ->
			rhs = result.options.$filter[1]
			assert.equal(rhs[0], 'add')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2].bind, 0)

		it 'rhr should be $1', ->
			assert.equal(result.options.$filter[2].bind, 1)


	test '$filter=Price sub 5 gt 10', [5, 10], (result) ->
		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		it 'lhr should be Price sub $0', ->
			rhs = result.options.$filter[1]
			assert.equal(rhs[0], 'sub')
			assert.equal(rhs[1].name, 'Price')
			assert.equal(rhs[2].bind, 0)

		it 'rhr should be $1', ->
			assert.equal(result.options.$filter[2].bind, 1)


	test '$filter=Price mul 5 gt 10', [5, 10], (result) ->

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		it 'lhr should be Price add $0', ->
			lhs = result.options.$filter[1]
			assert.equal(lhs[0], 'mul')
			assert.equal(lhs[1].name, 'Price')
			assert.equal(lhs[2].bind, 0)

		it 'rhr should be $1', ->
			assert.equal(result.options.$filter[2].bind, 1)


	test '$filter=Price div Price mul 5 gt 10', [5, 10], (result) ->
		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		lexpr = result?.options?.$filter?[1]

		it 'should be Price div {expr}', ->
			assert.equal(lexpr[0], 'div')
			assert.equal(lexpr[1].name, 'Price')


		it 'should be Price mul $0', ->
			assert.equal(lexpr[2][0], 'mul')
			assert.equal(lexpr[2][1].name, 'Price')
			assert.equal(lexpr[2][2].bind, 0)

		it 'rhr should be $1', ->
			assert.equal(result.options.$filter[2].bind, 1)


	test '$filter=(Price div Price) mul 5 gt 10', [5, 10], (result) ->
		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'gt'", ->
			assert.equal(result.options.$filter[0], 'gt')

		lexpr = result?.options?.$filter?[1]

		it 'should be {expr} mul $0', ->
			assert.equal(lexpr[0], 'mul')
			assert.equal(lexpr[2].bind, 0)

		it 'should be {Price div Price}', ->
			assert.equal(lexpr[1][0], 'div')
			assert.equal(lexpr[1][1].name, 'Price')
			assert.equal(lexpr[1][2].name, 'Price' )

		it 'rhr should be $1', ->
			assert.equal(result.options.$filter[2].bind, 1)


	test '$filter=Products/$count eq 10', [10], (result) ->
		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it "Filter should be an instance of 'eq'", ->
			assert.equal(result.options.$filter[0], 'eq')

		it 'lhr should be Foo', ->
			expect(result.options.$filter[1]).to.have.property('name').that.equals('Products')
			expect(result.options.$filter[1]).to.have.property('count').that.equals(true)

		it 'rhr should be $0', ->
			assert.equal(result.options.$filter[2].bind, 0)

	methodTest = (args, binds, argsTest) ->
		(methodName, expectFailure) ->
			test "$filter=#{methodName}(#{args}) eq 'cake'", binds.concat('cake'), (result, err) ->
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

				it 'rhs should be bound to the last arg', ->
					assert.equal(result.options.$filter[2].bind, binds.length)

	methodTestWithThreeArgs = methodTest "'alfred', Product, 2", ['alfred', 2], (argsResult) ->
		assert.equal(argsResult[0].bind, 0)
		assert.equal(argsResult[1].name, 'Product')
		assert.equal(argsResult[2].bind, 1)

	methodTestWithTwoArgs = methodTest "'alfred', Product", ['alfred'], (argsResult) ->
		assert.equal(argsResult[0].bind, 0)
		assert.equal(argsResult[1].name, 'Product')

	methodTestWithOneArg = methodTest "'alfred'", ['alfred'], (argsResult) ->
		assert.equal(argsResult[0].bind, 0)

	methodTestWithZeroArg = methodTest '', [], (argsResult) ->
		assert.equal(argsResult.length, 0)


	methodTestWithTwoArgs('contains')
	methodTestWithTwoArgs('endswith')
	methodTestWithTwoArgs('startswith')
	methodTestWithOneArg('length')
	methodTestWithTwoArgs('indexof')
	methodTestWithTwoArgs('substring')
	methodTestWithThreeArgs('substring')
	methodTestWithOneArg('tolower')
	methodTestWithOneArg('toupper')
	methodTestWithOneArg('trim')
	methodTestWithTwoArgs('concat')
	methodTestWithOneArg('year')
	methodTestWithOneArg('month')
	methodTestWithOneArg('day')
	methodTestWithOneArg('hour')
	methodTestWithOneArg('minute')
	methodTestWithOneArg('second')
	methodTestWithOneArg('fractionalseconds')
	methodTestWithOneArg('date')
	methodTestWithOneArg('time')
	methodTestWithOneArg('totaloffsetminutes')
	methodTestWithZeroArg('now')
	methodTestWithZeroArg('maxdatetime')
	methodTestWithZeroArg('mindatetime')
	methodTestWithOneArg('totalseconds')
	methodTestWithOneArg('round')
	methodTestWithOneArg('floor')
	methodTestWithOneArg('ceiling')
	methodTestWithOneArg('isof')
	methodTestWithTwoArgs('isof')
	methodTestWithOneArg('cast')
	methodTestWithTwoArgs('cast')
	methodTestWithTwoArgs('substringof')
	methodTestWithThreeArgs('replace')

	### Not sure about whether I want this or not - up to you but it's here
	methodTestWithThreeArgs('substringof', true)
	methodTestWithThreeArgs('endswith', true)
	methodTestWithThreeArgs('startswith', true)
	methodTestWithTwoArgs('length', true)
	methodTestWithThreeArgs('indexof', true)
	###


	lambdaTest = (methodName) ->
		lambdaAsserts = (lambda, alias = 'd') ->
			it 'where it is a lambda', ->
				assert.notEqual(lambda, null)

			it "of type '#{methodName}'", ->
				assert.equal(lambda.method, methodName)

			it "with the element identified by '#{alias}'", ->
				assert.equal(lambda.identifier, alias)

			it 'and an expression that is d/name', ->
				assert.equal(lambda.expression[1].name, alias)
				assert.equal(lambda.expression[1].property.name, 'name')
				assert.equal(lambda.expression[1].property.property, null)

			it "'eq'", ->
				assert.equal(lambda.expression[0], 'eq')

			it '$0', ->
				assert.equal(lambda.expression[2].bind, 0)

		test "$filter=child/#{methodName}(d:d/name eq 'cake')", ['cake'], (result, err) ->
			if err
				throw err

			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it 'Filter should be on the child resource', ->
				assert.equal(result.options.$filter.name, 'child')

			lambdaAsserts(result?.options?.$filter?.lambda)

		test "$filter=child/#{methodName}(long_name:long_name/name eq 'cake')", ['cake'], (result, err) ->
			if err
				throw err

			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it 'Filter should be on the child resource', ->
				assert.equal(result.options.$filter.name, 'child')

			lambdaAsserts(result?.options?.$filter?.lambda, 'long_name')

		test "$filter=child/grandchild/#{methodName}(d:d/name eq 'cake')", ['cake'], (result, err) ->
			if err
				throw err

			it 'A filter should be present', ->
				assert.notEqual(result.options.$filter, null)

			it 'Filter should be on the child/grandchild resource', ->
				assert.equal(result.options.$filter.name, 'child')
				assert.notEqual(result.options.$filter.property, null)
				assert.equal(result.options.$filter.property.name, 'grandchild')

			lambdaAsserts(result?.options?.$filter?.property?.lambda)

	lambdaTest('any')
	lambdaTest('all')

	test '$filter=child/canAccess(test)', [], (result, err) ->
		if err
			throw err

		it 'A filter should be present', ->
			assert.notEqual(result.options.$filter, null)

		it 'Filter should be on the child resource', ->
			assert.equal(result.options.$filter.name, 'child')

		it 'Filter should show the canAccess method', ->
			expect(result.options.$filter).to.have.property('method')
			expect(result.options.$filter.method[0]).to.equal('call')
			expect(result.options.$filter.method[1]).to.have.property('method').that.equals('canAccess')
