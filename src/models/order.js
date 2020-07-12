const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'},

    username: { 
      type: Schema.Types.ObjectId, 
      ref: 'User'},
    
      
    
  cart: {
    type: Object,
    required: true
  },
  timestamp: { type: Date, default: Date.now() }

  //,
  //address: {
   // type: String,
   // required: true
 // },
 // name: {
 //   type: String,
  //  required: true
  //}
});

module.exports = mongoose.model('Order', OrderSchema);
