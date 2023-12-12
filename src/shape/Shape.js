import axios from 'axios'

function makeColor() {
    const colors = ["red" , "yellow", "orange", "lightgreen", "#6096B4"]
    return colors[4]
}

function dataProcessing(data, array, index){

    for(let i = 0, j = data.length; i < j; i++){
        if(data[i + 1] === undefined) return
        const newArray = 
            {
                __id : data[i].__id,
                color : makeColor(),
                stop_src : {
                    stop_lat : parseFloat(data[i]?.shape_lat),
                    stop_lon : parseFloat(data[i]?.shape_lon)
                },
                stop_dest: {
                    stop_lat : parseFloat(data[i+1]?.shape_lat),
                    stop_lon : parseFloat(data[i+1]?.shape_lon)
                }
            }
        // console.log(newArray)
        const request = async () => {
                    try {
                        const url = `http://localhost:3812/createSegments/${index}`
                        const res = await axios.post(url, newArray)
                    } catch (error) {
                        console.log(error)
                    }
                }
        request()

        // array[index - 1].segments.push(newArray)
    }

    // return array
}





//segment 1 : 1 -> 20
async function dataImport(start){
    try {
        const routes = []


        let index
        await import(`../assets/sample${start}.json`).then(json => {
            // console.log(json.default)
            // console.log(index)
            const newArray = 
                {
                    shapeId : json.default[0].shape_id,
                    segments : []
                }
            index = newArray.shapeId
            routes.push(newArray)
            const request = async () => {
                try {
                    const res = await axios.post("http://localhost:3812/createRoutes", newArray)
                } catch (error) {
                    console.log(error)
                }
            }
            request()
            return json.default
        }).then((data) => {
            // const color = makeColor()
            return dataProcessing(data, routes , index)
        }).then((processedData) => {
            return processedData
        })
        // }
        // return routes
    } catch (error) {
        console.log(error)
    }
    
}




async function CreateSegments (){
    const result = await dataImport()
    // console.log(result)
    
    return result
    // const segments = []

    // let count = 0

    // const colors = ["lightgreen"]
    // // const colors = ["red" , "yellow", "orange", "lightgreen"]
    // for(let i = 0, j = size; i <= j; i = i + 1){
    //     // if(j % 2 !== 0) j = j + 1
    //     if(data[i+1] === undefined) return segments
        
    //     const newArray = 
    //         {
    //             id : count,
    //             color : colors[Math.floor(Math.random() * colors.length)],
    //             stop_src : {
    //                 stop_lat : parseFloat(data[i]?.shape_lat),
    //                 stop_lon : parseFloat(data[i]?.shape_lon)
    //             },
    //             stop_dest: {
    //                 stop_lat : parseFloat(data[i+1]?.shape_lat),
    //                 stop_lon : parseFloat(data[i+1]?.shape_lon)
    //             }
    //         }    
        
    //     segments.push(newArray)
    //     count++
    // }
}



async function checkSegments(){
    const variable = await CreateSegments()
    // console.log(variable)
    return variable
}
// export const shape = await checkSegments()

export function postSegments(){
    try {
        console.log("Hi")
        let start = 1
        const end = 211
        let timeStep = 120000
        // dataImport(start)
        // const timer = setInterval(() => {
        //     console.log("hello")
        // }, timeStep)

        var timer = setInterval(() => {
            if(start > end){
                clearInterval(timer)
            }
            else{
                dataImport(start)
                start++
            }
        }, timeStep)

        
        // if(start > end){
        //     clearInterval(timer)
        // }
        
        


    } catch (error) {
        console.log(error)
    }
    
    // const data = JSON.stringify(segments)
    // const customConfig = {
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }
    // const request = await axios.post("http://localhost:3812/createSegments", data, customConfig)
    // console.log(request.data)
    // console.log(segments)
}

export async function deleteSegments(){
    console.log("deleteSegments")
    const request = await axios.delete("http://localhost:3812/deleteSegments")
}
export async function getSegments(){
    console.log("GetSegments")
    try {
        const request = await axios.get("http://localhost:3812/getSegments")
        .then((res) => {
            // console.log(res.data)
            return res.data
        })
    } catch (error) {
        console.log(error)
    }
}

