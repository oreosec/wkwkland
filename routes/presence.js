const router = require("express").Router();
// controller
const {
    addPresence,
    editPresence,
    getPresenceDiscipleByDate,
} = require("../controller/presence.cont");

// middleware
const sessionsValidate = require("../middlewares/sessions-validation.mw");

router.put("/presence/add/:role", sessionsValidate, addPresence);
router.put("/presence/edit/:role", sessionsValidate, editPresence);
router.get("/presence/list/:id", sessionsValidate, getPresenceDiscipleByDate);

module.exports = router;
