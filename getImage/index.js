const createMongoClient = require('../shared/mongo')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request for getting a img.');

  const { id } = req.params

  if (!id) {
    context.res = {
      status: 400,
      body: 'Please enter a task Id number!'
    }
    return
  }else{
    const { db, connection } = await createMongoClient()

    const Images = db.collection('images')
  
    try {
      const imageFound= await Images.findOne({ _id: id })
      
      connection.close()

      var body={}
  
      if (imageFound){
        body= imageFound.file.buffer
        context.res = {
            status: 200,
            body: body,
            headers: {
                "Content-Disposition": `attachment; filename=${imageFound.name}`
            }
          }
      }else{
        context.res = {
            status: 204,
          }
      }

      
    } catch (error) {
      context.res = {
        status: 500,
        body: 'Error getting image by Id.'
      }
    }
  }
}