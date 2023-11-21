import LocationMarker from "./LocationMarker"

function RenderBuses(props){
  const data = props.data
  const array = []
  const updateSpeed = props.updateSpeed
  const updateCoordinate = props.updateCoordinate
  const updateClicked = props.updateClicked
  const updateVehicle = props.updateVehicle
  const updateArrived = props.updateArrived
  const updatePaths = props.updatePaths
  const updateStatus = props.updateStatus
  if(data.length != 0){
    data.map((bus, index) => {
      const busCoord = { bus_lat: bus.position.latitude, bus_lon: bus.position.longitude}
      const Marker = 
        <LocationMarker key={index} index = {index} details = {bus} route = {bus.trip.route_id} busCoord = {busCoord} pos={[bus.position.latitude, bus.position.longitude]} 
          updateSpeed={updateSpeed} updateCoordinate={updateCoordinate} updateClicked={updateClicked} 
          updateVehicle={updateVehicle} updateArrived = {updateArrived}
          updatePaths={updatePaths} updateStatus ={updateStatus}>
        </LocationMarker>
      array.push(Marker)
    })
    return array
  }
}

export default RenderBuses