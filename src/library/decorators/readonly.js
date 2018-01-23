export default function (target, name, descriptor) {
  descriptor.writable = false;

  return descriptor;
};