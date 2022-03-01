const router = require("express").Router();
// controller
const {
    getModerators,
    getSpecificModerator,
} = require("../controller/v1/moderator.cont");

// middleware
const sessionValidate = require("../middlewares/sessions-validation.mw");

router.get("/moderators", sessionValidate, getModerators);
router.get("/moderators/:moderatorId", sessionValidate, getSpecificModerator);

module.exports = router;
