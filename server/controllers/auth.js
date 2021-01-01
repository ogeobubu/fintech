const Users = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const bcrypt = require("bcryptjs");

const { CLIENT_URL } = process.env;

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    if (!name || !email || !password || !number)
      return res.json({ msg: "Please fill in all fields." });

    if (!validateEmail(email)) return res.json({ msg: "Invalid email." });

    const user = await Users.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: "This email already exists.",
      });
    } else {
      if (password.length < 6)
        return res.json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = {
        name,
        email,
        number,
        password: passwordHash,
      };

      const createActivationToken = (payload) => {
        return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
          expiresIn: "1d",
        });
      };

      const activation_token = createActivationToken(newUser);

      console.log({ activation_token });

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;

      sendMail(email, url, "Verify your email address");

      res.json({
        msg:
          "Registration Successful! Please activate your email to start using our services.",
      });
    }
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.accountActivation = async (req, res) => {
  try {
    const { activation_token } = req.body;

    const user = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    const { name, email, password, number } = user;

    const check = await Users.findOne({ email });

    if (check) {
      return res.status(400).json({
        msg: "This email already exists.",
      });
    }

    const newUser = new Users({
      name,
      email,
      number,
      password,
    });

    await newUser.save();

    res.json({
      msg: "Account has been activated!",
    });
  } catch (err) {
    return res.json({
      msg: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.json({
        msg: "This email does not exist.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        msg: "Password is incorrect ",
      });
    }

    const refresh_token = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/users/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      msg: "Login success!",
    });
  } catch (err) {
    return res.json({
      msg: err.message,
    });
  }
};

exports.getAccessToken = (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;

    if (!rf_token) {
      return res.json({
        msg: "Please Login now!",
      });
    }

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Please login now!" });

      const access_token = createAccessToken({ id: user.id });
      res.json({ access_token });
    });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) return res.json({ msg: "This email does not exist." });

    const access_token = createAccessToken({ id: user._id });
    const url = `${CLIENT_URL}/user/reset/${access_token}`;

    sendMail(email, url, "Reset your password");
    res.json({ msg: "Reset password, please check your email." });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);

    const passwordHash = await bcrypt.hash(password, 12);

    await Users.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      }
    );

    res.json({ msg: "Password successfully changed!" });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getUsersAllInfo = async (req, res) => {
  try {
    const users = await Users.find().select("-password");

    res.json(users);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/users/refresh_token" });
    return res.json({ msg: "Logged out." });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    await Users.findByIdAndUpdate(
      { _id: req.user.id },
      {
        name,
      }
    );

    res.json({ msg: "Updated Successfully!" });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.updateUsersRole = async (req, res) => {
  try {
    const { role } = req.body;

    await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        role,
      }
    );

    res.json({ msg: "Updated role was successful!" });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);

    res.json({ msg: "Successfully deleted user!" });
  } catch (err) {
    return res.json({ msg: err.message });
  }
};
