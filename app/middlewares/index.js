const auth = require('./middleweres.auth')
const cast = require('./middleweres.cast')


const middlewares = {
  auth, cast
}
module.exports = middlewares