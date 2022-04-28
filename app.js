const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const Thing = require("./models/sauce");

mongoose
  .connect(
    "mongodb+srv://READWRITEUSER:Vincenti012)@cluster0.6ia1x.mongodb.net/myFirstDatabase?Retrywrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie!"))
  .catch(() => console.log("Connexion à MongoDB échouée!"));

const app = express();
app.use(cors());
app.use(express.json());

const sauceRoutes = require("./routes/sauce");

const userRoutes = require("./routes/user");

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
