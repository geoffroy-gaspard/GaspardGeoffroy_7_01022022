const express = require ('express');
const bodyParser = require('body-parser');

require('dotenv').config({ path: process.cwd() + '/.env' });

const postRoute = require('./routes/post');
const userRoute = require('./routes/user');
const commentRoute = require('./routes/comment');
const imageRoute = require('./routes/image');

const app = express();

//Résolution erreur CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use("/posts", postRoute);
app.use("/users", userRoute);
app.use("/comments", commentRoute);
app.use("/images", imageRoute);

module.exports = app;