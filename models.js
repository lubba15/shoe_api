const mongoose = require('mongoose');
module.exports = function(mongoUrl) {
  mongoose.connect(mongoUrl);

  const shoeStock = mongoose.model('shoeStock',
   {
    brand: String,
    color: String,
    price: Number,
    size: Number,
    quantity: Number
  });
  return {
    shoeStock
  }
}
