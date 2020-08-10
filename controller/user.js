const User = require("../model/user");
const Post = require("../model/post");

exports.otheruser = async (req, res) => {
  try {
  // console.log(req.params.id);
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    const post = await Post.find({ postedBy: req.params.id }).populate(
      "postedBy",
      "_id name"
    );
    res.status(200).json({ user, post });
    // res.status(200).json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
};
exports.follow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.userfront._id },
      },
      { new: true }
    );
    const user2 = await User.findByIdAndUpdate(
      req.userfront._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    ).select("-password");
  //  console.log("user2==", user2);
    res.json(user2);
  } catch (error) {
    res.json({ error: error.message });
  }
};
exports.unfollow = async (req, res) => {
  try {
  //  console.log("unfollow", req.body.unfollowId);
    const user = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.userfront._id },
      },
      { new: true }
    );
    const user2 = await User.findByIdAndUpdate(
      req.userfront._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    ).select("-password");
   // console.log("user2", user2);
    res.json(user2);
  } catch (error) {
    res.json({ error: error.message });
  }
};
exports.updatepic = async (req, res) => {
  try {
//    console.log(req.body);
    const user = await User.findByIdAndUpdate(req.userfront._id, {
      photo: req.body.photo,
    });
  //  console.log(user);
    res.json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
};
