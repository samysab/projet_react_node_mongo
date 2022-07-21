const { Router } = require("express");
const { User } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const bcryptjs = require("bcryptjs");
const { createToken } = require("../lib/jwt");
const router = new Router();
const nodemailer  = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: "mkajeiou3@myges.fr",
    pass: "d2QULsktrxBwZGDF",
  }
});

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.post("/register", async (req, res) => {
  const email = req.body.email.trim();
  const pseudo = req.body.pseudo.trim();

  try {
    let token = crypto.randomBytes(64).toString('hex');

    const result = await User.create({
      email: email,
      password: req.body.password,
      isAdmin: false,
      firstname: pseudo,
      status: 0,
      token: token,
    });

    let url = 'http://localhost:3000/confirmation/'+token;

    await transporter.sendMail({
        from: "pa.express.esgi@gmail.com",
        to: email,
        subject: "Bienvenue",
        text: "Bienvenue sur notre nouveau site",
        html: `<h2>Bienvenue sur notre nouveau site. Pour confirmer votre compte <a href="${url}">cliquez ici</a>.</h2>`
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

router.put("/confirmation", async (req, res) => {
  try {
    console.log('test');
    const result = await User.update({
        status: 1,
        token: ''
      }, {
      where: {
        token: req.body.token,
      },
    });

    if (result[0] === 0) {
      res.status(401);
      res.send({
        success: false,
        message: 'Token is invalid',
      });
    }else {
      res.status(200);
      res.send({
        success: true,
        message: 'Success'
      });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

router.post("/reset", async (req, res) => {
  try {
    const email = req.body.email.trim();

    let token = crypto.randomBytes(64).toString('hex');

    const result = await User.update({
      token: token
    }, {
      where: {
        email: email,
      },
    });

    if (result[0] === 0) {
      res.status(401);
      res.send({
        success: false,
        message: 'Error',
      });
    }else {
      let url = 'http://localhost:3000/resetPassword/'+token;

      await transporter.sendMail({
        from: "pa.express.esgi@gmail.com",
        to: email,
        subject: "Réinitialisation du mot de passe",
        text: "Réinitialisation du mot de passe",
        html: `<h2>Vous avez fait une demande de réinitialisation de votre mot de passe. Pour le réinitialiser <a href="${url}">cliquez ici</a>.</h2>`
      });

      res.status(200);
      res.send({
        success: true,
        message: 'Success'
      });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

router.put("/resetPassword", async (req, res) => {
  try {
    const result = await User.update({
      token: '',
      password: req.body.password
    }, {
      where: {
        token: req.body.token,
      },
    });

    if (result[0] === 0) {
      res.status(401);
      res.send({
        success: false,
        message: 'Error',
      });
    }else {
      res.status(200);
      res.send({
        success: true,
        message: 'Success'
      });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await User.findOne({
      where: {
        email: req.body.email,
        status: 1,
      },
    });
    if (!result) {
      res.status(401);
      res.send({
        success: false,
        message: 'Email not found'
      });
      return;
    }
    if (!(await bcryptjs.compare(req.body.password, result.password))) {
      res.status(401);
      res.send({
        success: false,
        message: 'Password is incorrect'
      });
      return;
    }
    res.status(200);
    res.json({ token: await createToken(result) });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

module.exports = router;
