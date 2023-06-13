const Book = require("../models/books");

exports.createNewBook = (req, res, next) => {
  const bookDatas = JSON.parse(req.body.book);
  delete bookDatas._userId;

  const book = new Book({
    ...bookDatas,
    //check the user
    userId: req.auth.userId,
    // imageUrl: req.file.path,
    imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
    averageRating: bookDatas.ratings[0].grade,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
