const router = require("express").Router();
const User = require("../models/user");
const Com = require("../models/communication");
const Cours = require("../models/course");
const Horaire = require("../models/horaire");

const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");

//get one student profile
router.get("/profil", verifyToken, async (req, res) => {
  const user = req.session.loggedin;
  const com = await Com.find().sort({ _id: -1 }).limit(10);
  const courses = await Cours.find({ promotion: user.promotion })
    .sort({ _id: -1 })
    .limit(10);
  const horaires = await Horaire.find({ promotion: user.promotion })
    .sort({ _id: -1 })
    .limit(10);

  res.render("admin/espace_etudiant", {
    user: req.session.loggedin,
    com,
    courses,
    horaires,
  });
});

//update etudiant profile
router.post("/update_etudiant", verifyToken, async (req, res) => {
  // const salt = await bcrypt.genSalt(10);
  // const hashedPass = await bcrypt.hash(req.body.password, salt);
  const { id, nom, postnom, prenom, username, mail, tel, adresse } = req.body;
  const user = await User.findOne({ _id: id });
  if (user) {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          nom: nom,
          postnom: postnom,
          prenom: prenom,
          username: username,
          mail: mail,
          tel: tel,
          adresse: adresse,
        },
      },
      { new: true }
    )
      .then(() => {
        req.flash(
          "success_msg",
          "Vous avez mis à jour votre compte avec succes"
        );
        res.status(200).redirect("/etudiant/profil");
      })
      .catch((err) => console.log(err));
  } else {
    req.flash("error_msg", "Vous ne pouvez que modifier votre propre compte");
    res.status(401).redirect("/etudiant/profil");
  }
});

router.post("/update_password", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.new_password, salt);
  const { id, new_password, confirmation } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    req.flash("error_msg", "Cet utilisateur n'existe pas");
  } else {
    if (new_password !== confirmation) {
      req.flash("error_msg", "Les deux mots de passe ne sont pas identiques");
      res.status(400).redirect("/etudiant/profil#change-password");
    } else {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            password: hashedPass,
          },
        }
      )
        .then(() => {
          req.flash(
            "success_msg",
            "Vous avez mis à jour votre compte avec succes"
          );
          res.status(200).redirect("/etudiant/profil");
        })
        .catch((err) => console.log(err));
    }
  }
});

module.exports = router;
