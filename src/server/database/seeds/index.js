const users = require('./data/users');
const sessions = require('./data/sessions');
const categories = require('./data/categories');
const activityTypes = require('./data/activityTypes');
const activityInstances = require('./data/activityInstances');

const userTable = 'User';
const sessionTable = 'Session';
const categoryTable = 'Category';
const activityTypeTable = 'ActivityType';
const activityInstanceTable = 'ActivityInstance';


exports.seed = async function(knex, Promise) {

  // Delete all preexisting data.
  await Promise.all([
    knex(userTable).del(),
    knex(sessionTable).del(),
    knex(categoryTable).del(),
    knex(activityTypeTable).del(),
    knex(activityInstanceTable).del(),
  ]);

  await knex(userTable).insert(users);

  console.log('inserted users');

  await Promise.all([
    knex(sessionTable).insert(sessions),
    knex(categoryTable).insert(categories),
  ]);

  console.log('inserted sessions and categories');

  await knex(activityTypeTable).insert(activityTypes);
  console.log('inserted activity types');
  await knex(activityInstanceTable).insert(activityInstances);
  console.log('inserted activity instances');
};
