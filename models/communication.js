const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communicationSchema = new mongoose.Schema({
  titre: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Communication", communicationSchema);