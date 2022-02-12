require("dotenv").config();

const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// const corsOptions = {
//     origin: "http://localhost:3000",
//     credentials: true,
// };

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.set("trust proxy", 1);

mongoose.connect(
    process.env.DB_URI || "mongodb://127.0.0.1:27017/tahfidz",
    () => console.log("Connected to MongoDB")
);

const store = new MongoStore({
    mongoUrl: process.env.DB_URI || "mongodb://127.0.0.1:27017/tahfidz",
    collectionName: "sessions",
});

app.use(
    session({
        name: "sid",
        secret: process.env.KEY || "topsecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: true,
            // secure: true,
        },
        store: store,
    })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* custom middleware */
app.use(helmet());
app.use(mongoSanitize());

// routes
const authRouter = require("./routes/auth");
const moderatorRouter = require("./routes/moderator");
const mentorRouter = require("./routes/mentor");
const discipleRouter = require("./routes/disciple");
const base = "/api/v1";

app.use(base, authRouter);
app.use(base, moderatorRouter);
app.use(base, mentorRouter);
app.use(base, discipleRouter);

module.exports = app;
