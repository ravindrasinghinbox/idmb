const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const UserFavoriteMovie = new Schema({
	movie_id: Object,
	user_id: Object
});

module.exports = mongoose.model('users_favorite_movies', UserFavoriteMovie);
