const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts-routes');
const cmsRoutes = require('./routes/cms-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/cms', cmsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route,', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent){
        return next(error);
    }
    
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'})
});

mongoose
    .connect('mongodb+srv://miodrag:mongodb123@cluster0.iaduj.mongodb.net/postsByDateDatabase?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
