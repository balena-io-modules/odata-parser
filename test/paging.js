import * as assert from 'assert';

export default (test) => {
	describe('Paging', function () {
		test(
			'$top=5&$skip=100',
			[
				['Integer', 5],
				['Integer', 100],
			],
			function (result) {
				it('top should be specified', () => {
					assert.deepEqual(result.options.$top, { bind: 0 });
				});
				it('skip should be specified', () => {
					assert.deepEqual(result.options.$skip, { bind: 1 });
				});
			},
		);

		test('$inlinecount=allpages', (result) => {
			it('inline should be specified', () => {
				assert.equal(result.options.$inlinecount, 'allpages');
			});
		});

		test('$inlinecount=none', (result) => {
			it('inline should be specified', () => {
				assert.equal(result.options.$inlinecount, 'none');
			});
		});

		test('$inlinecount=flibble', (result) => {
			it('inline should be specified', () => {
				assert.equal(result.options.$inlinecount, '');
			});
		});
	});
};
