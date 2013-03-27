require('ometa-js')
var parser = require('../odata-parser.ometajs').createInstance();

module.exports = function(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var result;
    try {
      result = parser.matchAll(input, entry);
      expectation(result);
    }
    catch(e) {
      expectation(e);
    }
  });
};
