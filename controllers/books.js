const Book = require("../models/books");
const fs = require("fs");

//create
exports.createNewBook = (req, res, next) => {
  const bookDatas = JSON.parse(req.body.book);
  delete bookDatas._userId;

  const book = new Book({
    ...bookDatas,
    //check the user
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
    //return the first note
    averageRating: bookDatas.ratings[0].grade,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Read all books
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

//Read One book
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

//Update one book
exports.modifyBook = (req, res, next) => {
  //if new image or not
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/img/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  //delete image file
  if (bookObject) {
    Book.findOne({ _id: req.params.id }).then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/img/")[1];
        fs.unlink(`img/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id });
        });
      }
    });
  }
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Delete one book
exports.DeleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/img/")[1];
        fs.unlink(`img/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// find  3 books with the best average
exports.bestAverage = (req, res, next) => {
  Book.find()
    //order descending -1
    .sort({ averageRating: -1 })
    .limit(3)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

//change and update rating book
exports.ratingBook = (req, res, next) => {
  const url = req.url;
  const urlId = url.split("/")[1];

  const newUserId = req.body.userId;
  const newGrade = req.body.rating;

  const filter = { _id: urlId };

  //create a new objet ratings in the db
  const updatedData = {
    userId: newUserId,
    grade: newGrade,
  };
  if (0 <= req.body.rating <= 5) {
    Book.findOneAndUpdate(
      filter,
      { $push: { ratings: updatedData } },
      { new: true }
    )

      //calcul the average rating
      .then((updateAverage) => {
        const totalRatings = updateAverage.ratings.length;
        const sumRating = updateAverage.ratings.reduce(
          (acc, rating) => acc + rating.grade,
          0
        );
        updateAverage.averageRating = sumRating / totalRatings;

        return updateAverage.save();
      })
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }
};
