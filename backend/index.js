const http = require("http")
const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io")
require('dotenv').config()
const app = express();
const { DBconnection } = require('./repository/connection');
const { findAll } = require("./application/use-cases/bus/findAll");


app.use(express.json()); // Parse JSON request bodies
app.use(cors());
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin : "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)
    const client = DBconnection().connectToMongo()
    const realtimeDB = client.db("gtfs-realtime")

    socket.on("send_message", (data) =>{
        console.log(data)
    })

    socket.on("get-buses", async () => {
        try {
            const collectionName = 'vehicle_2'
            const query = await findAll(realtimeDB, collectionName)
            socket.emit("receive-all-routes", query)
          } catch (error) {
            console.log(error)
          }
    })
    
    socket.on("disconnect", () => {
        console.log("a user disconnected")
    })
})

server.listen(5000, () => {
    console.log(`Server is running on port ${5000}`);
});