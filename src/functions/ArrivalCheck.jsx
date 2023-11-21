const ArrivalCheck  = (prop) =>{
    console.log(prop)
    const status = prop.status
    if(status === 1){
        return <h2 className='title'>At station</h2>
    }
    else if(status === 0){
        return <h2 className='title'>In transit</h2>
    }
    else if(status === 2){
        return <h2 className='title'>Not on route</h2>
    }

}

export default ArrivalCheck