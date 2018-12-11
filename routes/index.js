var express = require('express');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Item = mongoose.model('Item');
// var ItemSettings = mongoose.model('ItemSettings');


//add item
router.post('/add', function(req,res,next){
    var item = new Item(req.body);
    item.save(function(err, item) {
    if (err) { return next(err); }
    res.json(item);
  });
});

// router.put('/update', function(req,res,next){
//     req.body.update();
// });

//get all items
router.get('/items', function(req, res, next) { //get is a read
  Item.find(function(err, items) {
    if (err) { return next(err); }
    res.json(items);
  });
});

//find item
router.param('item', function(req, res, next, id) {
  Item.findById(id, function(err, item) {
    if (err) { return next(err); }
    if (!item) { return next(new Error("can't find item")); }
    req.item = item;
    return next();
  });
});

router.get('/items/:item', function(req, res) {
  res.json(req.item);
});

//delete item 
router.delete('/items/:item', function(req, res) {
  console.log("in Delete");
  req.item.remove();
  res.sendStatus(200);
});

module.exports = router;
