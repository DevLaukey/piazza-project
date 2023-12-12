const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const authConfig = {
  domain: "YOUR_AUTH0_DOMAIN",
  audience: "YOUR_CLIENT_ID",
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
