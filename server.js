//boilerplate ejs setup
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.render('index');
});

app.get('/projects', (req,res)=>{
    res.render('projects');
})

app.get('/resume', (req, res) => {
    res.render('resume');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req,res)=>{
    res.render('about');
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
