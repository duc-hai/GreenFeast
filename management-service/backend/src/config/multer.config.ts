import { HttpException, HttpStatus } from "@nestjs/common"
import { diskStorage } from "multer"

export const multerOption = {
    limits: {
        fileSize: 10 * 1024 * 1024, //Limit file size is 10 MB
        files: 1 //Max file is 1
    },
    //Check file type before upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(png|jpg|jpeg|gif)$/))
            cb(null, true) // Allow upload
        else
            cb(new HttpException({
                    status: 'error',
                    message: 'Không hỗ trợ loại file này'
                }, HttpStatus.BAD_REQUEST, {
                    cause: 'Không hỗ trợ loại file này'
                }), false) //Error
    },
    storage: diskStorage({
        destination: './upload',
        filename: (req: any, file: any, cb: any) => {
            const currentDateTime = Date.now()
            //extname () can get extension name of a file's name
            cb(null, `${currentDateTime}-${file.originalname}`)
        },
    })
}