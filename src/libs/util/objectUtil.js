/**
* "Object" related methods that can be used throughout the project.
*/ 

/**
 * Renames a key on an object and ensures that behavior of the new property is identical.
 */
export function renameKey(object, newKey, oldKey) {
  if (newKey !== oldKey) {
    Object.defineProperty(
      object,
      newKey,
      Object.getOwnPropertyDescriptor(object, oldKey),
    );

    delete object[oldKey];
  }
}