const User = require("../../models/user");
const bcrypt = require("bcrypt");

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
        { role: { $not: { $regex: "admin" } } },
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
        { role: { $not: { $regex: "admin" } } },
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
        { role: { $not: { $regex: "admin" } } },
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
      $and: [
        { role: { $not: { $regex: "admin" } } },
        {
          $or: [
            { nom: req.body.search },
            { postnom: req.body.search },
            { prenom: req.body.search },
          ],
        },
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
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  const id = req.body.id;
  const etudiant = await User.findOne({ _id: id });
  if (etudiant) {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          nom: req.body.nom,
          postnom: req.body.postnom,
          prenom: req.body.prenom,
          username: req.body.username,
          tel: req.body.tel,
          adresse: req.body.adresse,
          mail: req.body.mail,
          password: hashedPass,
        },
      },
      { new: true }
    )
      .then(() => {
        req.flash("success_msg", "Vous avez mis à jour votre compte ");
        res.redirect("/admin/profil");
      })
      .catch((err) => {
        req.flash("error_msg", "Erreur");
        res.status(200).redirect("/admin/profil");
      });
  } else {
    req.flash("error_msg", "Erreur");
    res.redirect("/admin/profil");
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
