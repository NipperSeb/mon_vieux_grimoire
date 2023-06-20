const express = require("express");
const router = express.Router();
const authentification = require("../middleware/auth");
const uploads = require("../middleware/multer-config");
const bookCtrl = require("../controllers/books");

router.post(
  "/",
  authentification,
  uploads.uploadImg,
  uploads.compressImg,
  bookCtrl.createNewBook
);
router.post("/:id/rating", authentification, bookCtrl.ratingBook);

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.bestAverage);
router.get("/:id", bookCtrl.getOneBook);

router.put(
  "/:id",
  authentification,
  uploads.uploadImg,
  uploads.compressImg,
  bookCtrl.modifyBook
);
router.delete("/:id", authentification, bookCtrl.DeleteBook);

module.exports = router;
