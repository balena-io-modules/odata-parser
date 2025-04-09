import test from './test';
import * as assert from 'assert';
import * as _ from 'lodash';

describe('Stress Testing', function () {
	const ids = _.range(1, 2000);
	const filterString = ids.map((i) => 'id eq ' + i).join(' or ');
	test('$filter=' + filterString, ids, (result) => {
		it('A filter should be present', () => {
			assert.notEqual(result.options.$filter, null);
		});
	});
});
