//where we deal with our schema
var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name: String,
  img: String,
  price: Number,
  orderEvery: String,
  autoOrder: Boolean,
  useEmail: Boolean,
  usePhone: Boolean,
  text: String,
  email: String,
  mobilNotif : Boolean,
  nextOrder: String,
  vendor: String
});

ItemSchema.methods.update = function(autoOrder, text, email, mobile, nextOrder, vendor, cb) {
  this.autoOrder = autoOrder;
  this.text = text;
  this.email = email;
  this.mobilNotif = mobile;
  this.nextOrder = nextOrder;
  this.vendor = vendor;
  this.save(cb);
};

mongoose.model('Item', ItemSchema);


