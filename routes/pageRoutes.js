const express = require('express');
const projects = require('../src/data/projects');

const router = express.Router();

//route to homepage
router.get('/', (req,res)=>{
    res.render('index');
});

//demo page
router.get('/liveDemo', (req,res)=>{
    res.render('liveDemo', {projects});
})

//github projects page
router.get('/projects', (req,res)=>{
    res.render('projects', {projects});
})

//resume page
router.get('/resume', (req, res) => {
    res.render('resume');
});

//about page
router.get('/about', (req,res)=>{
    res.render('about');
})

//link to LinkedIn
router.get('/linkedin', (req,res)=>{
    res.redirect('https://www.linkedin.com/in/tony-liu-11a791189/')
})

//link to GitHub
router.get('/github', (req,res)=>{
    res.redirect('https://github.com/tony3129')
})

//snakegame page
router.get('/snakeGame',(req,res)=>{
    res.render('snake');
})

//weather page
router.get('/weatherApp',(req,res)=>{
    res.render('weather');
})

module.exports = router;