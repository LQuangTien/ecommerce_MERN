const path = require("path");
const cors = require("cors");
const env = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require('./routes')

const app = express();
env.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected");
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "uploads")));

routes.forEach(route => {
  app.use("/api", route);
})

app.listen(process.env.PORT, () => {
  console.log("Server is running on port:", process.env.PORT);
});
