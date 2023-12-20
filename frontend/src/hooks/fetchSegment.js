import axios from "axios"
async function fetchSegments(lookup, updatePaths, updateStatus){

    try {
        const request = await axios.get(`http://localhost:3812/getSegments/${lookup}`)
        .then((res) => {
            updatePaths(res.data[0].segments)
            updateStatus(true)
        })
    } catch (error) {
        updateStatus(false)
    }
}

export default fetchSegments