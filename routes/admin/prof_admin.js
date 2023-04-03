const User = require("../../models/user");
const bcrypt = require("bcrypt");

exports.getAllProf = async (req, res) => {
  const profs = await User.find({ role: "prof" });
  res.render("admin/prof", { user: req.session.loggedin, profs });
};

exports.saveProf = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      nom: req.body.username,
      postnom: req.body.postnom,
      prenom: req.body.prenom,
      username: req.body.username,
      departement: req.body.departement,
      promotion: req.body.promotion,
      section: req.body.section,
      role: "prof",
      mail: req.body.mail,
      password: hashedPass,
    });

    const userdb = await User.findOne({ username: req.body.username });
    if (userdb) {
      req.flash("error_msg", "Ce nom d'utilisateur existe deja");
      res.status(401).redirect("/admin/nouveau_prof");
    } else if (req.body.password !== req.body.confirmer) {
      req.flash("error_msg", "Les deux mots de passe ne sont pas conformes");
      res.redirect("/admin/nouveau_prof");
    } else {
      const user = await newUser.save();
      req.flash("success_msg", "Vous avez enregistré un prof avec succes");
      res.status(200).redirect("/admin/nouveau_prof");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
    // res.send(err);
  }
};

exports.updateProf = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  const { nom, postnom, prenom, username, mail, tel, adresse, id } = req.body;
  await User.updateOne(
    { _id: id },
    { $set: { nom, postnom, prenom, username, mail, password: hashedPass } },
    { new: true }
  )
    .then(() => {
      req.flash("success_msg", "Vous avez mis a jour avec success");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/prof");
    });
};

exports.deleteProf = async (req, res) => {
  const id = req.params.id;
  const cours = await User.findOne({ _id: id });
  if (cours) {
    await Horaire.deleteOne({ _id: cours._id });
    req.flash("success_msg", "Vous avez effacé un cours avec succes");
    res.redirect("/admin/cours");
  } else {
    req.flash("error_msg", "Non authorisé");
    res.redirect("/admin/horaire");
  }
};
