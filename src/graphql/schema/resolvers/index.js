import { merge } from 'lodash';

import UserResolvers from './UserResolvers';
import SessionResolvers from './SessionResolvers';
import ActivityResolvers from './ActivityResolvers';
import CategoryResolvers from './CategoryResolvers';


export default merge(UserResolvers, SessionResolvers, ActivityResolvers, CategoryResolvers);
