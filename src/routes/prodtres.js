const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Prodtres = require('../models/prodtres');
const Cart = require('../models/cart');
const Order = require('../models/Order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');





router.get('/prodtresindex', async (req, res) => {
  const prodtres = await Prodtres.find();
  res.render('prodtres/prodtres', { prodtres });
});




router.post('/prodtres/new-prodtres',  async (req, res) => {
  const { imagePath, product, color, talle, colorstock, tallestock, price } = req.body;
  const errors = [];
  if (!imagePath) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!product) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      imagePath,
      product,
      price
    });
  } else {
    const newNote = new Prodtres({ imagePath, product, color, talle, colorstock, tallestock, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodtres/add');
  }
});






router.get('/prodtresredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodtres = await Prodtres.findById(id);
  res.render('prodtres/prodtresredirect', {prodtres});
});








// New product
router.get('/prodtres/add',  async (req, res) => {
  const prodtres = await Prodtres.find();
  res.render('prodtres/new-prodtres',  { prodtres });
});


router.get('/prodtresbackend/:id', async (req, res) => {
  const { id } = req.params;
  const prodtres = await Prodtres.findById(id);
   res.render('prodtres/prodtresbackend', {prodtres});
});




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
  res.redirect('/prodtresbackend/' + id);
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
    return res.render('/', {products:null})
  }
  var cart = new Cart(req.session.cart);
  res.render('cart/shopcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});


router.post('/checkoutstripe', async (req, res) => {

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  const customer = await stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
    });
  const charge = await stripe.charges.create({
    amount: cart.totalPrice * 100,
    description: 'Video Editing Software',
    currency: 'usd',
    customer: customer.id
     });
// Save this charge in your database
console.log(charge.id);
// Finally Show a Success View
res.render('checkout');
});

router.get('/checkout',isAuthenticated, function (req, res, next){
  
  var cart = new Cart(req.session.cart);
  res.render('notes/checkout', {total: cart.totalPrice})
});


router.post('/checkout', isAuthenticated, async (req, res, next)=>{
  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  const cart = new Cart(req.session.cart);

  const order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name

  });
  await order.save();
  req.flash('success_msg', 'Note Added Successfully');
  res.redirect('/notes');
  
})

module.exports = router;
