import L from "leaflet"
import busIcon from '../assets/images/greenBus.png'

export const BusIcon = L.icon({
        iconUrl : busIcon,
        iconSize: [10, 25],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        className: "bus-icon"
})



