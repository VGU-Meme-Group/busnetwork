import {useState, useEffect, useContext} from 'react'
import L, { control } from "leaflet"
import "leaflet-routing-machine";
import { createControlComponent } from "@react-leaflet/core";
import data from '../src/assets/sample.json'
import { Marker } from 'react-leaflet';

const getWaypoints = () =>{
    const coords = data.map((item) => ([
        item.stop_lat,
        item.stop_lon
    ]))
    return coords
}



const setWaypoints = (props) =>{
  
    const temp = props
    const waypoints = temp.map((item) => {
        return(
            L.latLng(item.lat, item.lon)
        )
    })
    return waypoints
}   

let segments = []





const createRoutineMachineLayer = () => {
    
    // console.log()
  
    // getDistance()
    return L.Routing.control({
      waypoints: 
        getWaypoints().slice(0, 36).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
      ,
      lineOptions: {
        styles: [{ color: "#FF6F00", weight: 5 }]
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      instructions : [
        segments
      ]
      
    }).on('routeselected', (e) => {
      Object.assign(segments, e.route.instructions)
    })

  };


export const GetSegments = createRoutineMachineLayer



const RoutingMachine = createControlComponent(createRoutineMachineLayer);


export default RoutingMachine