import * as assert from 'assert';

export default (test) => {
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
