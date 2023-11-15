
const findMinDistance = (point1, point2, lookup) => {
    // console.log(lookup)
  
    // AC = C - A
    const oneLookup = [(lookup[0] - point1[0]), (lookup[1] - point1[1])]

    // BC = C - B
    const twoLookup = [(lookup[0] - point2[0]), (lookup[1] - point2[1])]

    const length1 = findLengthOfVector(oneLookup)
    const length2 = findLengthOfVector(twoLookup)
    if(length1 > length2){
        return length2
    }else{
        return length1
    }
    // const result = [oneLookup]
    // return result
}

const findLengthOfVector = (vector) => {
    // console.log(vector)
    const x = Math.pow(vector[0], 2)
    const y = Math.pow(vector[1], 2)
    const result = Math.sqrt(x + y) * 1000
    // console.log("Length : " +result)
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

const retrieveShape = (array, min) => {
    for(let item of array){
        if(min === item.distance){
            return item
        }
    }
}

const test = (length) => {
    console.log(length)

}

const arrivedCheck = (stop1, stop2, lookup) =>{
    const oneLookup = [(lookup[0] - stop1.stop_lat), (lookup[1] - stop1.stop_lon)]
    const twoLookup = [(lookup[0] - stop2.stop_lat), (lookup[1] - stop2.stop_lon)]
    const length1 = findLengthOfVector(oneLookup)
    const length2 = findLengthOfVector(twoLookup)
    
    if(Math.floor(length1) === 0 || Math.floor(length2) === 0){
        return 1
    }
    else{
        return 0
    }
}

const Validator = (array, point, minArr) => {
    const segment = array[0].segments
    let minArray = []
    let min = Infinity
    // console.log(array[0].shapeId)
    // console.log(array)
    for(let i = 0; i < segment.length; i++){
        const firstPoint = [[segment[i].stop_src.stop_lat], [segment[i].stop_src.stop_lon]]
        const secondPoint = [[segment[i].stop_dest.stop_lat], [segment[i].stop_dest.stop_lon]]
        const object = {
            segmentId : segment[i].segmentId,
            stop_src : segment[i].stop_src,
            stop_dest : segment[i].stop_dest,
            distance : findMinDistance(firstPoint, secondPoint, point)
        }
        minArray.push(object)    
    }

    const object = {
        shapeId : array[0].shapeId,
        distance : minimumDistance(minArray, min),
        first_stop : segment[0].stop_src,
        last_stop : segment[segment.length - 1].stop_dest
    }
    minArr.push(object)
}

exports.Validator =  Validator 
exports.minimumDistance = minimumDistance
exports.retrieveShape = retrieveShape
exports.arrivedCheck = arrivedCheck