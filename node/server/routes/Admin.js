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

router.get("/", async (req, res) => {
    res.send("Hello admin");
});

router.get("/show-user/:id", async (req, res) => {
    try {
        const user = await User.findByPk(parseInt(req.params.id, 10));
        if (!user) {
            res.sendStatus(404);
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.put("/edit-user/:id", async (req, res) => {
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

router.get("/check-reports", async (req, res) => {
    res.send("Hello admin");
});

router.post("/create-user", async (req, res) => {
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

//Garder dans la DB mais mettre email par défaut
router.put("/delete-user/:id", async (req, res) => {
    try {
        const [nbLines, [result]] = await User.update(
            {
                email: "default@default.com",
                status: "-1"
            }, {
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
    }});

router.get("/manage-messages", async (req, res) => {
    res.send("Hello admin");
});

module.exports = router;
