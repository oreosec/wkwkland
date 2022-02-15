const { Moderator, Mentor, Disciple } = require("../models/Models");

module.exports = {
	addPresence: async (req, res) => {
		var db;
		if(req.params.role == "mentor") db = Mentor;
		else if(req.params.role == "disciple") db = Disciple;

		console.log(req.params.role);
		let { id, date, info, description } = req.body;
		if (id && date && info && description){
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
					if(err) res.status(500).json({message: "terjadi masalah."});
					if(docs)
						res.status(201).json({
							message: "absensi berhasil.",
							data: docs
						});
				}
			)
		}
		else res.status(500).json({message: "form tidak boleh kosong."});
	},

	editPresence: async (req, res) => {
		var db;
		if(req.params.role == "mentor") db = Mentor;
		else if(req.params.role == "disciple") db = Disciple;

		console.log(req.params.role);
		let { id, date, info } = req.body;
		if (id && date && info){
			db.findOne({_id: id})
			.then((data) => {
				// search by index by date
				const absenIndex = data.presences.map((value, index) => {
					// date e ijek error wae
					if(value.date == date) {
						return index
					}
				})[0]
				
				console.log(absenIndex)

				data.presences[absenIndex].info = info;
				if(req.body.description != undefined) data.presences[absenIndex].description = req.body.description;
				data.save()
				res.status(201).json({message: "absensi berhasil dirubah."});
			})
		}
		else res.status(500).json({message: "form tidak boleh kosong."});
	},

	getPresenceDiscipleByDate: async (req, res) => {
		let { id, date } = req.body;
		
		// tanggale error wae raiso podo mboh nek ng fe pyw
		if(id && date) {
			await Mentor.findById(id)
			.populate('disciples')
			.exec((err, data) => {
				if(err) res.status(500).json({message: "terjadi masalah."});
				if(data) {
					var result = []
					data.disciples.forEach((value, index) => {
						value.presences.forEach((values, indexs) => {
							console.log(values.date);
							console.log(values.date.toString());
							if(values.date == date){
								result.push(value);
							}
						});
					});
					res.status(201).json({message: result});
				}
			})
			
		}else res.status(500).json({message: "form tidak boleh kosong"});
	},


}