const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Route =  require('./Route')
const http = require("http")
const { Server } = require("socket.io")
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


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin : "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)
    const busDatabase = client.db("Cluster0");
    const realtimeDB = client.db("gtfs-realtime")
    socket.on("send_message", (data) =>{
        console.log(data)
    })

    socket.on("get-buses", async () => {
        try {
            const routes = realtimeDB.collection('vehicle');
            const query = await routes.find().toArray();
            // console.log("hi")
            // console.log(query)
            socket.emit("receive-all-routes", query)
            // res.json(query)
          } catch (error) {
            console.log(error)
          }
    })

    socket.on("get-route-info", async (data) =>{
        try {
            const routeID  = data.routeId
            // console.log(routeID)
            const collection = busDatabase.collection('routes');
            const routeInfo = await collection.find({routeId : routeID}).toArray();
            // console.log(routeInfo[0].shapes)
            socket.emit("receive-route-info", routeInfo)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("check-shape", async (data) => {
        try {
            // console.log(data)
            const shapes = data.shapes
            const lookup = data.lookup
            let minArray = []
            let min = Infinity
            const collection = busDatabase.collection('shapes')
            
            console.log(shapes.length)
            // for(let i = 0; i < shapes.length; i++){
            //     const query = await collection.find({shapeId : shapes[i].shapeId}).toArray()
            //     Validator(query, lookup, minArray)
            // }
            // const result = retrieveShape(minArray, minimumDistance(minArray, min)).shapeId
            // const first = retrieveShape(minArray, minimumDistance(minArray, min)).first_stop
            // const second = retrieveShape(minArray, minimumDistance(minArray, min)).last_stop
            // console.log(result)
            // const response = {shapeId : result , arrived : arrivedCheck(first, second, lookup)}
            // console.log(response)
            // socket.emit("receive-shape-info", response)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected")
    })
})



async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await mongoose.connect(uri);
      console.log("Connected to MongoDB!");

    } finally {
        // Do not close the client here, it should be kept open while the server is running
    }
}

run().catch(console.dir);

server.listen(5000, () => {
    console.log(`Server is running on port ${5000}`);
});