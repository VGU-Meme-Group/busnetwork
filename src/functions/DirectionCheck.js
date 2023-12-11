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
    console.log(busCoord)
    console.log(endpoint)
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
    try {
        const request = await axios.post('http://localhost:3812/next-segments', payload)
        .then((res) => console.log(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const DirectionCheck = (busPosition, segmentsList, segment, bus) => {
    console.log(bus)
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

    const min1 = Math.abs(angle1 - bearing)
    const min2 = Math.abs(angle2 - bearing)
    const segmentId = parseInt(segment.segmentId)
    const max = 5
    let array = []
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
        postNextSegments(array)
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
        postNextSegments(array)
    }
    console.log(array)
    return array
    // console.log(bearing)
    // console.log(busCoord)
    // console.log(busPosition)
}