const jwt = require("jsonwebtoken");
const { authConfig } = require("../config");

const createToken = (user) => {
  const token = jwt.sign({ user }, authConfig.clientSecret, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { createToken };
