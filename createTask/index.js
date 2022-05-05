const createMongoClient = require('../shared/mongo');
const renderizador = require('../services/resizer');
const multipart = require("parse-multipart");
const { v4: uuidv4 } = require('uuid');
var sizeOf = require('buffer-image-size');


module.exports = async function (context, req) {
    // const tarea= req.body || {}

    if (!req.body) {
        context.res = {
          status: 400,
          body: 'an image is required to execute this task! '
        }
        context.done()
    }else{
        
        // estos uuids serviran para identificar tanto la tarea como la imagen guardada en BBDD
        const uuidOriginal=uuidv4()
        const uuid800=uuidv4()
        const uuid1024=uuidv4()
        
        context.res = {
            status: 201,
            body: {   
                      "ImagenGeneradaResolucion800":  uuid800,
                      "ImagenGeneradaResolucion1024": uuid1024
                  }
        }
        context.done()

        var bodyBuffer = Buffer.from(req.body);
        var boundary = multipart.getBoundary(req.headers['content-type']);
        var parts = multipart.Parse(bodyBuffer, boundary);
        
        const { db, connection } = await createMongoClient()
    
        const Images = db.collection('images')
        const Tasks = db.collection('tasks')
        
        var dimensions = sizeOf(parts[0].data);

        // var imgBase64 = parts[0].toString('base64');
    
        var imagen={
                    _id:    uuidOriginal,
                    name :  parts[0].filename, 
                    type:   parts[0].type, 
                    data:   parts[0].data.length,
                    file:   parts[0].data,
                    width:  dimensions.width,
                    height:   dimensions.height
        }
    
        try {
            const imageUploaded = await Images.insert(imagen)
            
            await Tasks.insert({
                _id:        uuid800,
                nombre:     null, 
                status:     "pending",
                createdAt:  new Date().toISOString(),
                lastUpdate: new Date().toISOString(),
                md5:        null
            })
            await Tasks.insert({
                _id:        uuid1024,
                nombre:     null, 
                status:     "pending",
                createdAt:  new Date().toISOString(),
                lastUpdate: new Date().toISOString(),
                md5:        null
            })
            var resultResize800= await renderizador(uuid800, parts[0].data, null, 800, null)
            
            await Tasks.updateOne({"_id":uuid800},{$set:{ status:"finished",
                                                    lastUpdate: new Date().toISOString(),
                                                    md5: resultResize800.md5
                                                }
                                            })

            var resultResize1024= await renderizador(uuid1024, parts[0].data, null, 1024, null)

            await Tasks.updateOne({"_id":uuid1024},{$set:{ status:"finished",
                                                    lastUpdate: new Date().toISOString(),
                                                    md5: resultResize1024.md5
                                                }
                                            })

            connection.close()
        
            console.log(imageUploaded.insertedIds[0])
    
            
        } catch (error) {
            console.log(error)
        }

    }
   
}