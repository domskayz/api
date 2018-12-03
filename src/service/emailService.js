"use strict";

const config = require("../config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.sendGridKey);

const sendD = (to, subject, body) => {
  const msg = {
    to: to,
    from: "lnfernando@gmail.com",
    subject,
    html: body
  };

  sgMail.send(msg);
};

module.exports = {
  sendD
};
