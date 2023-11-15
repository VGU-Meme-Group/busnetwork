const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Route =  require('./Route')


const { Validator, retrieveShape, minimumDistance, arrivedCheck } = require('./application/use-cases/Validator')


require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');

MONGODB_ATLAS_USER=process.env.MONGODB_ATLAS_USER
MONGODB_ATLAS_PASSWORD=process.env.MONGODB_ATLAS_PASSWORD
MONGODB_ATLAS_CLUSTER_ADDRESS=process.env.MONGODB_ATLAS_CLUSTER_ADDRESS
MONGODB_DATABASE_NAME=process.env.MONGODB_DATABASE_NAME

const uri = `mongodb+srv://${MONGODB_ATLAS_USER}:${MONGODB_ATLAS_PASSWORD}@${MONGODB_ATLAS_CLUSTER_ADDRESS}/${MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Cross Origin Resources between BE and FE
app.use(bodyParser.json({limit : '500kb'}))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});





async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");


    const database = client.db("Cluster0"); // Access your bus_network database
    const realtimeDB = client.db("gtfs-realtime")

    // console.log(route)
    // API Endpoint
    app.get('/getStopCoordinates', async (req, res) => {
      const { stop_id } = req.query;

      try {
        const collection = database.collection('stops');

        // Retrieve data from the collection based on stop_id
        const stopInfo = await collection.findOne({ stop_id });

        if (stopInfo) {
          // If stop_id is found, send the response with the retrieved data
          res.json({
            stop_lat: stopInfo.stop_lat,
            stop_lon: stopInfo.stop_lon
          });
        } else {
          // If stop_id is not found, return a 404 error
          res.status(404).json({ error: 'Stop not found' });
        }
      } catch (error) {
        console.error('Error occurred while querying MongoDB', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.get('/getAllRouteIds', async (req, res) => {
      try {
        const collection = database.collection('routes');
        // Retrieve all route_id values from the collection
        const routeIds = await collection.find({}, { projection: { _id: 0, route_id: 1 } }).toArray();
        
        // Send the route_id values as the API response
        res.json(routeIds);

      } catch (error) {
        console.error('Error occurred while querying MongoDB', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    

    app.get('/getAllStopIds', async (req, res) => {
      const { routeId } = req.query;

      try {
        const collection = database.collection('stops');

        // Retrieve unique stop_id values starting with the format provided in the routeId query parameter
        const stops = await collection.aggregate([
          {
            $match: {
              stop_id: new RegExp(`^${routeId}_\\w+`)
            }
          },
          {
            $group: {
              _id: '$stop_id',
              stop_name: { $first: '$stop_name' },
              stop_lat: { $first: '$stop_lat' },
              stop_lon: { $first: '$stop_lon' }
            }
          }
        ]).toArray();

        // Send the stop_id values as the API response
        res.json(stops);
      } catch (error) {
        console.error('Error occurred while querying MongoDB', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/createRoutes', async(req, res) => {
      try {
        const route  = req.body
        const result = await Route.create({
          shapeId : route.shapeId,
          segments : route.segments
        }) 
        res.json({status : 'success'})
        // console.log(route)
      } catch (error) {
        console.log(error)
      }
    })

    app.post('/createSegments/:shapeId', async(req, res) => {
      try {
        const shapeID  = req.params.shapeId
        const data = req.body
        // console.log(data)
        // const routeInfo = await Route.findOne({'routeId' : routeID})
        // if(routeInfo){
        //   const result = await Route.updateOne({
        //     routeId : route.routeId,
        //     segments : route.segments
        //   }) 
        // }
        // const filter = { routeId : routeID}

        const payload = {
          segmentId : data.__id,
          stop_src : {
            stop_lat : data.stop_src.stop_lat,
            stop_lon : data.stop_src.stop_lon
          },
          stop_dest : {
            stop_lat : data.stop_dest.stop_lat,
            stop_lon : data.stop_dest.stop_lon
          }
        }
        const query = await Route.updateMany(
          { shapeId : shapeID},
          {
            $push : {
              segments : payload
            }
          }
        )
        // const update = {

        // }
        // let doc = await Route.findOneAndUpdate()
        
        res.json({status : 'success'})
      } catch (error) {
        console.log(error)
      }
    })

    app.delete('/deleteSegments', async(req, res) => {
      try {
        const result = await Route.deleteMany()
        res.json({status : 'success'})
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    })

    app.get('/getSegments/:shapeId', async(req, res) => {
      // const collection = database.collection('segments');
      // console.log(collection)
      try {
        const shapeID  = req.params.shapeId
        const collection = database.collection('shapes');
        const routeIds = await collection.find({shapeId : shapeID}).toArray();
        // console.log(routeIds)
        res.json(routeIds);
    
      } catch (error) {
        console.log(error)
      }
    })

    app.get('/getRoute/:routeId', async(req, res) => {
      // const collection = database.collection('segments');
      // console.log(collection)
      try {
        const routeID  = req.params.routeId
        const collection = database.collection('routes');
        const routeIds = await collection.find({routeId : routeID}).toArray();
        // console.log(routeIds)
        res.json(routeIds);
    
      } catch (error) {
        console.log(error)
      }
    })

    app.get('/getRoutes', async(req, res) => {
      try {
        const routes = database.collection('routes');
        const query = await routes.find().toArray();
        // console.log(query)
        res.json(query)
      } catch (error) {
        console.log(error)
      }
    })

    app.post('/checkShape', async(req,res) =>{
      try {
        const request = req.body.shapes
        const lookup = req.body.lookup
        let minArray = []
        let min = Infinity
        // console.log(lookup)
        const collection = database.collection('shapes');
        for(let i = 0; i < request.length; i++){
          const query = await collection.find({shapeId : request[i].shapeId}).toArray()
          Validator(query, lookup, minArray)
        }

        // console.log(retrieveShape(minArray, minimumDistance(minArray, min)))
        const result = retrieveShape(minArray, minimumDistance(minArray, min)).shapeId
        const first = retrieveShape(minArray, minimumDistance(minArray, min)).first_stop
        const second = retrieveShape(minArray, minimumDistance(minArray, min)).last_stop
        // console.log(first)
        // console.log(" ")
        // console.log(arrivedCheck(first, second, lookup))

        res.json({shapeId : result , arrived : arrivedCheck(first, second, lookup)})
      } catch (error) {
        console.log(error)
      }
    })

    app.get("/getBuses", async (req, res) => {
      try {
        const collection = realtimeDB.collection("vehicle")
        const query = await collection.find().toArray()
        res.json(query)
        // console.log(query)
      } catch (error) {
        console.log(error)
      }
    })

  } finally {
    // Do not close the client here, it should be kept open while the server is running
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
