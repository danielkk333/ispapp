const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    nom: { type: String },
    postnom: { type: String },
    prenom: { type: String },
    role: { type: String, default: "etudiant" },
    username: { type: String },
    password: { type: String },
    mail: { type: String },
    tel: { type: String },
    adresse: { type: String },
    section: { type: String },
    departement: { type: String },
    promotion: { type: String },
    status: { type: String },
    isAdmin: { type: String, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
