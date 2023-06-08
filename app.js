const express = require("express");

const userRoutes = require("./routes/user");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//Connect mongoose
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://sebpincemoi:sebastien@grimoire.rsa6kju.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use("/api/auth", userRoutes);

module.exports = app;
