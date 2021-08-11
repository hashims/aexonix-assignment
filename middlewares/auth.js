const jwt = require("jsonwebtoken");


const createToken = (user) => {
    const token = jwt.sign(
        {
            user_id: user.id, 
            email: user.email
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: "12h",
        }
    )

    return token;
}

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = {
    createToken,
    verifyToken
};