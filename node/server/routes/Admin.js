const { Router } = require("express");
const { User } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const checkIsAdmin = require("../middlewares/checkIsAdmin");

const router = new Router();

router.get("/", async (req, res) => {
    res.send("Hello admin");
});

router.get("/show-user/:id", async (req, res) => {
    res.send(":id");
});

router.get("/edit-user/:id", async (req, res) => {
    res.send("Hello admin");
});

router.get("/check-reports", async (req, res) => {
    res.send("Hello admin");
});

router.get("/create-user", async (req, res) => {
    res.send("Hello admin");
});

//Garder dans la DB mais mettre email à null
router.get("/delete-user/:id", async (req, res) => {
    res.send("Hello admin");
});

router.get("/manage-messages", async (req, res) => {
    res.send("Hello admin");
});

module.exports = router;
