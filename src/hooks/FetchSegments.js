import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { BusContext } from "../context/BusContext";
import CoordsCheck from "../shape/CoordsCheck";

const FetchSegments = async (lookup, bus) => {
    const {setStatus, setPaths, paths, setFocus, coordinate} = useContext(BusContext)
        // console.log("GetSegments")
    console.log(lookup)
    try {
        // const coord = [bus.bus_lat, bus.bus_lon]
        const request = await axios.get(`http://localhost:3812/getSegments/${lookup}`)
        .then((res) => {
            setPaths(res.data[0].segments)
            setStatus(true)
        })
    } catch (error) {
        setStatus(false)
    }
    
}




export default FetchSegments