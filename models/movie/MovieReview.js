const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieReview = new Schema({
	movie_id: Object,
	user_id: Object,
	rating: {
		type:Number,
		min: 0,
		max: 5
	},
	comment: {
		type: String,
		maxlength:512,
		default:null
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('movies_review', MovieReview);
