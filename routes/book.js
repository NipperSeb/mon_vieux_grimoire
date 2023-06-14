const express = require("express");
const router = express.Router();
const authentification = require("../middleware/auth");
const uploads = require("../middleware/multer-config");

const bookCtrl = require("../controllers/books");

router.post("/", authentification, uploads.uploadImg, bookCtrl.createNewBook);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", authentification, uploads.uploadImg, bookCtrl.modifyBook);
router.delete("/:id", authentification, bookCtrl.DeleteBook);
module.exports = router;
