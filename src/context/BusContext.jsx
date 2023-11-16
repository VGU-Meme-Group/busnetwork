import { createContext, useState, useEffect } from "react";
import CoordsCheck from "../shape/CoordsCheck";
export const BusContext = createContext({})

export const BusProvider = ({children}) => {
    const [coordinate, setCoordinate] = useState([])
    const [vehicle, setVehicle] = useState({})
    const [isClicked, setIsClicked] = useState(null)
    const [speed, setSpeed] = useState(null)
    const [arrived, setArrived] = useState(null)
    const [focus, setFocus] = useState([])
    const [paths, setPaths] = useState([])
    const [status, setStatus] = useState(true) 

    useEffect(() => {
        if(paths.length != 0){
          setFocus(CoordsCheck(coordinate, paths)) 
        }
      }, [paths])

    return <BusContext.Provider value={{
        coordinate, setCoordinate,
        vehicle, setVehicle,
        isClicked, setIsClicked,
        speed, setSpeed,
        arrived, setArrived,
        focus, setFocus
    }}>
        {children}
    </BusContext.Provider>
}