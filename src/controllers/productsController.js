"use strict";

const ValidationContract = require("../validators/fluentValidator");
const repository = require("../repositories/productRepository");
const azure = require("azure-storage");
const config = require("../config");
const guid = require("guid");

const get = async (req, res) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
};

const getBySlug = async (req, res) => {
  try {
    const data = await repository.getBySlug(req.body.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
};

const getById = async (req, res) => {
  try {
    const data = await repository.getById(req.body.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
};

const getByTag = async (req, res) => {
  try {
    const data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
};

const post = async (req, res) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.title,
    3,
    "O Titulo deve conter pelo menos 3 caracteres"
  );
  contract.hasMinLen(
    req.body.slug,
    3,
    "O slug deve conter pelo menos 3 caracteres"
  );
  contract.hasMinLen(
    req.body.description,
    3,
    "A descrição deve conter ao menos 3 caracteres"
  );

  if (!contract.isValid()) {
    res
      .status(400)
      .send(contract.errors())
      .end();
    return;
  }

  try {
    const blobSvc = azure.createBlobService(config.containerConnectionString);

    let filename = guid.raw().toString() + ".jpg";
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], "base64");

    // Salva a imagem
    await blobSvc.createBlockBlobFromText(
      "product-image",
      filename,
      buffer,
      {
        contentType: type
      },
      function(error, result, response) {
        if (error) {
          filename = "default-product.png";
        }
      }
    );

    const { title, slug, description, price, tags } = req.body;

    await repository.create({
      title,
      slug,
      description,
      price,
      active: true,
      tags,
      image: "https://nodeteste.blob.core.windows.net/product-image/" + filename
    });

    res.status(201).send({ message: "Produto Cadastrado com sucesso! " }); // status 201 created
  } catch (e) {
    console.log(e);
    res
      .status(400) // bad request
      .send({ message: "Falha ao cadastrar produto! ", data: e }); // status 201 created
  }
};

const put = async (req, res) => {
  const id = req.params.id;
  try {
    await repository.update(id, req.body);
    res.status(201).send({
      message: "Produto atualizado com sucesso !"
    });
  } catch (e) {
    res.status(400).send({
      message: "Falha ao atualizar Produto !",
      data: e
    });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await repository.remove(id);
    res.status(201).send({
      message: "Produto removico com sucesso !"
    });
  } catch (e) {
    res.status(400).send({
      message: "Falha ao remover Produto !",
      data: e
    });
  }
};

module.exports = {
  post,
  put,
  remove,
  get,
  getBySlug,
  getById,
  getByTag
};
