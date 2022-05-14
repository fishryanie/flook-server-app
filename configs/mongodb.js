const USERNAME = 'TicketMovie'
const PASSWORD = 'TZ3vRyqRqMiAwPmQ'
const DATABASE = 'flex-flook-app'


const configsMongodb = {
  url:`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.lqsyp.mongodb.net/${DATABASE}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
}

module.exports = configsMongodb;