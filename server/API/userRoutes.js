const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Find users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Find a specific User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Finds a User by email and confirms their password
router.post("/confirm", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user, req.body);
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (valid) {
      res.status(201).json({ message: "success" });
    }
    if (!valid) {
      res.status(500).json({ message: "womp womp" });
    }
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Creates a new User
router.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    const data = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign({ data }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    console.log(token);
    res.json({ data, token });
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Update a specific User's details
router.put("/update/:id", async (req, res) => {
  const patch = req.body;
  console.log(patch);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: patch },
      { new: true }
    );
    const data = {
      id: user._id,
      email: user.email,
    };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Deletes a specific User
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(`deleted user with ID: ${deletedUser._id}`);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Login a User
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ message: "NOPE" });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.json({ message: "BIG NOPE" });
    }
    const data = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(data, "SECRET_KEY", { expiresIn: "4h" });
    res.json({ token, data });
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

// Log a User out
router.post("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: `🔥🗑️` });
});

// Check for valid token
router.post("/validate", async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const valid = await jwt.verify(token, process.env.JWT_SECRET);
    if (!valid) {
      res.json({ message: "Invalid Token" }).status(500);
    }
    res.json({ message: "Success", valid }).status(200);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
