REST API: No es mas que el envío y recepción de datos en formato json.

How to run:  npm run dev

1) Crear carpeta lowdb-pnode-restapi en el escritorio
2) En una terminal hacer:
        > cd desktop
        > cd lowdb-pnode-restapi
        > code .
3) En Visual Studio Code apretar "Ctrl + shift + p" y escribir terminal:integrate (Crear nueva terminal integrada)
        En esa terminal escribir:
        > npm init -y
        (Ese comando va a crear un archivo package.json que nos va a servir para describir nuestro proyecto o para listar los módulos que va a necesitar para funcionar correctamente).

4) Instalar "express": Framework del servidor que nos va a ayudar a definir las peticiones http que vamos  a poder tener accesibles desde el servidor
Instalar "morgan": Nos va a permitir ver por consola las peticiones que nos van llegando (peticiones que nos van haciendo los usuarios).
Instalar "lowdb": Base de datos que guarda todo en un archivo json. lowdb permite agregar, modificar, eliminar pero no guarda un ID, que aunque nosotros podemos generarlo, también podemos manejarlo con otro paquete llamado uuid.
Instalar "uuid": Permite dar un identificador único a los datos.
        >npm install express morgan lowdb uuid


5) Instalar un módulo más llamado nodemon. Nodemon va a reiniciar por nosotros el servidor cada vez que hagamos un cambio en el mismo.
        >npm install nodemon -D

6) Crear carpeta src y archivos:
            > index.js  -- Archivo que arranque toda la aplicacion.

7) Crear archivos relacionados con el servidor y la base de datos:
            > app.js Archivo para código del servidor.
            > database.js

8) Crear carpetas:
            > routes. Carpeta que contendrá las rutas. Y como las rutas tienen que hacer algo creo la carpeta controllers.
            > controllers. Donde se va a definir las funciones que necesito.

            Crear archivo dentro de la carpeta routes llamado:
            > tasks.routes.js

9) Inicializar servidor:
            En archivo app.js escribir:
                const express = require('express')
                const app = express();

10) Traer los otros módulos instalados adicionalmente (En este caso morgan). Esto se sigue haciendo en el app.js

            > app.use(morgan('dev'))// voy a utilizar morgan y voy a utilizarlo con el comando 'dev'

            /* Con esto ya puedo ver por consola las peticiones que van llegando */


11) Voy a utilizar el metodo json de express:
            >app.use(express.json()); //Este metodo va a servir para recibir en formato json las peticiones que lleguen al servidor.

12) Llamar al archivo tasks.routes.js
            > app.use(require('./routes/tasks.routes'));

13) En el archivo task.routes.js crear un enrutador con express.
            Para eso vamos a decir que vamos a requerir express pero solo la función Router, no todo el módulo.
            > const { Router } = require('express')
            > const router = Router(); // defino router y con "Router()" es que recibo un objeto.
            >
            > module.exports = router; //para exportarlo

14) Arrancar el servidor
            En el archivo index.js escribir:
            > const app = require('./app');
            > app.listen(3000); 
            > console.log('Server on port', 3000); // Estoy diciendo que cuando inicie quiero que muestre el siguiente mensaje por consola: Server on port 3000

15) Para arrancar el servidor por consola vamos a escribir:
            > node src/index.js
16) En la terminal se ve la respuesta del servidor gracias a JSON.
            "GET / 404 2.225 ms - 139"
            Petición: GET
            A donde se hizo la petición: / o ruta Inicial
            El servidor respondió con error: 404
            Tiempo que le tomó en responder: 4,2 milisegundos
            Peso de la respuesta: 139 bytes.

17) Ahora que tenemos el servidor vamos a definir la base de datos.
     Para eso tenemos que crear un archivo JSON que nuestra base de datos (lowDB) lo hará por nosotros.

     > const low = require('lowdb');
     > const FileAsync = require('lowdb/adapters/FileAsync'); //Archivo donde se guardaran las peticiones

     > let db; //variable global porque queremos que db sea accesible desde otras partes.

     > async function createConnection(){
     >   const adapter = new FileAsync('db.json'); //db.json asi vamos a llamar al archivo donde se guardaran los datos. En la variable adapter guardamos el objeto que devuelve el new.
     >   db = await low(adapter);//le paso el objeto o el adapter al lowdb.
     >   db.defaults({tasks:[]}).write(); // defaults podríamos pensarlo como las tablas que tendriamos en la BD. En mi caso quiero una propiedad 'task' que va a ser un arreglo. Para que se cree le doy el método write().
     > }

     > const getConnection = () => {
     >   return db;
     > }

     > module.exports = {
     >   createConnection,
     >   getConnection
     > }

18) En index.js requerimos el metodo createConnection del archivo database.js
    > const {createConnection} = require('./database')
    > createConnection();

19) Usamos nodemon. Vamos a package.json y creamos un script:
    > "dev": "nodemon src/index.js --ignore"

    Cada vez que haya un cambio nodemon lo ejecutará por mi. Pero tenemos que ignorar el archivo db.json para evitar un loop porque al iniciar la app lo crea.

    Ahora para ejecutar la aplicación ejecutamos:
    > npm run dev

