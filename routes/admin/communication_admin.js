const Communication = require("../../models/communication");

exports.getAllCom = async (req, res) => {
  const com = await Communication.find().sort({ _id: -1 });
  res.render("admin/communication", { user: req.session.loggedin, com });
};

exports.saveCom = async (req, res) => {
  const { titre, description } = req.body;
  const new_cours = new Communication({
    titre,
    date: new Date().toLocaleDateString("en-US"),
    description,
  })
    .save()
    .then(() => {
      req.flash("success_msg", "Vous avez enregistré un nouveau communiqué");
      res.redirect("/admin/communications");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Une erreur");
      res.redirect("/admin/communications");
    });
};

exports.updateCom = async (req, res) => {
  const { titre, description, id } = req.body;
  await Horaire.findOneAndUpdate(
    { _id: id },
    { $set: { titre, description } },
    { new: true }
  )
    .then(() => {
      req.flash("success_msg", "Vous avez mis a jour avec success");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/communications");
    });
};

exports.deleteCom = async (req, res) => {
  const id = req.params.id;
  const com = await Communication.findOne({ _id: id });
  if (com) {
    await Communication.deleteOne({ _id: com._id });
    req.flash("success_msg", "Vous avez effacé une communication avec succes");
    res.redirect("/admin/communications");
  } else {
    req.flash("error_msg", "Non authorisé");
    res.redirect("/admin/communications");
  }
};
