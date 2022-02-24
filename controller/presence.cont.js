const { Moderator, Mentor, Disciple } = require("../models/Models");
const mongoose = require('mongoose');

module.exports = {
	addPresence: async (req, res) => {
		var db;
		if (req.params.role == "mentor") db = Mentor;
		else if (req.params.role == "disciple") db = Disciple;

		let { id, date, info, description, morning } = req.body;
		if (id && date && info && description && morning) {
			let qFormated = new Date(date).toISOString();
			qFormated = qFormated.split("T")[0];
			var existed;
			db.findOne({_id: id})
			.then(data => {
				existed = Object.values(data.presences).find((obj) => {
					let oFormated = new Date(obj.date).toISOString();
					oFormated = oFormated.split("T")[0];
					return oFormated == qFormated && obj.morning == Boolean(morning);
				})
			})
			.catch(err => {
				res.status(500).json({message: "terjadi kesalahan."});
			})
			if(!existed){
				db.findByIdAndUpdate(id,
					{
						$push: {
							presences: {
								date: date,
								info: info,
								description: description,
								morning: morning,
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
			}else {
				res.status(500).json({message: "absen sudah terisi."});
			}
			
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
						var morningTime = [true, false];
						data.disciples.forEach(value => {
							for(let i=0; i<2; i++){
								result.push({
									id: value._id,
									username: value.username,
									presences: {
										_id: new mongoose.Types.ObjectId(),
										morning: morningTime[i],
										info: "",
										description: "",
										date: date,
									}
								})
							}
							value.presences.forEach(values => {
								qFormated = new Date(date).toISOString()
								oFormated = new Date(values.date).toISOString()
								qFormated = qFormated.split('T')[0]
								oFormated = oFormated.split('T')[0]

								if(qFormated === oFormated){
									result.forEach(rst => {
										if(values.morning == rst.presences.morning) {
											rst.presences = values
										}
									})
								}
							})
							
						})
						
					}res.json(result)
					
				})
		} else res.status(500).json({ message: "form tidak boleh kosong" });
	},
}