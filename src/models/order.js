const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
  user: { 
  //  type: Schema.Types.ObjectId, 
    type: ObjectId,
    ref: 'User'},

    cart: {
      type: Object,
      required: true
    },
   // timestamp: { type: Date, default: Date.now() },
  // address: {
   //  type: String,
   // required: true
   //},
   name: {
    type: String,
   required: true
   },
   direccion: {
    type: String,
   required: true
   },
   telefono: {
    type: Number,
   required: true
   },
   timestamp: { type: Date, default: Date.now() }

});

module.exports = mongoose.model('Order', OrderSchema);
