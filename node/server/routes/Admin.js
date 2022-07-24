const { Router } = require("express");
const { User, Report} = require("../models/postgres");
const { ValidationError } = require("sequelize");
const checkIsAdmin = require("../middlewares/checkIsAdmin");
const Message = require("../models/postgres/Message");

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
        if(req.body.status === "-1") { // Suppression d'un compte (possibilité de récupérer son compte)
            const [nbLines, [result]] = await User.update(
                {
                    email: "default@default.com",
                    status: req.body.status
                }, {
                    where: {
                        id: parseInt(req.params.id, 10),
                    },
                    returning: true,
                });


        }else if (req.body.status === "-2"){ //Suppression de tous les liens d'amitié mais garder l'email
            const [nbLines, [result]] = await User.update(
                {
                    status: req.body.status
                }, {
                    where: {
                        id: parseInt(req.params.id, 10),
                    },
                    returning: true,
                });
        }

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

// Envoyer un message en cas d'avertissement
router.post("/warn-user/:id", async (req, res) => {
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

// Classer sans suite un report
router.put("/filed-away/:id", async (req, res) => {
    try {
        const [nbLines, [result]] = await Report.update(
            {
                "status": "-1"
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
    }
});


module.exports = router;
