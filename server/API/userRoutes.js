const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

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
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

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

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(`deleted user with ID: ${deletedUser._id}`);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

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

router.post("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: `🔥🗑️` });
});

module.exports = router;
