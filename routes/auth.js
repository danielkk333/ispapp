const router = require("express").Router();
const User = require("../models/user");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const crypto = require("crypto");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      nom: req.body.username,
      postnom: req.body.postnom,
      prenom: req.body.prenom,
      username: req.body.username,
      section: req.body.section,
      departement: req.body.departement,
      promotion: req.body.promotion,
      role: req.body.role,
      mail: req.body.mail,
      password: hashedPass,
    });

    const userdb = await User.findOne({ username: req.body.username });
    if (userdb) {
      req.flash("error_msg", "Ce nom d'utilisateur existe deja");
      res.status(401).redirect("/auth/register");
    } else {
      const user = await newUser.save();
      res.status(200).redirect("/auth/login");
      // res.send("good register");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
    // res.send(err);
  }
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!user || !validated) {
      req.flash("error_msg", "Nom d'utilisateur ou mot de passe incorrect");
      res.status(400).redirect("/auth/login");
    } else if (user.status == "off") {
      req.flash(
        "error_msg",
        "Vous avez été suspendu par faute de paiement de frais academique"
      );
      res.redirect("/auth/login");
    } else {
      req.session.loggedin = user;
      if (user.role == "etudiant") {
        res.status(200).redirect("/etudiant/profil");
      } else if (user.role == "prof") {
        res.status(200).redirect("/prof/profil");
      } else {
        res.status(200).redirect("/admin/dashboard");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

//reset password
router.get("/recuperation_password", (req, res) => {
  res.render("auth/resetPassword");
});

router.post("/recuperation_password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    let nodeConfig = {
      host: "mail56.lwspanel.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "entreprise@carketingrdc.com", // generated ethereal user
        pass: "2022carketingR$", // generated ethereal password
      },
    };

    let transporter = nodemailer.createTransport(nodeConfig);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Institut superieur Mbanza ngungu",
        link: "https://isp.com/",
      },
    });

    const { mail } = req.body;
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    // body of the email
    var email = {
      body: {
        greeting: "Bonjour",
        signature: "Sincerement",
        name: user.username,
        intro:
          "Nous avons reçu une demande de réinitialisation de votre mot de passe",
        action: {
          instructions: "Veuillez cliquer sur le boutton ci-dessous",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Changer de mot de passe",
            link: `http://isp.herokuapp.com/auth/${user._id}/verifier/${token.token}`,
          },
        },
      },
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
      from: "entreprise@carketingrdc.com",
      to: mail,
      subject: "Reinitialisation mot de passe",
      html: emailBody,
    };

    // send mail
    await transporter
      .sendMail(message)
      .then(() => {
        req.flash(
          "success_msg",
          "Un mail vous a été envoyé pour reinitialisé votre mot de passe"
        );
        return res.status(200).redirect("/auth/recuperation_password");
      })
      .catch((error) => res.status(500).send({ error }));
  } else {
    req.flash(
      "error_msg",
      "Cet email n'est pas enregistré, veuillez créer un compte"
    );
    res.redirect("/auth/register");
  }
});

router.get("/:id/verifier/:token", async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      req.flash("error_msg", "Ce lien est invalide veuillez vous enregistrer");
      res.redirect("/auth/login");
    } else {
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) {
        req.flash("error_msg", "Ce lien est invalide veuillez vous enregistré");
        res.redirect("/auth/register");
      } else {
        const token = await Token.findOne({
          userId: user._id,
          token: req.params.token,
        });
        res.render("auth/newPassword", {
          userId: req.params.id,
          tokenId: token._id,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/nouveau_password", async (req, res) => {
  const { password, confirmation, id, token } = req.body;

  if (password !== confirmation) {
    req.flash("error_msg", "Les deux mot de passe ne sont pas conformes");
    res.redirect(`/auth/${id}/verifier/${token}`);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    await User.updateOne({ _id: id }, { $set: { password: hashedPass } });
    await Token.deleteOne({ _id: token });
    res.redirect("/auth/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});
module.exports = router;
