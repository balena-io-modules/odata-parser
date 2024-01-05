import test from './test';
import * as assert from 'assert';
import { SyntaxError } from '../odata-parser';

describe('Encoding', function () {
	test('foo=hello%20world', (result) =>
		it('should equal hello world without the encoding', () => {
			assert.equal(result.options.foo, 'hello world');
		}));

	test('foo=hello%2520world', (result) =>
		it('should equal hello%20world with encoded %20 and only decoded once', () => {
			assert.equal(result.options.foo, 'hello%20world');
		}));

	test('foo=hello%26world&test=second', (result) =>
		it('should equal hello&world', () => {
			console.log(`result:${JSON.stringify(result, null, 2)}`);
			assert.equal(result.options.foo, 'hello&world');
			assert.equal(result.options.test, 'second');
		}));

	test.raw('/some%20thing?foo=hello%20world', (result) =>
		it('should fail as we do not allow spaces in resource names', () => {
			assert(result instanceof SyntaxError);
		}),
	);

	test(`$filter=name+eq+'s%C3%BC%C3%9F'`, ['süß'], function (result, err) {
		if (err) {
			throw err;
		}

		it('A filter should be present', () =>
			assert.notEqual(result.options.$filter, null));
	});
});
