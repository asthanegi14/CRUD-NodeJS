require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.Mongodb_Url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (e) => console.log(e));
db.once('open', () => console.log("Connected to the database"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: process.env.Secret_Key,
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('images'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use("", require("./routes/routes"));

app.listen(port, () => {
    console.log(`Server started at port number ${port}`);
});
