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
router.post("/presence/list/", getPresenceDiscipleByDate);

module.exports = router;
