const Cours = require("../../models/course");
const multer = require("multer");

exports.getAllCours = async (req, res) => {
  const cours = await Cours.find().sort({ _id: -1 });
  res.render("admin/cours", { user: req.session.loggedin, cours });
};

exports.saveCours = async (req, res) => {
  const { titre, departement, section, promotion, nom_prof, description } =
    req.body;
  const new_cours = new Cours({
    titre,
    departement,
    section,
    image: req.file.originalname,
    description,
    promotion,
    prof: nom_prof,
  })
    .save()
    .then(() => {
      req.flash("success_msg", "Vous avez enregistré un nouveau cours");
      res.redirect("/admin/cours");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Une erreur");
      res.redirect("/admin/nouveau_cours");
    });
};

exports.updateCours = async (req, res) => {
  const { titre, departement, section, promotion, description, id } = req.body;
  const pic = req.file;
  if (pic) {
    await Cours.updateOne(
      { _id: id },
      {
        $set: {
          titre,
          departement,
          section,
          promotion,
          image: pic.originalname,
          description,
        },
      },
      { new: true }
    )
      .then(() => {
        req.flash("success_msg", "Vous avez mis a jour avec success");
        res.redirect("/admin/cours");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/dashboard");
      });
  } else {
    await Cours.updateOne(
      { _id: id },
      { $set: { titre, departement, section, description, promotion } },
      { new: true }
    )
      .then(() => {
        req.flash("success_msg", "Vous avez mis a jour avec success");
        res.redirect("/admin/cours");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/dashboard");
      });
  }
};

exports.deleteCours = async (req, res) => {
  const id = req.params.id;
  const cours = await Cours.findOne({ _id: id });
  if (cours) {
    await Cours.deleteOne({ _id: cours._id });
    req.flash("success_msg", "Vous avez effacé un cours avec succes");
    res.redirect("/admin/cours");
  } else {
    req.flash("error_msg", "Erreur");
    res.redirect("/admin/cours");
  }
};
