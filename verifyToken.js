const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.flash("error_msg", "Veuillez-vous connecter");
    res.redirect("/auth/login");
  }
}

module.exports = verify;
