
exports.up = function(knex, Promise) {
  knex.schema.createTable('user', table) {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('email').notNullable();
    table.timestamps.(true, true);
  }
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('user');
};
