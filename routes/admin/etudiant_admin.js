const User = require("../../models/user");

exports.getAllEtudiant = async (req, res) => {
  const etudiants = await User.find({ role: "etudiant" })
    .sort({ _id: -1 })
    .limit(20);
  res.render("admin/etudiant", { user: req.session.loggedin, etudiants });
};

exports.searchEtudiant = async (req, res) => {
  const { section, departement, promotion } = req.body;
  if (section) {
    const etudiants = await User.find({
      $and: [
        {
          $or: [
            { nom: req.body.search },
            { postnom: req.body.search },
            { prenom: req.body.search },
          ],
        },
        { section },
      ],
    });
    if (etudiants.length == 0) {
      req.flash("error_msg", "Aucun resultat");
      res.redirect("/admin/etudiants");
    } else {
      res.render("admin/etudiant", { etudiants });
    }
  } else if (section && departement) {
    const etudiants = await User.find({
      $and: [
        {
          $or: [
            { nom: req.body.search },
            { postnom: req.body.search },
            { prenom: req.body.search },
          ],
        },
        { $or: [{ section, departement, promotion }] },
      ],
    });
    if (etudiants.length == 0) {
      req.flash("error_msg", "Aucun resultat");
      res.redirect("/admin/etudiants");
    } else {
      res.render("admin/etudiant", { etudiants });
    }
  } else if (section && departement && promotion) {
    const etudiants = await User.find({
      $and: [
        {
          $or: [
            { nom: req.body.search },
            { postnom: req.body.search },
            { prenom: req.body.search },
          ],
        },
        { section },
        { departement },
        { promotion },
      ],
    });
    if (etudiants.length == 0) {
      req.flash("error_msg", "Aucun resultat");
      res.redirect("/admin/etudiants");
    } else {
      res.render("admin/etudiant", { etudiants });
    }
  } else {
    const etudiants = await User.find({
      $or: [
        { nom: req.body.search },
        { postnom: req.body.search },
        { prenom: req.body.search },
      ],
    });
    if (etudiants.length == 0) {
      req.flash("error_msg", "Aucun resultat");
      res.redirect("/admin/etudiants");
    } else {
      res.render("admin/etudiant", { etudiants });
    }
  }
};

exports.suspendreEtudiant = async (req, res) => {
  const etudiant = await User.findOne({ _id: req.params.id });
  if (etudiant) {
    await User.updateOne(
      { _id: req.params.id },
      { $set: { status: "off" } },
      { new: true }
    );
    req.flash(
      "success_msg','Vous avez suspendu l'etudiant" + " " + etudiant.nom
    );
    res.redirect("/admin/etudiants");
  }
};

// exports.saveEtudiant = async (req, res) => {
//   const { titre, departement, section, image, description } = req.body;
//   const new_cours = new Cours({
//     titre,
//     departement,
//     section,
//     image,
//     description,
//   })
//     .save()
//     .then(() => {
//       req.flash("success_msg", "Vous avez enregistré un nouveau cours");
//       res.redirect("/admin/cours");
//     })
//     .catch((err) => {
//       console.log(err);
//       req.flash("error_msg", "Une erreur");
//       res.redirect("/admin/nouveau_cours");
//     });
// };

exports.updateEtudiant = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const etudiant = await User.find({ _id: id });
  if (etudiant) {
    await User.updateOne({ _id: id }, { $set: { data } }, { new: true });
    req.flash("success_msg", "Vous avez mis à jour l'etudiant " + etudiant.nom);
    res.redirect("/admin/etudiants");
  } else {
    req.flash("error_msg", "Erreur");
    res.redirect("/admin/editer_etudiant");
  }
};

exports.deleteEtudiant = async (req, res) => {
  const id = req.params.id;
  const cours = await Cours.findOne({ _id: id });
  if (cours) {
    await Cours.deleteOne({ _id: cours._id });
    req.flash("success_msg", "Vous avez effacé un cours avec succes");
    res.redirect("/admin/cours");
  }
};
