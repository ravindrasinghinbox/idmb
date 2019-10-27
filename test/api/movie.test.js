const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');
chai.use(chaiHttp);

let token, movieId;

describe('/authenticate', () => {
	before((done) => {
		chai.request(server)
			.post('/authenticate')
			.send({ username: 'username', password: '******' })
			.end((err, res) => {
				token = res.body.token;
				done();
			});
	});

	describe('/movies', () => {
		it('it should get all the movies', (done) => {
			chai.request(server)
				.get('/api/movies')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					if (res.body.data.length) {
						res.body.data[0].should.have.property('_id');
						res.body.data[0].should.have.property('name');
						res.body.data[0].should.have.property('release_date');
						res.body.data[0].should.have.property('genres');
						res.body.data[0].should.have.property('like');
						res.body.data[0].should.have.property('dislike');
						res.body.data[0].should.have.property('total_review');
						res.body.data[0].should.have.property('avg_rating');
					}
					done();
				});
		})
	});

	describe('/movies', () => {
		it('it should save a movie', (done) => {
			const movie = {
				name: 'Movie' + Math.random(),
				release_date: '2020-10-25',
				genre: 'Action'
			};

			chai.request(server)
				.post('/api/movies')
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('name');
					res.body.data.should.have.property('release_date');
					res.body.data.should.have.property('created_at');
					movieId = res.body.data._id;
					done();
				});
		});
	});

	describe('/movies/review', () => {
		it('it should save a movie review', (done) => {
			const movie = {
				movie_id: movieId,
				rating: 3,
				comment: "This is simple comment example from test.",
			};

			chai.request(server)
				.post('/api/movies/review')
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('user_id');
					res.body.data.should.have.property('movie_id').eql(movieId);
					res.body.data.should.have.property('rating');
					res.body.data.should.have.property('_id');
					res.body.data.should.have.property('created_at');
					res.body.data.should.have.property('comment');
					done();
				});
		});
	});

	describe('/movies/vote', () => {
		it('it should save a movie vote', (done) => {
			const movie = {
				movie_id: movieId,
				is_like: true
			};

			chai.request(server)
				.post('/api/movies/vote')
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('user_id');
					res.body.data.should.have.property('movie_id').eql(movieId);
					res.body.data.should.have.property('is_like').eql(movie.is_like);
					res.body.data.should.have.property('_id');
					res.body.data.should.have.property('created_at');
					done();
				});
		});
	});

	describe('/movies/favorite', () => {
		it('it should save a movie as favorite', (done) => {
			const movie = {
				movie_id: movieId
			};

			chai.request(server)
				.post('/api/movies/favorite')
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('user_id');
					res.body.data.should.have.property('movie_id').eql(movieId);
					res.body.data.should.have.property('created_at');
					res.body.data.should.have.property('_id');
					done();
				});
		});
	});

	describe('/movies/:movie_id', () => {
		it('it should get a movie by the given id', (done) => {
			chai.request(server)
				.get('/api/movies/' + movieId)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('name');
					res.body.data.should.have.property('release_date');
					res.body.data.should.have.property('genres');
					res.body.data.should.have.property('like');
					res.body.data.should.have.property('dislike');
					res.body.data.should.have.property('total_review');
					res.body.data.should.have.property('avg_rating');
					res.body.data.should.have.property('_id').eql(movieId);
					done();
				});
		});
	});

	describe('/movies/review/:movie_id', () => {
		it('it should get review by movie_id', (done) => {
			chai.request(server)
				.get('/api/movies/review/' + movieId)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					if (res.body.data.length) {
						res.body.data[0].should.have.property('_id');
						res.body.data[0].should.have.property('comment');
						res.body.data[0].should.have.property('created_at');
						res.body.data[0].should.have.property('rating');
						res.body.data[0].should.have.property('user_id');
						res.body.data[0].should.have.property('movie_id').eql(movieId);
					}
					done();
				});
		});
	});

	describe('/movies/vote/:movie_id', () => {
		it('it should get vote by movie_id', (done) => {
			chai.request(server)
				.get('/api/movies/vote/' + movieId)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					if (res.body.data.length) {
						res.body.data[0].should.have.property('_id');
						res.body.data[0].should.have.property('user_id');
						res.body.data[0].should.have.property('created_at');
						res.body.data[0].should.have.property('is_like');
						res.body.data[0].should.have.property('movie_id').eql(movieId);
					}
					done();
				});
		});
	});

	describe('/movies/recommended', () => {
		it('it should get recommended movies', (done) => {
			chai.request(server)
				.get('/api/movies/recommended')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					if (res.body.data.length) {
						res.body.data[0].should.have.property('_id');
						res.body.data[0].should.have.property('name');
						res.body.data[0].should.have.property('release_date');
						res.body.data[0].should.have.property('created_at');
					}
					done();
				});
		});
	});
});

