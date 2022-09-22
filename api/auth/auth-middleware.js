const db = require("../../data/dbConfig");
const User = require("./auth-model");
const bcrypt = require("bcryptjs");

async function checkUsernameFree(req, res, next) {
  const findUser = await db("users")
    .where("username", req.body.username)
    .first();
  if (findUser) {
    res.status(422).json({
      message: "username taken",
    });
  } else {
    next();
  }
}

function checkCredentialsExist(req, res, next) {
  if (!req.body.username) {
    res.status(401).json({
      message: "username and password required",
    });
  } else if (!req.body.password) {
    res.status(401).json({
      message: "username and password required",
    });
  } else {
    next();
  }
}

function checkPasswordLength(req, res, next) {
  if (req.body.password.trim().length < 3) {
    res.status(422).json({
      message: "Password must be longer than 3 characters",
    });
  } else {
    next();
  }
}

async function checkCredentialsAreValid(req, res, next) {
  try {
    const { username, password } = req.body;
    const [findUsername] = await User.findBy({ username });
    if (findUsername && bcrypt.compareSync(password, findUsername.password)) {
      next();
    } else {
      res.status(401).json({
        message: "invalid credentials",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  checkUsernameFree,
  checkCredentialsExist,
  checkPasswordLength,
  checkCredentialsAreValid,
};
