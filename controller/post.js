const Post = require("../model/post");

exports.getAllPost = async (req, res) => {
  try {
    const post = await Post.find().populate(
      "postedBy comments.postedBy",
      "name email _id"
    ).sort("-createdAt");
    res.status(200).json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.getsubPost = async (req, res) => {
  try {
    const post = await Post.find({
      postedBy: { $in: req.userfront.following },
    }).populate("postedBy comments.postedBy", "name email _id").sort("-createdAt");
    res.status(200).json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
      throw new Error("ALL fields must be thr");
    }
    req.body.postedBy = req.userfront._id;
    // console.log(req.body);
    const post = await Post.create(req.body);
    res.status(200).json({
      post,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
exports.mypost = async (req, res) => {
  try {
    //console.log(req.userfront);
    const mypost = await Post.find({ postedBy: req.userfront._id });
    res.status(200).json({ mypost });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
exports.like = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.userfront._id },
      },
      { new: true }
    ).populate("postedBy", "name email _id");
    res.status(200).json(post);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
exports.unlike = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.userfront._id },
      },
      { new: true }
    ).populate("postedBy", "name email");
    res.status(200).json(post);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
exports.comment = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.userfront._id,
    };
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    ).populate("comments.postedBy postedBy", "name _id");
    res.status(200).json(post);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
exports.deletepost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );
    if (post.postedBy._id.toString() === req.userfront._id.toString()) {
      const result = await post.remove();

      res.json(result);
    }
  } catch (err) {
    err: err.message;
  }
};
// exports.deletecomment = async (req, res) => {
//   try {
//     const post = await Post.findOne({ _id: req.params.postId }).populate(
//       "comments.postedBy",
//       "_id"
//     );
//     if (post.comments.postedBy._id.toString() === req.userfront._id.toString()) {
//      const result= await post.remove();

//       res.json(result);
//     }
//   } catch (err) {
//     err: err.message;
//   }
// };
