
exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('session').del();
  await knex.raw('ALTER SEQUENCE session_id_seq RESTART WITH 1');

  return knex('session').insert([
    {
      // id: 1,
      name: 'Study Session 1',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 1,
    },
    {
      // id: 2,
      name: 'Study Session 2',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 1,
    },
    {
      // id: 3,
      name: 'Study Session 3',
      start: '2017-10-21T22:51:09.489Z',
      end: '2017-10-22T22:51:09.489Z',
      is_complete: true,
      user_id: 1,
    },
    {
      // id: 4,
      name: 'Study Session 1',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 2,
    },
    {
      // id: 5,
      name: 'Study Session 2',
      start: '2017-10-21T22:51:09.489Z',
      end: null,
      is_complete: false,
      user_id: 2,
    },
    {
      // id: 6,
      name: 'Study Session 3',
      start: '2017-10-21T22:51:09.489Z',
      end: '2017-10-22T22:51:09.489Z',
      is_complete: true,
      user_id: 2,
    },
  ]);
};
