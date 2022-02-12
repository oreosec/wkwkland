const jwt = require("jsonwebtoken");
const config = require("../config");
const { Moderator, Mentor } = require("../models/Models");

module.exports = {
    // this function will create new req object, req.model
    // req.model will handle what model will be used
    handleDynamicModel: (req, res, next) => {
        const { role } = req.body;

        if (!role || role === null) {
            res.status(400).send("Role needed!");
        }

        if (role === "moderator") {
            req.model = Moderator;
        }

        if (role === "mentor") {
            req.model = Mentor;
        }

        next();
    },

    isModerator: (req, res, next) => {
        const { token } = req.session;

        const { role } = jwt.verify(token, config.secret);
        const validRoles = ["moderator", "admin", "superuser"];

        if (validRoles.includes(role)) {
            return next();
        }

        return res.status(403).json({
            message: "You doesn't have any permission",
        });
    },
};
