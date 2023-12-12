
const express = require("express");
const app = express();
const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://dev-fb3fqap2.us.auth0.com/api/v2/",
  issuerBaseURL: `https://dev-fb3fqap2.us.auth0.com/`,
});
