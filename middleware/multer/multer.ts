import multer from 'multer';
import path from "path"
export const upload = multer({
    dest: 'uploads/',
    limits: {
        fields: 5,
        fieldNameSize: 50, // TODO: Check if this size is enough
        fieldSize: 20000, //TODO: Check if this size is enough
        fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
})
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error('file is not allowed'));
    }
}
