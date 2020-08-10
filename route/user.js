const express = require("express");

const router = express.Router();
const { isAuthenticated } = require("../controller/auth");
const { otheruser,follow,unfollow,updatepic } = require("../controller/user");

router.get("/user/:id", isAuthenticated, otheruser);

router.put("/follow", isAuthenticated, follow);
router.put("/unfollow", isAuthenticated, unfollow);
router.put("/updatepic", isAuthenticated, updatepic);

module.exports = router;
