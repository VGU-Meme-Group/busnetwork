const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
// const client = require('./frameworks/database/mongoDB/repositories/connection')
const { DBconnection } = require('./repository/connection');
const { findById } = require('./application/use-cases/route/findById');
const { findByShapeId } = require('./application/use-cases/segment/findById');
const { checkShape } = require('./application/use-cases/checkShape');
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors());

const port = process.env.SERVER_PORT;

async function run() {
    try {
        // DB configuration and creation
        const client = DBconnection().connectToMongo()

        // Routes for each endpoint
        app.get('/getRoute/:routeId', async(req, res) => {
            const routeID  = req.params.routeId
            try {
                const collectionName = 'routes'
                const result = await findById(client, routeID, collectionName)
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
                const result = await checkShape(client, request, lookup, collectionName)
                console.log(result)
                res.json(result)
            } catch (error) {
              console.log(error)
            }
          })

          app.get('/getSegments/:shapeId', async(req, res) => {
            const shapeID  = req.params.shapeId
            try {
                const collectionName = "shapes"
                const result = await findByShapeId(client, shapeID, collectionName)
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


