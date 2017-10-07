
exports.up = function(knex, Promise) {
  knex.schema.createTable('category', table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('color').notNullable();
    table.boolean('is_primary').defaultTo(false);
    table.timestamps.(true, true);

    // Foreign Keys
    table.integer('user_id').references('id').inTable('user');
  }
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('category');
};
