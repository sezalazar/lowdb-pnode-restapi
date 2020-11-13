const { Router } = require('express') // Estamos diciendo que vamos a requerir express pero solo la función Router, no todo el módulo.
const router = Router(); // defino router y con "Router()" es que recibo un objeto.

const { getTasks, createTask, getTask, updateTask, deleteTask} = require('../controllers/tasks.controller');

router.get('/tasks', getTasks); //para obtener todas las tareas
router.get('/tasks/:id', getTask); // para obtener una sola tarea
router.post('/tasks', createTask); // para crear tareas
router.put('/tasks/:id', updateTask); // de lo que quiero actualizar
router.delete('/tasks/:id', deleteTask);

module.exports = router;
