const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const winston = require('./util/logger');

const sequelize = require('./util/database');

// MODELS
require('./models/user');

// ROUTES
const userRoutes = require('./routes/users');
const logger = require('./util/logger');

const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));

const logOptions = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(logOptions, { stream: winston.stream }));
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('*', (req, res) => {
    res.status(404).send('Resource not found');
});

app.use((err, req, res, next) => {
    logger.error(`${err.status} ${req.method} ${req.connection.remoteAddress} - s${req.originalUrl} HTTP/${req.httpVersion} ${err.message} ${req.header('Referer')}`)
    res.status(500).send('Something Went Wrong');
})

const PORT = process.env.PORT || 5000;

sequelize.sync();
app.listen(PORT, console.log("Server listening on port " + PORT));
