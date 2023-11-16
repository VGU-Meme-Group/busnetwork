import axios from "axios";
import { useEffect, useState } from "react";

export const useBuses = (socket) => {
    const [ buses, setBuses] = useState([])

    const fetchBusesSocket = () =>{
        socket.emit("get-buses")
        socket.on("receive-all-routes", (result) =>{
          setBuses(result)
        })
    }

    useEffect(() => {
        fetchBusesSocket()
    }, [])

    return buses
}