const { Router } = require("express");
const { User } = require("../models/postgres");
const { Relationship } = require("../models/postgres");

const { ValidationError, where } = require("sequelize");
const checkIsAdmin = require("../middlewares/checkIsAdmin");
const checkAuthentication = require("../middlewares/checkAuthentication");
const { Op } = require("sequelize");
const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.put("/friend-request/accept/:id", async (req, res) =>{

  try {

    const result = await Relationship.update(
      {
        status: 1
      },
      {
        where:{
          id: parseInt(req.params.id, 10),
        },
        returning:true
      }
    )

    if (!result) {
      res.sendStatus(404);
    } else {
      res.json(result);
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

router.get("/search/:word", async (req, res) =>{
  try {
    
    const result = await User.findAll({
      where: {
        id: {
          [Op.ne]: 1
        },

        [Op.or]: [
          {
            firstname: {
              [Op.like]: req.params.word + "%",
            }
          },
          {
            email: {
              [Op.like]: req.params.word + "%",
            }
          }
        ]

      },
      include: [
        {
          model: User,
          as: "following",
          required: false,
          attributes: ["firstname","id"],
          through: {
            attributes: ["status"],
            where: { status: 1 }
          }
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.put("/friend-request/refuse/:id", async (req, res) =>{

  try {

    const result = await Relationship.update(
      {
        status: -1
      },
      {
        where:{
          id: parseInt(req.params.id, 10),
        },
        returning:true
      }
    )
    if (!result) {
      res.sendStatus(404);
    } else {
      res.json(result);
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


router.post("/follow", async (req, res) => {
  try {
    const result = await Relationship.create(req.body);
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

router.get("/friend-request", async (req, res) => {
  try {
    const result = await User.findAll({
      where:{ id : 1},
      attributes: [],
      include: [
        {
          model: User,
          as: "follower",
          required: false,
          attributes: ["firstname","id"],
          through: {
            attributes: ["status","id"],
            where: { status: 0 }
          }
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});



router.get("/friends", async (req, res) => {
  try {
    const result = await User.findAll({
      where:{ id : 1},
      include: [
        {
          model: User,
          as: "following",
          required: false,
          attributes: ["firstname","id"],
          through: {
            attributes: ["status"],
            where: { status: 1 }
          }
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const result = await User.findAll({
      where: {
        id: {
          [Op.ne]: 1
        }
      },
      include: [
        {
          model: User,
          as: "following",
          required: false,
          attributes: ["firstname","id"],
          through: {
            attributes: ["status"],
            where: { status: 1 }
          }
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/user/following/:id", async (req, res) => {
  try {
  
    const result = await User.findAll({
      where: {
        id: parseInt(req.params.id)
      },
      include: [
        {
          model: User,
          as: "following",
          required: false,
          attributes: ["firstname","id"],
          where:{
              id:1
          },
          through: {
            attributes: ["status","id"],
            where: {
              status: {
                [Op.ne]: -1
              }
            },
            
          }
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/user/follower/:id", async (req, res) => {
  try {
  
    const result = await User.findAll({
      where: {
        id: parseInt(req.params.id)
      },
      include: [
        {
          model: User,
          as: "follower",
          required: false,
          attributes: ["firstname","id"],
          where: {
            id:1,
          },
          through: {
            attributes: ["status","id"],
            where: {
              status: {
                [Op.ne]: -1
              }
            },
          }
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});


router.delete("/unfollow/:id", async (req, res) => {
  try {
    const nbLines = await Relationship.destroy({
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
