import multer from "multer";

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/gallery");
    },
    filename: (req,file,cb) =>{
        cb(null,Date.now() + file.originalname)
    },
});
const fileFilter = (req,file,cb) =>{
    if(file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ||file.mimetype === "image/png" || file.mimetype === "image/gif" ){
        cb(null,true)
    }else{
        cb(null,false)
    }
    }

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})

export default upload;