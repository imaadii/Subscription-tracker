import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';
import db_connection from './database/db.js';

import auth_router from './routes/auth.route.js';
import user_router from './routes/user.route.js';
import subscription_router from './routes/subscription.route.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', auth_router);
app.use('/api/v1/users', user_router);
app.use('/api/v1/subscriptions', subscription_router);

app.get('/', (req, res) => {
    res.send('Working Mode On');
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db_connection();
})