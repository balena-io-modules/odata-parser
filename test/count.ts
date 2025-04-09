import * as assert from 'assert';
import type { TestFn } from './test';

export default (test: TestFn) => {
	describe('Count', function () {
		test('$count=true', (result) =>
			it('count option should be specified with value true', () => {
				assert.equal(result.options.$count, true);
			}));

		test('$count=false', (result) =>
			it('count option should be specified with value false', () => {
				assert.equal(result.options.$count, false);
			}));
	});
};
