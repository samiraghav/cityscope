const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('./cloudinary');
const prisma = new PrismaClient();

const signup = async (req, res) => {
  const { username, password, bio } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicUrl = null;

    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.buffer, 'profilePics');
    }

    const imageUrl = req.file
      ? await uploadToCloudinary(req.file.buffer, 'profilePics')
      : null;

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        bio,
        imageUrl
      }
    });


    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
