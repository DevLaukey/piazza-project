const jwt = require("jsonwebtoken");


const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3000",
  clientID: "x5Phd8R92bgg1yVMLGQ3azXMu7jLDXqD",
  issuerBaseURL: "https://dev-fb3fqap2.us.auth0.com",
};
const createToken = (user) => {
  const token = jwt.sign({ user }, authConfig.clientSecret, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { createToken };
