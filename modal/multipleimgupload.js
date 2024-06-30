const multer = require('multer')
/*
Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.

Returns a StorageEngine implementation configured to store files on the local file system
A string or function may be specified to determine the destination directory, and a function to determine filenames. If no options are set, files will be stored in the system's temporary directory with random 32 character filenames.
*/
var storage_engine = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./multipleuploaddocuments')
    },
    filename:(req,file,callback)=>{
        callback(null,Date.now()+"_"+file.originalname)
    }
})

var multipleimgupload = multer({storage:storage_engine})
module.exports = multipleimgupload
