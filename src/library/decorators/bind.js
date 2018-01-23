export default function (target, name, descriptor) {
  const decorated = descriptor.value;

  if (typeof descriptor.value === 'function') {
    descriptor.value = function(...args) {
      decorated.apply(target, args);
    }
  }

  return descriptor;
};