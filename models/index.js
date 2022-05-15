const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const model = {
  vips: mongoose.model('vips', require('./model.vip')),
  casts: mongoose.model('casts', require('./model.cast')),
  users: mongoose.model('users', require('./schema/user')),
  roles: mongoose.model('roles', require('./schema/roles')),
  genres: mongoose.model('genres', require('./schema/genre')),
  status: mongoose.model('status', require('./schema/status')),
  ebooks: mongoose.model('ebooks', require('./schema/ebooks')),
  authors: mongoose.model('authors', require('./schema/author')),
  reviews: mongoose.model('reviews', require('./schema/reviews')),
  comments: mongoose.model('comments', require('./schema/comment')),
  categories: mongoose.model('categories', require('./schema/categories')),
  chapterchats: mongoose.model('chapterchats', require('./schema/chapterChat')),
  chaptercomics: mongoose.model('chapterComic', require('./schema/chapterComic')),
  chapternovels: mongoose.model('chapterNovel', require('./schema/chapterNovel'))
}


module.exports = model