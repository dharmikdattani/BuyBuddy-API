const mongoose = require("mongoose");
const Register = require("../models/register-payload");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const Validator = require("validatorjs");
const { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema } = require("../schema/authSchema")

function generateTokens(userId) {
  const payload = { _id: userId };
  const accessToken = jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: "30d"
  });
  return { accessToken, refreshToken };
}

const securePassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;

};

// new create user
const createNewUser = async (req, res) => {

  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {

    const { Firstname, Lastname, email, password, Address } = value;

    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ sucess: false, message: "Email already exists" }] });
    }

    const hashedPassword = await securePassword(password);

    const newUser = new Register({
      _id: new mongoose.Types.ObjectId(),
      Firstname,
      Lastname,
      email,
      password: hashedPassword,
      Address,
    });

    const result = await newUser.save();
    res.status(200).json({ success: true, message: "User created successfully", data: result });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// create LoginAPI
const loginApi = async (req, res) => {
  try {

    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    const user = await Register.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User with this email does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Login successful
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken
    user.accessToken = accessToken
    user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        email: user.email,
        Address: user.Address,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Refresh token
const refreshToken = async (req, res) => {

  const { error, value } = refreshTokenSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { refreshToken } = value;

  try {

    const decoded = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
    const userId = decoded._id;

    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newTokens = generateTokens(userId);

    user.refreshToken = newTokens.refreshToken;
    res.json({ success: true, message: "Refresh Token successful!", ...newTokens });

  } catch (error) {
    console.error("Error refreshing token:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token expired. Please re-login" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
  }
};

// Forgot-password API
const forgotPassword = async (req, res) => {
  try {

    const { error, value } = forgotPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = value;

    const userData = await Register.findOne({ email });

    if (!userData) {
      return res.status(404).json({ success: false, msg: "Email not found" });
    }

    if (userData) {
      const randomString = randomstring.generate();
      await Register.updateOne({ email }, { $set: { token: randomString } });
      await setResetPasswordMail(
        userData.Firstname,
        userData.email,
        randomString
      );
      res
        .status(200)
        .json({ success: true, msg: "Please check your mailbox and reset your password" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// email using with nodemailer
const setResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.emailUser,
        pass: process.env.emailPassword,
      },
    });

    const templatePath = path.join(__dirname, "../views/template.html");
    const template = fs.readFileSync(templatePath, "utf8");

    const resetLink = `http://localhost:3500/auth/reset_password?token=${token}`;
    const html = template.replace("{{resetLink}}", resetLink);

    const mailOptions = {
      from: process.env.emailUser,
      to: email,
      subject: "For Reset Password",
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw error;
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { password } = req.body;

  const validation = new Validator(req.body, { password: "required" });
  if (!validation.passes()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }

  try {

    const hashedPassword = await securePassword(password);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createNewUser,
  loginApi,
  forgotPassword,
  resetPassword,
  refreshToken,
};
