import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth.route.js';
import youthRouter from './src/routes/youth.route.js';
import adminRouter from './src/routes/admin.route.js';
import purokRouter from './src/routes/purok.route.js';
import verificationRouter from './src/routes/verification.route.js';
import dashboardRouter from './src/routes/dashboard.routes.js'
import post from './src/routes/post.route.js'
import comment from './src/routes/comments.route.js'
import reaction from './src/routes/reactions.route.js'
import inbox from './src/routes/inbox.route.js'


dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Project-ID']
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

//Api Routes
app.use('/api/auth', authRouter);
app.use('/api', youthRouter);
app.use('/api', adminRouter);
app.use('/api', purokRouter);
app.use('/api', verificationRouter);
app.use('/api', dashboardRouter);
app.use('/api', post);
app.use('/api', comment);
app.use('/api', reaction);
app.use('/api', inbox);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;