const express = require("express");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const path = require("path");
let cors = require("cors");

//Connect mongoose
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://sebpincemoi:sebastien@grimoire.rsa6kju.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/img", express.static(path.join(__dirname, "img")));

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
