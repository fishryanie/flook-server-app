
module.exports = app => {

  app.get("/", (req, res) => {
    res.send({ message: "Welcome to Flook-app." });
  });

  require('./Router.auth')(app)
  require('./Router.cast')(app)
  require('./Router.movie')(app)
  require('./Router.comment')(app)
  require('./Router.manga')(app)
  require('./Router.genre')(app)
  require('./Router.author')(app)
  require('./Router.chapter')(app)
}