require('ometa-js')
{ ODataParser } = require '../odata-parser.ometajs'
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
	[ binds = [], entry = 'Process' ] = optArgs
	binds = _.map(binds, getBindType)
	describe "Parsing #{input}", ->
		try
			result = ODataParser.matchAll(input, entry)
		catch e
			expectation(e)
			return
		if entry is 'Process'
			it 'should have the correct binds', ->
				expect(result).to.have.property('binds').that.deep.equals(binds)
			expectation(result.tree)
		else
			expectation(result)

runExpectation = (args...) ->
	args[1] = '/resource?' + args[1]
	raw(args...)

module.exports = runExpectation.bind(null, describe)
module.exports.skip = runExpectation.bind(null, describe.skip)
module.exports.only = runExpectation.bind(null, describe.only)
module.exports.raw = raw.bind(null, describe)
module.exports.raw.skip = raw.bind(null, describe.skip)
module.exports.raw.only = raw.bind(null, describe.only)