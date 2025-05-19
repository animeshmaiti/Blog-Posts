import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';

import mongoConnect from './db/mongoConnect.js';
import authRoutes from './routes/authRoute.js';
import createBlogRoutes from './routes/createBlogRoute.js';
import getBlogRoutes from './routes/getBlogRoutes.js';
import getUserRoutes from './routes/getUserRoutes.js';
import blogInteractionRoutes from './routes/blogInteractionRoutes.js';

configDotenv();
const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(cookieParser());
server.use(cors({
    origin:'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.use('/api/auth', authRoutes);
server.use('/api/create', createBlogRoutes);
server.use('/api/blog',getBlogRoutes);
server.use('/api/user',getUserRoutes);
server.use('/api/interaction',blogInteractionRoutes);

server.listen(PORT, () => {
    mongoConnect();
    console.log(`Server is running on http://localhost:${PORT}`);
});