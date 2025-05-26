const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const createReply = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { postId, text } = req.body;

    const reply = await prisma.reply.create({
      data: {
        text,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getReplies = async (req, res) => {
  const { postId } = req.params;
  try {
    const replies = await prisma.reply.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { username: true } } },
    });
    res.json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createReply, getReplies };
