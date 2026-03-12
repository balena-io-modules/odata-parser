import test from './test';
import * as assert from 'assert';

describe('Stress Testing', function () {
	const ids = Array.from({ length: 1999 }, (_, i) => i + 1);
	const filterString = ids.map((i) => 'id eq ' + i).join(' or ');
	test('$filter=' + filterString, ids, (result) => {
		it('A filter should be present', () => {
			assert.notEqual(result.options.$filter, null);
		});
	});
});
