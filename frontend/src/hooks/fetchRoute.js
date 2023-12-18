import ShapeCheck from "../shape/ShapeCheck"
import axios from "axios"
import fetchSegments from "./fetchSegment"
async function fetchRoute(lookup, bus, updateArrived, updatePaths, updateStatus){
    try {
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
        const id = await ShapeCheck(res.data[0], coord)
        fetchSegments(id[0].shapeId, updatePaths, updateStatus)
        updateArrived(id[0].arrived)
      })
    } catch (error) {
      // console.log(error)
    }
  }

export default fetchRoute