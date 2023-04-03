const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tachesSchema = new mongoose.Schema({
  nom: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "off",
  },
});

module.exports = mongoose.model("Taches", tachesSchema);
