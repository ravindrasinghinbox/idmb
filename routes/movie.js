const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Models
const Genre = require('../models/Genre');
const Movie = require('../models/movie/Movie');
const MovieReview = require('../models/movie/MovieReview');
const MovieFavorite = require('../models/movie/MovieFavorite');
const MovieGenre = require('../models/movie/MovieGenre');
const MovieVote = require('../models/movie/MovieVote');
router.get('/', (req, res) => {
	const promise = Movie.aggregate([
		{
			$lookup: {
				from: 'movies_genres',
				localField: '_id',
				foreignField: 'movie_id',
				as: 'movies_genres'
			}
		},
		{
			$lookup: {
				from: 'movies_votes',
				localField: '_id',
				foreignField: 'movie_id',
				as: 'movies_votes'
			}
		},
		{
			$lookup: {
				from: 'genres',
				localField: 'movies_genres.genre_id',
				foreignField: '_id',
				as: 'genres'
			}
		},
		{
			$lookup: {
				from: 'movies_reviews',
				localField: '_id',
				foreignField: 'movie_id',
				as: 'reviews'
			}
		},
		{
			$project: {
				'_id': 1,
				'name': 1,
				'release_date': 1,
				'genres.name': 1,
				"like": {
					"$size": {
						"$filter": {
							"input": "$movies_votes",
							"cond": { "$eq": ["$$this.is_like", true] }
						}
					}
				},
				"dislike": {
					"$size": {
						"$filter": {
							"input": "$movies_votes",
							"cond": { "$eq": ["$$this.is_like", false] }
						}
					}
				},
				"total_review": {
					"$size": "$reviews"
				},
				"avg_rating": {
					"$avg": "$reviews.rating"
				}
			}
		}
	]);
	// .sort({ name: 1 }).skip(1).limit(3);

	promise.then((data) => {
		res.json({ data: data });;
	}).catch((err) => {
		res.status(404).json({ error: err.message });
	})
});

// Top 10 recomended list
router.get('/recommended', (req, res) => {
	const promise = MovieFavorite.aggregate([
		{
			$match: {
				user_id: req.session._id
			}
		},
		{
			$lookup: {
				from: 'movies_genres',
				localField: 'movie_id',
				foreignField: 'movie_id',
				as: 'favorite_movies'
			}
		},
		{
			$lookup: {
				from: 'movies_genres',
				localField: 'favorite_movies.genre_id',
				foreignField: 'genre_id',
				as: 'favorite_movies'
			}
		},
		{
			$lookup: {
				from: 'movies',
				localField: 'favorite_movies.movie_id',
				foreignField: '_id',
				as: 'favorite_movies'
			}
		},
		{ $unwind: '$favorite_movies' },
		{
			$group: {
				_id: '$favorite_movies'
			}
		}
	]);

	promise.then((data) => {
		result = [];
		data.map((obj) => {
			result.push(obj._id);
		})
		res.json({ data: result });
	}).catch((err) => {
		res.status(404).json({ error: err.message });
	})
});

/**
 * Get Movie by id
 */
router.get('/:movie_id', (req, res, next) => {
	const promise = Movie.aggregate([
		{
			$match: {
				_id: mongoose.Types.ObjectId(req.params.movie_id)
			}
		},
		{
			$lookup: {
				from: 'movies_genres',
				localField: '_id',
				foreignField: 'movie_id',
				as: 'movies_genres'
			}
		},
		{
			$lookup: {
				from: 'movies_votes',
				localField: '_id',
				foreignField: 'movie_id',
				as: 'movies_votes'
			}
		},
		{
			$lookup: {
				from: 'genres',
				localField: 'movies_genres.genre_id',
				foreignField: '_id',
				as: 'genres'
			}
		},
		{
			$lookup: {
				from: 'movies_reviews',
				localField: '_id',
				foreignField: 'movie_id',
				as: 'reviews'
			}
		},
		{
			$project: {
				'_id': 1,
				'name': 1,
				'release_date': 1,
				'genres.name': 1,
				"like": {
					"$size": {
						"$filter": {
							"input": "$movies_votes",
							"cond": { "$eq": ["$$this.is_like", true] }
						}
					}
				},
				"dislike": {
					"$size": {
						"$filter": {
							"input": "$movies_votes",
							"cond": { "$eq": ["$$this.is_like", false] }
						}
					}
				},
				"total_review": {
					"$size": "$reviews"
				},
				"avg_rating": {
					"$avg": "$reviews.rating"
				}
			}
		}
	]);

	promise.then((movie) => {
		if (!movie.length)
			return res.status(404).json({ error: 'The movie was not found.' });

		res.json({ data: movie.pop() });
	}).catch((err) => {
		res.status(404).json({ error: err.message });
	});
});

