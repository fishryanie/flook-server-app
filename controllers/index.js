const auth = require('./func/auth')
const movie = require('./func/movie')
const cast = require('./func/cast')
const comment = require('./func/comment')
const manga = require('./func/ebooks')
const genre = require('./func/genre')
const author = require('./func/author')
const chapter = require('./func/chapter')

const Controller = {
  auth, movie, cast, comment, manga, genre, author, chapter
}

module.exports = Controller