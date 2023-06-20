const multer = require("multer");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const checkType = Object.values(MIME_TYPES).includes(extension);

    if (checkType) {
      callback(null, true);
    } else {
      callback(new Error("Only image"));
    }
  },
});

const uploadImg = upload.single("image");

const compressImg = (req, res, next) => {
  if (req.file) {
    // clean the extension
    const name = req.file.originalname;
    const position = name.lastIndexOf(".");
    const shortName = name.substring(0, position);
    const newName = shortName.split(" ").join("_");
    const newExtension = newName + Date.now() + "." + "webp";

    // compress image
    sharp(req.file.buffer)
      .resize({ width: 206, height: 260 })
      .webp()
      .toFile("img/" + newExtension, (error) => {
        if (error) {
          next(error);
        } else {
          req.file.filename = newExtension;
          next();
        }
      });
  } else {
    next();
  }
};

module.exports = { uploadImg, compressImg };
