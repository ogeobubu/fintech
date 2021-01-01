const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config.js");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const authRoute = require("./routes/authRoute.js");

// ---------------
// MIDDLEWARE
// ---------------

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV == "development") {
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
}

app.use("/api/users", authRoute);

const URI = process.env.DATABASE;

mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB has successfully connected!");
  }
);

const PORT = process.env.PORT || process.env.PORT_PATH;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
