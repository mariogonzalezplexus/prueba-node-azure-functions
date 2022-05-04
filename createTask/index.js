const createMongoClient = require('../shared/mongo');

module.exports = async function (context, req) {
    const tarea= req.body || {}

    if (tarea) {
        context.res = {
          status: 400,
          body: 'task data is required! '
        }
    }

    const { db, connection } = await createMongoClient()

    const Tasks = db.collection('tasks')

    try {
        const tasksCreated = await Tasks.insert(tarea)
        connection.close()
    
        console.log(tasksCreated.insertedIds[0])

        context.res = {
          status: 201,
          body: {"idInserted": tasksCreated.insertedIds}
        }
      } catch (error) {
        context.res = {
          status: 500,
          body: 'Error creating a new Task'
        }
    }
}