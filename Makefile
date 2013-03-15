default: build

build:
	ometajs2js -i odata.ometa > odataparser.js


test: build
	mocha test
