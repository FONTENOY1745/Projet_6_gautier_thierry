const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Thing = require("./models/sauce");

mongoose
  .connect(
    "mongodb+srv://READWRITEUSER:Vincenti01}@cluster0.6ia1x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie!"))
  .catch(() => console.log("Connexion à MongoDB échouée!"));

const app = express();

const sauceRoutes = require("./routes/sauce");

app.use("/api/sauce", sauceRoutes);

module.exports = app;

const userRoutes = require("./routes/user");

app.use("/api/sauce", sauceRoutes);
app.use("/api/auth", userRoutes);
