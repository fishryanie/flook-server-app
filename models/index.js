const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const model = {
  casts: mongoose.model('casts', require('./movie/cast')),
  users: mongoose.model('users', require('./auth/user')),
  roles: mongoose.model('roles', require('./auth/roles')),
  movies: mongoose.model('movies', require('./movie/movie')),
  genres: mongoose.model('genres', require('./storybook/genre')),
  ebooks: mongoose.model('ebooks', require('./storybook/ebooks')),
  authors: mongoose.model('authors', require('./storybook/author')),
  chapters: mongoose.model('chapters', require('./storybook/chapter')),
  reviews: mongoose.model('reviews', require('./review/reviews')),
  comments: mongoose.model('comments', require('./review/comment')),
  features: mongoose.model('features', require('./auth/feature')),
  featuresGroups: mongoose.model('featuresGroups', require('./auth/featureGroup')),
}


module.exports = model