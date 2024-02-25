const multer = require('multer')

// Local Storage:
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'upload/')
//     },
//     filename: (req, file, cb) => {
//         cb(null , file.originalname)
//     },
// })

//memoryStorage() is one of the ways to configure temporary storage for files uploaded from the client. Instead of storing files directly on the server's hard disk, memoryStorage() stores files in the server's memory.
const storage = multer.memoryStorage()

var upload = multer({ storage: storage })

module.exports = upload