const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieFavorite = new Schema({
	movie_id: Object,
	user_id: Object,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('movies_favorite', MovieFavorite);
