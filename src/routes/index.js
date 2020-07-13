const express = require('express');
const router = express.Router();
const Ofertauno = require('../models/ofertauno');
const Ofertados = require('../models/ofertados');
const Ofertatres = require('../models/ofertatres');
//const Order = require('../models/order');



router.get('/', async (req, res) => {
  const ofertauno = await Ofertauno.find();
  const ofertados = await Ofertados.find();
  const ofertatres = await Ofertatres.find();
  res.render('index', { ofertauno, ofertados, ofertatres
  });
});





module.exports = router;
