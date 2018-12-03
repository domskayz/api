"use strict";

const ValidationContract = require("../validators/fluentValidator");
const repository = require("../repositories/customerRepository");
const md5 = require("md5");
const emailService = require("../service/emailService");
const authService = require("../service/authService");

const post = async (req, res) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.name,
    3,
    "O nome deve conter pelo menos 3 caracteres"
  );
  contract.hasMinLen(
    req.body.password,
    6,
    "A Senha deve conter pelo menos 6 caracteres"
  );
  contract.isEmail(req.body.email, "Email invalido");

  if (!contract.isValid()) {
    res
      .status(400)
      .send(contract.errors())
      .end();
    return;
  }

  try {
    const { name, email, password } = req.body;

    await repository.create({
      name,
      email,
      password: md5(password + global.SALT_KEY),
      roles: ["user"]
    });

    emailService.sendD(
      email,
      "Hello World no email, welcome!!!",
      global.EMAIL_TMPL.replace("{0}", name)
    );

    res.status(201).send({ message: "Cliente Cadastrado com sucesso! " }); // status 201 created
  } catch (e) {
    res
      .status(400) // bad request
      .send({ message: "Falha ao cadastrar requisição! ", data: e }); // status 201 created
  }
};

const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await repository.authenticate({
      email,
      password: md5(password + global.SALT_KEY)
    });

    if (!customer) {
      res.status(404).json({ message: "Usaurio ou senha Invalidos" });
      return;
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles
    });

    res.status(201).send({
      token,
      data: { email: customer.email, name: customer.name },
      message: "Usuairo Cadastrado com sucesso!"
    }); // status 201 created
  } catch (e) {
    console.log(e);
    res
      .status(400) // bad request
      .send({ message: "Falha ao cadastrar requisição! ", data: e }); // status 201 created
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);

    const customer = await repository.getById(data.id);

    if (!customer) {
      res.status(404).send({
        message: "Cliente não encontrado"
      });
      return;
    }

    const tokenData = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles
    });

    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};

module.exports = {
  post,
  authenticate,
  refreshToken
};
