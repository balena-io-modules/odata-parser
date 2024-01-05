import test from './test';
import * as assert from 'assert';
import { SyntaxError } from '../odata-parser';
import { expect } from 'chai';

describe('Encoding', function () {
	test('foo=hello%20world', (result) =>
		it('should equal hello world without the encoding', () => {
			assert.equal(result.options.foo, 'hello world');
		}));

	test.raw('/some%20thing?foo=hello%20world', (result) =>
		it('should fail as we do not allow spaces in resource names', () => {
			assert(result instanceof SyntaxError);
		}),
	);

	test(
		`%24filter=child%2fany%28long_name%3Along_name%2Fname eq %27cake%27%29`,
		['cake'],
		function (result, err) {
			if (err) {
				throw err;
			}

			it('A filter should be present from encoded `(`, `)`, `:`, and `/`', () =>
				assert.notEqual(result.options.$filter, null));

			it('Filter should be on the child resource from encoded `(`, `)`, `:`, and `/`', () =>
				assert.equal(result.options.$filter.name, 'child'));
		},
	);

	test('$expand=Products%2cSuppliers%2CCars', function (result) {
		it('has an $expand value from encoded comma', () => {
			assert.notEqual(result.options.$expand, null);
		});
		it('has a resource of Products from encoded comma', () => {
			assert.equal(result.options.$expand.properties[0].name, 'Products');
		});
		it('has a resource of Suppliers from encoded comma', () => {
			assert.equal(result.options.$expand.properties[1].name, 'Suppliers');
		});
		it('has a resource of Cars from encoded comma', () => {
			assert.equal(result.options.$expand.properties[2].name, 'Cars');
		});
	});

	test('$format=json%3bodata.metadata%3dnone', (result) => {
		it('has a valid $format value from lowercase encoded semicolon and equal', () => {
			assert.deepEqual(result.options.$format, {
				type: 'json',
				metadata: 'none',
			});
		});
	});

	test('$format=json%3Bodata.metadata%3Dnone', (result) => {
		it('has a valid $format value from uppercase encoded semicolon and equal', () => {
			assert.deepEqual(result.options.$format, {
				type: 'json',
				metadata: 'none',
			});
		});
	});

	test.raw(
		'/model(%40id)?%40id=1',
		undefined,
		undefined,
		{ '@id': 1 },
		function (result) {
			it('should have the resource specified from encoded @ sign', () => {
				expect(result).to.have.property('resource').that.equals('model');
			});
			it('should have the key specified for the source from encoded @ sign', () => {
				expect(result)
					.to.have.property('key')
					.that.has.property('bind')
					.that.equals('@id');
			});
		},
	);	

	test.raw('/model(a%3d1,b%3D2)', [1, 2], function (result) {
		it('should have the resource specified from encoded equals', () => {
			expect(result).to.have.property('resource').that.equals('model');
		});
		it('should have the both keys specified from encoded equals', function () {
			expect(result)
				.to.have.property('key')
				.that.has.property('a')
				.that.has.property('bind')
				.that.equals(0);
			expect(result)
				.to.have.property('key')
				.that.has.property('b')
				.that.has.property('bind')
				.that.equals(1);
		});
	});

	test('$select=%2a', function (result) {
		it('has a $select value from lowercase encoded asterisk', () => {
			assert.notEqual(result.options.$select, null);
		});
		it('property name is * from lowercase encoded asterisk', () => {
			assert.equal(result.options.$select, '*');
		});
	});	

	test('$select=%2A', function (result) {
		it('has a $select value from uppercase encoded asterisk', () => {
			assert.notEqual(result.options.$select, null);
		});
		it('property name is * from uppercase encoded asterisk', () => {
			assert.equal(result.options.$select, '*');
		});
	});	
});
