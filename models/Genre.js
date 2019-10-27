const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const Genre = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	status: ["active","disabled"]
});

module.exports = mongoose.model('Genre', Genre);
