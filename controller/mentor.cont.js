const { Moderator, Mentor } = require("../models/Models");

module.exports = {
    getMentors: async (req, res) => {
        const { expand } = req.query;

        let M = Mentor.find({});

        if (expand) {
            M = M.populate("disciples");
        }

        M.find({})
            .then((data) => {
                res.status(200).json({
                    message: "Successfully fetch data",
                    data,
                });
            })
            .catch((err) => {
                res.status(404).json({
                    message: "Can't find any valid data",
                    data: err,
                });
            });
    },

    getSpecificMentor: (req, res) => {
        const { expand, populate } = req.query || false;

        let M = Mentor.findOne({ _id: req.params.mentorId });

        if (expand) {
            M = M.populate("disciples");
        }

        M.then((data) => {
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

    bindMentorAndModerator: async (req, res) => {
        const { mentor, moderator } = req.body;

        const Me = await Mentor.findOne({ _id: mentor });

        const Mo = await Moderator.findOne({ _id: moderator });

        console.log(`
            MentorID: ${mentor}, 
            Mentor-Model: ${Me},

            ModeratorID: ${moderator},
            Moderator-Model: ${Mo}
            
            `);

        if (Me.moderator) {
            await Moderator.findOneAndUpdate(
                { _id: Me.moderator },
                {
                    $pull: {
                        mentors: Me._id,
                    },
                }
            );
        }

        if (!Mo.mentors.includes(mentor)) {
            await Mentor.updateOne({ _id: mentor }, { moderator: Mo._id });

            await Moderator.updateOne(
                { _id: moderator },
                {
                    $push: {
                        mentors: Me._id,
                    },
                }
            );

            res.status(201).json({
                message: "Successfully binding Pengampu and Koordinator",
            });
        } else {
            res.status(409).json({
                message: "This user has already been bound.",
            });
        }
    },

    // Patch
    patchMentorDisciples: async(req, res) => {
        const {id} = req.params;

        Mentor.findOneAndUpdate({_id: id}, {})
        res.json({message: id})
    }
};
