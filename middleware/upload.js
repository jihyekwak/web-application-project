const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd (null, 'uploads/')
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb (null, Date.now() +ext)
    }
})

let upload = multer ({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/jpg"
        ) {
            callback(null, true)
        } else {
            console.log("only jpg/jpeg/png file supported")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 *2
    }
})

module.exports = upload;