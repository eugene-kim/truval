const bind = (target, key, descriptor) => {
  target[key] = target[key].bind(target);
};


export default bind;