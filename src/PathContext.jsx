import { createContext, useState, useEffect } from "react";

export const PathContext = createContext({})

export const PathProvider = ({children}) => {
    const [segments, setSegments] = useState([])
    return <PathContext.Provider value={segments, setSegments}></PathContext.Provider>
}