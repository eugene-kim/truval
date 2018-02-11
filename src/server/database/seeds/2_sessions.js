exports.seed = async function(knex, Promise) {
  const table = 'session';

  // Deletes ALL existing entries
  await knex(table).del();

  // Resets the table's id sequence back to one. The database keep a record of the last insertion for
  // the user_id type so it can properly auto increment the next inserted row. Failure to reset
  // the id sequence and subsequently adding seed data that starts with `id: 1` will result in a
  // duplicate primary key error, even if you've deleted all the rows.
  await knex.raw('ALTER SEQUENCE session_id_seq RESTART WITH 1');

  // We don't put ids in our seed data to allow for Postgres to increment properly.
  return knex(table).insert([
    {
      name: 'Study Session 1',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 1,
    },
    {
      name: 'Study Session 2',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 1,
    },
    {
      name: 'Study Session 3',
      start: '2017-10-21T22:51:09.489Z',
      end: '2017-10-22T22:51:09.489Z',
      is_complete: true,
      user_id: 1,
    },
    {
      name: 'Study Session 1',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 2,
    },
    {
      name: 'Study Session 2',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 2,
    },
    {
      name: 'Study Session 3',
      start: '2017-10-21T22:51:09.489Z',
      end: '2017-10-22T22:51:09.489Z',
      is_complete: true,
      user_id: 2,
    },
  ]);
};
