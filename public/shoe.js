var dropDown = document.querySelector('.dropDownTamplate').innerHTML;
var drop = Handlebars.compile(dropDown);
var tamplate = document.querySelector('#tableTamplate').innerHTML;
var table = Handlebars.compile(tamplate);

var display = document.querySelector('#display');
var message = document.querySelector('.message');

var brandAndSize = document.querySelector('.brandAndSize');


$(document).ready(function() {
  $.ajax({
    url: '/api/shoes',
    type: 'GET',
    success: function(data) {
      var data = data.Shoes
      display.innerHTML = table({
        shoe: data
      })
      var UniqueBrand = [];
      var brandMap = {};
      for (var i = 0; i < data.length; i++) {
        var shoeBrand = data[i];
        if (brandMap[shoeBrand.brand] === undefined) {
          brandMap[shoeBrand.brand] = shoeBrand.brand;
          UniqueBrand.push(shoeBrand.brand);
        }
      }
      var sorted = UniqueBrand.sort();
      document.querySelector(".brands").innerHTML = drop({
        shoeData: UniqueBrand
      });
      var UniqueSize = [];
      var sizeMap = {};
      for (var i = 0; i < data.length; i++) {
        var shoeSize = data[i];
        if (sizeMap[shoeSize.size] === undefined) {
          sizeMap[shoeSize.size] = shoeSize.size;
          UniqueSize.push(shoeSize.size);
        }
      }
      var sorted = UniqueSize.sort();
      document.querySelector(".sizes").innerHTML = drop({
        shoeData: UniqueSize
      });
    }
  })

  $('.brandAndSize').on('change', function() {

    var display = document.querySelector('#display');
    var Selectbrands = document.querySelector('.brands').value;
    var Selectsizes = document.querySelector('.sizes').value;

    if (Selectbrands !== "" && Selectsizes !== "") {
      $.ajax({
        url: '/api/shoes/brand/' + Selectbrands + '/size/' + Selectsizes,
        type: 'GET',
        success: function(SizeWthBrand) {
          if (SizeWthBrand.brandAndSizes.length <= 1) {
            display.innerHTML = 'Sorry, this shoe is out of stock';
          } else {
            display.innerHTML = table({
              shoe: SizeWthBrand.brandAndSizes
            })
          }
        }
      })
    } else if (Selectsizes == "") {
      $.ajax({
        url: '/api/shoes/brand/' + Selectbrands,
        type: 'GET',
        success: function(brand) {
          console.log(brand);
          display.innerHTML = table({
            shoe: brand.brandName
          })
        }
      })
    } else if (Selectbrands == "") {
      $.ajax({
        url: '/api/shoes/size/' + Selectsizes,
        type: 'GET',
        success: function(size) {
          display.innerHTML = table({
            shoe: size.sizes
          })
        }
      })
    }
    Selectbrands.value = ""
    Selectsizes.value = ""
  })
  $('#addButton').on('click', function() {
    var Brand = document.querySelector('.Brands').value;
    var Size = document.querySelector('.Sizes').value;
    var Colors = document.querySelector('.Colors').value;
    var price = document.querySelector('.Prices').value;
    var Instock = document.querySelector('.Quantity').value;

    if (Brand.length == 0 ||
      Size.length == 0 ||
      Colors.length == 0 ||
      price.length == 0 ||
      Instock.length == 0) {
      message.innerHTML = "Please fill in the text-box's and add again.";


    } else {
      console.log('correct');
      var newList = {
        brand: Brand,
        size: Size,
        price: price,
        color: Colors,
        quantity: Instock
      }

      $.post({
        url: "/api/shoes",
        type: 'POST',
        data: newList,
        dataType: "application/json",
        success: function(newList) {
          display.innerHTML = table({
            shoe: newShoe.newList
          })
        }
      })
      window.location.reload()
    }
  })

})

$('#display').on('click', function(e) {
  var _id = e.target.id;
  console.log(_id);
  $.post({
    url: '/api/shoes/sold/' + _id,
    type: 'POST',
    success: function(sold) {
      display.innerHTML = table({
        shoe: sold
      })
    }
  })
  window.location.reload()
})

$('#allStock').on('click', function() {
  $.ajax({
    url: '/api/shoes',
    type: 'GET',
    success: function(data) {
      var data = data.Shoes
      display.innerHTML = table({
        shoe: data
      })
    }
  })
})

// function show() {
//   var shoe = document.querySelector('.Shoes');
//     if (shoe.style.display === "none") {
//         shoe.style.display = "block";
//     } else {
//         shoe.style.display = "none";
//     }
// }
