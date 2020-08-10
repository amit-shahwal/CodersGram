const express = require("express");

const router = express.Router();
const {
  signin,
  signout,
  signup,
  isAuthenticated,
  uploadphoto,
  getphoto,
  uploadphotoincloud
} = require("../controller/auth");
const { route } = require("./post");
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/signup", signup);
router.post("/photo", isAuthenticated, uploadphoto);
router.get("/getphoto", isAuthenticated, getphoto);
router.post("/uploadphotoincloud",uploadphotoincloud)
module.exports = router;



