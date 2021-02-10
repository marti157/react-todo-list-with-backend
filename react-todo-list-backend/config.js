const config = {
  app: {
    port: 8000,
  },
  db: {
    host: 'localhost',
    port: 8889,
    user: 'mysql_user',
    pass: 'mysql_pass',
    name: 'todo',
  },
  origin: {
    url: 'http://localhost:3000',
  },
};

export default config;
