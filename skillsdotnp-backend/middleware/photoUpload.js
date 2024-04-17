// const path = require("path");
// const multer = require("multer");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploads = path.resolve(__dirname + "/../uploads");
//     cb(null, uploads);
//   },

//   filename: (req, file, cb) => {
//     req.body.uploadFileName = Date.now() + "-" + file.originalname;
//     cb(null, req.body.uploadFileName);
//   },
// });

// const validExtensions = [".jpg", ".jpeg", ".png"];

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (!validExtensions.includes(ext)) return cb(null, false);
//     return cb(null, true);
//   },
// });

// module.exports = upload;
