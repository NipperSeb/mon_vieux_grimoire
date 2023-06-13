const express = require("express");
const router = express.Router();
const authentification = require("../middleware/auth");
const uploads = require("../middleware/multer-config");

const bookCtrl = require("../controllers/books");

router.post("/", authentification, uploads.uploadImg, bookCtrl.createNewBook);
module.exports = router;
