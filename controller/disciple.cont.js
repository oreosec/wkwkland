const { Mentor, Disciple } = require("../models/Models");

module.exports = {
    createDisciple: async (req, res) => {
        const disciple = await Disciple.create({
            username: req.body.username,
            kelas: req.body.kelas,
            mentor: req.body.mentor,
            jenjang: req.body.jenjang,
        });

        await Mentor.findOneAndUpdate(
            { _id: req.body.mentor },
            {
                $push: {
                    disciples: disciple._id,
                },
            }
        );

        res.status(201).json({
            message: "Successfully create Santri",
            data: await Disciple.findOne({ name: req.body.name }),
        });
    },

    deleteDisciple: async (req, res) => {
        await Disciple.findOneAndRemove({ _id: req.body.disciple });
        await Mentor.findOneAndUpdate(
            { _id: req.body.mentor },
            {
                $pull: {
                    disciples: req.body.disciple,
                },
            }
        );

        res.status(201).json({
            message: "Successfully delete Santri",
        });
    },
};
