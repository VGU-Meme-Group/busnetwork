
export const colorCheck = (speed, updateLevel) => {
    const color = ["#0ED87A", '#F5F400', '#F50016']
    if(speed <= 7){
        updateLevel(3)
        return color[2]
    }
    else if(speed > 7 && speed <= 15){
        updateLevel(2)
        return color[1]
    }
    else{
        updateLevel(1)
        return color[0]
    }
}

const findLengthOfVector = (vector) => {
    const x = Math.pow(vector[0], 2)
    const y = Math.pow(vector[1], 2)
    const result = Math.sqrt(x + y) * 1000
    return result
}

const dotProduct = (vector1, vector2) => {
    // console.log("Vector 1 : " + vector1)
    // console.log("Vector 2 : " + vector2)
    const dot = (vector1[0] * vector2[0]) + (vector1[1] * vector2[1])
    // console.log("Dot: " + dot)
    return dot
}

const validateVectors = (dot1, dot2) =>{
    if(dot1 < 0 || dot2 < 0){
        return 0
    }
    else if(dot1 > 0 && dot2 > 0){
        return 1
    }
}

const findVectorBetweenTwoCoords = (point1, point2, lookup) => {
    // AB = B - A
    const segmentVector = [(point2[0] - point1[0]), (point2[1] - point1[1])]
  
    // AC = C - A
    const oneLookup = [(lookup[0] - point1[0]), (lookup[1] - point1[1])]

    // BA = A - B
    const segmentVector2 = [(point1[0] - point2[0]), (point1[1] - point2[1])]

    // BC = C - B
    const twoLookup = [(lookup[0] - point2[0]), (lookup[1] - point2[1])]

    const dot1 = dotProduct(segmentVector, oneLookup)
    const dot2 = dotProduct(segmentVector2, twoLookup)


    const result = [dot1 , dot2, oneLookup]
    return result
}


const minimumDistance = (array, min) => {
    for(let item of array){
        if(item.distance < min){
            min = item.distance
        }
    }
    return min
}

const retrieveSegment = (array, min) => {
    console.log(array)
    for(let item of array){
        if(min === item.distance){
            console.log(item)
            return item
        }
    }
}

const CoordsCheck = (location, segment) => {
    let min = Infinity
    const minArray = []

    for(let i = 0; i < segment.length; i++){
        // console.log(segment[i])
        const firstPoint = [[segment[i].stop_src.stop_lat], [segment[i].stop_src.stop_lon]]
        const secondPoint = [[segment[i].stop_dest.stop_lat], [segment[i].stop_dest.stop_lon]]
        // const distance = findDistanceBetweenTwoCoords(firstPoint, secondPoint)
        const vectors = findVectorBetweenTwoCoords(firstPoint, secondPoint, location)
        if(validateVectors(vectors[0], vectors[1]) === 1){
            const length = findLengthOfVector(vectors[2])
            const object = {
                segmentId : segment[i].segmentId,
                stop_src : segment[i].stop_src,
                stop_dest : segment[i].stop_dest,
                distance : length
            }
            minArray.push(object)         
        }
        else{
            continue
        } 
    }
    if(minArray.length == 0) {
        const status = { onRoute : false}
        return status
    }
    else{
        return retrieveSegment(minArray, minimumDistance(minArray, min))
    }
}

export default CoordsCheck