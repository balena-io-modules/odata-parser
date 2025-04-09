import * as ODataParser from '../odata-parser';
import { expect } from 'chai';
import * as _ from 'lodash';

type BindPrimitive = number | string | boolean | object;
const getBindType = function (value: BindPrimitive) {
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

export type ExpectationFn = (result: any) => void;
type Binds = BindPrimitive[];
type Opts = Parameters<typeof ODataParser.parse>[1];
type Params = Record<string, BindPrimitive>;
function raw(
	describe: Mocha.SuiteFunction,
	input: string,
	...optArgs: [expectation: ExpectationFn]
): void;
function raw(
	describe: Mocha.SuiteFunction,
	input: string,
	...optArgs: [binds: Binds, expectation: ExpectationFn]
): void;
function raw(
	describe: Mocha.SuiteFunction,
	input: string,
	...optArgs: [binds: Binds | undefined, opts: Opts, expectation: ExpectationFn]
): void;
function raw(
	describe: Mocha.SuiteFunction,
	input: string,
	...optArgs: [
		binds: Binds | undefined,
		opts: Opts,
		params: Params,
		expectation: ExpectationFn,
	]
): void;
function raw(
	describe: Mocha.SuiteFunction,
	input: string,
	...optArgs:
		| [expectation: ExpectationFn]
		| [binds: Binds, expectation: ExpectationFn]
		| [binds: Binds | undefined, opts: Opts, expectation: ExpectationFn]
		| [
				binds: Binds | undefined,
				opts: Opts,
				params: Params,
				expectation: ExpectationFn,
		  ]
): void {
	const expectation = optArgs.pop() as ExpectationFn;
	const [binds = [], options = { startRule: 'Process' }, params = {}] =
		optArgs as any as [binds?: Binds, opts?: Opts, params?: Params];
	const processedBinds = _.map(binds, getBindType) as Binds &
		Record<string, BindPrimitive>;
	_.each(params, (value, key) => {
		processedBinds[key] = getBindType(value);
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
			expect(result).to.have.property('binds').that.deep.equals(processedBinds);
		});
		expectation(result.tree);
	});
}

const runExpectation: typeof raw = function (...args) {
	args[1] = '/resource?' + args[1];
	// @ts-expect-error The types should match but typescript doesn't handle the overloads nicely
	raw(...args);
};

interface BoundRunExpectation {
	(
		input: string,
		...optArgs: [
			binds: Binds | undefined,
			opts: Opts,
			params: Params,
			expectation: ExpectationFn,
		]
	): void;
	(
		input: string,
		...optArgs: [
			binds: Binds | undefined,
			opts: Opts,
			expectation: ExpectationFn,
		]
	): void;
	(input: string, ...optArgs: [binds: Binds, expectation: ExpectationFn]): void;
	(input: string, ...optArgs: [expectation: ExpectationFn]): void;
	(
		input: string,
		...optArgs:
			| [expectation: ExpectationFn]
			| [binds: Binds, expectation: ExpectationFn]
			| [binds: Binds, opts: Opts, expectation: ExpectationFn]
			| [binds: Binds, opts: Opts, params: Params, expectation: ExpectationFn]
	): void;
}

export type TestFn = BoundRunExpectation & {
	skip: BoundRunExpectation;
	only: BoundRunExpectation;
	raw: BoundRunExpectation & {
		skip: BoundRunExpectation;
		only: BoundRunExpectation;
	};
};
const test: TestFn = runExpectation.bind(null, describe);
test.skip = runExpectation.bind(null, describe.skip);
// eslint-disable-next-line no-only-tests/no-only-tests
test.only = runExpectation.bind(null, describe.only);

test.raw = raw.bind(null, describe);
test.raw.skip = raw.bind(null, describe.skip);
// eslint-disable-next-line no-only-tests/no-only-tests
test.raw.only = raw.bind(null, describe.only);

export default test;
