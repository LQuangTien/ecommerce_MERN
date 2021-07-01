const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const env = require("dotenv");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
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
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port:", process.env.PORT);
});
