const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Ofertados = require('../models/ofertados');
const Ofertatres = require('../models/ofertatres');




router.get('/', async (req, res) => {
  const notes = await Note.find();
  const ofertados = await Ofertados.find();
  const ofertatres = await Ofertatres.find();
  res.render('index', { notes, ofertados, ofertatres
  });
});




module.exports = router;
