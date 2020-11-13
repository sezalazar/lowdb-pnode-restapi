const app = require('./app');                          // Llamo  a mi servidor
const {createConnection} = require('./database')       // Llamo a mi base de datos

createConnection();                                    // Inicio la base de datos

app.listen(3000);                                      // Inicio el servidor

console.log('Server on port', 3000);