/**
 * Get Movie by id
 */
router.get('/review/:movie_id', (req, res, next) => {
	const promise = MovieReview.find({ 'movie_id': mongoose.Types.ObjectId(req.params.movie_id) });

	promise.then((movie) => {
		if (!movie)
			return res.status(404).json({ error: 'The movie was not found.' });

		res.json({ data: movie });
	}).catch((err) => {
		res.status(404).json({ error: err.message });
	});
});

/**
 * Get Movie by id
 */
router.get('/vote/:movie_id', (req, res, next) => {
	const promise = MovieVote.find({ 'movie_id': mongoose.Types.ObjectId(req.params.movie_id) });

	promise.then((movie) => {
		if (!movie)
			return res.status(404).json({ error: 'The movie was not found.' });

		res.json({ data: movie });
	}).catch((err) => {
		res.status(404).json({ error: err.message });
	});
});

/**
 * Vote Movie
 */
router.post('/vote', (req, res, next) => {
	Movie.findById(req.body.movie_id)
		.then((movie) => {
			if (!movie)
				return res.status(404).json({ error: 'The movie was not found.' });
			MovieVote.find({ user_id: req.session._id, movie_id: movie._id }).then((result) => {
				if (result.length)
					return res.status(412).json({ message: 'Already given vote for this movie.' });
				new MovieVote({ user_id: req.session._id, movie_id: movie._id, is_like: req.body.is_like }).save().then((vote) => {
					res.json({ data: vote });
				}, (err) => {
					console.log(err);
				});
			});
		}).catch((err) => {
			res.status(404).json({ error: err.message });
		});
});

/**
 * Add or update movie review
 */
router.post('/review', (req, res, next) => {
	Movie.findById(req.body.movie_id)
		.then((movie) => {
			if (!movie)
				return res.status(404).json({ error: 'The movie was not found.' });
			MovieReview.find({ user_id: req.session._id, movie_id: movie._id }).then((result) => {
				if (result.length)
					return res.status(412).json({ message: 'Already given review for this movie.' });
				new MovieReview({ user_id: req.session._id, movie_id: movie._id, rating: req.body.rating, comment: req.body.comment }).save().then((vote) => {
					res.json({ data: vote });
				}, (err) => {
					console.log(err);
				});
			})
		}).catch((err) => {
			res.status(404).json({ error: err.message });
		});
});

/**
 * Add Favorite movie
 */
router.post('/favorite', (req, res, next) => {
	Movie.findById(req.body.movie_id)
		.then((movie) => {
			if (!movie)
				return res.status(404).json({ error: 'The movie was not found.' });
			MovieFavorite.findOne({ user_id: req.session._id, movie_id: movie._id })
				.then((favorite) => {
					if (favorite)
						return res.status(403).json({ message: 'Already added this movie in your favorite movie list.' });
					new MovieFavorite({ user_id: req.session._id, movie_id: movie._id }).save().then((data) => {
						res.json({ data: data });;
					}, (err) => {
						console.log(err);
					});
				})
		})
		.catch((err) => {
			res.status(404).json({ error: err.message });
		});
});

async function saveMovie(obj) {
	// save movie
	return new Movie(obj)
		.save()
		.then((movie) => {
			// save movie genre
			return new MovieGenre({ genre_id: obj.genre_id, movie_id: movie._id })
				.save()
				.then((data) => {
					return movie;
				});
		});
}
/**
 * Add Movie
 */
router.post('/', (req, res, next) => {
	Genre.findOne({ name: req.body.genre }).then((data) => {
		if (!data) {
			new Genre({ name: req.body.genre, status: "active" })
				.save()
				.then((data) => {
					req.body.genre_id = data._id;
					saveMovie(req.body).then((data) => {
						res.json({ data: data });;
					});
				})
		} else {
			req.body.genre_id = data._id;
			saveMovie(req.body).then((data) => {
				res.json({ data: data });;
			});
		}
	}).catch((err) => {
		res.status(404).json({ error: err.message });
	});
});

module.exports = router;
