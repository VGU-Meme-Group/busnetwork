import { useState, useEffect, createElement, useRef } from 'react'
import React from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L, { control, map } from "leaflet"
import { createControlComponent } from "@react-leaflet/core";
import RoutingMachine from './RoutingMachine';
import './App.scss'
import data from '../src/assets/sample.json'
import data1 from '../src/assets/sample1.json'
import axios from 'axios';
// import { segment } from './Segment';
import { shape } from './shape/Shape';
import Delayed from './Delayed';

function App(props) {
  const position = [41.554242, -81.574411]
  const [stops, setStops] = useState([])
  const [paths, setPaths] = useState([]) 
  // const segments = []
  const [map, setMap] = useState(null)
  const routingMachineRef = useRef()
  const pluginRef = useRef()
  const [loading, setLoading] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const URL = import.meta.env.VITE_SOME_KEY
  let count = 0;
  const size = 2
  const colors = ["red" , "yellow", "orange", "lightgreen"]


  const pos1 = [[41.554209, -81.574449], [41.553623, -81.575142]]
  const pos2 = [[41.552582, -81.578125], [41.551938, -81.580713]]
  const pos3 = [[41.553623, -81.575142], [41.552582, -81.578125]]
  const route = [
    {
      id: 1,
      coords : pos1,
      routeColor : colors[3]
    },
    {
      id: 2,
      coords : pos2,
      routeColor : colors[2]
    },
    {
      id: 3,
      coords : pos3,
      routeColor : colors[0]
    }
  ]
  const temp = [pos1, pos2]
  let rendered = []
  // const getData = async () => {
  //   try {
  //     const response = await axios.get(`${URL}/getAllRouteIds`,
  //     {
  //       headers: {
          
  //       }
  //     })
  //     console.log(response)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const getSegments = () => {
    var size = 4;
    data.slice(0, size).map((stop, index) => {
      const coords = [
        stop.stop_lat,
        stop.stop_lon
      ]   
      setPaths(paths => [...paths, coords])
    })
  }

  const createSegments = () =>{
    let count = 0 

    for(let i = 0; i < data.length; i++){
      for(let j = 1; j <= data.length - 1; j++){
        
        const arr = [
          {
            id : count,
            color : "lightgreen",
            stop_src : {
              stop_name : data[i].stop_name,
              stop_lat : data[i].stop_lat,
              stop_lon : data[i].stop_lon
            },
            stop_dest: {
              stop_name : data[j].stop_name,
              stop_lat : data[j].stop_lat,
              stop_lon : data[j].stop_lon
            }
          }
        ]
        segments.push(arr)
        count++
        
      }
      
    }
    // console.log(segments)
    
  }
  function RoutingControl(props){
    // console.log(props.waypoints)
    // console.log(props)
    const waypoints  = props.waypoints
    const routeColor = props.color
    const src = props.srcName
    // console.log(waypoints)
    // const { routeColor } = props.color
    const getWaypoints = () =>{
        const coords = data.map((item) => ([
            item.stop_lat,
            item.stop_lon
        ]))
        return coords
      }
    
      const createRoutingMachineLayer = () =>{
        const control =  L.Routing.control({
          // waypoints 
            waypoints : waypoints
            
            // [
            //   L.latLng(pos1[0][0], pos1[0][1]),
            //   L.latLng(pos1[1][0], pos1[1][1])
            // ]
            // [
            //   L.latLng(props[0][0], props[0][1]),
            //   L.latLng(props[1][0], props[1][1])
            // ]
          ,
          lineOptions: {
            styles: [{ color: routeColor, weight: 3 }]
          },
          createMarker: function(waypointIndex, waypoint, numberOfWaypoints ){

            return L.marker(waypoint.latLng).bindPopup(`${src}`)
          },
          addWaypoints: false,
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: false
        })

    
        return control
      }
      

      return createElement(createControlComponent(createRoutingMachineLayer))
  }

  useEffect(() => {
    if(routingMachineRef.current) {
      routingMachineRef.current.setWaypoints(pos1)
    }
  }, [routingMachineRef])


  useEffect(() => {
    if(!map) return;
  },[map])


  function RenderRoute(props){
    const id = props.id
    const data = props.segments
      
    const temp = data.map((item, index) => {
          const coords = [[
            item[0]?.stop_src.stop_lat,
            item[0]?.stop_src.stop_lon
          ],
          [
            item[0]?.stop_dest.stop_lat,
            item[0]?.stop_dest.stop_lon
          ]]
          return(
            <Polyline key={index} color={item[0]?.color} positions={coords} weight={2}></Polyline>
          )
        })
    return temp
  }


 
  
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
        {/* <h1>Public Bus Applications</h1> */}
      </div>
      <div className='map-container'>
        <MapContainer className='map-wrapper' center={position} zoomSnap={0.5} zoom={15} whenCreated={setMap}>
          <TileLayer attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}' ext = {'png'}
                    ></TileLayer>
          
          {
            shape.slice(0,24).map((segment, index) => {
              return (
                <RenderRoute key = {index} id = {segment[0].routeId} segments = {segment[0].segments}></RenderRoute>
              )
            })
          }
        </MapContainer>
      </div>

    </div>
  )
}


// data.map((route, index) => {  
//   return(
//     <h1 key={index}>{index+1 + ". " +route.stop_name}</h1>
//   )
// })


// Main function to render Routing Control
// {
//   segment?.map((component, index) =>{
//       const coords = [[
//         component?.stop_src.stop_lat,
//         component?.stop_src.stop_lon
//       ],
//       [
//         component?.stop_dest.stop_lat,
//         component?.stop_dest.stop_lon
//       ]]


//       return(
//         <Delayed key = {index} waitBeforeShow={3800 * index}>
//           <RoutingControl waypoints={coords} color = {component.color} srcName = {component.stop_src.stop_name}></RoutingControl>
//         </Delayed>
          
//       )
//     })
// }



// shape.map((stop) => {
  // stop[0].segments.map((segment, index) => {
    // const coords = [[
    //   segment[0]?.stop_src.stop_lat,
    //   segment[0]?.stop_src.stop_lon
    // ],
    // [
    //   segment[0]?.stop_dest.stop_lat,
    //   segment[0]?.stop_dest.stop_lon
    // ]]

    //   return(
    //     <Polyline key={index} color={segment?.color} positions={coords} weight={2}></Polyline>
    //   )
    // })
//   })







export default App
