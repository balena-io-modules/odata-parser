default: build

build:
	ometajs2js -i odata.ometajs > odataparser.js


test: build
	mocha test
