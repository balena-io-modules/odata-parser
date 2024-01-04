import test from './test';
import * as assert from 'assert';
import * as _ from 'lodash';
import * as ODataParser from '../odata-parser';

function measureExecutionTime(runs, uri) {
	const startTime = Date.now();
	for (let i = 0; i < runs; i++) {
		ODataParser.parse(uri);
	}
	const endTime = Date.now();

	const diff = endTime - startTime;
	const perRun = diff / runs;
	console.log(
		`\turi.length: ${uri.length}\truns: ${runs}\tperRun: ${JSON.stringify(
			perRun,
			null,
			2,
		)}`,
	);
	return perRun;
}

const selects = [];
for (let selectItemCounter = 0; selectItemCounter < 100; selectItemCounter++) {
	selects.push(`long_field_name__field_${selectItemCounter}`);
}
const $select = '$select=' + selects.join(',');
const $filter = `$filter=(long_field_name__field%20eq%20%27value%27)%20and%20(long_field_name__field_1%20eq%20true)`;
const $nestedExpand = `$expand=resource_test(${$select})`;
const $expand = `$expand=resource_test(${$select};${$nestedExpand};${$filter})`;
const longTestURI = `/resource?${$select}&${$filter}&${$expand}`;
const runCount = 1000;

describe('Stress Testing', function () {
	const ids = _.range(1, 2000);
	const filterString = ids.map((i) => 'id eq ' + i).join(' or ');
	test('$filter=' + filterString, ids, (result) => {
		it('A filter should be present', () => {
			assert.notEqual(result.options.$filter, null);
		});
	});

	it(`should parse long (${longTestURI.length} chars) URI ${runCount} times and record average execution time`, () => {
		const perRun = measureExecutionTime(runCount, longTestURI);
		assert.equal(perRun < 1.5, true);
	});

	const shortTestURI = `/resource(123456789)`;
	it(`should parse short (${shortTestURI.length} chars) URI ${runCount} times and record average execution time`, () => {
		const perRun = measureExecutionTime(runCount, shortTestURI);
		assert.equal(perRun < 0.1, true);
	});
});
