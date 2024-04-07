import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue } from '../../vitest/index.ts';
import { unknown, type UnknownSchema } from './unknown.ts';

describe('unknown', () => {
  test('should return schema object', () => {
    expect(unknown()).toStrictEqual({
      kind: 'schema',
      type: 'unknown',
      expects: 'unknown',
      async: false,
      _run: expect.any(Function),
    } satisfies UnknownSchema);
  });

  describe('should return no issue', () => {
    const schema = unknown();

    // Primitive types

    test('for bigints', () => {
      expectNoSchemaIssue(schema, [-1n, 0n, 123n]);
    });

    test('for booleans', () => {
      expectNoSchemaIssue(schema, [true, false]);
    });

    test('for null', () => {
      expectNoSchemaIssue(schema, [null]);
    });

    test('for numbers', () => {
      expectNoSchemaIssue(schema, [-1, 0, 123, 45.67]);
    });

    test('for undefined', () => {
      expectNoSchemaIssue(schema, [undefined]);
    });

    test('for strings', () => {
      expectNoSchemaIssue(schema, ['', 'foo', '123']);
    });

    test('for symbols', () => {
      expectNoSchemaIssue(schema, [Symbol(), Symbol('foo')]);
    });

    // Complex types

    test('for arrays', () => {
      expectNoSchemaIssue(schema, [[], ['value']]);
    });

    test('for functions', () => {
      expectNoSchemaIssue(schema, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectNoSchemaIssue(schema, [{}, { key: 'value' }]);
    });
  });
});