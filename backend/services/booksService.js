const db = require("../configuration/db");
const queries = require("../configuration/Queries");

exports.getAllBooks = (req, res, next) => {
  const id = req.userId;
  try {
    db.query(queries.get_all_books_query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "No Books Found" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getBooksForPersonal = (req, res, next) => {
  const id = req.userId;
  try {
    db.query(queries.get_books_to_personal_query, [id], (err, data) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (data.length === 0) {
        return res.status(404).send({ message: "No Books Found" });
      }
      const newResults = data.map((result) => {
        return result.added_by === id
          ? { ...result, required: "yes" }
          : { ...result, required: "no" };
      });
      return res.status(200).json(newResults);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.insertABook = (req, res, next) => {
  const { title, author, genre, publication_year } = req.body;
  const userId = req.userId;
  db.query(
    queries.insert_a_book_query,
    [title, author, genre, publication_year, userId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
      return res.status(201).json({ message: "Book inserted Successfully" });
    }
  );
};

exports.deleteBookFromPersonal = (req, res, nex) => {
  const { id } = req.params;
  const bookId = parseInt(id, 10);
  try {
    db.query(queries.delete_book_from_personal_query, [bookId], (err, data) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      return res.status(200).json({ message: "Book deleted successfully" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.requestBook = (req, res, next) => {
  const { id } = req.params;
  const bookId = parseInt(id, 10);
  const userId = req.userId;

  if (!userId || !bookId) {
    return res.status(400).send("Missing user_id or book_id");
  }

  db.query(queries.request_insert_query, [userId, bookId], (err, result) => {
    if (err) {
      return res.status(500).send("Error creating book request");
    }
    return res.status(201).send("Book request created successfully");
  });
};

exports.requestAll = (req, res, next) => {
  const id = req.userId;
  try {
    db.query(queries.request_all_query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "No Requests Found" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
