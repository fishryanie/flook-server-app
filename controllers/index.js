const auth = require('./auth/user')
const movie = require('./movie/movie')
const cast = require('./movie/cast')
const comment = require('./review/comment')
const ebooks = require('./storybook/ebooks')
const genre = require('./storybook/genre')
const author = require('./storybook/author')
const roles = require('./auth/role')
const chapter = require('./storybook/chapter')
const feature = require('./auth/feature')
const featureGroup = require('./auth/featureGroup')
const review =require('./review/review')

const Controller = {
  auth, movie, cast, comment, ebooks, genre, author, chapter, roles, feature, featureGroup, review
}

module.exports = Controller