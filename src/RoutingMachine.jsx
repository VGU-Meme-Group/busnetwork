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




var instance = L.routing.control({
  waypoints: 
        getWaypoints().slice(0,36).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1]))),
  show: false,
  addWaypoints: false,
  routeWhileDragging: true,
  draggableWaypoints: true,
  fitSelectedRoutes: true,
  showAlternatives: false
})

// instance.on('routeselected', (e) => {
//   console.log(e)
// })
instance.on('routesfound', (e) => {
  console.log(e)
})


const createRoutineMachineLayer = () => {
    
    // console.log()
  
    // getDistance()
    return L.Routing.control({
      waypoints: 
        getWaypoints().slice(0,8).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
      ,
      lineOptions: {
        styles: [{ color: "green", weight: 5 }]
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
      
    })
    .on('routeselected', (e) => {
      Object.assign(segments, e.route)
      // console.log(e.route.instructions)
      // L.polyline(e.route.coordinates, {
      //   color: '#44C',
      //   weight: 1
      // })
      // console.log(e)
    })

  };
const createRoutineMachineLayer2 = () => {
    
    // console.log()
  
    // getDistance()
    return L.Routing.control({
      waypoints: 
        getWaypoints().slice(8,12).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
      ,
      lineOptions: {
        styles: [{ color: "yellow", weight: 5 }]
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
      
    })
    .on('routeselected', (e) => {
      Object.assign(segments, e.route)
      // console.log(e.route.instructions)
      // L.polyline(e.route.coordinates, {
      //   color: '#44C',
      //   weight: 1
      // })
      // console.log(e)
    })

  };
const createRoutineMachineLayer3 = () => {
    
    // console.log()
  
    // getDistance()
    return L.Routing.control({
      waypoints: 
        getWaypoints().slice(12,20).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
      ,
      lineOptions: {
        styles: [{ color: "red", weight: 5 }]
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
      
    })
    .on('routeselected', (e) => {
      Object.assign(segments, e.route)
      // console.log(e.route.instructions)
      // L.polyline(e.route.coordinates, {
      //   color: '#44C',
      //   weight: 1
      // })
      // console.log(e)
    })

  };

const createRoutineMachineLayer4 = () => {
    
    // console.log()
  
    // getDistance()
    return L.Routing.control({
      waypoints: 
        getWaypoints().slice(20,36).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
      ,
      lineOptions: {
        styles: [{ color: "green", weight: 5 }]
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
      
    })
    .on('routeselected', (e) => {
      Object.assign(segments, e.route)
      // console.log(e.route.instructions)
      // L.polyline(e.route.coordinates, {
      //   color: '#44C',
      //   weight: 1
      // })
      // console.log(e)
    })

  };


export const GetSegments = createRoutineMachineLayer


export const RoutingMachine2 = createControlComponent(createRoutineMachineLayer2)
export const RoutingMachine3 = createControlComponent(createRoutineMachineLayer3)
export const RoutingMachine4 = createControlComponent(createRoutineMachineLayer4)

const RoutingMachine = createControlComponent(createRoutineMachineLayer);



export default RoutingMachine