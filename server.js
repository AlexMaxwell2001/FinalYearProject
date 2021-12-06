const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("passport");

const cardRouter = require('./routes/cards');
const usersRouter = require('./routes/api/users');
const cardV2Router = require('./routes/cardsv2');
const setsRouter = require('./routes/sets');
const commentsRouter = require('./routes/comments');
const arrangementsRouter = require('./routes/arrangements');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("[DATABASE] MongoDB connection was established successfully");
});

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

app.use('/comments', commentsRouter);
app.use('/cards', cardRouter);
app.use('/api/users', usersRouter);
app.use('/cardsV2', cardV2Router);
app.use('/sets', setsRouter);
app.use('/arrangements', arrangementsRouter);

app.listen(port, () => { 
  console.log(`[SERVER] Listening on port ${port}`) 
});


const path = require('path')
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/public')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'))
})