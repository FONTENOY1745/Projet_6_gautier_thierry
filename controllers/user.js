const bcrypt = require("bcrypt");
// on chiffre avec bcrypt (cf. cours full stack OC Will Alexander)
const User = require("../models/User");
// création constante User
const jwt = require("jsonwebtoken");
// création constante du générateur du jeton d'entrée (token = jeton)
const emailValidator = require("email-validator");
// création de la constante du validateur d'adresse e-mail
const passwordValidator = require("password-validator");
// création de la constante du validateur du mot de passe e-mail
const MaskData = require("maskdata");
// on masque les données

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8)
  // Longueur minimum de caractères = 8
  .is()
  .max(50)
  // Longueur maximum de caractères = 50
  .has()
  .uppercase()
  // Les lettres en capitales sont obligatoires
  .has()
  .lowercase()
  // Les lettres en minuscules sont obligatoires
  .has()
  .digits()
  // Un caractère minimum est obligatoire
  .has()
  .not()
  .symbols();
// Pas de caractères spéciaux
//.Aucun().espace()

exports.signup = (req, res, next) => {
  // Saisie de l'identifiant
  if (
    !emailValidator.validate(req.body.email) ||
    !passwordSchema.validate(req.body.password)
  ) {
    // Cas ou l'identifiant e-mail et le mot de passe sont invalides
    return res.status(400).json({
      message:
        "Check your email address format and your password should be at least 8 characters long, contain uppercase, lowercase letter and digit ",
    });
  } else if (
    emailValidator.validate(req.body.email) ||
    passwordSchema.validate(req.body.password)
  ) {
    // Cas ou l'identifiant e-mail et le mot de passe sont valides
    const maskedMail = MaskData.maskEmail2(req.body.email);
    // On masque l'adresse mail
    bcrypt
      .hash(req.body.password, 10)
      // bcrypt hashe le mot de passe
      .then((hash) => {
        const user = new User({
          // On crée un nouveau user
          email: req.body.email,
          // Constatation de l'adresse e-mail masquée
          password: hash,
        });
        user
          .save()
          // On enregistre avec mongoose dans la database
          .then((hash) =>
            res.status(201).json({ message: "L'utilisateur est créé!" })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  // connexion de l'utilisateur
  const maskedMail = MaskData.maskEmail2(req.body.email);
  User.findOne({ email: req.body.email })
    // On vérifie que l'adresse e-mail figure bien dan la database
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Cette adresse e-mail n'est pas reconnue!" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        // On compare les mots de passes
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Ce mot de passe incorrect!" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              // On génère un token de session pour l'identifiant connecté
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
