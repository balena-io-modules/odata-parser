import test from './test';
import assert from 'assert';
import { SyntaxError } from '../odata-parser';

describe('Encoding', function () {
	test('foo=hello%20world', (result) =>
		it('should equal hello world without the encoding', () => {
			assert.equal(result.options.foo, 'hello world');
		}));

	test.raw('/some%20thing?foo=hello%20world', (result) =>
		it('should fail as we do not allow spaces in resource names', () => {
			assert(result instanceof SyntaxError);
		}),
	);

	for (const input of [
		'foo=%ZZ',
		'@%ZZ=1',
		"$filter=Foo eq '%ZZ'",
		// A truncated multi-byte sequence
		"$filter=Foo eq '%E0%A4%A'",
	]) {
		test(input, (result) =>
			it('should fail with a SyntaxError for malformed percent-encoding', () => {
				assert(result instanceof SyntaxError);
			}),
		);
	}

	test.raw("/model('%ZZ')", (result) =>
		it('should fail with a SyntaxError for malformed percent-encoding in a key', () => {
			assert(result instanceof SyntaxError);
		}),
	);
});
