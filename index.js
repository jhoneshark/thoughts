const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
require('dotenv').config()

const env = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_SSL: process.env.DB_SSL,
}
module.exports = env;

const app = express();

const conn = require("./db/conn");

// Models
const Tought = require("./models/Tought");

// routes
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");
const ToughController = require("./controllers/ToughtController");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//session middleware
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
)

// flash messages
app.use(flash());

app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {
  // console.log(req.session)
  console.log(req.session.userid);

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughController.showToughts);

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
