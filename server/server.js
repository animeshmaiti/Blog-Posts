import express from 'express';
import { configDotenv } from "dotenv";
import mongoConnect from './db/mongoConnect.js';
import router from './routes/authRoute.js';

configDotenv();
const server = express();

const PORT = process.env.PORT || 3000;
server.use(express.json());


server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.use('/api/auth', router);

server.listen(PORT, () => {
    mongoConnect();
    console.log(`Server is running on http://localhost:${PORT}`);
});