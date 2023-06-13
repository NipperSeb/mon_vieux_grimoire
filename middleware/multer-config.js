const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./img");
  },

  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + Date.now() + "." + extension);
  },
});

const uploadImg = multer({ storage: multerStorage }).single("image");

module.exports = { uploadImg };
