const router = require("express").Router();

const {
    createDisciple,
    deleteDisciple,
} = require("../controller/disciple.cont");

router.post("/disciple", createDisciple);

router.delete("/disciple", deleteDisciple);

module.exports = router;
