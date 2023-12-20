import { Marker } from "react-leaflet"
import { BusIcon } from "./BusIcon"
import fetchRoute from "../use-cases/fetchRoute"

function LocationMarker({ axios,
    index ,pos, details, route, busCoord, updateSpeed, updateCoordinate, 
    updateClicked, updateVehicle, updateArrived, updateStatus, updatePaths, updateLoading, updatePressed}){
 
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
            // FetchRoute(route, busCoord)
            fetchRoute(axios, route, busCoord, updateArrived, updatePaths, updateStatus, updateLoading)
            updateCoordinate(coord)
            updateSpeed(details.position.speed)
            updateVehicle(details)
            updateClicked(true)
            updatePressed(false)
          }
        }}
        >
        </Marker>

    )
  }


  export default LocationMarker