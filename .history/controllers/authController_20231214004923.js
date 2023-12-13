const axios = require("axios").default;

const User = require("../models/userModel");
const { createToken } = require("../utils/auth");

var authConfig = {
  method: "GET",
  url: "https://dev-fb3fqap2.us.auth0.com/oauth/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer",
  },
  data: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: "vfrYORSozWqdGpJZEWjqCMnBNbMLEhtX",
    client_secret:
      "FyAX8goTiMu7qz8b9MSqbgi22gLji_IdUPR5zU8NOATCDW6zcaZg67QNGACz4uqS",
    audience: "https://dev-fb3fqap2.us.auth0.com/api/v2/",
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
      return res.status(400).json({ message: "User already exists" });
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, encryptedPassword });

    // Create token
    const token = jwt.sign({ user_id: newUser._id, username }, "secret-token", {
      expiresIn: "2h",
    });
    // save user token
    newUser.token = token;

    try {
      await newUser.save();
    } catch (saveError) {
      console.error(saveError);
      return res
        .status(500)
        .json({ message: "Internal Server Error - User creation failed" });
    }

    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    // Validate user in your MongoDB (or any other database)
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to get Auth0 access token
const getAuth0AccessToken = async () => {
  const response = await axios
    .request(authConfig)
    .then(function (response) {
      console.log(response?.data);
    })
    .catch(function (error) {
      console.error(error);
    });

  return response.data.access_token;
};

module.exports = { registerUser, loginUser };
