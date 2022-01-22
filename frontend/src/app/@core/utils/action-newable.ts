/**
 * Defines a constructor with an optional argument.
 *
 * @param R result
 * @param T argument
 */
export type ActionNewable<R, T = void> = new (args: T) => R;
