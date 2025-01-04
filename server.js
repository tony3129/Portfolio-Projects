//to use variables within .env file
require('dotenv').config({path: './privateInfo.env'});
const projects = require('./src/projects.js');
//parser to get info sent in contact form
const bodyParser = require('body-parser');
//to be able to send emails from contact form
const nodeMailer = require('nodemailer');
//boilerplate express config
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));


app.get('/', (req,res)=>{
    res.render('index');
});

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

app.get('/snakeGame',(req,res)=>{
    res.render('snake');
})

app.get('/weatherApp',(req,res)=>{
    res.render('weather');
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
            console.log(err);
            res.render('contact', {message: 'Error submitting form. Please try again later'});
        });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
