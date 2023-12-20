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
        setInterval(fetchBusesSocket(), 5000)
    }, [buses])

    return buses
}