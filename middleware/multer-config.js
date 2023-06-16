// const multer = require("multer");
// const sharp = require("sharp");
// const path = require("path");
// const fs = require("fs");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// };
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./img");
//   },

//   filename: (req, file, cb) => {
//     const name = file.originalname.replace(/[\s.]+/g, "_");
//     const extension = MIME_TYPES[file.mimetype];
//     cb(null, name + Date.now() + "." + extension);
//   },
// });

// const uploadImg = multer({ storage: multerStorage }).single("image");

// const resizeImage = (req, res, next) => {
//   // On vérifie si un fichier a été téléchargé
//   if (!req.file) {
//     return next();
//   }

//   const filePath = req.file.path;
//   const fileName = req.file.filename;
//   const outputFilePath = path.join("img", `${fileName}`);

//   sharp(filePath)
//     .resize({ width: 206, height: 260 })
//     .toFile(outputFilePath)
//     .then(() => {
//       // Remplacer le fichier original par le fichier redimensionné
//       fs.unlink(filePath, () => {
//         req.file.path = outputFilePath;
//         next();
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       return next();
//     });
// };
// module.exports = { uploadImg, resizeImage };

// ________________________________________________________________

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
    const name = req.file.originalname;
    const position = name.lastIndexOf(".");
    const shortName = name.substring(0, position);
    const newName = shortName.split(" ").join("_");
    const newExtension = newName + Date.now() + "." + "webp";

    sharp(req.file.buffer)
      // .resize({ width: 206, height: 260 })
      .resize(206, 260, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
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
