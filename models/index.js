const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const model = {
  casts: mongoose.model('casts', require('./movie/cast')),
  users: mongoose.model('users', require('./auth/user')),
  roles: mongoose.model('roles', require('./auth/roles')),
  movies: mongoose.model('movies', require('./movie/movie')),
  genres: mongoose.model('genres', require('./storybook/genre')),
  status: mongoose.model('status', require('./other/status')),
  ebooks: mongoose.model('ebooks', require('./storybook/ebooks')),
  authors: mongoose.model('authors', require('./storybook/author')),
  reviews: mongoose.model('reviews', require('./review/reviews')),
  comments: mongoose.model('comments', require('./review/comment')),
  categories: mongoose.model('categories', require('./other/categories')),
  chapterchats: mongoose.model('chapterchats', require('./storybook/chapterChat')),
  chaptercomics: mongoose.model('chapterComic', require('./storybook/chapterComic')),
  chapternovels: mongoose.model('chapterNovel', require('./storybook/chapterNovel'))
}


module.exports = model