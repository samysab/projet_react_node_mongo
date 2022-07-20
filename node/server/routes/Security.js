const { Router } = require("express");
const { User } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const bcryptjs = require("bcryptjs");
const { createToken } = require("../lib/jwt");
const router = new Router();
const nodemailer  = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "priscilla82@ethereal.email",
    pass: "UjEQsw7qcGyczbxM84",
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
    const result = await User.create({
      email: email,
      password: req.body.password,
      isAdmin: false,
      firstname: pseudo
    });

    await transporter.sendMail({
        from: "pa.express.esgi@gmail.com",
        to: "theodoresigaud@gmail.com",
        subject: "Bienvenue sur Express.esgi",
        text: "Bienvenue sur toto Express.esgi",
        html: `<h1>Bienvenue sudzdzaddnar Express.esgi</h1>`
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

router.post("/login", async (req, res) => {
  try {
    const result = await User.findOne({
      where: {
        email: req.body.email,
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
