import * as assert from 'assert';
import { expect } from 'chai';
import type { TestFn } from './test';

export default (test: TestFn) => {
	describe('$apply groupby', function () {
		describe('single property', function () {
			test('$apply=groupby((licence))', function (result) {
				it('should have a $apply.groupby object', () => {
					assert.notEqual(result.options.$apply?.groupby, null);
				});
				it('should have properties: [licence]', () => {
					assert.deepStrictEqual(result.options.$apply?.groupby?.properties, [
						'licence',
					]);
				});
				it('should not have an aggregate key', () => {
					expect(result.options.$apply?.groupby).to.not.have.property(
						'aggregate',
					);
				});
			});
		});

		describe('multiple properties', function () {
			test('$apply=groupby((licence,name))', function (result) {
				it('should have properties: [licence, name]', () => {
					assert.deepStrictEqual(result.options.$apply?.groupby?.properties, [
						'licence',
						'name',
					]);
				});
				it('should not have an aggregate key', () => {
					expect(result.options.$apply?.groupby).to.not.have.property(
						'aggregate',
					);
				});
			});
		});

		describe('aggregate with sum', function () {
			test('$apply=groupby((licence),aggregate(age with sum as total_age))', function (result) {
				it('should have properties: [licence]', () => {
					assert.deepStrictEqual(result.options.$apply?.groupby?.properties, [
						'licence',
					]);
				});
				it('should have one sum aggregate', () => {
					assert.deepStrictEqual(result.options.$apply?.groupby?.aggregate, [
						{ field: 'age', with: 'sum', as: 'total_age' },
					]);
				});
			});
		});

		describe('aggregate with average', function () {
			test('$apply=groupby((licence),aggregate(age with average as avg_age))', function (result) {
				it('should have one average aggregate', () => {
					assert.deepStrictEqual(result.options.$apply?.groupby?.aggregate, [
						{ field: 'age', with: 'average', as: 'avg_age' },
					]);
				});
			});
		});

		describe('aggregate with count', function () {
			test('$apply=groupby((licence),aggregate(id with count as pilot_count))', function (result) {
				it('should have one count aggregate', () => {
					assert.deepStrictEqual(result.options.$apply?.groupby?.aggregate, [
						{ field: 'id', with: 'count', as: 'pilot_count' },
					]);
				});
			});
		});
	});
};
