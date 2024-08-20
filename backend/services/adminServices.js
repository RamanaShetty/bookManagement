const db = require("../configuration/db");
const queries = require("../configuration/Queries");

exports.auditBooks = (req, res, next) => {
  try {
    db.query(queries.audit_books_query, (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "Nothing to show" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userBooks = (req, res, next) => {
  try {
    db.query(queries.user_books_query, (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "Nothing to show" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.genreBooks = (req, res, next) => {
  try {
    db.query(queries.genre_books_query, (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "Nothing to show" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userInfo = (req, res, nex) => {
  try {
    db.query(queries.user_info_query, (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "Nothing to show" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestInfo = (req, res, next) => {
  try {
    db.query(queries.request_info_query, (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: "Nothing to show" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestApprove = (req, res, next) => {
  const { id } = req.params;
  try {
    db.query(queries.request_approve_query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      db.query(
        "select user_id,book_id from bookrequests where id=?",
        [id],
        (err, results) => {
          if (err) {
            return res.status(500).send(err.message);
          }
          const data = results[0];
          db.query(
            queries.insert_into_personal,
            [data.user_id, data.book_id, data.book_id],
            (err, data) => {
              if (err) {
                return res.status(500).send(err.message);
              }
              return res.status(200).json({ message: "Updation successfull" });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestDecline = (req, res, next) => {
  const { id } = req.params;
  try {
    db.query(queries.request_decline_query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      return res.status(200).json({ message: "Decline Successfull" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;
  try {
    db.query(queries.user_delete_query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      return res.status(200).json({ message: "Decline Successfull" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
