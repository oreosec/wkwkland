const router = require("express").Router();

const {
    createDisciple,
    deleteDisciple,
} = require("../controller/v1/disciple.cont");

const sessionsValidate = require("../middlewares/sessions-validation.mw");

router.post("/disciple", sessionsValidate, createDisciple);

router.delete("/disciple", sessionsValidate, deleteDisciple);

module.exports = router;
