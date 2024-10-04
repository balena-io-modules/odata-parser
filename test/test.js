import * as ODataParser from '../odata-parser';
import { expect } from 'chai';
import * as _ from 'lodash';

const getBindType = function (value) {
	if (_.isNumber(value)) {
		return ['Real', value];
	} else if (_.isString(value)) {
		return ['Text', value];
	} else if (_.isBoolean(value)) {
		return ['Boolean', value];
	} else {
		return value;
	}
};

const raw = function (describe, input, ...optArgs) {
	const expectation = optArgs.pop();
	let [binds = [], options = { startRule: 'Process' }, params = {}] = optArgs;
	binds = _.map(binds, getBindType);
	_.each(params, (value, key) => {
		binds[key] = getBindType(value);
	});
	describe(`Parsing ${input}`, function () {
		let result;
		try {
			result = ODataParser.parse(input, options);
		} catch (e) {
			expectation(e);
			return;
		}
		it('should have the correct binds', () => {
			expect(result).to.have.property('binds').that.deep.equals(binds);
		});
		expectation(result.tree);
	});
};

const runExpectation = function (...args) {
	args[1] = '/resource?' + args[1];
	raw(...args);
};

const test = runExpectation.bind(null, describe);
test.skip = runExpectation.bind(null, describe.skip);
// eslint-disable-next-line no-only-tests/no-only-tests
test.only = runExpectation.bind(null, describe.only);

test.raw = raw.bind(null, describe);
test.raw.skip = raw.bind(null, describe.skip);
// eslint-disable-next-line no-only-tests/no-only-tests
test.raw.only = raw.bind(null, describe.only);

export default test;
