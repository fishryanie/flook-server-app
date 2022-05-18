
module.exports = app => {
  
  app.get("/", (req, res) => {
    res.send({ message: "Welcome to Flook-app." });
  });

  require('./auth/user')(app)
  require('./movie/cast')(app)
  require('./movie/movie')(app)
  require('./review/comment')(app)
  require('./storybook/ebooks')(app)
  require('./storybook/genre')(app)
  require('./storybook/author')(app)
  require('./storybook/chapter')(app)
}