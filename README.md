[![Build status](https://api.travis-ci.org/meseven/node-egitimi-movie-api.svg)](https://travis-ci.org/meseven/node-egitimi-movie-api)

# IDMB
Make clone of project
run `npm install`|
run `npm run start:dev` for serve |
run `npm run test` for test 

# Movies

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/movies | `POST` | { name: 'Welcome', release_date:'2019-10-28 20:29:00', genre:'Comedy' } | Create a new movie. |
| /api/movies/favorite | `POST` | { movie_id: '...'} | Create a new favorite movie. |
| /api/movies/review   | `POST` | { movie_id: '...',rating:1,commnet:'this is really nice movie'} | Create a review for movie. |
| /api/movies/vote   | `POST` | { movie_id: '...',is_like:true} | Create a vote for movie. |
| /api/movies | `GET` | Empty | List all movies. |
| /api/movies/:movie_id | `GET` | Empty | get a movie. |
| /api/movies/recommended | `GET` | Empty | Get movies. |
| /api/movies/review/:movie_id | `GET` | Empty | Get list of revies of movie. |
| /api/movies/vote/:movie_id | `GET` | Empty | Get list of votes of movie. |

# Index

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /register | `POST` | { username: 'foo', password:'1234' } | Create a new user. |
| /authenticate | `POST` | { username: 'foo', password:'1234' } | Generate a token. |
