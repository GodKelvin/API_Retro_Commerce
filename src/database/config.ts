import { Knex } from "knex";
import { knexSnakeCaseMappers } from 'objection';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },

    //Permite a conversao de camelCase para snake_case (JS <=> Banco de dados)
    ...knexSnakeCaseMappers()
  },

  production: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    ...knexSnakeCaseMappers()
  }

};

export default config;
