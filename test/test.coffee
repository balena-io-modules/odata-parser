require('ometa-js')
parser = require('../odata-parser.ometajs').ODataParser.createInstance()

raw = (describe, input, entry, expectation) ->
	describe "Parsing #{input}", ->
		try
			result = parser.matchAll(input, entry)
			expectation(result)
		catch e
			expectation(e)

runExpectation = (args...) ->
	args[1] = '/resource?' + args[1]
	raw(args...)

module.exports = runExpectation.bind(null, describe)
module.exports.skip = runExpectation.bind(null, describe.skip)
module.exports.only = runExpectation.bind(null, describe.only)
module.exports.raw = raw.bind(null, describe)
module.exports.raw.skip = raw.bind(null, describe.skip)
module.exports.raw.only = raw.bind(null, describe.only)