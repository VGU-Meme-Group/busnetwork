import {useState, useEffect, useContext} from 'react'
import L, { control } from "leaflet"
import "leaflet-routing-machine";
import { createControlComponent } from "@react-leaflet/core";
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


// const createRoutingMachineLayer = () => {

//     return L.Routing.control({
//       waypoints: 
//         getWaypoints().slice(0, 55).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
//       ,
//       lineOptions: {
//         styles: [{ color: "green", weight: 5 }]
//       },
//       addWaypoints: false,
//       routeWhileDragging: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       showAlternatives: false
      
//     })
    

//   };

  const createRoutingMachineLayer = () =>{
    const control =  L.Routing.control({
      waypoints 
        // getWaypoints().slice(0, 55).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
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
        styles: [{ color: routeColor, weight: 5 }]
      },
      createMarker: function(waypointIndex, waypoint, numberOfWaypoints ){
        console.log(waypoint)
        return L.marker(waypoint.latLng).bindPopup(`${waypoint.latLng}`)
      },
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false
    })

    return control
  }
// const createRoutineMachineLayer2 = () => {
    
//     // console.log()
  
//     // getDistance()
//     return L.Routing.control({
//       waypoints: 
//         getWaypoints().slice(8,12).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
//       ,
//       lineOptions: {
//         styles: [{ color: "yellow", weight: 5 }]
//       },
//       show: false,
//       addWaypoints: false,
//       routeWhileDragging: true,
//       draggableWaypoints: true,
//       fitSelectedRoutes: true,
//       showAlternatives: false,
//       instructions : [
//         segments
//       ]
      
//     })
//     .on('routeselected', (e) => {
//       Object.assign(segments, e.route)
//       // console.log(e.route.instructions)
//       // L.polyline(e.route.coordinates, {
//       //   color: '#44C',
//       //   weight: 1
//       // })
//       // console.log(e)
//     })

//   };
// const createRoutineMachineLayer3 = () => {
    
//     // console.log()
  
//     // getDistance()
//     return L.Routing.control({
//       waypoints: 
//         getWaypoints().slice(12,20).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
//       ,
//       lineOptions: {
//         styles: [{ color: "red", weight: 5 }]
//       },
//       show: false,
//       addWaypoints: false,
//       routeWhileDragging: true,
//       draggableWaypoints: true,
//       fitSelectedRoutes: true,
//       showAlternatives: false,
//       instructions : [
//         segments
//       ]
      
//     })
//     .on('routeselected', (e) => {
//       Object.assign(segments, e.route)
//       // console.log(e.route.instructions)
//       // L.polyline(e.route.coordinates, {
//       //   color: '#44C',
//       //   weight: 1
//       // })
//       // console.log(e)
//     })

//   };

// const createRoutineMachineLayer4 = () => {
    
//     // console.log()
  
//     // getDistance()
//     return L.Routing.control({
//       waypoints: 
//         getWaypoints().slice(20,36).map((point) => L.latLng(parseFloat(point[0]), parseFloat(point[1])))
//       ,
//       lineOptions: {
//         styles: [{ color: "green", weight: 5 }]
//       },
//       show: false,
//       addWaypoints: false,
//       routeWhileDragging: true,
//       draggableWaypoints: true,
//       fitSelectedRoutes: true,
//       showAlternatives: false,
//       instructions : [
//         segments
//       ]
      
//     })
//     .on('routeselected', (e) => {
//       Object.assign(segments, e.route)
//       // console.log(e.route.instructions)
//       // L.polyline(e.route.coordinates, {
//       //   color: '#44C',
//       //   weight: 1
//       // })
//       // console.log(e)
//     })

//   };


export const GetSegments = createRoutingMachineLayer


// export const RoutingMachine2 = createControlComponent(createRoutineMachineLayer2)
// export const RoutingMachine3 = createControlComponent(createRoutineMachineLayer3)
// export const RoutingMachine4 = createControlComponent(createRoutineMachineLayer4)

const RoutingMachine = createControlComponent(createRoutingMachineLayer);



export default RoutingMachine