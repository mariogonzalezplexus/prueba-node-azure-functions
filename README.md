# Prueba Back Node- Serverless Functions  #
## Arquitectura ##

Se ha optado por el desarrollo de la aplicación con Azure Functions, el servicio serverless de Azure, como base de datos, se ha optado por MongoDB, una de las bases de datos no relacionales mas populares y con mas soporte, para desplegar la aplicacion se hara en local junto a una version dockerizada de mongoDB, para ello sera necesario tener instalado docker y el paquete azure-functions-core-tools en npm.
se ha estructurado la base de datos para tener dos collecciones, la primera para las **tareas** encoladas y su estado, y otra con la información de las **imágenes** de entrada y salida con sus detalles, ademas, en esta coleccion se guardara las imagenes directamente en binario, ya que al basar la arquitectura en azure functions, no se pueden crear directorios permanentes ni acceder a ellos, por lo tanto para acceder a estas imagenes se recomienta el uso de un cliente de base de datos para mongo, como puede ser "Studio 3t", aunque para facilitar la descarga de las imagenes, tambien se ha creado un endpoint adicional que descarga la imagen a traves de su id, con postman o un navegador.


## API ##
se añadira una coleccion de Postman en el repositorio con ejemplos de las siguientes llamadas

---

POST [http://localhost:7071/api/task](URL "http://localhost:7071/api/task") creará una solicitud de procesado de imagen

Este endpoint recibirá una imagen a través de un **form-data en el body** con el nombre **file_upload**

respuesta:
```json

{
    "ImagenGeneradaResolucion800": "ec9850a4-e2bb-4d21-ab70-c45efdd4691d",
    "ImagenGeneradaResolucion1024": "88de7c3e-a487-4ad7-89bf-11668d584ae9"
}
```
---
GET [localhost:7071/api/task/:taskid](URL "localhost:7071/api/task/:taskid") nos devolverá el estado del procesado

respuesta:
```json
{
  "_id": "ec9850a4-e2bb-4d21-ab70-c45efdd4691d",
  "nombre": "01cf08c27f8b59fc2b3765657a01404d.jpg",
  "status": "finished",
  "createdAt": "2022-05-05T08:07:57.375Z",
  "lastUpdate": "2022-05-05T08:07:57.466Z",
  "md5": "01cf08c27f8b59fc2b3765657a01404d"
}
```
---
GET [localhost:7071/api/image/:id](URL "localhost:7071/api/image/:id") nos devolverá la imagen resultado del procesado

---

## Como ejecutar el proyecto ##

### 1 Core de azure-functions ###
Instalar las herramientas del core de azure-functions
```
npm install -g azure-functions-core-tools
```

### 2 Base de datos Mongo ###
Levantar una base de datos Mongo en localhost:27017 con usuario **example-user** y contraseña **example-pass** , se recomienda el uso de Docker por simplicidad.
comando docker:
```
docker run -d -p 27017:27017 --name resizerDB -v mongo-data:/data/db -e MONGODB_INITDB_ROOT_USERNAME=example-user -e MONGODB_INITDB_ROOT_PASSWORD=example-pass mongo:latest
```

### 3 Ejecutar el proyecto ###
Ejecutar el proyecto con 

```
func host start
```
---
/!\ Advertencia!

en caso de obtener un error del tipo:
```
You cannot run this
script on the current system. For more information about running scripts and setting execution policy, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
```
ejecutar el siguiente comando en powershell ejecutado como administrador:
```
Set-ExecutionPolicy Unrestricted
```
---
### 4 Llamadas Postman ###
Ejecutar las llamadas con la coleccion adjunta en el repositorio en ***postman/redimensionar_imagenes_azureFunctions.postman_collection.json***