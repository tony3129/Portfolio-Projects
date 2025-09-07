//By Tony Liu, live demo for projects below:
//https://portfolio-projects-theta.vercel.app/

//to use variables within .env file
require('dotenv').config({path: './privateInfo.env'});
require('dotenv').config();
const path = require('path');
const projects = require('./src/data/projects.js');
//parser to get info sent in contact form
const bodyParser = require('body-parser');
//to be able to send emails from contact form
const nodeMailer = require('nodemailer'); // move?
//connection initialization and table structure
//require pg needed to work on vercel
require('pg');
const sequelize = require('./db/connection.js');
const itemStructure = require('./db/models/itemStructure.js') // move?
const userStructure = require('./db/models/userStructure.js') // move?
//bcrypt and clientSessions for login functionality
//bcryptjs needed to work on vercel
const bcrypt = require('bcryptjs'); // move?
const clientSessions = require('client-sessions');
const requireLogin = require('./middleware/wishListLogin.js');

const HTTP_PORT = process.env.PORT || 3000;

//boilerplate express config
const express = require('express');
const app = express();

//let express know to use ejs files to render views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended:false}));
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


app.get('/', (req,res)=>{
    res.render('index');
});

app.get('/liveDemo', (req,res)=>{
    res.render('liveDemo', {projects});
})

app.get('/projects', (req,res)=>{
    res.render('projects', {projects});
})

app.get('/resume', (req, res) => {
    res.render('resume');
});

app.get('/contact', (req, res) => {
    res.render('contact', {message: null});
});

app.get('/about', (req,res)=>{
    res.render('about');
})

app.get('/linkedin', (req,res)=>{
    res.redirect('https://www.linkedin.com/in/tony-liu-11a791189/')
})

app.get('/github', (req,res)=>{
    res.redirect('https://github.com/tony3129')
})

app.get('/snakeGame',(req,res)=>{
    res.render('snake');
})

app.get('/weatherApp',(req,res)=>{
    res.render('weather');
})

app.get('/login', (req,res)=>{
    res.render('login', {message: ''});
})

app.get('/register', (req,res)=>{
    res.render('register', {message: ''});
})

app.get('/logout', (req, res)=>{
    req.session.reset();
    res.redirect('/login');
})

app.get('/wishlist', requireLogin, async (req,res)=>{
    try{
        const items = await itemStructure.findAll({ where: { userID: req.session.user.userID}});
        //pass all items found in database, and enable logout in 
        res.render('wishList', {items: items});
    } catch (err) {
        console.log(err);
    }
})

//for contact form submission, utilize nodeMailer to send info to my email
app.post('/contact', (req, res) => {
    const { email, message } = req.body;
    var transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,  //port 465 for SSL
        secure: true,  //set true for SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASS 
        }
    });

    //layout how message will be sent
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'liu.h.tony@gmail.com',
        subject: 'New Portfolio Contact Form Submission from: ' + email,
        text: 'From Email:\n\n' + email + '\n\nMessage:\n\n' + message
    };
    //reload page with success or failure message
    transporter.sendMail(mailOptions)
        .then(() => {
            console.log('Form submitted');
            res.render('contact', {message: 'Form successfully submitted'});
        })
        .catch(err => {
            console.log('Error sending email: ' + err);
            res.render('contact', {message: 'Error submitting form. Please try again later'});
        });
});

app.post('/register', async (req, res)=>{
    //destructure information into variables
    const { username, email, password } = req.body;

    //hash password, then store in database
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await userStructure.create({
            userName: username,
            email: email,
            password: hashPassword
        });
        res.render('login', {message: 'Registration successful'});
    } catch (err){
        //reload register page with error message
        console.log(err)
        res.render('register', {message: 'Unable to register. Please try again later'})
    }
})
//verify user credentials, start client session for user
app.post('/login', async (req,res)=>{
    const { username, password } = req.body;

    try{
        //search database for user
        const user = await userStructure.findOne({ where: { userName: username } });

        if(!user) {
            res.render('login', { message: 'Invalid username or password'});
        }
        //see if password matches bcrypt hash
        const passMatch = await bcrypt.compare(password, user.password);

        if(!passMatch){
            res.render('login', {message: 'Invalid username or password'});
        }
        //if user is found and passwords match, send to wishlist route with modified req params
        req.session.user= {
            userID: user.userID,
            username: user.userName,
        };
        res.redirect('wishlist');
    } catch (err) {
        console.log(err);
        res.render('login', {message: 'Error logging in. Please try again later'});
    }
})

//if form is submitted, create a new entry
app.post('/wishlist/add', async (req,res)=>{
    console.log(req.body);
    const { title, desc, price, link } = req.body;

    try{
        //don't include itemID as its auto incremented
        const newItem = await itemStructure.create({
            title: title,
            desc: desc,
            price: price,
            link: link,
            userID: req.session.user.userID,
        })
        //send json response, so appending new card can be done
        res.json(newItem);
    } catch (err) {
        console.log(err);
    }
})

//allow deletion of items
app.post('/wishlist/delete/:id', async (req,res)=>{
    //delete based on itemID
    const {id} = req.params;

    try{
        await itemStructure.destroy({
            where: {itemID: id, userID: req.session.user.userID}
        });
        //redirect becomes redundant with jquery
        res.redirect('/wishlist');
    } catch(err){
        console.log(err);
        //redirect becomes redundant with jquery
        res.redirect('/wishlist');
    }
})

app.listen(HTTP_PORT, () => {
    console.log('Server is running on: ' + HTTP_PORT);
});

module.exports = app;