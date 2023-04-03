const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const env = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");
env.config();
const authRoutes = require("./routes/auth");
const pagesRoutes = require("./routes/pages");
const adminRoutes = require("./routes/admin");
const etudiantRoutes = require("./routes/etudiant");
const profRoutes = require("./routes/prof");
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

const app = express();
app.set("view engine", "ejs");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "secret",
    resave: true,
    cookie: { maxAge: 6000000 },
    saveUninitialized: true,
  })
);

//connect flash
app.use(flash());

// Global variables
app.use(async function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//routes
app.use("/auth", authRoutes);
app.use(pagesRoutes);
app.use("/admin", adminRoutes);
app.use("/etudiant", etudiantRoutes);
app.use("/prof", profRoutes);

app.get("/", (req, res) => {
  res.render("index", { user: req.session.loggedin });
});

app.listen(port, () => {
  console.log("the server is running on port " + port);
});
