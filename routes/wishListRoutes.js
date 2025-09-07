const express = require('express');
const itemStructure = require('../db/models/itemStructure.js');
const requireLogin = require('../middleware/wishListLogin.js');

const router = express.Router();

//view wishlist
router.get('/', requireLogin, async (req,res)=>{
    try{
        const items = await itemStructure.findAll({ where: { userID: req.session.user.userID}});
        //pass all items found in database, and enable logout in 
        res.render('wishList', {items: items});
    } catch (err) {
        console.log(err);
    }
})

//if form is submitted, create a new entry
router.post('/add', async (req,res)=>{
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
router.post('/delete/:id', async (req,res)=>{
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

module.exports = router;