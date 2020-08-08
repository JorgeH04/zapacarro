const express = require('express');
const router = express.Router();
 
// Models
const Prodcinco = require('../models/prodcinco');
const Cart = require('../models/cart');
//const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');







////////////////////////////////////////back/////////////////////////////////////////////////////7

router.post('/prodcinco/new-prodcinco',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, color, colorstock  } = req.body;
  const errors = [];
  if (!image) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!title) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      image,
      title,
      price
    });
  } else {
    const newNote = new Prodcinco({ name, title, image, imagedos, imagetres, description, price, oldprice, filtroprice, color, colorstock  });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodcincoback/:1');
  }
});





router.get('/prodcincoback/:page', async (req, res) => {


  let perPage =12;
  let page = req.params.page || 1;

  Prodcinco 
  .find()// finding all documents
  .sort({_id:-1})
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, prodcinco) => {
    Prodcinco.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('prodcinco/new-prodcinco', {
        prodcinco,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});








router.get("/searchback", function(req, res){
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Prodcinco.find({title: regex}, function(err, prodcinco){
         if(err){
             console.log(err);
         } else {
            if(produno.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("prodcinco/new-prodcinco",{prodcinco, noMatch: noMatch});
         }
      });

  } else {
      // Get all campgrounds from DB
      Prodcinco.find({}, function(err, prodcinco){
         if(err){
             console.log(err);
         } else {
            res.render("prodcinco/prodcinco",{prodcinco, noMatch: noMatch});
         }
      });
  }
});







/////////////////////////////////////////front//////////////////////////////////////////////////

router.get('/prodcincoindex/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Prodcinco 
  .find({}) // finding all documents
  .sort( {timestamp: -1})
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produno) => {
    Prodcinco.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('prodcinco/prodcinco', {
        prodcinco,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});






router.get('/prodcincoredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodcinco = await Prodcinco.findById(id);
  res.render('prodcinco/prodcincoredirect', {prodcinco});
});





router.get("/search", function(req, res){
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Prodcinco.find({title: regex}, function(err, prodcinco){
         if(err){
             console.log(err);
         } else {
            if(prodcinco.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("prodcinco/prodcinco",{prodcinco, noMatch: noMatch});
         }
      });

  } else {
      // Get all campgrounds from DB
      Prodcinco.find({}, function(err, prodcinco){
         if(err){
             console.log(err);
         } else {
            res.render("prodcinco/prodcinco",{prodcinco, noMatch: noMatch});
         }
      });
  }
});



/////////////////////////////////filter/////////////////////////////////////////////




router.post("/filtroprod", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtroprod;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ name:flrtName},
      {$and:[{},{}]}
      ]
       
    }
    }else{
      var flterParameter={}
  }
  var prodcinco = Prodcinco.find(flterParameter);
  prodcinco
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    prodcinco.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("prodcinco/prodcinco",
      {
        prodcinco: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});








router.post("/filtroprecio", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtroprice;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ filtroprice:flrtName},
      {$and:[{},{}]}
      ]
       
    }
    }else{
      var flterParameter={}
  }
  var prodcinco = Prodcinco.find(flterParameter);
  prodcinco
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    prodcinco.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("prodcinco/prodcinco",
      {
        prodcinco: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});






router.post("/filtrocolor", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtrocolor;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ color:flrtName},
      {$and:[{},{}]}
      ]
       
    }
    }else{
      var flterParameter={}
  }
  var prodcinco = Prodcinco.find(flterParameter);
  prodcinco
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    prodcinco.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("prodcinco/prodcinco",
      {
        prodcinco: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});



 

/////////////////////////////crud//////////////////////////////7



// talle y color
router.get('/prodcinco/tallecolor/:id',  async (req, res) => {
  const prodcinco = await Prodcinco.findById(req.params.id);
  res.render('prodcinco/tallecolor-prodcinco', { prodcinco });
});

router.post('/prodcinco/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcinco.updateOne({_id: id}, req.body);
  res.redirect('/prodcincoredirect/' + id);
});




//editar


router.get('/prodcinco/edit/:id',  async (req, res) => {
  const prodcinco = await Prodcinco.findById(req.params.id);
  res.render('prodcinco/edit-prodcinco', { prodcinco });
});

router.post('/prodcinco/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcinco.updateOne({_id: id}, req.body);
  res.redirect('/prodcinco/add');
});




// Delete 
router.get('/prodcinco/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodcinco.deleteOne({_id: id});
  res.redirect('/prodcinco/add');
});






router.get('/addtocardprodcinco/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodcinco.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shopcart');

  });
});



module.exports = router;
