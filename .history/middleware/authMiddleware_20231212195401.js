const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3000",
  clientID: "x5Phd8R92bgg1yVMLGQ3azXMu7jLDXqD",
  issuerBaseURL: "https://dev-fb3fqap2.us.auth0.com",
};

const authenticateUser = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

module.exports = { authenticateUser };
