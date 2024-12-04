require('dotenv').config();
module.exports = {
    client: 'pg', 
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DBNAME,
      port: process.env.PG_PORT,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: './migrations' // Directory for migration files
    },
    seeds: {
      directory: './seeds' // Directory for seed files
    }
};
