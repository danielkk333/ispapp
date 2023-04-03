const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coursSchema = new mongoose.Schema({
  titre: {
    type: String,
  },
  departement: {
    type: String,
  },
  section: {
    type: String,
  },
  promotion: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  prof: {
    type: String,
  },
});

module.exports = mongoose.model("Cours", coursSchema);
