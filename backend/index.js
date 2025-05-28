import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';

import router from "./src/routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4300;

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Project-ID']
}));

app.use(express.json({ 
    limit: "10mb"}
));
app.use(express.urlencoded({ 
    extended: true
}));

//Api Routes
app.use('/api', router);

const startServer = () => {
    console.log('Starting Server')
    app.listen(PORT, () => {
        console.log(`Server is running on port https://localhost:${PORT}`);
    }).on('error', (error) => {
        console.error('Error starting server:', error);
        process.exit(1);
    });
};

startServer();

