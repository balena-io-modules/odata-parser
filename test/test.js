var ODataParser = require('../odataparser.js').ODataParser

module.exports = function(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var parser = ODataParser.createInstance()
    var result = parser.matchAll(input, entry)
    expectation(result)
  });
}
