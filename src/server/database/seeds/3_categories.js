
exports.seed = async function(knex, Promise) {
  const table = 'category';

  // Deletes ALL existing entries
  await knex(table).del();

  // Resets the table's id sequence back to one. The database keep a record of the last insertion for
  // the user_id type so it can properly auto increment the next inserted row. Failure to reset
  // the id sequence and subsequently adding seed data that starts with `id: 1` will result in a
  // duplicate primary key error, even if you've deleted all the rows.
  await knex.raw('ALTER SEQUENCE category_id_seq RESTART WITH 1');

  // We don't put ids in our seed data to allow for Postgres to increment properly.
  return knex(table).insert([
    {
      name: 'CODE',
      is_primary: true,
      color: '#3E416A',
      user_id: 1,
    },
    {
      name: 'EAT',
      color: '#E9696A',
      user_id: 1,
    },
    {
      name: 'POTTY',
      color: '#BBD8CB',
      user_id: 1,
    },
    {
      name: 'INTERNET',
      color: '#4ACDDE',
      user_id: 1,
    },
    {
      name: 'TRANSIT',
      color: '#866981',
      user_id: 1,
    },
    {
      name: 'MISC',
      color: '#FCD66B',
      user_id: 1,
    },
    {
      name: 'CODE',
      is_primary: true,
      color: '#3E416A',
      user_id: 2,
    },
    {
      name: 'EAT',
      color: '#E9696A',
      user_id: 2,
    },
    {
      name: 'POTTY',
      color: '#BBD8CB',
      user_id: 2,
    },
    {
      name: 'INTERNET',
      color: '#4ACDDE',
      user_id: 2,
    },
    {
      name: 'TRANSIT',
      color: '#866981',
      user_id: 2,
    },
    {
      name: 'MISC',
      color: '#FCD66B',
      user_id: 2,
    },
  ]);
};
