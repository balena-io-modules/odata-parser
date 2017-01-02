ODataParser = require '../odata-parser'
{ expect } = require 'chai'
_ = require 'lodash'

getBindType = (value) ->
	if _.isNumber(value)
		return ['Real', value]
	else if _.isString(value)
		return ['Text', value]
	else if _.isBoolean(value)
		return ['Boolean', value]
	else
		return value

raw = (describe, input, optArgs..., expectation) ->
	[ binds = [], options = { startRule: 'Process' }, params = {} ] = optArgs
	binds = _.map(binds, getBindType)
	_.each params, (value, key) ->
		binds[key] = getBindType(value)
	describe "Parsing #{input}", ->
		try
			result = ODataParser.parse(input, options)
		catch e
			expectation(e)
			return
		it 'should have the correct binds', ->
			expect(result).to.have.property('binds').that.deep.equals(binds)
		expectation(result.tree)

runExpectation = (args...) ->
	args[1] = '/resource?' + args[1]
	raw(args...)

module.exports = runExpectation.bind(null, describe)
module.exports.skip = runExpectation.bind(null, describe.skip)
module.exports.only = runExpectation.bind(null, describe.only)
module.exports.raw = raw.bind(null, describe)
module.exports.raw.skip = raw.bind(null, describe.skip)
module.exports.raw.only = raw.bind(null, describe.only)
