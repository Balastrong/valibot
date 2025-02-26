import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  Dataset,
  InferIssue,
  InferOutput,
  MaybePromise,
} from '../../types/index.ts';
import { getFallback } from '../getFallback/index.ts';

/**
 * Fallback async type.
 */
export type FallbackAsync<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> =
  | InferOutput<TSchema>
  | ((
      dataset?: Dataset<InferOutput<TSchema>, InferIssue<TSchema>>,
      config?: Config<InferIssue<TSchema>>
    ) => MaybePromise<InferOutput<TSchema>>);

/**
 * Schema with fallback async type.
 */
export type SchemaWithFallbackAsync<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TFallback extends FallbackAsync<TSchema>,
> = Omit<TSchema, 'async' | '_run'> & {
  /**
   * The fallback value.
   */
  readonly fallback: TFallback;
  /**
   * Whether it's async.
   */
  readonly async: true;
  /**
   * Parses unknown input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: Dataset<unknown, never>,
    config: Config<InferIssue<TSchema>>
  ): Promise<Dataset<InferOutput<TSchema>, InferIssue<TSchema>>>;
};

/**
 * Returns a fallback value as output if the input does not match the schema.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
export function fallbackAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TFallback extends FallbackAsync<TSchema>,
>(
  schema: TSchema,
  fallback: TFallback
): SchemaWithFallbackAsync<TSchema, TFallback> {
  return {
    ...schema,
    fallback,
    async: true,
    async _run(dataset, config) {
      schema._run(dataset, config);
      return dataset.issues
        ? // @ts-expect-error
          { typed: true, value: await getFallback(this, dataset, config) }
        : dataset;
    },
  };
}
