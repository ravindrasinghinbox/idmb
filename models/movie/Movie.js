const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	release_date: {
		required: true,
		type: Date,
		min: Date.now
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('movies', Movie);
