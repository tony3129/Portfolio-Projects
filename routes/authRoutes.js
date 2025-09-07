const express = require('express');
const bcrypt = require('bcryptjs');
const userStructure = require('../db/models/userStructure.js');

const router = express.Router();

//login page
router.get('/login', (req,res)=>{
    res.render('login', {message: ''});
})

//verify user credentials, start client session for user
router.post('/login', async (req,res)=>{
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

//logout
router.get('/logout', (req, res)=>{
    req.session.reset();
    res.redirect('/login');
})

//register page
router.get('/register', (req,res)=>{
    res.render('register', {message: ''});
})

//register logic
router.post('/register', async (req, res)=>{
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

module.exports = router;