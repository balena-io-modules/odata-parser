import * as assert from 'assert';
import filterby from './filterby';

export default (test) => {
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
		});

		const testFilterOption = function (nestedTest, input, ...optArgs) {
			const expectation = optArgs.pop();
			nestedTest(
				`$orderby=PropertyOne/$count(${input})`,
				...optArgs,
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
	});
};
