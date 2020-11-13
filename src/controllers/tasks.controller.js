const { getConnection } = require('../database');
const {v4} = require('uuid'); //llamamos a la funcion v4 de uuid. es lo que genera automaticamente el id


const getTasks = (req, res) => {
    const tasks = getConnection().get('tasks').value() // quiero que traiga todo lo que tiene el arreglo de tareas
    //res.send('received');
    res.json(tasks);
};

const getTask = (req, res) => {
    //console.log(req.params.id) // se llama .id porque en el tasks.routes.js lo llamamos :id
    const task = getConnection().get('tasks').find({id: req.params.id}).value();
    res.json(task);
};

const createTask = (req, res) => {
    //console.log(req.body);

    // Guardar nueva tarea en la base de datos lowdb - Inicio

    const newTask = {
        id: v4(), //el id sera generado automaticamente por el modulo uuid
        name: req.body.name,
        description: req.body.description
    };

    // console.log(newTask);
    getConnection().get('tasks').push(newTask).write();

    res.send(newTask); // le enviamos al cliente la nueva tarea que estamos guardando
};


const updateTask = async (req, res) => {
    const result = await getConnection().get('tasks').find({id: req.params.id}).assign(req.body).write(); //usamos el await porque el .write es asincrono
    res.json(result);
}

const deleteTask = (req, res) => {
    const result = getConnection().get('tasks').remove({id: req.params.id}).write();
    res.json(result);
}

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
}