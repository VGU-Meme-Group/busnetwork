const OS = require("node:os")
const {parentPort} = require("worker_threads")

console.log(OS.cpus().length)
