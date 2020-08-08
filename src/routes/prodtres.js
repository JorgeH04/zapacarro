const express = require('express');
const router = express.Router();

 

// Models
const Prodtres = require('../models/prodtres');
const Cart = require('../models/cart');
//const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');






////////////////////////////////////////back/////////////////////////////////////////////////////7

router.post('/prodtres/new-prodtres',  async (req, res) => {
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
    const newNote = new Prodtres({ name, title, image, imagedos, imagetres, description, price, oldprice, filtroprice, color, colorstock  });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodtresback/:1');
  }
});





router.get('/prodtresback/:page', async (req, res) => {


  let perPage =12;
  let page = req.params.page || 1;

  Prodtres 
  .find()// finding all documents
  .sort({_id:-1})
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produno) => {
    Prodtres.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('prodtres/new-prodtres', {
        prodtres,
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
      Prodtres.find({title: regex}, function(err, prodtres){
         if(err){
             console.log(err);
         } else {
            if(prodtres.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("prodtres/new-prodtres",{prodtres, noMatch: noMatch});
         }
      });

  } else {
      // Get all campgrounds from DB
      Prodtres.find({}, function(err, prodtres){
         if(err){
             console.log(err);
         } else {
            res.render("prodtres/prodtres",{prodtres, noMatch: noMatch});
         }
      });
  }
});







/////////////////////////////////////////front//////////////////////////////////////////////////

router.get('/prodtresindex/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Prodtres 
  .find({}) // finding all documents
  .sort( {timestamp: -1})
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, prodtres) => {
    Prodtres.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('prodtres/prodtres', {
        prodtres,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});






router.get('/prodtresredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodtres = await Prodtres.findById(id);
  res.render('prodtres/prodtresredirect', {prodtres});
});





router.get("/search", function(req, res){
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Prodtres.find({title: regex}, function(err, prodtres){
         if(err){
             console.log(err);
         } else {
            if(prodtres.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("prodtres/prodtres",{prodtres, noMatch: noMatch});
         }
      });

  } else {
      // Get all campgrounds from DB
      Prodtres.find({}, function(err, prodtres){
         if(err){
             console.log(err);
         } else {
            res.render("prodtres/prodtres",{prodtres, noMatch: noMatch});
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
  var prodtres = Prodtres.find(flterParameter);
  prodtres
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    prodtres.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("prodtres/prodtres",
      {
        prodtres: data, 
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
  var prodtres = Prodtres.find(flterParameter);
  prodtres
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    prodtres.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("prodtres/prodtres",
      {
        prodtres: data, 
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
  var prodtres = Prodtres.find(flterParameter);
  prodtres
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    prodtres.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("prodtres/prodtres",
      {
        prodtres: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});
















/////////////////////////////crud//////////////////////////////7



// talle y color
router.get('/prodtres/tallecolor/:id',  async (req, res) => {
  const prodtres = await Prodtres.findById(req.params.id);
  res.render('prodtres/tallecolor-prodtres', { prodtres });
});

router.post('/prodtres/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodtres.updateOne({_id: id}, req.body);
  res.redirect('/prodtresredirect/' + id);
});




//editar


router.get('/prodtres/edit/:id',  async (req, res) => {
  const prodtres = await Prodtres.findById(req.params.id);
  res.render('prodtres/edit-prodtres', { prodtres });
});

router.post('/prodtres/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodtres.updateOne({_id: id}, req.body);
  res.redirect('/prodtres/add');
});




// Delete 
router.get('/prodtres/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodtres.deleteOne({_id: id});
  res.redirect('/prodtres/add');
});






router.get('/addtocardprodtres/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodtres.findById(productId, function(err, product){
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
