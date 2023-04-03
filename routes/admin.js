const router = require("express").Router();
const verify = require("../verifyToken");
const multer = require("multer");
const User = require("../models/user");
const Horaire = require("../models/horaire");
const Tache = require("../models/taches");
const Cours = require("../models/course");
const Communication = require("../models/communication");
const bcrypt = require("bcrypt");
const {
  getAllCours,
  saveCours,
  updateCours,
  deleteCours,
} = require("./admin/cours_admin");

const {
  getAllHoraire,
  saveHoraire,
  updateHoraire,
  deleteHoraire,
} = require("./admin/horaire_admin");

const {
  getAllProf,
  saveProf,
  updateProf,
  deleteProf,
} = require("./admin/prof_admin");

const {
  getAllCom,
  saveCom,
  updateCom,
  deleteCom,
} = require("./admin/communication_admin");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const {
  getAllEtudiant,
  suspendreEtudiant,
  searchEtudiant,
  updateEtudiant,
} = require("./admin/etudiant_admin");
//
//
//
//
//

const { updateOne } = require("../models/user");

//render dashboard front page
router.get("/dashboard", verify, async (req, res) => {
  const etudiants = await User.find({ role: "etudiant" })
    .sort({ _id: -1 })
    .limit(10);
  const profs = await User.find({ role: "prof" }).sort({ _id: -1 }).limit(10);
  const countEtudiants = await User.find({ role: "etudiant" }).count();
  const countprofs = await User.find({ role: "prof" }).count();
  const countEtuPasPayer = await User.find({ status: "off" }).count();
  const countEtuEnOrdre = await User.find({ status: "on" }).count();
  const taches = await Tache.find().sort({ _id: -1 }).limit(10);

  res.render("admin/dashboard", {
    user: req.session.loggedin,
    etudiants,
    profs,
    countEtudiants,
    countprofs,
    countEtuPasPayer,
    countEtuEnOrdre,
    taches,
  });
});
//terminer une tache
router.get("/tache_terminer/:id", verify, async (req, res) => {
  const id = req.params.id;
  const tache = await Tache.findOne({ _id: id });
  if (tache) {
    await updateOne({ _id: id }).then(() => {
      req.flash("success_msg", "Vous avez terminé une" + tache.nom);
      res.redirect("/admin/dashbaord");
    });
  } else {
    res.redirect("/admin/dashboard");
  }
});

//ajouter une tache
router.post("/ajouter_tache", (req, res) => {
  const nom = req.body.nom;
  const newtache = new Tache({
    nom: nom,
  })
    .save()
    .then(() => {
      req.flash("success_msg", "Vous avez ajouté une tache avec succes");
      res.redirect("/admin/dashboard");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/dashboard");
    });
});

//render all courses
router.get("/cours", verify, getAllCours);

//render form for new cours
router.get("/nouveau_cours", verify, (req, res) => {
  res.render("admin/form_cours", { user: req.session.loggedin });
});

//render form for update cours
router.get("/editer_cours/:id", async (req, res) => {
  const id = req.params.id;
  const cours = await Cours.findOne({ _id: id });
  if (cours) {
    res.render("admin/editer_cours", { user: req.session.loggedin, cours });
  } else {
    req.flash("error_msg", "Erreur");
    res.redirect("/admin/cours");
  }
});

//save the new course
router.post("/save_cours", verify, upload.single("image"), saveCours);

//update courses
router.post("/update_course", verify, upload.single("image"), updateCours);

//delete course
router.get("/delete_cours/:id", verify, deleteCours);

//etudiants methods

router.get("/etudiants", verify, getAllEtudiant);

//add etudiant
router.get("/nouveau_etudiant", verify, (req, res) => {
  res.render("admin/form_etudiant", { user: req.session.loggedin });
});

//suspendre etudiant
router.get("/suspendre_etudiant/:id", verify, suspendreEtudiant);

//search etudiant
router.post("/search", verify, searchEtudiant);

//get horaire
router.get("/horaire", verify, getAllHoraire);

//horaire form
router.get("/nouveau_horaire", verify, (req, res) => {
  res.render("admin/form_horaire", { user: req.session.loggedin });
});

//save horaire
router.post("/save_horaire", verify, saveHoraire);

//update horaire
router.post("/update_horaire"), updateHoraire;

//delete horaire
router.post("/delete_course/:id", deleteHoraire);

//get prof
router.get("/prof", verify, getAllProf);

//save prof
router.post("/save_prof", verify, saveProf);

//get prof form
router.get("/nouveau_prof", verify, (req, res) => {
  res.render("admin/form_prof", { user: req.session.loggedin });
});

//save prof
router.post("/save_horaire", verify, saveProf);

//update prof
router.post("/update_horaire", updateProf);

//delete prof
router.post("/delete_prof/:id", deleteProf);

//
//
//communication
router.get("/communications", verify, getAllCom);

router.get("/nouvelle_communication", verify, (req, res) => {
  res.render("admin/form_communication", { user: req.session.loggedin });
});

//lire une communication
router.get("/lire/:id", async (req, res) => {
  const com = await Communication.findOne({ _id: id });
  if (com) {
    res.render("admin/lireCom", { user: req.session.loggedin, com });
  } else {
    req.flash("error_msg", "Erreur");
    res.redirect("/admin/communications");
  }
});

//save communication
router.post("/save_communication", verify, saveCom);

//update communication
router.post("/update_communication", verify, updateCom);

//delete communication
router.get("/delete_communication/:id", verify, deleteCom);

router.get("/profil", verify, (req, res) => {
  res.render("admin/profil", { user: req.session.loggedin });
});

module.exports = router;
