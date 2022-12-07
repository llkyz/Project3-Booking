const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

function IsAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized, token not found");
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).send("Invalid token");
      } else {
        console.log("Token authorized");
        req.username = decoded.username;
        next();
      }
    });
  }
}

module.exports = IsAuthenticated;
