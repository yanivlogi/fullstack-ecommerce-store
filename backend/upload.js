import path from 'path'
import multer from 'multer'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});



var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype === 'image/jpeg'
        ){
            callback(null,true)
        } else{
            console.log('only jpg & png file supported!')
            callback(null,false)
        }
    },
    limits : {
        fileSize: 1024 * 1024 * 20
    }
})
export default upload;