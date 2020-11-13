// Archivo para definir el servidor. Se va a exportar (con module.exports) para que otro archivo pueda arrancarlo.
const express = require('express');
const morgan = require('morgan');

const app = express();

//middlewares

app.use(morgan('dev'))// voy a utilizar morgan y voy a utilizarlo con el comando 'dev'
app.use(express.json());


//routes
// Se van a definir aca las rutas
app.use(require('./routes/tasks.routes'));

module.exports = app;