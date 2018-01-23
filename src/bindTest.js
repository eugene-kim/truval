import bind from './library/decorators/bind';

global.x = 9;

var module = {
  x: 81,

  @bind
  getX: function() { return this.x; },
};

console.log(module.getX());

var retrieveX = module.getX;

console.log(retrieveX());