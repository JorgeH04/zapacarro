const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  imagePath: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true
  }

});

module.exports = mongoose.model('Note', NoteSchema);