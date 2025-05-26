const { uploadToCloudinary } = require('./cloudinary');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const createPost = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { text, type, location } = req.body;

    if (!text || !type || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'posts');
    }

    const newPost = await prisma.post.create({
      data: {
        text,
        type,
        location,
        imageUrl,
        userId
      }
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  const { location, type } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.userId;
    } catch {
      // ignore if invalid
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
        type: type || undefined
      },
      include: {
        user: { select: { id: true, username: true, imageUrl: true } },
        replies: {
          include: { user: { select: { username: true } } }
        },
        reactions: currentUserId ? {
          where: { userId: currentUserId },
          select: { type: true }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = posts.map(post => ({
      ...post,
      userReaction: post.reactions?.[0]?.type || null
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const replyToPost = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const { postId, text } = req.body;

    if (!postId || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ message: 'postId and text are required' });
    }

    const reply = await prisma.reply.create({
      data: {
        text: text.trim(),
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(reply);
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ error: err.message });
  }
};

const reactToPost = async (req, res) => {
  const { type } = req.body; // 'like' or 'dislike'
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No token provided" });
  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: "Invalid reaction type" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const postId = id;

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (existingReaction && existingReaction.type === type) {
      return res.status(400).json({ message: `You already ${type}d this post` });
    }

    if (existingReaction) {
      await prisma.reaction.update({
        where: { userId_postId: { userId, postId } },
        data: { type }
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: type === 'like' ? { increment: 1 } : { decrement: 1 },
          dislikes: type === 'dislike' ? { increment: 1 } : { decrement: 1 }
        }
      });

      return res.json({ message: `Reaction updated to ${type}` });
    }

    await prisma.reaction.create({
      data: { userId, postId, type }
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        [type === 'like' ? 'likes' : 'dislikes']: {
          increment: 1
        }
      }
    });

    return res.json({ message: `Post ${type}d` });
  } catch (err) {
    console.error('React to post error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPost, getPosts, reactToPost, replyToPost };
