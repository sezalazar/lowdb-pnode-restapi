const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync'); //Archivo donde se guardaran las peticiones

let db; //variable global porque queremos que db sea accesible desde otras partes.

async function createConnection(){
    const adapter = new FileAsync('db.json'); //db.json asi vamos a llamar al archivo donde se guardaran los datos. En la variable adapter guardamos el objeto que devuelve el new.
    db = await low(adapter);//le paso el objeto o el adapter al lowdb.
    db.defaults({tasks:[]}).write(); // defaults podríamos pensarlo como las tablas que tendriamos en la BD. En mi caso quiero una propiedad 'task' que va a ser un arreglo. Para que se cree le doy el método write().
}

const getConnection = () => {
    return db;
}

module.exports = {
    createConnection,
    getConnection
}