require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 2222;
const authRoute = require("./route/auth.js");
const postRoute = require("./route/post");
const userRoute = require("./route/user");
const DB = process.env.DB;
const cors = require("cors");
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log("connected successfully"));
// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  // console.log("this is a middleware");
  next();
});
//router
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", userRoute);
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port, () => console.log(`listening on port ${port}`));
