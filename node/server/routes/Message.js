const { Router } = require("express");
const { Message } = require("../models/postgres");
const connection = require("../models/postgres/db");
const { ValidationError, Op, QueryTypes } = require("sequelize");
const logger = require("../lib/logger");

const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.get("/", async (req, res) => {
  try {
    const result = await connection.query(
      "SELECT *, a.firstname as userto, u.firstname as userfrom, m.id as idmess, m.status as msgstatus from messages m INNER JOIN users u ON m.from = u.id INNER JOIN users a ON m.to = a.id",
    { 
      type: QueryTypes.SELECT
    }
    );
    res.json(result);
  } catch (error) {
    logger.error(`Get all messages error: ${error}`);
    res.sendStatus(500);
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await Message.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Create new message error : ${error}`);
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
    logger.info(`GET method respoonse successfuly for id ${req.params.id}`);
  } catch (error) {
    logger.error(`Impossible to get Message per Id : ${req.params.id} - error : ${error}`);
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/getAllMessagesPerUser/:id", async (req, res) => {
  try {
    const result = await Message.findAll({
      where: {
        [Op.or]: [
          { from: req.params.id },
          { to: req.params.id }
        ]
      },
      order: [["id", "ASC"]]
    });
    if (!result) {
      res.sendStatus(404);
    } else {
      res.json(result);
    }
  } catch (error) {
    logger.error(`Get all messages per userId (${req.params.id}) error: ${error}`);
    console.error(error);
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [nbLines, [result]] = await Message.update(req.body, {
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

router.put("/changeStatus/:id", async (req, res) => {
  try {
    const result = await Message.update({
      status: 0
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
    logger.error(`Change status of message error ${error}`);

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
    logger.error(`Delete message error: ${error}`);
    res.sendStatus(500);
    console.error(error);
  }
});

module.exports = router;
