const sessionsValidate = (req, res, next) => {
    if (req.session.token) next();
    else res.status(400).json({ message: "Can't resolve sessions" });
};

module.exports = sessionsValidate;
