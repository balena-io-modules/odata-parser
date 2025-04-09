import * as assert from 'assert';
import { expect } from 'chai';
import filterby from './filterby';
import type { TestFn } from './test';

export default (test: TestFn) => {
	describe('$orderby', function () {
		test('$orderby=Property', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have the property specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'Property');
			});
		});

		test('$orderby=PropertyOne,PropertyTwo', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have the first property specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it('sort options have the second property specified', () => {
				assert.equal(result.options.$orderby.properties[1].name, 'PropertyTwo');
			});
		});

		test('$orderby=PropertyOne desc', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have the property specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it('sort options have the property ordering specified', () => {
				assert.equal(result.options.$orderby.properties[0].order, 'desc');
			});
		});

		test('$orderby=PropertyOne%20desc', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have the property specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it('sort options have the property ordering specified', () => {
				assert.equal(result.options.$orderby.properties[0].order, 'desc');
			});
		});

		test('$orderby=PropertyOne asc', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have the property specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it('sort options have the property ordering specified', () => {
				assert.equal(result.options.$orderby.properties[0].order, 'asc');
			});
		});

		test('$orderby=PropertyOne asc,PropertyTwo desc', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have property one name specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it('sort options have property one ordering specified', () => {
				assert.equal(result.options.$orderby.properties[0].order, 'asc');
			});
			it('sort options have the property two name specified', () => {
				assert.equal(result.options.$orderby.properties[1].name, 'PropertyTwo');
			});
			it('sort options have the property two ordering specified', () => {
				assert.equal(result.options.$orderby.properties[1].order, 'desc');
			});
		});

		test('$orderby=PropertyOne/SubProperty', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have property one name specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it("sort options have property one's sub property specified", () => {
				assert.equal(
					result.options.$orderby.properties[0].property.name,
					'SubProperty',
				);
			});
		});

		test('$orderby=PropertyOne/$count', function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have property one name specified', () => {
				assert.equal(result.options.$orderby.properties[0].name, 'PropertyOne');
			});
			it('has count defined', () => {
				assert.equal(result.options.$orderby.properties[0].count, true);
			});
			it('has no count options defined', () => {
				expect(result.options.$orderby.properties[0]).to.not.have.property(
					'options',
				);
			});
			it('sort options property should be as expected', () => {
				assert.deepStrictEqual(result.options.$orderby.properties, [
					{
						name: 'PropertyOne',
						count: true,
						order: 'desc',
					},
				]);
			});
		});

		const testFilterOption = function (
			nestedTest: TestFn,
			input: string,
			...optArgs: any[]
		) {
			const expectation = optArgs.pop();
			nestedTest(
				`$orderby=PropertyOne/$count(${input})`,
				...(optArgs as []),
				function (result) {
					it('sort options are present on the result', () => {
						assert.notEqual(result.options.$orderby, null);
					});
					it('sort options have property one name specified', () => {
						assert.equal(
							result.options.$orderby.properties[0].name,
							'PropertyOne',
						);
					});
					it('has count defined', () => {
						assert.equal(result.options.$orderby.properties[0].count, true);
					});
					expectation(result?.options?.$orderby?.properties?.[0]);
				},
			);
		};

		const nestedFilterTest = testFilterOption.bind(null, test);
		nestedFilterTest.skip = testFilterOption.bind(null, test.skip);
		// eslint-disable-next-line no-only-tests/no-only-tests
		nestedFilterTest.only = testFilterOption.bind(null, test.only);

		filterby(nestedFilterTest);

		test('$orderby=Products(1) asc', [1], function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have a single property specified', () => {
				assert.equal(result.options.$orderby.properties.length, 1);
			});
			it('sort options property should be as expected', () => {
				assert.deepStrictEqual(result.options.$orderby.properties, [
					{
						name: 'Products',
						key: { bind: 0 },
						order: 'asc',
					},
				]);
			});
		});

		test('$orderby=Products(1)/Quantity asc', [1], function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have a single property specified', () => {
				assert.equal(result.options.$orderby.properties.length, 1);
			});
			it('sort options property should be as expected', () => {
				assert.deepStrictEqual(result.options.$orderby.properties, [
					{
						name: 'Products',
						key: { bind: 0 },
						property: { name: 'Quantity' },
						order: 'asc',
					},
				]);
			});
		});

		test(
			`$orderby=Products(partialkey='a')/Quantity asc`,
			['a'],
			function (result) {
				it('sort options are present on the result', () => {
					assert.notEqual(result.options.$orderby, null);
				});
				it('sort options have a single property specified', () => {
					assert.equal(result.options.$orderby.properties.length, 1);
				});
				it('sort options property should be as expected', () => {
					assert.deepStrictEqual(result.options.$orderby.properties, [
						{
							name: 'Products',
							key: {
								partialkey: { bind: 0 },
							},
							property: { name: 'Quantity' },
							order: 'asc',
						},
					]);
				});
			},
		);

		test('$orderby=Products(a=1,b=2)/Quantity asc', [1, 2], function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have a single property specified', () => {
				assert.equal(result.options.$orderby.properties.length, 1);
			});
			it('sort options property should be as expected', () => {
				assert.deepStrictEqual(result.options.$orderby.properties, [
					{
						name: 'Products',
						key: {
							a: { bind: 0 },
							b: { bind: 1 },
						},
						property: { name: 'Quantity' },
						order: 'asc',
					},
				]);
			});
		});

		test(`$orderby=Products(1)/Orders/$count asc`, [1], function (result) {
			it('sort options are present on the result', () => {
				assert.notEqual(result.options.$orderby, null);
			});
			it('sort options have a single property specified', () => {
				assert.equal(result.options.$orderby.properties.length, 1);
			});
			it('sort options property should be as expected', () => {
				assert.deepStrictEqual(result.options.$orderby.properties, [
					{
						name: 'Products',
						key: { bind: 0 },
						property: { name: 'Orders', count: true },
						order: 'asc',
					},
				]);
			});
		});

		test(
			`$orderby=Products(partialkey='a')/Orders/$count asc`,
			['a'],
			function (result) {
				it('sort options are present on the result', () => {
					assert.notEqual(result.options.$orderby, null);
				});
				it('sort options have a single property specified', () => {
					assert.equal(result.options.$orderby.properties.length, 1);
				});
				it('sort options property should be as expected', () => {
					assert.deepStrictEqual(result.options.$orderby.properties, [
						{
							name: 'Products',
							key: {
								partialkey: { bind: 0 },
							},
							property: { name: 'Orders', count: true },
							order: 'asc',
						},
					]);
				});
			},
		);
	});
};
