module.exports = function(models) {

  const allShoes = function(req, res, next) {
    models.shoeStock.find({},
      function(err, Shoes) {
        if (err) {
          return next(err);
        }
        res.send({
          Shoes
        })
      })
  }

  const addShoes = function(req, res, next) {
    var addShoes = req.body
    // console.log('Add ' + addShoes);
    models.shoeStock.findOneAndUpdate({
      brand: addShoes.brand,
      color: addShoes.color,
      price: addShoes.price,
      size: addShoes.size,
    }, {
      $inc: {
        quantity: addShoes.quantity
      }
    }, function(err, newShoe) {
      if (err) {
        return next(err)
      } else if (!newShoe) {
        models.shoeStock.create({
            brand: addShoes.brand,
            color: addShoes.color,
            price: addShoes.price,
            size: addShoes.size,
            quantity: addShoes.quantity
          },
          function(err, newShoe) {
            if (err) {
              return next(err)
            }
          })
      }
      res.send({
        newShoe: newShoe
      })
    })
  }

  const soldStock = function(req, res, next) {
    var id = req.params.id;
    models.shoeStock.findOne({
      _id: id
    }, function(err, results) {}).then(function(results) {
      if (results.quantity <= 1) {
        results.remove();
        res.json({
          results: 'Out of stock'
        })
      } else {
        models.shoeStock.findOneAndUpdate({
            _id: id
          }, {

            $inc: {
              quantity: -1
            }
          }, {
            upSet: false
          },
          function(err, sold) {
            if (err) {
              return next(err)
            }

            console.log(sold);
            res.send({
              sold
            })
          })
      }
    })
  }
  const brandname = function(req, res, next) {
    var shoeBrand = req.params.brandname;
    models.shoeStock.find({
      brand: shoeBrand
    }, function(err, brandName) {
      if (err) {
        return next(err)
      }
      res.send({
        brandName
      })
    })
  }
  const size = function(req, res, next) {
    var shoeSize = req.params.size;
    models.shoeStock.find({
      size: shoeSize
    }, function(err, sizes) {
      if (err) {
        return next(err)
      }
      res.send({
        sizes
      })
    })
  }
  const brandAndSize = function(req, res, next) {
    var shoeBrand = req.params.brandname;
    var shoeSize = req.params.size;
    models.shoeStock.find({
      brand: shoeBrand,
      size: shoeSize
    }, function(err, brandAndSizes) {
      if (err) {
        return next(err)
      } else {
        res.send({
          brandAndSizes
        })
      }
    })
  }

  return {
    allShoes,
    addShoes,
    soldStock,
    brandname,
    size,
    brandAndSize

  }
}
