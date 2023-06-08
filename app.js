const express = require("express");
const User = require("./models/users");
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

//login
app.post("/api/auth/signup", (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.use("/api/auth", userRoutes);

module.exports = app;
