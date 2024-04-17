const router = require('express').Router();
const commonServices = require('../controllers/common.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const { StatusCodes } = require('http-status-codes');
const {
    tokenExtractor,
    verifyToken,
    superAdminScope,
} = require('../middleware/tokenAuth');

router.delete('/category/:id', commonServices.deleteCategory);
router
    .route('/category')
    .get(commonServices.getCategory)
    .post(commonServices.addCategory);

try {
    if (!fs.existsSync(path.resolve(__dirname, '..', 'files'))) {
        fs.mkdirSync(path.resolve(__dirname, '..', 'files'));
    }
} catch (error) {}

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: 'No file uploaded' });
        }
        const filename = req.file.filename;
        return res.status(StatusCodes.OK).json({ url: `/files/${filename}` });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error' });
    }
};

const getFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        console.log(res);
        const filePath = path.resolve(__dirname, '..', 'files', filename);
        if (fs.existsSync(filePath) === false) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'File not found' });
        }
        return res.sendFile(filePath);
    } catch (error) {
        console.error('Error getting file:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error' });
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadFolder = path.resolve(__dirname, '..', 'files');
            cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
            let originalName = file.originalname;
            if (originalName.length > 10) {
                originalName = originalName.substring(
                    originalName.length - 10,
                    originalName.length
                );
            }
            const sanitizedFilename = sanitize(`${Date.now()}-${originalName}`);
            cb(null, sanitizedFilename);
        },
    }),
    fileFilter: function (req, file, cb) {
        console.log('Mimetype: ' + file.mimetype.toLowerCase());
        if (file.mimetype.toLowerCase().includes('image')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image'));
        }
    },
});

router.post('/file', upload.single('image'), uploadImage);
router.get('/files/:filename', getFile);

router.get(
    '/students',
    tokenExtractor,
    verifyToken,
    superAdminScope,
    commonServices.getAllStudents
);

module.exports = router;
