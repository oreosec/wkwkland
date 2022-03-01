const router = require("express").Router();

// controllers
const { login, register, logout } = require("../controller/v1/auth.cont");

// middlewares
const sessionsValidate = require("../middlewares/sessions-validation.mw");
const { handleDynamicModel } = require("../middlewares/role.mw");

// const csrf = require("csurf");
// var csrfProtection = csrf({ cookie: true });

router.get("/csrf", (req, res) => {res.status(201).json({token: req.csrfToken()})});

router.get("/login", sessionsValidate, login);
router.post("/login", login);
router.post("/register", handleDynamicModel, register);

router.get("/logout", logout);

module.exports = router;
