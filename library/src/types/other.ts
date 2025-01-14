import type {
  LazySchema,
  LazySchemaAsync,
  NonNullableIssue,
  NonNullableSchema,
  NonNullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
} from '../schemas/index.ts';
import type { Config } from './config.ts';
import type { Dataset } from './dataset.ts';
import type { InferInput, InferIssue } from './infer.ts';
import type { BaseIssue } from './issue.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type { MaybePromise } from './utils.ts';

/**
 * Error message type.
 */
export type ErrorMessage<TIssue extends BaseIssue<unknown>> =
  | ((issue: TIssue) => string)
  | string;

/**
 * Function reference type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionReference<TArgs extends any[], TReturn> = (
  ...args: TArgs
) => TReturn;

/**
 * Default type.
 */
export type Default<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TInput extends null | undefined,
> =
  | InferInput<TWrapped>
  | TInput
  | ((
      dataset?: Dataset<TInput, never>,
      config?: Config<InferIssue<TWrapped>>
    ) => InferInput<TWrapped> | TInput);

/**
 * Default async type.
 */
export type DefaultAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TInput extends null | undefined,
> =
  | InferInput<TWrapped>
  | TInput
  | ((
      dataset?: Dataset<TInput, never>,
      config?: Config<InferIssue<TWrapped>>
    ) => MaybePromise<InferInput<TWrapped> | TInput>);

/**
 * Default value type.
 */
export type DefaultValue<
  TDefault extends
    | Default<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        null | undefined
      >
    | DefaultAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        null | undefined
      >,
> =
  TDefault extends DefaultAsync<
    infer TWrapped extends
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    infer TInput
  >
    ? TDefault extends (
        dataset?: Dataset<TInput, never>,
        config?: Config<InferIssue<TWrapped>>
      ) => MaybePromise<InferInput<TWrapped> | TInput>
      ? Awaited<ReturnType<TDefault>>
      : TDefault
    : never;

/**
 * Question mark schema type.
 *
 * TODO: Document that for simplicity and bundle size, we currently do not
 * distinguish between `undefined` and missing keys when using `optional` and
 * `nullish`.
 */
export type QuestionMarkSchema =
  | NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
  | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
  // @ts-expect-error
  | LazySchema<QuestionMarkSchema>
  | NonNullableSchema<
      // @ts-expect-error
      QuestionMarkSchema,
      ErrorMessage<NonNullableIssue> | undefined
    >;

/**
 * Question mark schema async type.
 */
export type QuestionMarkSchemaAsync =
  | NullishSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  | OptionalSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  // @ts-expect-error
  | LazySchemaAsync<QuestionMarkSchema | QuestionMarkSchemaAsync>
  | NonNullableSchemaAsync<
      // @ts-expect-error
      QuestionMarkSchema | QuestionMarkSchemaAsync,
      ErrorMessage<NonNullableIssue> | undefined
    >;
