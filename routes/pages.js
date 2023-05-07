const router = require("express").Router();

router.get("/contact", (req, res) => {
  res.render("pages/contact", { user: req.session.loggedin });
});

router.get("/evenements", (req, res) => {
  res.render("pages/evenements", { user: req.session.loggedin });
});

router.get("/inscription", (req, res) => {
  res.render("pages/inscription", { user: req.session.loggedin });
});

router.get("/revues", (req, res) => {
  res.render("pages/revues", { user: req.session.loggedin });
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

module.exports = router;
