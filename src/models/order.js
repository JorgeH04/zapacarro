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
    }
   // timestamp: { type: Date, default: Date.now() },
  // address: {
   //  type: String,
   // required: true
   //},
  // name: {
    // type: String,
  //  required: true
  // }
});

module.exports = mongoose.model('Order', OrderSchema);
