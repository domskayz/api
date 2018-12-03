"use strict";

const repository = require("../repositories/orderRepository");
const guid = require("guid");
const authService = require("../service/authService");

const post = async (req, res) => {
  try {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);


    await repository.create({
      customer: data.id,
      number: guid.raw().substring(0, 6),
      items: req.body.items
    });

    res.status(201).send({ message: "Pedido Cadastrado com sucesso! " }); // status 201 created



  } catch (e) {
    if (e) {
      throw e;
    }

    res
      .status(400) // bad request
      .send({ message: "Falha ao Pedir requisição! ", data: e }); // status 201 created
  }
};

const get = async (req, res) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  post,
  get
};
