const user = require('./auth/user')
const movie = require('./movie/movie')
const cast = require('./movie/cast')
const review = require('./review/review')
const comment = require('./review/comment')
const ebooks = require('./storybook/ebooks')
const genre = require('./storybook/genre')
const author = require('./storybook/author')
const roles = require('./auth/role')
const chapter = require('./storybook/chapter')
const feature = require('./auth/feature')
const featureGroup = require('./auth/featureGroup')
const payment =  require('./payment')


const Controller = {
  roles, user, movie, cast, comment, ebooks, genre, author, chapter, review, comment, feature, featureGroup,payment
}

module.exports = Controller