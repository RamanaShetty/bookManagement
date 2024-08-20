const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./configuration/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", require("./controller/routes.js"));

db.connect((err) => {
  if (err) {
    console.log("user: ", process.env.MYSQL_USER);
    console.log(err.message);
    return;
  }
  console.log(`Database Connection is successful...`);
  app.listen(process.env.PORT || 8080, () => {
    console.log(
      `The app is listening on port - ${process.env.PORT || 8080}...`
    );
  });
});
