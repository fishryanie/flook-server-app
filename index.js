const cors = require("cors");
const express = require("express");
const database = require('./app/configs/configs.mongodb')
const bodyParser = require("body-parser");
const PORT = 8000;
const app = express();
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
// path upload image
app.use("/uploads", express.static("uploads"));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "welcome to flex-ticket project." });
});

require('./app/routes')(app)


app.listen(PORT, async () => {
  await database
  console.log(`Server is running on port ${PORT}`);
});
