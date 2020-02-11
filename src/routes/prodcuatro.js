const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Prodcuatro = require('../models/prodcuatro');
const Cart = require('../models/cart');
//const Order = require('../models/Order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');




router.get('/prodcuatroindex', async (req, res) => {
  const prodcuatro = await Prodcuatro.find();
  res.render('prodcuatro/prodcuatro', { prodcuatro });
});





router.post('/prodcuatro/new-prodcuatro',  async (req, res) => {
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
    const newNote = new Prodcuatro({ imagePath, product, color, talle, colorstock, tallestock, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodcuatro/add');
  }
});






router.get('/prodcuatroredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodcuatro = await Prodcuatro.findById(id);
  res.render('prodcuatro/prodcuatroredirect', {prodcuatro});
});








// New product
router.get('/prodcuatro/add',  async (req, res) => {
  const prodcuatro = await Prodcuatro.find();
  res.render('prodcuatro/new-prodcuatro',  { prodcuatro });
});


router.get('/prodcuatrobackend/:id', async (req, res) => {
  const { id } = req.params;
  const prodcuatro = await Prodcuatro.findById(id);
   res.render('prodcuatro/prodcuatrobackend', {prodcuatro});
});




// talle y color
router.get('/prodcuatro/tallecolor/:id',  async (req, res) => {
  const prodcuatro = await Prodcuatro.findById(req.params.id);
  res.render('prodcuatro/tallecolor-prodcuatro', { prodcuatro });
});

router.post('/prodcuatro/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcuatro.updateOne({_id: id}, req.body);
  res.redirect('/prodcuatroredirect/' + id);
});




//editar


router.get('/prodcuatro/edit/:id',  async (req, res) => {
  const prodcuatro = await Prodcuatro.findById(req.params.id);
  res.render('prodcuatro/edit-prodcuatro', { prodcuatro });
});

router.post('/prodcuatro/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcuatro.updateOne({_id: id}, req.body);
  res.redirect('/prodcuatrobackend/' + id);
});




// Delete 
router.get('/prodcuatro/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodcuatro.deleteOne({_id: id});
  res.redirect('/prodcuatro/add');
});






router.get('/addtocardprodcuatro/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodcuatro.findById(productId, function(err, product){
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
  res.render('cart/checkout', {total: cart.totalPrice})
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
  res.redirect('/shopcart');
  
})

module.exports = router;
