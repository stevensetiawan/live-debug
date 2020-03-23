const express = require('express');

const app = express();

const routes = require('./routes/');
const errorHandler = require('./middlewares/error-handler');

app.use(express.urlencoded({ extended: false }));
app.get(express.json());

app.use(errorHandler);
app.use('/', routes);


module.exports = app;
