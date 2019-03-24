module.exports = {
  cors: {
    origin: [
      'http://localhost:8080'
    ]
  },
  pgPool: {
    user: 'sammugg',
    host: 'localhost',
    database: 'ipv4-heatmap-db',
    password: '',
    port: 5432,
    max: 20
  }
};
