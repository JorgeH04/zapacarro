const express = require('express');
const router = express.Router();
const mercadopago = require("mercadopago");


// Models
const Produno = require('../models/produno');
const Cart = require('../models/cart');
const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');



///////////////////////////////////////////////////////////////////////7

router.post('/produno/new-produno',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, price } = req.body;
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
    const newNote = new Produno({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/produnoback/1');
  }
});



router.get('/produnoredirect/:id', async (req, res) => {
  const { id } = req.params;
  const produno = await Produno.findById(id);
  res.render('produno/produnoredirect', {produno});
});



////////////////////////////////////////////////////////////////7


router.get('/produnoindex/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produno 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produno) => {
    Produno.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('produno/produno', {
        produno,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});





router.get("/search", function(req, res){
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno
      // finding all documents
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produno) => {
       Produno.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("produno/produno",{
              produno, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Produno.find({}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            res.render("produno/produno",{
              produno,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});















///////////////////////////////////////////////////////////
router.get('/produnoback/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produno 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produno) => {
    Produno.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('produno/new-produno', {
        produno,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});


router.get("/searchback", function(req, res){
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno
      // finding all documents
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produno) => {
       Produno.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("produno/new-produno",{
              produno, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Produno.find({}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            res.render("produno/new-produno",{
              produno,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});


router.get('/produnobackend/:id', async (req, res) => {
  const { id } = req.params;
  const produno = await Produno.findById(id);
   res.render('produno/produnobackend', {produno});
});


///////////////////////////////////////////////////////////////////////////7



// talle y color
router.get('/produno/tallecolor/:id',  async (req, res) => {
  const produno = await Produno.findById(req.params.id);
  res.render('produno/tallecolor-produno', { produno });
});

router.post('/produno/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Produno.updateOne({_id: id}, req.body);

  res.redirect('/produnoredirect/' + id);
});




//editar


router.get('/produno/edit/:id',  async (req, res) => {
  const produno = await Produno.findById(req.params.id);
  res.render('produno/edit-produno', { produno });
});

router.post('/produno/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Produno.updateOne({_id: id}, req.body);
  res.redirect('/produno/add');
});




// Delete 
router.get('/produno/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Produno.deleteOne({_id: id});
  res.redirect('/produno/add');
});







router.get('/addtocardproduno/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Produno.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shopcart');

  });
});


router.get('/sumar/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.sumar(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});


router.get('/shopcart', function (req, res, next){
  if(!req.session.cart){
    return res.render('cart/shopcart', {products:null})
  }
  var cart = new Cart(req.session.cart);
  res.render('cart/shopcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});



//router.get('/checkout',isAuthenticated, function (req, res, next){
  router.get('/checkout', function (req, res, next){
  var cart = new Cart(req.session.cart);
  res.render('cart/checkout', {products: cart.generateArray(), total: cart.totalPrice})
});



//router.post('/checkout', isAuthenticated, async (req, res, next)=>{  



router.get('/checkout', function (req, res, next){
  var cart = new Cart(req.session.cart);
  res.render('cart/checkout', {products: cart.generateArray(), total: cart.totalPrice})
});



router.post('/confirmacion', isAuthenticated, async (req, res, next)=>{
  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  const cart = new Cart(req.session.cart);

  const order = new Order({
    user: req.user,
    cart: cart,
    //address: req.body.address,
    name: req.user.name,
    direccion: req.user.direccion,
    telefono: req.user.telefono
    //timestamp:req.body.timestamp

  });
  console.log(order)
  await order.save();
  req.flash('success_msg', 'Note Added Successfully');
  res.redirect('/prepagar');
  
})


router.get('/prepagar', function (req, res, next){
  var cart = new Cart(req.session.cart);
  res.render('cart/prepagar', {products: cart.generateArray(), total: cart.totalPrice})
});




router.post('/checkout',isAuthenticated,  async (req, res) => {

  if(!req.session.cart){
    return res.render('/', {products:null})
 }
 const cart = new Cart(req.session.cart);

  mercadopago.configure({
      //insert your access_token
     // access_token: process.env.ACCESS_TOKEN
     access_token: 'TEST-1727718622428421-041715-2360deef34519752e5bd5f1fca94cdf1-344589484',
     publicKey: 'TEST-662a163b-afb0-4994-9aea-6be1cca2decd'
   // access_token: 'APP_USR-1727718622428421-041715-07777da5a8f8451aba826d2727adeadd-344589484',
     //publicKey: 'APP_USR-9abfa6a9-7a19-45c9-9d13-15edf5baf8f7'
  
  
    });
  
    // Cria um objeto de preferência
    let preference = {
      items: [
        {
          title: "Total a pagar:",
          unit_price: cart.totalPrice, 
          quantity: 1
        }
      ]
    };

   
    mercadopago.preferences
      .create(preference)
      .then(function(response) {
        global.init_point = response.body.init_point;
        var preference_id = response.body.id;
        res.render("cart/checkout", { preference_id });
      })
      .catch(function(error) {
        res.render("error");
        console.log(error);
      });
    
});  



module.exports = router;
