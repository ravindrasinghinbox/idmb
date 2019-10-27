const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieGenre = new Schema({
	movie_id: Object,
	genre_id: Object,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Movies_Genre', MovieGenre);
