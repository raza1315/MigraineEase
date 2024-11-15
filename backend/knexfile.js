module.exports = {
    client: 'pg', 
    connection: {
      host: 'pg-52e82-migraineease.h.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_1Rnp2g-dtBrxFiWIbrM',
      database: 'defaultdb',
      port: 22846,
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
