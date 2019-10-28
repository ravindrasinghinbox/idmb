const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieVote = new Schema({
	movie_id: Object,
	user_id: Object,
	is_like: Boolean,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('movies_votes', MovieVote);
