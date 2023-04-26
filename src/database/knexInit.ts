import knex from 'knex';
import config from './config';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];
const knexInstance = knex(knexConfig);

export default knexInstance;