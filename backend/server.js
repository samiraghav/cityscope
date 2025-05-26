require('dotenv').config();
const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const replyRoutes = require('./routes/replyRoutes');


const prisma = new PrismaClient();

const allowedOrigins = [
  'http://localhost:5173',
  'https://cityscope-fawn.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reply', replyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', async () => {
  console.log('Disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});
