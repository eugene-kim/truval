import { merge } from 'lodash';

import UserResolvers from './UserResolvers';
import SessionResolvers from './SessionResolvers';
import ActivityTypeResolvers from './ActivityTypeResolvers';
import ActivityInstanceResolvers from './ActivityInstanceResolvers';
import CategoryResolvers from './CategoryResolvers';


export default merge(
  UserResolvers,
  SessionResolvers,
  CategoryResolvers,
  ActivityTypeResolvers,
  ActivityInstanceResolvers,
);
