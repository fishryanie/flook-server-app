const express = require("express");
const socket = require("socket.io");
const PORT = 8888;
const app = express();

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

app.use(express.static("public"));

// app.get('/', function(req, res){
//   res.send('Hello World!');
// });

const main = () => {
  const io = socket(server);
  io.on("connection", function (socket) {
    // socket.on("connection", (postdata) => {
    //   request.post(
    //     "http://localhost:8000/api/user-management/login",
    //     {
    //       body: postdata,
    //     },
    //     function (res) {
    //       console.log(res);
    //       client.send("post req called", postdata);
    //     }
    //   );
    // });

    console.log("Connected: " + socket.id);

    // socket.on("message", (data) => {
    //   socket.broadcast.emit("message", data);
    // })
  });
};

const socketClientModule = require('socket.io-client');
const streamConnectionServer = 'http://localhost:8888';

const main1 = () => {
  const activityToStreamSocket = socketClientModule.connect(streamConnectionServer);
  activityToStreamSocket.on('connect', function(socket){
    console.log('Connected to Stream Server');
});
}

module.exports = {
  main,
  main1,
};

// const { Server } = require("socket.io");
// const { Adapter } = require('socket.io-adapter')
// const { MongoClient } = require("mongodb");

// const createAdapter = new Adapter();

// const USERNAME = 'TicketMovie'
// const PASSWORD = 'TZ3vRyqRqMiAwPmQ'
// const DATABASE = 'Flex-ticket-movie'

// const COLLECTION = "socket.io-adapter-events";
// const io = new Server();

// const mongoClient = new MongoClient(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.lqsyp.mongodb.net/${DATABASE}?retryWrites=true&w=majority`, {
//   useUnifiedTopology: true,
// });

// const main = async () => {
//   await mongoClient.connect();

//   try {
//     await mongoClient.db(DATABASE).createCollection(COLLECTION, {
//       capped: true,
//       size: 1e6
//     });
//   } catch (e) {
//     // collection already exists
//   }
//   const mongoCollection = mongoClient.db(DATABASE).collection(COLLECTION);

//   io.adapter(createAdapter(mongoCollection));
//   io.listen(3000);
// }

// module.exports = {
//   main,
// }
