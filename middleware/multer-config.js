const multer = require("multer");

const MIME_TYPES = {
  // Listage des formats d'images
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Destination pour le stockage des images
    callback(null, "images");
  },

  filename: (req, file, callback) => {
    // Création d'un nouveau nom du fichier image pour éviter les doublons
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
