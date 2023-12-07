const dotenv = require("dotenv");

dotenv.config();

module.exports = {
	discordToken: process.env.TOKEN,
	clientID: process.env.CLIENT_ID,
	dbName: process.env.DB_NAME,
	dbPassword: process.env.DB_PASSWORD,
	dbUser: process.env.DB_USER,
	dbHost: process.env.DB_HOST,
};
