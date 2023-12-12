const axios = require("axios");

const User = require("../models/userModel");
const { createToken } = require("../utils/auth");

var options = {
  method: "POST",
  url: "https://dev-fb3fqap2.us.auth0.com/oauth/token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  data: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: "vfrYORSozWqdGpJZEWjqCMnBNbMLEhtX",
    client_secret: "YOUR_CLIENT_SECRET",
    audience: "YOUR_API_IDENTIFIER",
  }),
};

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Bad Request - Missing username or password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bad Request - User already exists" });
    }

    // Create user in your MongoDB (or any other database)
    const newUser = new User({ username, password });

    try {
      await newUser.save();
    } catch (saveError) {
      console.error(saveError);
      return res
        .status(500)
        .json({ message: "Internal Server Error - User creation failed" });
    }

    // Register user in Auth0
    await axios.post(
      `${authConfig.issuerBaseURL}/users`,
      {
        email: username,
        password,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          Authorization: `Bearer ${await getAuth0AccessToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Bad Request - Missing username or password" });
    }

    // Validate user in your MongoDB (or any other database)
    const user = await User.findOne({ username, password });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid credentials" });
    }

    // Get Auth0 token for the user
    const auth0Token = await getAuth0UserToken(username, password);

    // Generate a JWT token
    const token = createToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to get Auth0 access token
const getAuth0AccessToken = async () => {
  const response = await axios.post(
    `https://${authConfig.domain}/oauth/token`,
    {
      grant_type: "client_credentials",
      client_id: authConfig.clientID,
      client_secret: authConfig.secret,
      audience: authConfig.aud,
    }
  );

  return response.data.access_token;
};

// Helper function to get Auth0 user token
const getAuth0UserToken = async (username, password) => {
  const response = await axios.post(
    `https://${authConfig.domain}/oauth/token`,
    {
      grant_type: "password",
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      audience: authConfig.audience,
      username,
      password,
    }
  );

  return response.data.access_token;
};

module.exports = { registerUser, loginUser };
