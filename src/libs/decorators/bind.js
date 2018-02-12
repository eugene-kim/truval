/**
 * ES7 Decorator that binds functions automatically. This is useful for passing
 * functions around as props in React components.
 */
function bind(target, name, descriptor) {
  const {value} = descriptor;

  return {
    configurable: true,

    get() {
      const boundValue = value.bind(this);

      Object.defineProperty(this, name, {
        value: boundValue,
        configurable: true,
        writable: true,
      });

      return boundValue;
    },
  };
}


export default bind;