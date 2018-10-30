'use strict';

module.exports = {
	input: 'odata-parser.pegjs',
	output: 'odata-parser.js',
	cache: true,
	allowedStartRules: [
		'Process',
		'ProcessRule',
	],
	features: {
		error: false,
		expected: false,
		filename: false,
		location: false,
		offset: false,
		range: false,
		text: false,
	},
};
