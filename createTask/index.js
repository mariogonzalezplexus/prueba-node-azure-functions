const createMongoClient = require('../shared/mongo');
const multipart = require("parse-multipart");


module.exports = async function (context, req) {
    // const tarea= req.body || {}

    if (!req.body) {
        context.res = {
          status: 400,
          body: 'an image is required to execute this task! '
        }
        context.done()
    }else{
        var bodyBuffer = Buffer.from(req.body);
        var boundary = multipart.getBoundary(req.headers['content-type']);
        var parts = multipart.Parse(bodyBuffer, boundary);
        
        const { db, connection } = await createMongoClient()
    
        const Images = db.collection('images')
    
        var imgBase64 = parts[0].toString('base64');
    
        var imagen={
                    name : parts[0].filename, 
                    type: parts[0].type, 
                    data: parts[0].data.length,
                    file: parts[0].data
        }
    
        try {
            const imageUploaded = await Images.insert(imagen)
            connection.close()
        
            console.log(imageUploaded.insertedIds[0])
    
            context.res = {
              status: 201,
              body: {   idInserted: imageUploaded.insertedIds[0],
                        name : parts[0].filename, 
                        type: parts[0].type, 
                        data: parts[0].data.length,
                        file: parts[0].data
                    }
            }
        } catch (error) {
            context.res = {
              status: 500,
              body: 'Error creating a new Task'
            }
        }

    }
   
}