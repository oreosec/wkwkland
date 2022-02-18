const router = require("express").Router();
// controller
const {
    addPresence,
    editPresence,
    getPresenceDiscipleByDate,
} = require("../controller/presence.cont");

// middleware
const sessionsValidate = require("../middlewares/sessions-validation.mw");

router.put("/presence/add/:role", addPresence);
router.put("/presence/edit/:role", editPresence);
router.get("/presence/list/:id", getPresenceDiscipleByDate);

module.exports = router;
