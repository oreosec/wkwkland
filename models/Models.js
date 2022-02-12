const { Schema, model } = require("mongoose");

const PresenceSchema = new Schema({
    date: Date,
    status: {
        type: String,
        enum: ["hadir", "izin", "sakit", "alpha"],
        default: "alpha",
    },
    description: String,
});

const ReportSchema = new Schema({
    cause: String,
    date: Date,
    reporter_id: { type: Schema.Types.ObjectId, ref: "User" },
    reported_id: { type: Schema.Types.ObjectId, ref: "User" },
});

// nggo login
// dadi pas login handle e neng kene
const UserSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "moderator", "mentor"],
    },
    token: String,
    details: Schema.Types.ObjectId,
});

const AdminSchema = new Schema({
    username: String,
    role: { type: String, default: "admin" },
});

const ModeratorSchema = new Schema({
    username: String,
    role: { type: String, default: "moderator" },
    mentors: [{ type: Schema.Types.ObjectId, ref: "Mentor" }],
});

const MentorSchema = new Schema({
    username: String,
    role: { type: String, default: "mentor" },
    presences: [PresenceSchema],
    moderator: { type: Schema.Types.ObjectId, ref: "Moderator" },
    disciples: [{ type: Schema.Types.ObjectId, ref: "Disciple" }],
});

const DiscipleSchema = new Schema({
    username: String,
    kelas: String,
    jenjang: { type: String, enum: ["MA", "SMP"] },
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor" },
    presences: [PresenceSchema],
});

const [User, Admin, Moderator, Mentor, Disciple, Report] = [
    model("User", UserSchema),
    model("Admin", AdminSchema),
    model("Moderator", ModeratorSchema),
    model("Mentor", MentorSchema),
    model("Disciple", DiscipleSchema),
    model("Report", ReportSchema),
];

module.exports = {
    User,
    Admin,
    Moderator,
    Mentor,
    Disciple,
    Report,
};
