$(document).ready(function() {
  var cartProduct = new CartProduct();
  cartProduct.bindEvents();
});

function CartProduct() {
  var cartProduct = this;
  this.bindEvents = function() {
    $('#main-container').on('click', '#add-cart', this.addProductToCart);
  }
  
  //adds product to the cart
  this.addProductToCart = function() {
    if($('.size-all.selected').length == 1) {
      cartProduct.getProductResponse($(this));
      $('#before-add').toggleClass('visibility').html('Product added to your cart');
    }
    else {
      $('#before-add').toggleClass('visibility').html('Select a size');
    }
  }

  this.getProductResponse = function(cart) {
    $.ajax({
      url: cart.data('href'),
      type: 'POST',
      data: { 'size_id': $('.size-all.selected').data('id') },
      dataType: 'json'
    }).complete(function(response) {
      response = response.responseJSON;
      $('#cart-count').text(response.cart_size);
      $('#cart-link').attr('href', '/carts/' + response.cart_id );
    });
  }
} 