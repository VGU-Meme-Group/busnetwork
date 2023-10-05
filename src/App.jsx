import { useState, useEffect } from 'react'
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './App.scss'
import data from '../src/assets/sample.json'
import RoutingMachine from './RoutingMachine';
import { GetSegments } from './RoutingMachine';

function App(props) {
  const position = [21.048408, 105.8783349]
  const [stops, setStops] = useState([])
  const [paths, setPaths] = useState([]) 
  const [loc, setLoc] = useState([])
  const temp1 = []

  const [loading, setLoading] = useState(true)



  useEffect(() => {
    setStops(Object.entries(data))
    
    setPaths(Object.assign(paths, GetSegments().options.instructions))
    console.log(paths) 
  }, [])

  
  function LocationMarker({pos, onMove, id, name}){
    return(
      <Marker 
        position={pos}
        // draggable
        autoPan
        // eventHandlers={{
        //   moveend: (e) =>{
        //     onMove([e.target.getLatLng().lat, e.target.getLatLng().lng])
        //     console.log(loc)
        //   }
        // }}
        >
          <Popup>{"Bus Stop : " + name + "\n with coords" + "[" + pos[0] + "," + pos[1] +"]"}</Popup>
        </Marker>

    )
  }

  return (
    <div className='page-wrapper'>
      <div className='top-container'>
        <h1>Public Bus Applications</h1>
      </div>
      <div className='map-container'>
        <MapContainer className='map-wrapper' center={position} zoomSnap={0.5} zoom={15}>
          <TileLayer attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}" ext = {'png'}
                    ></TileLayer>
          {
            stops.map((stop, index) => {
              if(index > 36){
                return
              } 
              else{
                return(
                  <LocationMarker pos={[stop[1].stop_lat, stop[1].stop_lon]} name = {[stop[1].stop_name]} id={[stop[1].__id]} key={index}/>
                )
              }
            }) 

            
          }
          <RoutingMachine></RoutingMachine>
        </MapContainer>
      </div>
      <div className='segments-container'>
          {
            
          }
      </div>
    </div>
  )
}

export default App
