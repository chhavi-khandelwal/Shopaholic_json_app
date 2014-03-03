$(document).ready(function(){
  var cartHelper = new CartHelper();
  cartHelper.bindEvents(); 
});

function CartHelper() {
  var cartHelper = this;
  this.extract_size_and_quantity = function() {
    var size_ids = [];
    var quantity_collection = [];
    $('#cart-show .items-container').each(function() {
      var item_container = $(this);
      size_ids.push(item_container.data('size-id'));
      quantity_collection.push(item_container.data('quantity')); 
    });
    return ({ 'ids': size_ids, 'quantities': quantity_collection });

  }


  this.bindEvents = function() {
    $('#proceed-pay').on('click', this.payCheck);
  }

  this.payCheck = function() {
    $.ajax({
      url: $(this).attr('href'),
      data: cartHelper.extract_size_and_quantity(),
      // dataType: 'JSON'
    }).complete(function(data) {
    });
  }
}