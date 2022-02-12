const router = require("express").Router();
// controller
const {
    getMentors,
    getSpecificMentor,
    bindMentorAndModerator,
    patchMentorDisciples,
} = require("../controller/mentor.cont");

// middleware
const sessionsValidate = require("../middlewares/sessions-validation.mw");

// only moderator and above who can get mentors information

// this accepts query { expand: Boolean}
// /mentors?expand=false
router.get("/mentors", sessionsValidate, getMentors);
// /mentors/briyan?expand=false
router.get("/mentors/:mentorId", sessionsValidate, getSpecificMentor);

router.patch("/ref/mentors", sessionsValidate, bindMentorAndModerator);
router.patch("/mentor/:id", patchMentorDisciples)

module.exports = router;
