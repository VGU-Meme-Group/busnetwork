import { dotProduct } from "./CoordsCheck"
import { findLengthOfVector } from "./CoordsCheck"
import axios from "axios"
const findMainVector = (busCoord) => {
    const scalarCoord = [1.00001 * busCoord[0], busCoord[1]]
    const vector = [(scalarCoord[0] - busCoord[0]), (scalarCoord[1] - busCoord[1])]

    return vector
}

const getEndPointVector = (busCoord, endpoint) => {
    const vector = [(endpoint[0] - busCoord[0]), (endpoint[1] - busCoord[1])]
    return vector
}

const toRadians = (degree) => {
    return degree * Math.PI / 180
}

const toDegrees = (radian) => {
    return radian * 180 / Math.PI
}

const filterSegments = (segment, coord) => {
    return segment.stop_src.stop_lat == coord[0] && segment.stop_src.stop_lon == coord[1]
}

const calculateAngle = (busCoord, endpoint) => {
    // console.log(busCoord)
    // console.log(endpoint)
    const startLat = toRadians(busCoord[0])
    const startLon = toRadians(busCoord[1])
    
    const stopLat = toRadians(endpoint[0])
    const stopLon = toRadians(endpoint[1])

    var y = Math.sin(stopLon - startLon) * Math.cos(stopLat)
    var x = Math.cos(startLat) * Math.sin(stopLat) - Math.sin(startLat) * Math.cos(stopLat) * Math.cos(stopLon - startLon)

    const bearing = toDegrees(Math.atan2(y, x)) 
    
    return (bearing + 360) % 360
}

const postNextSegments = async (payload) => {
    let test = []
    try {
        // console.log("Hallo from Direction Check")
        const request = await axios.post('http://localhost:4242/next-segments', payload)
        .then((res) => {
            test = res.data.map((item) => item)
            return test
        })
    } catch (error) {
        console.log(error)
    }
    return test
}


export const DirectionCheck = async (busPosition, segmentsList, segment, bus) => {
    const busCoord = [
        busPosition.latitude,
        busPosition.longitude
    ]

    const endpoint1 = [
        segment.stop_src.stop_lat,
        segment.stop_src.stop_lon
    ]

    const endpoint2 = [
        segment.stop_dest.stop_lat,
        segment.stop_dest.stop_lon
    ]

    const bearing = busPosition.bearing


    // Find angle of main and first vectors
    const angle1 = calculateAngle(busCoord, endpoint1)
    const angle2 = calculateAngle(busCoord, endpoint2)
    console.log("Angle 1 " + angle1)
    console.log("Angle 2 " + angle2)


    const min1 = Math.abs(angle1 - bearing)
    const min2 = Math.abs(angle2 - bearing)
    const segmentId = parseInt(segment.segmentId)
    const max = 40
    let array = []
    let result = []
    array.push(bus)
    if(min1 < min2){
        console.log("Bus is coming to endpoint 1")

        for(let i = 1; i <= max; i++){
            const id = segmentId - i
            const object = {
                nextId : id.toString()
            }
            const found = segmentsList.find((item) => item.segmentId == object.nextId)
            array.push(found)
        }
        result = await postNextSegments(array)
    }
    else{
        console.log("Bus is coming to endpoint 2")

        for(let i = 1; i <= max; i++){
            const id = segmentId + i
            const object = {
                nextId : id.toString()
            }
            const found = segmentsList.find((item) => item.segmentId == object.nextId)
            array.push(found)
        }
        result = await postNextSegments(array)
    }
    console.log(result)
    console.log(bearing)
    return result
    
    // console.log(busCoord)
    // console.log(busPosition)
}