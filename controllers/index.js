const auth = require('./auth/user')
const movie = require('./movie/movie')
const cast = require('./movie/cast')
const comment = require('./review/comment')
const ebooks = require('./storybook/ebooks')
const genre = require('./storybook/genre')
const author = require('./storybook/author')
const chapter = require('./storybook/chapter')
const categories = require('./storybook/categories')


const Controller = {
  auth, movie, cast, comment, ebooks, genre, author, chapter, categories
}

module.exports = Controller