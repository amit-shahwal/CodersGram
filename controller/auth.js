const User = require("../model/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");
const superagent = require("superagent");

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.trim() });
    if (!user) {
      throw new Error("USER NOT REGISTERED");
    }
    // var hash = await bcrypt.hashS(process.env.SECRET, 8);

    const truee = await bcrypt.compare(req.body.password, user.password);

    if (truee) {
      var token = jwt.sign({ id: user._id }, process.env.SECRET);
      // console.log(token);
    } else {
      throw new Error("Invalid password");
    }
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    });
    user.password = undefined;

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.signout = (req, res) => {
  res.clearCookie("jwt");
  res.json({
    message: "signout",
  });
};
exports.signup = async (req, res) => {
  try {
    var hash = await bcrypt.hash(req.body.password, 12);
    // console.log(hash);
    if (!req.body.email || !req.body.password || !req.body.name) {
      throw new Error("please enter all fields");
    }
    const userpre = await User.findOne({ email: req.body.email });
    if (userpre) {
      throw new Error("User already exists");
    }
    req.body.password = hash;
    const user = await User.create(req.body);
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // console.log(req.headers);
    if (!token) {
      throw new Error("You must be logged in!");
    }
    var decoded = jwt.verify(token, process.env.SECRET);
    const freshuser = await User.findById(decoded.id);
    if (freshuser) {
      req.userfront = freshuser;

      // console.log(req.userfront);
      next();
    } else {
      throw new Error("ERROR IN LOGIN");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.uploadphoto = (req, res) => {
  const form = formidable({ multiples: true });
  let product = new User();
  //console.log(product.photo);
  form.parse(req, async (err, fields, file) => {
    try {
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
      if (err) {
        return res.json(err);
      }
      const user = await User.findByIdAndUpdate(req.userfront._id, {
        photo: product.photo,
      });

      res.json(user);
    } catch (err) {
      // console.log(err.message);
    }
  });
};
exports.getphoto = (req, res) => {
  // console.log(req.userfront.photo.data);
  if (req.userfront.photo.data) {
    res.set("Content-Type", req.userfront.photo.contentType);
    return res.send(req.userfront.photo.data);
  }
};
exports.uploadphotoincloud = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, file) => {
    try {
      var d = { file: file.file };
      //   console.log(d);
      if (err) {
        return res.json(err);
      }
      const data = await superagent
        .post("https://api.cloudinary.com/v1_1/cha/image/upload")
        .send({
          file: file.file,
          upload_preset: "insta-clone",
          cloud_name: "cha",
        });
      // console.log(data);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });
};
