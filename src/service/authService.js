"use strict";

const jwt = require("jsonwebtoken");

const generateToken = async data => {
  return jwt.sign(data, global.SALT_KEY, { expiresIn: "1d" });
};

const decodeToken = async token => {
  return await jwt.verify(token, global.SALT_KEY);
};

const authorize = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({
      message: "Acesso Restrito"
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: "Token Invalido"
        });
      } else {
        next();
      }
    });
  }
};

const isAdmin = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    res.status(401).json({
      message: "Token Invalido"
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: "Token Invalido"
        });
      } else {
        if (decoded.roles.includes("admin")) {
          next();
        } else {
          res.status(401).json({
            message: "Está funcionalidade é restrita para administradores"
          });
        }
      }
    });
  }
};

module.exports = {
  decodeToken,
  generateToken,
  authorize,
  isAdmin
};
