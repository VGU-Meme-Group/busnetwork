import { createContext, useState, useEffect, createElement } from "react";
import L, { control } from "leaflet"
import { createControlComponent } from "@react-leaflet/core";
export const PathContext = createContext({})

export const PathProvider = ({children}) => {


    
    
    return <PathContext.Provider></PathContext.Provider>
}