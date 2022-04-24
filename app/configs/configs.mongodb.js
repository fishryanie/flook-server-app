const messages = require('../constants/Messages')
const initialize = require('./configs.initialize.auth')
const updatePremiere = require('./configs.premiere')
const emptyTrash = require('./configs.empty-trash')
const Socket = require('./configs.socket.io')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const USERNAME = 'TicketMovie'
const PASSWORD = 'TZ3vRyqRqMiAwPmQ'
const DATABASE = 'Flex-ticket-movie'

const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.lqsyp.mongodb.net/${DATABASE}?retryWrites=true&w=majority`
const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const connection = mongoose.connect(url, option)
  .then(() => {
    updatePremiere.Main()
    initialize.initialize_create_auth()
    initialize.initialize_create_roles()
    emptyTrash.emptyTrash()

    Socket.main()
    console.log(messages.MongoDBSuccess)
  }).catch(err => console.log(messages.MongoDBError, err));


module.exports = connection;