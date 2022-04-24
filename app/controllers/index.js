const auth = require('./controller.auth')
const movie = require('./controller.movie')
const cast = require('./controller.cast')
const comment = require('./controller.comment')
const manga = require('./controller.manga')
const genre = require('./controller.genre')
const author = require('./controller.author')
const chapter = require('./controller.chapter')



const Controller = {
  auth, movie, cast, comment, manga, genre, author, chapter
}

module.exports = Controller