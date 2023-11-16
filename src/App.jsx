import { useState, useEffect, createElement, useRef, useContext } from 'react'
import React from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import L, { control, map } from "leaflet"
import { createControlComponent } from "@react-leaflet/core";
import RoutingMachine from './RoutingMachine';
import './App.scss'
import axios from 'axios';
import { FaBus, FaLeaf, FaRoad } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
// import { io } from "socket.io-client"
import 'leaflet-rotatedmarker'
import { colorCheck } from './shape/CoordsCheck';
import CoordsCheck from './shape/CoordsCheck';

import busPic from './assets/images/cleveBus.jpg'
import Delayed from './Delayed';
import ShapeCheck from './shape/ShapeCheck';
import io from 'socket.io-client'

import { useBuses } from './hooks/useBuses';
import { BusIcon } from './components/BusIcon';
import { Fly } from './functions/Fly';

import ArrivalCheck from './functions/ArrivalCheck';
import { BusContext } from './context/BusContext';

const socket = io.connect("http://localhost:5000")
function App() {
  //Socket
  const mapRef = useRef(null)

  //
  const buses = useBuses(socket)

  // const position = [41.554242, -81.574411]
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





  async function fetchSegments(lookup, bus){
      // console.log("GetSegments")
      console.log(lookup)
      try {
          const coord = [bus.bus_lat, bus.bus_lon]
          const request = await axios.get(`http://localhost:3812/getSegments/${lookup}`)
          .then((res) => {
              setPaths(res.data[0].segments)
              setStatus(true)
              console.log(res.data[0].segments)
          })
      } catch (error) {
          setStatus(false)
      }
  }

  async function fetchRoute(lookup, bus){
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
        // fetchSegments(id[0].shapeId, bus)
        fetchSegments(id[0].shapeId, bus)
        setArrived(id[0].arrived)
      })
    } catch (error) {
      // console.log(error)
    }
  }

    useEffect(() => {
      if(paths?.length != 0){
        setFocus(CoordsCheck(coordinate, paths)) 
      }
    }, [paths])
  


  function RenderBuses(props){
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

  function LocationMarker({index ,pos, details, route, busCoord}){
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
            fetchRoute(route, busCoord)
            setCoordinate(coord)
            setSpeed(details.position.speed)
            setVehicle(details)
            setIsClicked(true)
          }
        }}
        >

          <Popup key={index}>{"Vehicle : " + details.vehicle.label + "\n with coords" + "[" + pos[0] + "," + pos[1] +"]"}
          </Popup>
        </Marker>

    )
  }

  const ColorSegment = (segment) => {
    if(focus.length !== 0 && focus.onRoute !== false){
    const coords = [[
      segment?.seg.stop_src.stop_lat,
      segment?.seg.stop_src.stop_lon
    ],
    [
      segment?.seg.stop_dest.stop_lat,
      segment?.seg.stop_dest.stop_lon
    ]]
    if(arrived === 1){
      return
    }
    else{
        return(
        <Polyline color={colorCheck(speed)} positions={coords} weight={5}></Polyline>
        )
      }
    }
    else if(focus.length !== 0){
      setArrived(2)
    }
  }

  const HandleClose = () => {
    setIsClicked(false)
    setPaths([])
    setFocus([])
  }
const BusDetails = ({details}) =>{
    
    return(
      <div className='bus-top'>
          <div className='bus-top-left'>
            <FaBus className='icon'></FaBus>
            <h1>BUS{details.vehicle.label}</h1>
            <div className='bus-id'>
              {details.vehicle._id}
            </div>
          </div>
          <div className='bus-top-right' onClick={HandleClose}>
            <AiOutlineClose className='icon'></AiOutlineClose>
          </div>
          
      </div>
    )
}

  return (
    <div className='page-wrapper'>
      <div className='top-container'>
      </div>
      <div className='map-container'>
        <MapContainer className='map-wrapper' 
          center={[41.42, -81.63]} 
          zoomSnap={0.2} 
          zoom={13} 
          whenCreated={(map) => {
					  mapRef.current = map
				  }}>
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
          <ColorSegment seg = {focus} speed = {speed}></ColorSegment>
          <RenderBuses data = {buses}></RenderBuses>
          <Fly pos = {coordinate}></Fly>
          {isClicked === false && <Fly pos = {center} status = {isClicked}></Fly>}
        </MapContainer>
      </div>
      {
        vehicle.position !== undefined && isClicked === true && 
        <div className='bus-container'>
          <BusDetails details = {vehicle}></BusDetails>
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
              <div className='box predict'>
              <div className='box-upper'>
                  <h2 className='title'>Predict</h2>
                  <div className='sep'></div>
                </div>
                <div className='box-bottom'>
                  <h2 className='title'>Congestion level</h2>
                  
                </div>
              </div>
            </div>
          </div>

        </div>
      }
      <div className='description-container'>
        <h1>Congestion level</h1>
        <div className='indicate-wrapper'>
          <div className='left'>
            <h2>Level 1 :</h2>
          </div>
          <div className='right one'></div>
        </div>
        <div className='indicate-wrapper'>
          <div className='left'>
            <h2>Level 2 :</h2>
          </div>
          <div className='right two'>

          </div>
        </div>
        <div className='indicate-wrapper'>
          <div className='left'>
            <h2>Level 3 :</h2>
          </div>
          <div className='right three'></div>
        </div>
      </div>
    </div>
  )
}

export default App
