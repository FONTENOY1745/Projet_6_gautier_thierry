const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // On récupère le token de la requête
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // On vérifie le token de la requête
    const userId = decodedToken.userId;
    // On récupère l'identifiant du token de la requête

    if (req.body.userId && req.body.userId !== userId) {
      // On compare l'identifiant de la requête à celui du token
      throw "L'identifiant est erroné!";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: new Error("Cette requête est erronée!") });
  }
};
