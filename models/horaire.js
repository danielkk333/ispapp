const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const horaireSchema = new mongoose.Schema({
  nom_cours: {
    type: String,
  },
  departement: {
    type: String,
  },
  promotion: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
  role: {
    type: String,
  },
});

module.exports = mongoose.model("Horaire", horaireSchema);
