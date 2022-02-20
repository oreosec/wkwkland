const { Moderator, Mentor, Disciple } = require("../models/Models");

module.exports = {
	addPresence: async (req, res) => {
		var db;
		if (req.params.role == "mentor") db = Mentor;
		else if (req.params.role == "disciple") db = Disciple;


		let { id, date, info, description } = req.body;
		if (id && date && info && description) {
			db.findByIdAndUpdate(id,
				{
					$push: {
						presences: {
							date: date,
							info: info,
							description: description
						}
					}
				}, (err, docs) => {
					if (err) res.status(500).json({ message: "terjadi masalah." });
					if (docs)
						res.status(201).json({
							message: "absensi berhasil.",
							data: docs
						});
				}
			)
		}
		else res.status(500).json({ message: "form tidak boleh kosong." });
	},

	editPresence: async (req, res) => {
		var db;
		if (req.params.role == "mentor") db = Mentor;
		else if (req.params.role == "disciple") db = Disciple;

		console.log(req.params.role);
		let { id, date, info } = req.body;
		if (id && date && info) {
			db.findOne({ _id: id })
				.then((data) => {
					// search by index by date
					const absenIndex = data.presences.map((value, index) => {
						let qFormated = new Date(date).toISOString();
						let oFormated = new Date(value.date).toISOString();
						qFormated = qFormated.split("T")[0];
						oFormated = oFormated.split("T")[0];
						if (qFormated == oFormated) {
							return index
						}
					})[0]

					console.log(absenIndex)

					data.presences[absenIndex].info = info;
					if (req.body.description != undefined) data.presences[absenIndex].description = req.body.description;
					data.save()
					res.status(201).json({ message: "absensi berhasil dirubah." });
				})
		}
		else res.status(500).json({ message: "form tidak boleh kosong." });
	},

	getPresenceDiscipleByDate: async (req, res) => {
		let { id } = req.params;
		let { date } = req.query;

		if (id && date) {
			await Mentor.findById(id)
				.populate('disciples')
				.exec((err, data) => {
					if (err) res.status(500).json({ message: "terjadi masalah." });
					if (data) {
						var result = [];
						data.disciples.forEach((value, index) => {
							value.presences.forEach((values, indexs) => {
								let qFormated = new Date(date).toISOString();
								let oFormated = new Date(values.date).toISOString();
								qFormated = qFormated.split("T")[0];
								oFormated = oFormated.split("T")[0];
								if (oFormated === qFormated) {
									result.push({
										id: value.id,
										username: value.username,
										presences: values
									});
								}
							});
						});
						res.status(201).json({ message: result });
					}
				})

		} else res.status(500).json({ message: "form tidak boleh kosong" });
	},
}