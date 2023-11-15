import { FaBus } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { useContext } from "react";
import { BusContext } from '../context/BusContext';

const HandleClose = () => {
    const {setIsClicked, setPaths, setFocus} = useContext(BusContext)
    setIsClicked(false)
    setPaths([])
    setFocus([])
}
const BusDetails = ({details}) =>{
    
    return(
      <div className='bus-top'>
          <div className='bus-top-left'>
            <FaBus className='icon'></FaBus>
            <h1>BUS{details.vehicle.label}</h1>
            <div className='bus-id'>
              {details.vehicle._id}
            </div>
          </div>
          <div className='bus-top-right' onClick={HandleClose}>
            <AiOutlineClose className='icon'></AiOutlineClose>
          </div>
          
      </div>
    )
}

export default BusDetails