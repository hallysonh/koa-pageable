import { Context } from 'koa';
import { NumberFormatError, Pageable } from '@hallysonh/pageable';

/**
 * Converts the input into a number it it's a valid numeric string, otherwise it throws a NumberFormatError
 *
 * @param input Input to convert to number
 * @returns Numeric value of string
 */
function parseIntOrThrow(input: string): number {
  const result = parseInt(input, 10);

  if (Number.isNaN(result)) {
    throw new NumberFormatError(`Could not convert '${input}' to number`);
  }
  return result;
}

/**
 * Converts the input to a number if it's a valid numeric string using {@link parseIntOrThrow}. If the input isn't
 * specified, returns null
 *
 * @param input Input to convert to number
 * @returns Null or numeric value of string
 */
function parseOptionalIntOrThrow(input?: string): number | null {
  return input ? parseIntOrThrow(input) : null;
}

/**
 * Koa Middleware function that reads pagination parameters from the query string, and populate `ctx.state.pageable`
 * with a {@link Pageable} instance.
 *
 * @param ctx Context associated with the Koa middleware function
 * @param next Middleware function called after {@link Pageable} property is set in state
 * @returns {Promise}
 */
export default async function paginate(ctx: Context, next: Function) {
  const page = parseOptionalIntOrThrow(ctx.query.page) || 0;
  const size = parseOptionalIntOrThrow(ctx.query.size) || 10;
  const sort = ctx.query.sort || null;
  const indexed: boolean = (ctx.query.indexed === 'true');

  ctx.state.pageable = new Pageable(page, size, indexed, sort);
  return next();
}
