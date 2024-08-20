const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require("../configuration/db");
const queries = require("../configuration/Queries");

exports.register = async (req, res, next) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).send("Please fill in all the required fields!");

  try {
    db.query(
      queries.find_user_by_username,
      [username],
      async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        if (results.length > 0) {
          return res.status(409).json({ message: "Username already exists" });
        }

        const hashpwd = await hash(password, 12);
        db.query(
          queries.add_user_query,
          [username, hashpwd, role],
          (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: err.message });
            }
            const token = sign(
              { username: username, id: data.insertId },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            return res.status(201).json({ token, role });
          }
        );
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Please fill in all the required fields!");
  try {
    db.query(queries.find_user_by_username, [username], async (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      if (data.length <= 0) {
        return res
          .status(409)
          .json({ message: "User or Admin does not exists" });
      }
      const isMatch = await compare(password, data[0].password);
      if (!isMatch) {
        return res.status(400).send("Invalid credentials");
      }
      const token = sign(
        { username: username, id: data[0].id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(201).json({ token, role: data[0].role });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
