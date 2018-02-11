exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('session', table => {
      table.dropForeign('user_id');
      table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
    }),
    knex.schema.table('category', table => {
      table.dropForeign('user_id');
      table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
    }),
    knex.schema.table('activity', table => {
      table.dropForeign('session_id');
      table.foreign('session_id').references('id').inTable('session').onDelete('CASCADE');

      table.dropForeign('category_id');
      table.foreign('category_id').references('id').inTable('category').onDelete('SET NULL');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('session', table => {
      table.dropForeign('user_id');
      table.foreign('user_id').references('id').inTable('user');
    }),
    knex.schema.table('category', table => {
      table.dropForeign('user_id');
      table.foreign('user_id').references('id').inTable('user');
    }),
    knex.schema.table('activity', table => {
      table.dropForeign('session_id');
      table.foreign('session_id').references('id').inTable('session');

      table.dropForeign('category_id');
      table.foreign('category_id').references('id').inTable('category');
    }),
  ]);
};
