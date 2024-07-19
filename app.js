require("dotenv").config({ path: ".env.local" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./src/models/associations");
const sequelize = require("./src/lib/database");
const { errorHandler } = require("./src/lib/error");

const userRoutes = require("./src/routes/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use(errorHandler);

sequelize
  .sync({
    force: true,
    alter: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Wallit started on port: " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Could not connect to the database.");
    console.log(error);
  });
