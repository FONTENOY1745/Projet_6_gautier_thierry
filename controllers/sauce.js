const Sauce = require("../models/Sauce");
// On importe le modèle de sauce
const fs = require("fs");
// fs = file system : c'est l'ensemble qui modifie et/ou supprime des fichiers

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    // On crée un nouvel objet sauce avec le modèle sauce
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    // L'adresse web de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la database
  });
  sauce
    .save()
    // On enregistre la sauce dans la database
    .then(() =>
      res.status(201).json({ message: "Cette sauce est enregistrée" })
    )
    .catch((error) => res.status(400).json({ error }));
  console.log(sauce);
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? // On vérifie si la modification concerne le body ou un nouveau fichier image
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Cette sauce est modifiée" }))
    .catch(() => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    // On identifie la sauce
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      // On récupère l'adresse de l'image
      fs.unlink(`images/${filename}`, () => {
        // On supprime alors l'image du serveur
        Sauce.deleteOne({ _id: req.params.id })
          // On supprime aussi la sauce de la database
          .then(() =>
            res.status(200).json({ message: "Cette sauce est supprimée!" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    });
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  if (like === 1) {
    // Choix "J'aime"
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then(() => res.status(200).json({ message: "Vous aimez cette sauce!" }))

      .catch((error) => res.status(400).json({ error }));
  } else if (like === -1) {
    // Choix "Je n'aime pas"
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous n'aimez pas cette sauce!" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    //Choix  annulation pour "J'aime" ou "Je n'aime pas"
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "Vous n'aimez plus cette sauce!" })
            )
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "Vous aimez toujours cette sauce!" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.getAllSauces = (req, res, next) => {
  // On va chercher toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
exports.getOneSauce = (req, res, next) => {
  // On va chercher une seule sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
