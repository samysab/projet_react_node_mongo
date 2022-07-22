const { Router } = require("express");
const { Message } = require("../models/postgres");
const { ValidationError } = require("sequelize");

const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.get("/", async (req, res) => {
  try {
    const { page = 1, perPage = 10, ...criteria } = req.query;
    const result = await Message.findAll({
      where: criteria,
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await Message.create(req.body);
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
    const result = await Message.findByPk(parseInt(req.params.id, 10));
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

router.get("/getAllMessagesPerUser/:id", async (req, res) => {
  try {
    const result = await Message.findAll({
      where: {
        from: req.params.id,
      }
    });
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

router.put("/changeStatus/:id", async (req, res) => {
  try {
    const result = await Message.update({
      status: req.body.status
    }, {
      where: {
        id: req.params.id,
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

router.delete("/:id", async (req, res) => {
  try {
    const nbLines = await Message.destroy({
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
