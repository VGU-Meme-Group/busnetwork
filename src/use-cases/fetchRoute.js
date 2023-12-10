import ShapeCheck from "../functions/ShapeCheck"
// import axios from "axios"
import fetchSegments from "./fetchSegment"
async function fetchRoute(axios, lookup, bus, updateArrived, updatePaths, updateStatus, updateLoading){
    try {
      updateLoading(true)
      const coord = [Math.round(bus.bus_lat * 10000000) / 10000000, Math.round(bus.bus_lon * 10000000) / 10000000]
      if(lookup === "55-55B/C"){
        lookup = "55-55B-55C"
      }
      else if(lookup === "19-19A/B"){
        lookup = "19-19A-19B"
      }
      else if(lookup === "66"){
        return
      }
      else if(lookup === "67"){
        return
      }
      const request = await axios.get(`http://localhost:3812/getRoute/${lookup}`)
      .then(async (res) => {
        const result = await ShapeCheck(res.data[0], coord)
        fetchSegments(axios, result[0].shapeId, updatePaths, updateStatus)
        updateArrived(result[0].arrived)
        updateLoading(false)
      })
    } catch (error) {
      // console.log(error)
    }
  }

export default fetchRoute