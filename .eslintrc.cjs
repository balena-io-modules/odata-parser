module.exports = {
	extends: ['./node_modules/@balena/lint/config/.eslintrc.js'],
	parserOptions: {
		project: 'tsconfig.js.json',
		sourceType: 'module',
	},
	env: {
		mocha: true,
	}
};