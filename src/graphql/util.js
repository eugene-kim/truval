export const getGqlParamString = object => {
  const keys = Object.keys(object);

  return keys.reduce((paramString, key, index) => {
    const value = object[key];
    const isLast = index === keys.length - 1;

    // No need to output a space at the end of the last parameter.
    const space = isLast ? '' : ' ';
    const shouldWrapWithQuotes = typeof value !== 'number' || typeof value !== 'boolean';
    const valueString = shouldWrapWithQuotes ? `"${value}"` : value;

    return paramString.concat(`${key}:${valueString}${space}`);
  }, '');
};