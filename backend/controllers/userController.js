const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const {uploadToCloudinary} = require('./cloudinary')

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        bio: true,
        imageUrl: true,
        posts: {
          select: {
            id: true,
            text: true,
            type: true,
            location: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, bio } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (id !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    let imageUrl;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'profilePics');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: username || undefined,
        bio: bio || undefined,
        imageUrl: imageUrl || undefined
      }
    });

    res.json({ message: "Profile updated", updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPublicProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        bio: true,
        imageUrl: true,
        posts: {
          select: {
            id: true,
            text: true,
            type: true,
            location: true,
            imageUrl: true,
            createdAt: true,
            likes: true,
            dislikes: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getPublicProfile};
