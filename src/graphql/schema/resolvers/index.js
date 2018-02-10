const {merge} = require('lodash');

const UserResolvers = require('./UserResolvers');
const SessionResolvers = require('./SessionResolvers');
const ActivityResolvers = require('./ActivityResolvers');
const CategoryResolvers = require('./CategoryResolvers');


export default merge(UserResolvers, SessionResolvers, ActivityResolvers, CategoryResolvers);
