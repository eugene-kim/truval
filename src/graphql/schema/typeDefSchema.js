import typeDefs from './types/typeDefs';
import { buildSchema } from 'graphql';


export default buildSchema(typeDefs);