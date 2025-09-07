const express = require('express');
const nodeMailer = require('nodemailer');

const router = express.Router();

//render contact page
router.get('/', (req, res) => {
    res.render('contact', {message: null});
});

//for contact form submission, utilize nodeMailer to send info to my email
router.post('/', (req, res) => {
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

module.exports = router;