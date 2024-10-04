import * as assert from 'assert';
import { expect } from 'chai';
import $test from './test';
import filterby from './filterby';
import format from './format';
import orderby from './orderby';
import paging from './paging';
import select from './select';
import count from './count';

// We default to testing 1 level of expand options, this can be increased to test multiple levels
const testExpands = function (test, nested = 1) {
	describe('$expand', function () {
		test('$expand=Products/Suppliers', function (result) {
			it('has an $expand value', () => {
				assert.notEqual(result.options.$expand, null);
			});
			it('has a resource of Products', () => {
				assert.equal(result.options.$expand.properties[0].name, 'Products');
			});
			it('has a child path of Suppliers', () => {
				assert.equal(
					result.options.$expand.properties[0].property.name,
					'Suppliers',
				);
			});
			it('should not have a nested property on Suppliers', () => {
				expect(
					result.options.$expand.properties[0].property,
				).to.not.have.property('property');
			});
		});

		test('$expand=Products,Suppliers()', function (result) {
			it('has an $expand value', () => {
				assert.notEqual(result.options.$expand, null);
			});
			it('has a resource of Products', () => {
				assert.equal(result.options.$expand.properties[0].name, 'Products');
			});
			it('not have count set on Products', () => {
				expect(result.options.$expand.properties[0]).to.not.have.property(
					'count',
				);
			});
			it('not have options set on Products', () => {
				expect(result.options.$expand.properties[0]).to.not.have.property(
					'options',
				);
			});
			it('should not have a nested property on Products', () => {
				expect(result.options.$expand.properties[0]).to.not.have.property(
					'property',
				);
			});
			it('has a resource of Suppliers', () => {
				assert.equal(result.options.$expand.properties[1].name, 'Suppliers');
			});
			it('not have options set on Suppliers', () => {
				expect(result.options.$expand.properties[1]).to.not.have.property(
					'options',
				);
			});
		});

		test('$expand=Products/$count', function (result) {
			it('has an $expand value', () => {
				assert.notEqual(result.options.$expand, null);
			});
			it('has a resource of Products', () => {
				assert.equal(result.options.$expand.properties[0].name, 'Products');
			});
			it('has count defined', () => {
				assert.equal(result.options.$expand.properties[0].count, true);
			});
		});

		if (nested > 0) {
			const testExpandOption = function (nestedTest, input, ...optArgs) {
				const expectation = optArgs.pop();
				nestedTest(`$expand=Products(${input})`, ...optArgs, function (result) {
					it('has an options property', () => {
						assert.notEqual(result.options, null);
					});
					it('has an $expand value', () => {
						assert.notEqual(result.options.$expand, null);
					});
					it('has a resource of Products', () => {
						assert.equal(result.options.$expand.properties[0].name, 'Products');
					});
					expectation(result.options?.$expand?.properties?.[0]);
				});
			};

			const testExpandOptionCount = function (nestedTest, input, ...optArgs) {
				const expectation = optArgs.pop();
				nestedTest(
					`$expand=Products/$count(${input})`,
					...optArgs,
					function (result) {
						it('has an options property', () => {
							assert.notEqual(result.options, null);
						});
						it('has an $expand value', () => {
							assert.notEqual(result.options.$expand, null);
						});
						it('has a resource of Products', () => {
							assert.equal(
								result.options.$expand.properties[0].name,
								'Products',
							);
						});
						it('has count defined', () => {
							assert.equal(result.options.$expand.properties[0].count, true);
						});
						expectation(result.options?.$expand?.properties?.[0]);
					},
				);
			};

			const nestedExpandTest = testExpandOption.bind(null, test);
			nestedExpandTest.skip = testExpandOption.bind(null, test.skip);
			// eslint-disable-next-line no-only-tests/no-only-tests
			nestedExpandTest.only = testExpandOption.bind(null, test.only);

			const nestedCountTest = testExpandOptionCount.bind(null, test);
			nestedCountTest.skip = testExpandOptionCount.bind(null, test.skip);
			// eslint-disable-next-line no-only-tests/no-only-tests
			nestedCountTest.only = testExpandOptionCount.bind(null, test.only);

			for (const nestedTest of [nestedExpandTest, nestedCountTest]) {
				filterby(nestedTest);
				format(nestedTest);
				orderby(nestedTest);
				paging(nestedTest);
				select(nestedTest);
				count(nestedTest);
				testExpands(nestedTest, nested - 1);
			}
		}
	});
};

testExpands($test);

export default testExpands;
