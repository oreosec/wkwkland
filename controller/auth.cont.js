const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config");

// models
const { User } = require("../models/Models");

const salt = 10;

module.exports = {
    register: async (req, res) => {
        const { model: Model } = req;

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const M = await Model.create({ username: req.body.username });

        await User.create({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role,
            details: M._id,
        });

        res.status(201).json({
            message: "Successfully create an account",
            data: await User.findOne({
                username: req.body.username,
                role: req.body.role,
            }),
        });
    },

    login: async (req, res) => {
        if (req.method === "GET") {
            return res.status(200).send(req.session.token);
        }

        const { username, password } = req.body;

        const currentUser = await User.findOne({ username });

        if (!currentUser || currentUser === {}) {
            res.status(401).json({ message: "invalid credentials." });
        } else {
            const passwordIsValid = await bcrypt.compare(
                password,
                currentUser.password
            );

            if (!passwordIsValid)
                res.status(401).json({
                    auth: false,
                    token: null,
                    message: "invalid credentials",
                });
            else {
                const token = jwt.sign(
                    {
                        auth: true,
                        id: currentUser.details,
                        username: currentUser.username,
                        role: currentUser.role,
                    },
                    config.secret
                );
                req.session.token = token;

                res.status(200).json({ token });
            }
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ err });
            } else {
                res.status(200).json({ message: "js is suck" });
            }
        });
    },
};
