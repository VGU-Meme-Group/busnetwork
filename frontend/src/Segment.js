import data from './assets/sample.json'



function CreateSegments (){
    const size = data.length
    const segments = []
    let count = 0

    const colors = ["red" , "yellow", "orange", "lightgreen"]
    for(let i = 0, j = size; i <= j; i = i + 1){
        // if(j % 2 !== 0) j = j + 1
        if(data[i+1] === undefined) return segments
        
        const newArray = 
            {
                id : count,
                color : colors[Math.floor(Math.random() * colors.length)],
                stop_src : {
                    stop_name : data[i]?.stop_name,
                    stop_lat : data[i]?.stop_lat,
                    stop_lon : data[i]?.stop_lon
                },
                stop_dest: {
                    stop_name : data[i+1]?.stop_name,
                    stop_lat : data[i+1]?.stop_lat,
                    stop_lon : data[i+1]?.stop_lon
                }
            }    
        
        segments.push(newArray)
        count++
    }
}


function checkSegments(){
    const variable = CreateSegments()
    return variable
}
export const segment = checkSegments()