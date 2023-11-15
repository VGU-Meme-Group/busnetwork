import { useState, useContext } from "react"
import { Marker } from 'react-leaflet'
import { BusIcon } from "./BusIcon"
import { BusContext } from "../context/BusContext"
// import FetchRoute from "../hooks/UseRoute"
import ShapeCheck from "../shape/ShapeCheck"
import FetchSegments from "../hooks/FetchSegments"

async function FetchRoute(lookup, bus){
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
      FetchSegments(id[0].shapeId, bus)
      // FetchSegments(id[0].shapeId, bus)
      // setArrived(id[0].arrived)
  })
  } catch (error) {
  // console.log(error)
  }
}

function LocationMarker({index ,pos, details, route, busCoord}){
    const {setCoordinate, setSpeed, setVehicle, setIsClicked, setArrived} = useContext(BusContext)
    // console.log(route)
    // console.log(speed)
    const coord = [Math.round(details.position.latitude * 10000000) / 10000000, Math.round(details.position.longitude * 10000000) / 10000000]
    return(
      <Marker 
        position={pos}
        // draggable
        autoPan
        icon={BusIcon}
        rotationAngle={details.position.bearing}
        rotationOrigin='top center'
        eventHandlers={{
          click: (e) =>{
            // console.log(route)
            // console.log(details)
            FetchRoute(route, busCoord)
            setCoordinate(coord)
            setSpeed(details.position.speed)
            setVehicle(details)
            setIsClicked(true)
          }
        }}
        >
        </Marker>

    )
  }


export function RenderBuses(props){
    const data = props.data
    const array = []
    if(data.length != 0){
      data.map((bus, index) => {
        const busCoord = { bus_lat: bus.position.latitude, bus_lon: bus.position.longitude}
        const Marker = <LocationMarker key={index} index = {index} details = {bus} route = {bus.trip.route_id} busCoord = {busCoord} pos={[bus.position.latitude, bus.position.longitude]}></LocationMarker>
        array.push(Marker)
      })
      return array
    }
    
  }