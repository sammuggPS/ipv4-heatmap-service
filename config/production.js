module.exports = {
  cors: {
    origin: [
      'https://sammuggps.github.io'
    ]
  },
  pgPool: {
    user: undefined,
    host: undefined,
    database: undefined,
    password: undefined,
    port: undefined,
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
};