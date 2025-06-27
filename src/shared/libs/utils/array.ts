export function keyBy<T, K extends string>(
  array: T[],
  iteratee: (item: T) => K
): Record<K, T> {
  return array.reduce(
    (acc, item) => {
      const key = iteratee(item);
      acc[key] = item;
      return acc;
    },
    {} as Record<K, T>
  );
}
