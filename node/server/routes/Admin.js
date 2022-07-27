const {Router} = require("express");
const {User, Report} = require("../models/postgres");
const {ValidationError, QueryTypes} = require("sequelize");
const checkIsAdmin = require("../middlewares/checkIsAdmin");
const Message = require("../models/postgres/Message");
const crypto = require("crypto");
const logger = require("../lib/logger");
const nodemailer = require("nodemailer");
const connection = require("../models/postgres/db");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});
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
    const email = req.body.email.trim();
    const firstname = req.body.firstname.trim();
    let password = crypto.randomBytes(10).toString('hex');
    let token = crypto.randomBytes(64).toString('hex');

    try {

        const result = await User.create({
            email: email,
            password: password,
            isAdmin: req.body.isAdmin.value,
            firstname: req.body.firstname,
            status: req.body.status.value,
            token: token,
            technologies: JSON.stringify(req.body.technologies)
        });

        await transporter.sendMail({
            from: "pa.express.esgi@gmail.com",
            to: email,
            subject: "Création de votre compte",
            text: "Bienvenue sur notre nouveau site",
            html: `<h2>Bienvenue sur notre nouveau site. Votre mot de passe est le suivant :` + password + ` N'hésitez pas à le changer dans votre profil.</h2>`
        });

        logger.info(`New user ${email} registered with pseudo: ${firstname}`);

        res.status(201).json(result);
    } catch (error) {
        logger.error(`Register user error: ${error}`);

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
        if (req.body.status === "-1") { // Suppression d'un compte (possibilité de récupérer son compte)
            const result = await User.update(
                {
                    email: "default-" + req.params.id + "@default.com",
                    status: req.body.status
                }, {
                    where: {
                        id: parseInt(req.params.id, 10),
                    },
                    returning: true,
                });

            if (!result) {
                res.sendStatus(404);
            } else {
                res.json(result);
            }

        } else if (req.body.status === "-2") { //Suppression de tous les liens d'amitié mais garder l'email
            const result = await User.update(
                {
                    status: req.body.status
                }, {
                    where: {
                        id: parseInt(req.params.id, 10),
                    },
                    returning: true,
                });

            if (!result) {
                res.sendStatus(404);
            } else {
                res.json(result);
            }
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

router.put("/delete-message/:id", async (req, res) => {
    try {
        const result = await Message.update(
            {
                status: req.body.status
            }, {
                where: {
                    id: parseInt(req.params.id, 10),
                },
                returning: true,
            });

        if (!result) {
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

router.put("/delete-report/:id", async (req, res) => {
    try {
        const result = await Report.update(
            {
                status: req.body.status
            }, {
                where: {
                    id: parseInt(req.params.id, 10),
                },
                returning: true,
            });

        if (!result) {
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

router.get("/manage-messages", async (req, res) => {
    res.send("Hello admin");
});

// Envoyer un message en cas d'avertissement
router.post("/warn-user", async (req, res) => {
    try {
        const result = await Message.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.log(req.body);
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

router.get("/reports", async (req, res) => {
    try {
        const result = await connection.query(
            "SELECT * from Reports;",
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



module.exports = router;
