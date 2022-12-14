const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

function IsAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).send("Token not found");
    } else {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          res.status(401).send("Invalid token");
        } else {
          req.username = decoded.username;
          next();
        }
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = IsAuthenticated;
