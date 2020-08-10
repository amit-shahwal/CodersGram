const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../controller/auth");
const { createPost, getAllPost,mypost,like,unlike, comment,deletepost ,getsubPost} = require("../controller/post");

router.post("/createPost", isAuthenticated, createPost);
//router.getPost("/getpost",isAuthenticated,getPost);
router.get("/getAllPost", isAuthenticated,getAllPost);
router.get("/getsubPost", isAuthenticated,getsubPost);
router.get("/mypost", isAuthenticated,mypost);
router.put("/like",isAuthenticated,like);
router.put("/unlike",isAuthenticated,unlike);
router.put("/comment",isAuthenticated,comment);
router.delete("/deletepost/:postId",isAuthenticated,deletepost)
module.exports = router;
