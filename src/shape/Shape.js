import data from '../assets/sample211.json'


// {
//     __id : data[i].__id,
//     shape_lat : data[i].shape_lat,
//     shape_lon : data[i].shape_lon,
//     shape_sequence : data[i].shape_sequence
// }

function makeColor() {
    var color = "";
    for(var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += (sub.length == 1 ? "0" + sub : sub);
    }
    return "#" + color;
}

function dataProcessing(data, array, index, color){
    // console.log(array)
    // console.log(array[index - 1][0])

    for(let i = 0, j = data.length; i <= j; i++){
        // console.log(data[i])
        if(data[i+1] === undefined) return array
        const newArray = [
            {
                __id : data[i].__id,
                color : color,
                stop_src : {
                    stop_lat : parseFloat(data[i]?.shape_lat),
                    stop_lon : parseFloat(data[i]?.shape_lon)
                },
                stop_dest: {
                    stop_lat : parseFloat(data[i+1]?.shape_lat),
                    stop_lon : parseFloat(data[i+1]?.shape_lon)
                }
            }
        ]
        array[index - 1][0].segments.push(newArray)
        
    }

    // return array
}

async function dataImport(){

    const start = 1
    const end = 3
    const routes = []
    const segments = []
    for(let i = 1; i <= 211; i++)
    {
        let index = i
        await import(`../assets/sample${i}.json`).then(json => {
            // console.log(json.default)
            // console.log(index)
            const newArray = [
                {
                    routeId : json.default[0].shape_id,
                    segments : []
                }
            ]
            routes.push(newArray)
            return json.default
        }).then((data) => {
            const color = makeColor()
            return dataProcessing(data, routes , index, color)
        }).then((processedData) => {
            return processedData
        })
    }
    return routes
}


function makeSegments (data, index) {
    console.log(data)
    console.log(index)
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
export const shape = await checkSegments()