const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { Worker } = require("worker_threads")
const cluster = require('cluster')
const os = require('os')
// const client = require('./frameworks/database/mongoDB/repositories/connection')
const { DBconnection } = require('./repository/connection');
const { findById } = require('./application/use-cases/route/findById');
const { findByShapeId } = require('./application/use-cases/segment/findById');
const { Validator, retrieveShape, minimumDistance } = require('./application/use-cases/Validator')
const checkShape = require('./application/use-cases/checkShape');
const sliceIntoChunks = require('./application/use-cases/splitChunks');
const splitIntoChunk = require('./application/use-cases/splitChunks');
require('dotenv').config()

const app = express()
const numCpu = os.cpus().length

app.use(bodyParser.json())
app.use(cors());

const port = process.env.SERVER_PORT;
const THREAD_COUNT = 2

function createWorker(shapes, lookup, minArray){
  return new Promise((resolve, reject) => {
    const worker = new Worker('../backend/application/use-cases/Worker.js', {
      workerData : {
        thread_count : THREAD_COUNT,
        shapes : shapes,
        lookup : lookup,
        minArray : minArray
      }
    })

    worker.on("message", (data) => {
      resolve(data)
    })

    worker.on("error", (error) => {
      reject(error)
    })
  })
}

function createMultiThreads(shapes, array){
  return new Promise((resolve, reject) => {
    const worker = new Worker('../backend/application/use-cases/Multithreads.js', {
      workerData : {
        thread_count : THREAD_COUNT,
        shapeID : shapes,
        result : array
      }
    })

    worker.on("message", (data) => {
      resolve(data)
    })

    worker.on("error", (error) => {
      reject(error)
    })
  })
}


async function run() {
    try {
        // DB configuration and creation
        const client = DBconnection().connectToMongo()

        // Routes for each endpoint
        app.get('/getRoute/:routeId', async(req, res) => {
            const routeID  = req.params.routeId
            try {
                const collectionName = 'routes'
                const database = client.db("Cluster0")
                const result = await findById(database, routeID, collectionName)
                res.json(result);
          
            } catch (error) {
              console.log(error)
            }
        })

        app.post('/checkShape', async(req,res) =>{
            try {
                const request = req.body.shapes
                const lookup = req.body.lookup
                const collectionName = "shapes"
                const database = client.db("Cluster0")
                const collection = database.collection(collectionName);
                console.time('time')
                const result = await checkShape(database, request, lookup, collectionName, collection)
                console.timeEnd("time")
                console.log(result)
                res.json(result)
            } catch (error) {
              console.log(error)
            }
          })

        // app.post('/next-segments', async(req, res) => {
        //   try {
        //     const segments = req.body
        //     console.log("Hello")
        //     console.log(segments)

        //     res.json({status: 'Segments sent'})
        //   } catch (error) {
        //     console.log(error)
        //   }
        // })

        app.post('/checkShapeWorker', async(req,res) =>{
            const workerPromises = []
            try {
                const request = req.body.shapes
                // console.log(request)
                const lookup = req.body.lookup
                const collectionName = "shapes"
                const database = client.db("Cluster0")
                const collection = database.collection(collectionName);

                // const promise = await Promise.all([createWorker(request, lookup, collection)])
                // const result = await checkShape(database, request, lookup, collectionName, collection)
                
                // console.log(promise)
                // console.log(result)

                let minArray = []
                let min = Infinity

                const allShapes = []
                const workerPromises = []
 
                console.log('Old')
                console.time('time')
                for(let i = 0; i < request.length; i++){
                  
                  const query = await collection.find({shapeId : request[i].shapeId}).toArray()
                  allShapes.push(query)
                  
                  // allShapes.push(query)
                }
                console.timeEnd("time")

                const allShapesTest = []
                console.log("New")
                console.time('time')
                for(let i = 0; i < request.length; i++){
                  const miniArray = []
                  
                  const query = collection.find({shapeId : request[i].shapeId})
                  while(await query.hasNext()){
                    const doc = await query.next()
                    miniArray.push(doc)
                  }
                  allShapesTest.push(miniArray)
                  // allShapesTest.push(query)

                  
                  // allShapes.push(query)
                }
                // console.log(allShapesTest)
                console.timeEnd("time")
                // console.time('time')
                let chunkSize;
                if(allShapes.length === 2){
                  chunkSize = 1
                  const result = splitIntoChunk(allShapes, chunkSize)
                  // console.log(result[1])
                  
                  for(let i = 0; i < THREAD_COUNT; i++){
                    // console.log(result[i][0])
                    workerPromises.push(createWorker(result[i][0], lookup, minArray))
                  }
                  // console.log(result[0][0])
                }
                else if(allShapes.length === 3){
                  chunkSize = 2
                  const result = splitIntoChunk(allShapes, chunkSize)
                  // console.log(result)
                }
                else if(allShapes.length === 4){
                  chunkSize = 1
                  console.log(chunkSize)
                }
                else if(allShapes.length > 4){
                  chunkSize = 2
                  console.log(chunkSize)
                }



                const thread_results = await Promise.all(workerPromises)
                // console.timeEnd("time")
                // console.log(thread_results)
                // const mainArray = []
                // mainArray.push(thread_results)
                // const mainArray = thread_results.map((results, index) => {
                //   return results
                // })

                for(let item of thread_results){
                  if(item[0].distance < min){
                      min = item[0].distance
                  }
                }

                const shapeID = retrieveShape(thread_results, min).shapeId
                // const first = retrieveShape(mainArray, minimumDistance(mainArray, min)).first_stop
                // const second = retrieveShape(minArray, minimumDistance(minArray, min)).last_stop

                // console.log(shapeID)
                // console.log(thread_results)
                // console.log(minResult)
                
                res.json({shapeId : shapeID , arrived : 0})
                // res.json(result)
            } catch (error) {
              console.log(error)
            }
          })

          app.get('/getSegments/:shapeId', async(req, res) => {
            const shapeID  = req.params.shapeId
            try {
                const collectionName = "shapes"
                const database = client.db("Cluster0")
                const result = await findByShapeId(database, shapeID, collectionName)
                
                // const segments = result[0].segments
                // const stopsCollection = "stops"
                // const collection = database.collection(stopsCollection)

                // for(let i = 0; i < segments.length; i++){
                //   const query = await collection.find({
                //     "stop_lat" : segments[0]stop_src.stop_lat,
                //     "stop_lon" : segments[0]stop_src.stop_lon
                //   })
                // }
                // const query = await collection.find({
                //   "stop_lat" : segments[0].stop_src.stop_lat
                // }).toArray()
                // const test = await collection.find().toArray()
                // console.log(segments[0].stop_src.stop_lon)
                // console.log(shapes)
                res.json(result);
            } catch (error) {
              console.log(error)
            }
          })
    }
    finally {
    // Do not close the client here, it should be kept open while the server is running
    }
    
}

run().catch(console.dir);

if(cluster.isMaster) {
  for(let i = 0; i < numCpu / 2; i++){
    cluster.fork()
  }
}
else{
  app.listen(port, () => {
      console.log(`Server ${process.pid} is running on port ${port}`);
  });
}




