import { useMap } from 'react-leaflet'
export const Fly = (pos) => {
    const updateClicked = pos.updateClicked
    var map = useMap()
    if(focus.length != 0){
      if(pos){
        map.flyTo(pos.pos)
      }
    }

    if(pos.status === false){
      if(pos){
        map.flyTo(pos.pos, 12)
        updateClicked(null)
      }
    }
    
  }