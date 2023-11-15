import axios from "axios"
const ShapeCheck = async (shapesArray ,location) => {
    // console.log(location)
    // console.log(shapes)
    const result = []
    try {
        const array = 
            {
                shapes : shapesArray.shapes,
                lookup : location
            }
        const query = await axios.post(`http://localhost:3812/checkShape`, array)
        .then((res) => {
            result.push(res.data)
            // console.log(result)
        })
    } catch (error) {
        console.log(error)
    }
    return result
}
// const ShapeCheck = (shapesArray ,location, socket) => {
//     // console.log(location)
//     // console.log(shapes)
//     const result = []
//     try {
//         const array = 
//             {
//                 shapes : shapesArray.shapes,
//                 lookup : location
//             }

//         socket.emit("check-shape", array)
//         socket.on("receive-shape-info", (data) =>{
//             console.log(data)
//         })
//         // const query = await axios.post(`http://localhost:3812/checkShape`, array)
//         // .then((res) => {
//         //     result.push(res.data)
//         //     // console.log(result)
//         // })

//     } catch (error) {
//         console.log(error)
//     }
//     return result
// }

export default ShapeCheck