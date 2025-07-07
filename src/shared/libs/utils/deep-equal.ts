import { isObject } from "../types";

export function isDeepEqual(object1: unknown, object2: unknown): boolean {
  if (!isObject(object1) || !isObject(object2)) {
    return object1 === object2;
  }

  const obj1 = object1 as Record<string, unknown>;
  const obj2 = object2 as Record<string, unknown>;

  const objKeys1 = Object.keys(obj1);
  const objKeys2 = Object.keys(obj2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (let key of objKeys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const areBothObjects = isObject(value1) && isObject(value2);

    if (
      (areBothObjects && !isDeepEqual(value1, value2)) ||
      (!areBothObjects && value1 !== value2)
    ) {
      return false;
    }
  }

  return true;
}
