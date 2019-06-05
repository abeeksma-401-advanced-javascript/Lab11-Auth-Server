'use strict';

require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
};


mongoose.connect('mongodb://localhost/lab11', options)
  .then(() => {

    require('./src/app.js').start(3000);
  });

