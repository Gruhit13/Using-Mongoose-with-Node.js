import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        //  setting the dest to store images on server
        callback(null, path.join(__dirname , '..' , '..', 'assets/uploads'))
    },

    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fieldSize : 1024 * 1024 * 5 //  setting to 5MB
    }
})

export default upload