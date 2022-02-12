const { Moderator } = require("../models/Models");

module.exports = {
    getModerators: (req, res) => {
        const { expand } = req.query || false;

        let Model = Moderator.find({});

        if (expand) {
            Model = Model.populate("mentors");
        }

        Model.then((data) => {
            res.status(200).json({
                message: "Successfully fetch data",
                data,
            });
        }).catch((err) => {
            res.status(404).json({
                message: "Can't find any valid data",
                data: err,
            });
        });
    },

    getSpecificModerator: (req, res) => {
        const { expand } = req.query || false;

        let Model = Moderator.findOne({ _id: req.params.moderatorId });

        if (expand) {
            Model = Model.populate("mentors");
        }

        Model.then((data) => {
            res.status(200).json({
                message: "Successfully fetch data",
                data,
            });
        }).catch((err) => {
            res.status(404).json({
                message: "Can't find any valid data",
                data: err,
            });
        });
    },
};
