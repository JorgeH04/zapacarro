const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Note = require('../models/Note');
const Cart = require('../models/cart');
//const Order = require('../models/Order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/notes/add',  async (req, res) => {
  const notes = await Note.find();
  res.render('notes/new-note',  { notes });
});



router.post('/notes/new-note',  async (req, res) => {
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
    const newNote = new Note({ imagePath, product, color, talle, colorstock, tallestock, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/notes/add');
  }
});






router.get('/notesredirect/:id', async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  //console.log(post);
  //res.send('recibido');
   res.render('notes/notesredirect', {note});
});





// talle y color
router.get('/notes/tallecolor/:id',  async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('notes/tallecolor-notes', { note });
});

router.put('/notes/tallecolor/:id',  async (req, res) => {
  const { talle, color } = req.body;
  const note = await Note.findByIdAndUpdate(req.params.id, {talle, color});
  req.flash('success_msg', 'Talle y Color cargados exitosamente, ya puede efectuar su compra');
  res.redirect('/noteredirect/' + note);
});








// Get All Notes  {user: req.user.id}).sort({date: 'desc'}
router.get('/notes',  async (req, res) => {
  const notes = await Note.find();
  res.render('notes/all-notes', { notes });
});

// Edit Notes
router.get('/notes/edit/:id',  async (req, res) => {
  const note = await Note.findById(req.params.id);
  if(note.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  } 
  res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/notes');
});

// Delete Notes
router.get('/notes/delete/:id', async (req, res) => {
  //await Note.findByIdAndDelete(req.params.id);
  //req.flash('success_msg', 'Note Deleted Successfully');
  const { id } = req.params;
    await Note.deleteOne({_id: id});
  res.redirect('/notes/add');
});

router.get('/addtocard/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Note.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');

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
  res.render('notes/shopcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
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
