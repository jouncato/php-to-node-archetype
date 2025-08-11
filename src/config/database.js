const mysql = require('mysql2/promise');
const config = require('./environment');
const logger = require('../utils/logger');

class DatabaseClient {
  constructor() {
    this.pool = null;
    this.connect();
  }

  async connect() {
    try {
      this.pool = mysql.createPool({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        port: config.database.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

     