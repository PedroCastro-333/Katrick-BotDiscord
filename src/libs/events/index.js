const interactionCreate = require("./interactionCreate");
const deleteChannels = require("./deleteChannels");
const createChannels = require("./createChannels");
const messageCreate = require("./messageCreate");
const addUserById = require('./insertMemberonDb')
const ready = require("./ready");

module.exports = {
	interactionCreate,
	messageCreate,
	ready,
	deleteChannels,
	createChannels,
	addUserById
};
