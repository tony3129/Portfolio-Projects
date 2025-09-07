//By Tony Liu, live demo for projects below:
//https://portfolio-projects-theta.vercel.app/

//to use variables within .env file
require('dotenv').config({path: './privateInfo.env'});
require('dotenv').config();
const path = require('path');
const projects = require('./src/data/projects.js');
//parser to get info sent in contact form
const bodyParser = require('body-parser');
//require pg needed to work on vercel
require('pg');
const sequelize = require('./db/connection.js');
//bcrypt and clientSessions for login functionality
//bcryptjs needed to work on vercel
const clientSessions = require('client-sessions');
const requireLogin = require('./middleware/wishListLogin.js');

//import custom routes
const authRoutes = require('./routes/authRoutes.js');
const pageRoutes = require('./routes/pageRoutes.js');
const wishListRoutes = require('./routes/wishListRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');

const HTTP_PORT = process.env.PORT || 3000;

//boilerplate express config
const express = require('express');
const app = express();

//let express know to use ejs files to render views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended:false}));

//session setup
app.use(clientSessions({
    cookieName: 'session',
    secret: process.env.CLIENT_SESSIONS_KEY,
    //10 minute sessions
    duration: 10 * 60 * 1000,
    //extend session by 5 minutes if active
    activeDuration: 5 * 60 * 1000,
}))

//establish connection to database for wish list, connection is through /db/connection.js
sequelize.authenticate().then(()=>{
    console.log('Connection established successfully.');
}).catch((err)=>{
    console.log('Unable to connect to database: ',err)
});

//create database tables
sequelize.sync({force:false}).then(()=>{
    console.log('Database synced successfully')
}).catch((err)=>{
    console.log('Unable to sync database: ' + err)
})

//routes
app.use('/', authRoutes);
app.use('/', pageRoutes);
app.use('/wishlist', requireLogin, wishListRoutes);
app.use('/contact', contactRoutes);

app.listen(HTTP_PORT, () => {
    console.log('Server is running on: ' + HTTP_PORT);
});

module.exports = app;