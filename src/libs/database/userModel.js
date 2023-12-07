// userModel.js
const db = require("./db");

function createUserTable() {
	return db.none(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(255),
            pontos INTEGER,
            mortes INTEGER,
            sobrevidas INTEGER
        )
    `);
}

module.exports = { createUserTable };
