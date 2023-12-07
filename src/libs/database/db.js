const pgp = require("pg-promise")();
const { dbName, dbHost, dbUser, dbPassword } = require("../config");


const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:5432/${dbName}`;

const db = pgp(connectionString);

module.exports = db;

