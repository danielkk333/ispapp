const Horaire = require("../../models/horaire");

exports.getAllHoraire = async (req, res) => {
  const horaire = await Horaire.find();
  res.render("admin/horaire", { user: req.session.loggedin, horaire });
};

exports.saveHoraire = async (req, res) => {
  const { nom_cours, departement, promotion, horaire_role } = req.body;
  const date = new Date(req.body.date).toLocaleDateString();
  const new_cours = new Horaire({
    nom_cours,
    departement,
    promotion,
    date,
    role: horaire_role,
  })
    .save()
    .then(() => {
      req.flash("success_msg", "Vous avez enregistré un nouvel horaire");
      res.redirect("/admin/horaire");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Une erreur");
      res.redirect("/admin/horaire");
    });
};

exports.updateHoraire = async (req, res) => {
  const { nom_cours, departement, promotion, date, id } = req.body;
  await Horaire.findOneAndUpdate(
    { _id: id },
    { $set: { nom_cours, departement, promotion, date } },
    { new: true }
  )
    .then(() => {
      req.flash("success_msg", "Vous avez mis a jour avec success");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/horaire");
    });
};

exports.deleteHoraire = async (req, res) => {
  const id = req.params.id;
  const cours = await Horaire.findOne({ _id: id });
  if (cours) {
    await Horaire.deleteOne({ _id: cours._id });
    req.flash("success_msg", "Vous avez effacé un cours avec succes");
    res.redirect("/admin/cours");
  } else {
    req.flash("error_msg", "Non authorisé");
    res.redirect("/admin/horaire");
  }
};
