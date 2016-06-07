test = require './test'
require './encoding'
require './resource_parsing'
require './stress'
# These tests take the test function as an argument so they can also be used in expand tests.
require('./expand')(test)
require('./filterby')(test)
require('./format')(test)
require('./orderby')(test)
require('./paging')(test)
require('./select')(test)
require('./count')(test)
