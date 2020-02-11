const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Ofertatres = require('../models/ofertatres');
const Cart = require('../models/cart');
//const Order = require('../models/Order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');




router.post('/ofertatres/new-ofertatres',  async (req, res) => {
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
    const newNote = new Ofertatres({imagePath, product, color, talle, colorstock, tallestock, price});
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/ofertatres/add');
  }
});





router.get('/ofertatresredirect/:id', async (req, res) => {
  const { id } = req.params;
  const ofertatres = await Ofertatres.findById(id);
  //console.log(post);
  //res.send('recibido');
   res.render('ofertatres/ofertatresredirect', {ofertatres});
});








// New producto
router.get('/ofertatres/add',  async (req, res) => {
  const ofertatres = await Ofertatres.find();
  res.render('ofertatres/new-ofertatres',  { ofertatres });
});



router.get('/ofertatresbackend/:id', async (req, res) => {
  const { id } = req.params;
  const ofertatres = await Ofertatres.findById(id);
   res.render('ofertatres/ofertatresbackend', {ofertatres});
});






// talle y color
router.get('/ofertatres/tallecolor/:id',  async (req, res) => {
  const ofertatres = await Ofertatres.findById(req.params.id);
  res.render('ofertatres/tallecolor-ofertatres', { ofertatres });
});

router.post('/ofertatres/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertatres.updateOne({_id: id}, req.body);
  res.redirect('/ofertatresredirect/' + id);
});




//editar
router.get('/ofertatres/edit/:id',  async (req, res) => {
  const ofertatres = await Ofertatres.findById(req.params.id);
  res.render('ofertados/edit-ofertados', { ofertados });
});

router.post('/ofertatres/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertatres.updateOne({_id: id}, req.body);
  res.redirect('/ofertatresbackend/' + id);
});



// Delete 
router.get('/ofertatres/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Ofertatres.deleteOne({_id: id});
  res.redirect('/ofertatres/add');
});









router.get('/addtocardofertatres/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Ofertatres.findById(productId, function(err, product){
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
