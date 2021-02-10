import mysql from 'mysql';
import config from './config.js';

const connection = mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.pass,
  database: config.db.name,
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

export default connection;