20) Defino en tasks.routes.js las rutas a utilizar (luego de la ',' iria la funcion que tendremos dentro de la carpeta controller para tener un poco mas de orden)

    > router.get('/tasks', ); //para obtener todas las tareas
    > router.get('/tasks/:id', ); // para obtener una sola tarea
    > router.post('/tasks', ); // para crear tareas
    > router.put('/tasks/:id', ); // de lo que quiero actualizar
    > router.delete('/tasks/:id', );

21) Dentro del archivo controller (tasks.controller.js) donde voy a crear una funcion getTasks

    > const getTasks = (req, res) => {
    >    res.send('received');
    > };

    > module.exports = {
    >    getTasks
    > }

22) Importar getTasks desde tasks.routes.js

    > const { getTasks} = require('../controllers/tasks.controller');
    
    Modificar la sentencia > router.get('/tasks', );
    >router.get('/tasks', getTasks); //para obtener todas las tareas

    Ahora si visitamos la ruta: http://localhost:3000/tasks
    Obtendremos el mensaje: received

23) En el archivo controller:
        > const { getConnection } = require('../database'); // obtengo el metodo getConnection. Es decir obtengo DB que al estar definido con un let es accesible desde todos lados.

        Reescribimos la funcion tasks
        > const getTasks = (req, res) => {
            > const tasks = getConnection().get('tasks').value() // quiero que traiga todo lo que tiene el arreglo de tareas
            > //res.send('received');
        > res.json(tasks);
        > };
        
        El resultado al visitar la ruta: http://localhost:3000/tasks debería ser un arreglo vacío: []

        Creamos funcion createTask

        > const createTask = (req, res) => {
        >     console.log(req.body);
        >     res.send('received');
        >  }

        Y lo agregamos al export

        > module.exports = {
        >    getTasks,
        >   createTask
        > }

24) Importamos createTask en el task.routes.js

        > const { getTasks, createTask} = require('../controllers/tasks.controller');
        
        Modificamos el router.post a
        > router.post('/tasks', createTask); // para crear tareas

25) Lo anterior va a funcionar cuando llame a la ruta post
        Para probarlo vamos a usar clientes res, por ejemplo el software Postman

        Parametros:
        > Request type: POST 
        > url: http://localhost:3000/tasks

        Headers:
        > Key: Content-type
        > Value: application/json

        Body (elegir raw):
        > {
        > "name": "I have to run".
        > "description": "some description"
        > }

        El postman debería hasta este momento devolver: "received"

26) Guardar las peticiones que llegan en lowdb
    En el archivo tasks.controller.js escribimos
        > const {v4} = require('uuid'); //llamamos a la funcion v4 de uuid. es lo que genera automaticamente el id

    Probamos con console.log(newTask); a ver por consola como se ve la misma peticion que volveremos a enviar con Postman. Observar como uuid genero un id

    > const createTask = (req, res) => {
    > //console.log(req.body);

    > // Guardar nueva tarea en la base de datos lowdb - Inicio

    > const newTask = {
    >     id: v4(), //el id sera generado automaticamente por el modulo uuid
    >     name: req.body.name,
    >     description: req.body.description
    > };

    > console.log(newTask);

    > res.send('received');
    > };


    Ahora vamos a agregar la sentencia getConnection().get('tasks').push(newTask).write(); para guardar en la base de datos:

    > const createTask = (req, res) => {
    > //console.log(req.body);

    > // Guardar nueva tarea en la base de datos lowdb - Inicio

    > const newTask = {
    >    id: v4(), //el id sera generado automaticamente por el modulo uuid
    >    name: req.body.name,
    >    description: req.body.description
    > };

    > // console.log(newTask);
    > getConnection().get('tasks').push(newTask).write();

    > res.send(newTask); // le enviamos al cliente la nueva tarea que estamos guardando
    > };


27) Devolver un objeto de la base de datos lowDB

        Parametros:
        > Request type: GET
        > url: http://localhost:3000/tasks/a4383700-483b-4f1a-9b2f-90650317639c (o el codigo de ID generado)


        En el archivo tasks.controller.js:
        > const getTask = (req, res) => {
        >   //console.log(req.params.id) // se llama .id porque en el tasks.routes.js lo llamamos :id
        >   const task = getConnection().get('tasks').find({id: req.params.id}).value();
        >   res.json(task);
        > };

        Luego exportarlo:

        > module.exports = {
        >   getTasks,
        >   getTask,
        >   createTask
        > };

        Importarlo en el tasks.routes.js y usar el metodo en la siguiente linea

        > const { getTasks, createTask, getTask} = require('../controllers/tasks.controller');

        > router.get('/tasks/:id', getTask); // para obtener una sola tarea

28) Actualizar y eliminar en la base de datos lowDB

    Request Type: put
    URL: http://localhost:3000/tasks/a4383700-483b-4f1a-9b2f-90650317639c
    Tipo Body: raw
    Cuerpo del body
        {
            "name" : "Try Update",
            "description" : "description to be updated"
        }

    Se supone que el id que le mandamos debería tener su contenido reemplazado por el texto de arriba.


    En el controller escribimos la función updateTask y la exportamos en el moduleExports:

    > const updateTask = async (req, res) => {
    >   const result = await getConnection().get('tasks').find({id: req.params.id}).assign(req.body).write(); //usamos el await porque el .write es asincrono
    >   res.json(result);
    > }

    En el routes lo importo y agrego la funcion 

    > router.put('/tasks/:id', updateTask); // de lo que quiero actualizar


29) El eliminar que es como lo mismo que veniamos viendo. La funcion es deleteTask