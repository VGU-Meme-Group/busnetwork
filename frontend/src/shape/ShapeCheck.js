import axios from "axios"
const ShapeCheck = async (shapesArray ,location) => {
    console.log(location)
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
            console.log(res.data)
            result.push(res.data)
        })
    } catch (error) {
        console.log(error)
    }
    return result
}


export default ShapeCheck