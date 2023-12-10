const {workerData, parentPort} = require("worker_threads")
const { Validator } = require('./Validator')
// let counter = workerData.shapes;

let counter = 'hi'
// console.log(workerData.shapes)
// console.log(workerData.minArray)

const shapeArray = workerData.shapes
const minArr = workerData.minArray
const lookup = workerData.lookup

Validator(shapeArray, lookup, minArr)

parentPort.postMessage(minArr)