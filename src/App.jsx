// Libraries
import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet-rotatedmarker'
import io from 'socket.io-client'

// CSS
import './App.scss'
import "leaflet/dist/leaflet.css";

// External functions
import { colorCheck } from './shape/CoordsCheck';
import CoordsCheck from './shape/CoordsCheck';
import busPic from './assets/images/cleveBus.jpg'
import { useBuses } from './hooks/useBuses';
import { Fly } from './functions/Fly';
import ArrivalCheck from './functions/ArrivalCheck';
import RenderBuses from './components/RenderBuses';
import BusDetails from './components/BusDetails';


// Socket connection
const socket = io.connect("http://localhost:5000")


function App() {
  const mapRef = useRef(null)
  const buses = useBuses(socket)
  const [center, setCenter] = useState([41.42, -81.63])
  const [routes, setRoutes] = useState([]) 
  const [coordinate, setCoordinate] = useState([])
  const [vehicle, setVehicle] = useState({})
  const [isClicked, setIsClicked] = useState(null)
  const [speed, setSpeed] = useState(null)
  const [arrived, setArrived] = useState(null)
  const [focus, setFocus] = useState([])
  const [paths, setPaths] = useState([])
  const [status, setStatus] = useState(true) 
  const [level, setLevel] = useState(null)

  function updateSpeed(value){
    setSpeed(value)
  }

  function updateVehicle(value){
    setVehicle(value)
  }

  function updateCoordinate(value){
    setCoordinate(value)
  }

  function updateClicked(value){
    setIsClicked(value)
  }

  function updateArrived(value){
    setArrived(value)
  }

  function updatePaths(value){
    setPaths(value)
  }

  function updateStatus(value){
    setStatus(value)
  }

  function updateLevel(value){
    setLevel(value)
  }

  const HandleClose = () => {
    setIsClicked(false)
    setPaths([])
    setFocus([])
  }

  useEffect(() => {
    if(paths?.length != 0){
      setFocus(CoordsCheck(coordinate, paths)) 
    }
  }, [paths])
  

  const ColorSegment = (props) => {
    if(focus.length !== 0 && focus.onRoute !== false){
    const coords = [[
      props?.seg.stop_src.stop_lat,
      props?.seg.stop_src.stop_lon
    ],
    [
      props?.seg.stop_dest.stop_lat,
      props?.seg.stop_dest.stop_lon
    ]]
    if(arrived === 1){
      return
    }
    else{
        return(
        <Polyline color={colorCheck(speed, props.updateLevel)} positions={coords} weight={5}></Polyline>
        )
      }
    }
    else if(focus.length !== 0){
      setArrived(2)
    }
  }


  // whenCreated={(map) => {
  //   mapRef.current = map
  // }}

  return (
    <div className='page-wrapper'>
      <div className='top-container'>
      </div>
      <div className='map-container'>
        <MapContainer className='map-wrapper' 
          center={[41.42, -81.63]} 
          zoomSnap={0.2} 
          zoom={13} >
          <TileLayer attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}' ext = {'png'}
                    ></TileLayer>

          {
            paths?.map((stop, index) => {

                  const coords = [[
                  stop?.stop_src.stop_lat,
                  stop?.stop_src.stop_lon
                ],
                [
                  stop?.stop_dest.stop_lat,
                  stop?.stop_dest.stop_lon
                ]]

                return(
                  <Polyline key={index} color={"#0079EB"} positions={coords} weight={3}></Polyline>
                )
              })
          }
          <ColorSegment seg = {focus} speed = {speed} updateLevel = {updateLevel}></ColorSegment>
          <RenderBuses data = {buses} 
            updateSpeed={updateSpeed} updateCoordinate={updateCoordinate} 
            updateClicked={updateClicked} updateVehicle={updateVehicle} 
            updateArrived={updateArrived} updatePaths={updatePaths} updateStatus={updateStatus}>
          </RenderBuses>
          {/* <Fly pos = {coordinate}></Fly> */}
          {isClicked === false && <Fly pos = {center} status = {isClicked} updateClicked ={updateClicked}></Fly>}
        </MapContainer>
      </div>
      {
        vehicle.position !== undefined && isClicked === true && 
        <div className='bus-container'>
          <BusDetails details = {vehicle} handleEvent={HandleClose}></BusDetails>
          <div className='bus-middle'>
            <div className='bus-image'>
              <img src={busPic} alt='cleve-bus'></img>
            </div>
            <div className='bus-details'>
              <div className='box'>
                <div className='box-upper'>
                  <h2 className='title'>On route</h2>
                  <div className='sep'></div>
                </div>
                <div className='box-bottom'>
                  <h2 className='title'>{vehicle.trip.route_id}</h2>
                </div>
              </div>
              <div className='box'>
              <div className='box-upper'>
                  <h2 className='title'>Status</h2>
                  <div className='sep'></div>
                </div>
                <div className='box-bottom'>
                  <ArrivalCheck status = {arrived}></ArrivalCheck>
                </div>
              </div>
            </div>
            <div className='bus-details two'>
              <div className='box'>
                <div className='box-upper'>
                  <h2 className='title'>Speed</h2>
                  <div className='sep'></div>
                </div>
                <div className='box-bottom'>
                  <h2 className='title'>{Math.round(vehicle.position.speed * 100) / 100 + " m/s"}</h2>
                </div>
              </div>
              <div className='box'>
                <div className='box-upper'>
                  <h2 className='title'>Clogging level</h2>
                  <div className='sep'></div>
                </div>
                <div className='box-bottom'>
                  <h2 className='title'>{level}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className='bus-bottom'>
            <h2 className='title'>Predict congestion level</h2>
          </div>
        </div>
      }
      <div className='description-container'>
        <h1>Congestion level</h1>
        <div className='indicate-wrapper'>
          <div className='left'>
            <h2>Level 1 </h2>
            <h3>( speed &le; 7 )</h3>
          </div>
          <div className='right one'></div>
        </div>
        <div className='indicate-wrapper'>
          <div className='left'>
            <h2>Level 2 </h2>
            <h3>( 7 &gt; speed &ge; 15)</h3>
          </div>
          <div className='right two'>
          </div>
        </div>
        <div className='indicate-wrapper'>
          <div className='left'>
            <h2>Level 3 </h2>
            <h3>( speed &gt; 15 )</h3>
          </div>
          <div className='right three'></div>
        </div>
      </div>
    </div>
  )
}

export default App
