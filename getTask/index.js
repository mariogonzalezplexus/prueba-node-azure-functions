const createMongoClient = require('../shared/mongo')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request for getting details of a task.');

  const { id } = req.params

  if (!id) {
    context.res = {
      status: 400,
      body: 'Please enter a task Id number!'
    }
    return
  }else{
    const { db, connection } = await createMongoClient()

    const Tasks = db.collection('tasks')
  
    try {
      const body = await Tasks.findOne({ _id: id })
  
      connection.close()
      context.res = {
        status: 200,
        body
      }
    } catch (error) {
      context.res = {
        status: 500,
        body: 'Error listing task by Id.'
      }
    }
  }
}