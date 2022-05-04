const createMongoClient = require('../shared/mongo')
const sharp = require('sharp')
var sizeOf = require('buffer-image-size')
var md5 = require("md5")

async function renderizador(uuid, fileBuffer, fileName, size, nombreSinExtension) {
    
    // redimensionado imagen
    fileresult= await sharp (fileBuffer)
    .resize(size)
    .toBuffer()
    
    // calcular MD5 fichero resultante
    const hash= await md5(fileresult)

    // // renombrar fichero con el MD5 
    // const oldPath = path.join(__dirname, "output/",nombreSinExtension+"/"+size+"/"+fileName)  
    // const newPath = path.join(__dirname, "output",nombreSinExtension,size.toString(),hash + ".jpg")
    
    // fs.renameSync(oldPath, newPath) 
    
    var file= {path: null, name: hash + ".jpg", md5: hash, fileresult:fileresult};

    console.log(file)

    const { db, connection } = await createMongoClient()
    
    const Images = db.collection('images')
    const Tasks = db.collection('tasks')
    var dimensions = sizeOf(fileresult);
    
    var imagen={
        _id: uuid,
        name : file.name, 
        type: "image/jpeg", 
        data: fileresult.length,
        resolutionObjetive: size,
        file: fileresult,
        width:  dimensions.width,
        height:     dimensions.height
    }

    const imageUploaded = await Images.insert(imagen)
    connection.close()

    return {md5: hash }
}

module.exports = renderizador;