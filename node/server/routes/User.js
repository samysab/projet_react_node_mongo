const { Router } = require("express");
const { User } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const checkIsAdmin = require("../middlewares/checkIsAdmin");

const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.get("/", checkIsAdmin, async (req, res) => {
  try {
    const { page = 1, perPage = 10, ...criteria } = req.query;
    const result = await User.findAll({
      where: criteria,
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [
        { model: Post, as: "posts", limit: 2, order: [["createdAt", "DESC"]] },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/profile", async (req, res) => {
  try {
    res.status(200);
    res.send({
      pseudo: req.user.dataValues.firstname,
      technologies: req.user.dataValues.technologies
    });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.put("/resetPassword", async (req, res) => {
  try {
    const result = await User.update({
      password: req.body.password
    }, {
      where: {
        id: req.user.dataValues.id,
      },
      individualHooks: true,
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

router.put("/updateProfile", async (req, res) => {
  const pseudo = req.body.pseudo.trim();

  try {
    console.log(req.body.pseudo);
    console.log(req.body.technologies);

    const result = await User.update({
      firstname: pseudo,
      technologies: JSON.stringify(req.body.technologies)
    }, {
      where: {
        id: req.user.dataValues.id,
      },
    });

    console.log(result);

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

router.post("/", checkIsAdmin, async (req, res) => {
  try {
    const result = await User.create(req.body);
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

router.get("/:id", async (req, res) => {
  try {
    const result = await User.findByPk(parseInt(req.params.id, 10));
    if (!result) {
      res.sendStatus(404);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [nbLines, [result]] = await User.update(req.body, {
      where: {
        id: parseInt(req.params.id, 10),
      },
      returning: true,
    });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);

    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const nbLines = await User.destroy({
      where: {
        id: parseInt(req.params.id, 10),
      },
    });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

module.exports = router;
