const Users = require('./model.auth')
const Roles = require('./model.roles')
const Casts = require('./model.cast')
const Movies = require('./model.movie')
const Comments = require('./model.comment')
const Manga = require('./model.manga')
const Genre = require('./model.genre')
const Chapter = require('./model.chapter')
const Author = require('./model.author')
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const MODEL_USERS = mongoose.model('users', Users)
const MODEL_ROLES = mongoose.model('roles', Roles)
const MODEL_CASTS = mongoose.model('casts', Casts)
const MODEL_MOVIES = mongoose.model("movies", Movies)
const MODEL_COMMENTS = mongoose.model("comments", Comments)
const MODEL_MANGAS = mongoose.model('mangas', Manga)
const MODEL_GENRES = mongoose.model('genres', Genre)
const MODEL_CHAPTERS = mongoose.model('chapters', Chapter)
const MODEL_AUTHORS = mongoose.model('authors', Author)


module.exports = {
  mongoose,
  MODEL_USERS,
  MODEL_ROLES,
  MODEL_CASTS,
  MODEL_MOVIES,
  MODEL_COMMENTS,
  MODEL_MANGAS,
  MODEL_GENRES,
  MODEL_CHAPTERS,
  MODEL_AUTHORS


}