require('ometa-js')
parser = require('../odata-parser.ometajs').ODataParser.createInstance()

runExpectation = (describe, input, entry, expectation) ->
	describe "Parsing " + input, ->
		try
			result = parser.matchAll(input, entry)
			expectation(result)
		catch e
			expectation(e)

module.exports = runExpectation.bind(null, describe)
module.exports.skip = runExpectation.bind(null, describe.skip)
module.exports.only = runExpectation.bind(null, describe.only)