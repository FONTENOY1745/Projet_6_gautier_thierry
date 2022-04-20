const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
// Validation de l'adresse e-mail unique

const userSchema = mongoose.Schema({
  // Structure du modèle d'identifiant demandé
  email: { type: String, required: true, unique: true },
  // Identifiant unique : soit une adresse e-mail pour un utilisateur
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
// Installation du plug-in pour un identifiant unique

module.exports = mongoose.model("User", userSchema);
