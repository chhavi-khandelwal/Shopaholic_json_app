$(document).ready(function() {
  var productDashBoard = new ProductDashBoard();
  productDashBoard.bindEvents();
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

function ProductDashBoard() {

  var productDashBoard = this;
  
  //bind events on the product show page
  this.bindEvents = function() {
    var $main_container = $('#main-container');
    $main_container.on('click', '.angle', this.changeFocussedImage);
    $main_container.on('click', '.color-all', this.changeProductAngles);
    $main_container.on('click', '.size-all', function() { productDashBoard.setCurrentSizeAndPrice($(this)) });
  }
  
  //get focussed image of the product color
  this.getFocussedImage = function(product_angle) {
    var image = $("<img>", { 'src': product_angle.data('focussed-image'), id: 'zoomed_image', 'data-zoom-image': product_angle.data('large-image') });
    return image;
    
  }
  
  //change focussed image of the product color on clicking the different color
  this.changeFocussedImage = function() {
    $(this).addClass('selected').siblings().removeClass('selected');
    var image = productDashBoard.getFocussedImage($(this));
    $('.product-in-focus').html(image);
    image.elevateZoom({ zoomWindowPosition: 1, zoomWindowHeight: 200, zoomWindowWidth: 200 });
  }
  
  //change product angles once clicked on a different color
  this.changeProductAngles = function() {
    var product_color = $(this);
    var sizes = product_color.data('sizes');
    var size = 'none';
    size = productDashBoard.setSize(product_color, size);
    if(size == 'none') {
      alert('color has no sizes');
      $(this).append($('<img>', { class: 'gray', 'src': '/assets/gray.jpg'}))
    }
    else {
      productDashBoard.setUrlHash(product_color);
      product_color.addClass('selected').siblings().removeClass('selected');
    }
  }

  this.setUrlHash = function(selected_tag) {
    var window_hash = window.location.hash.split('#')[1].split('&');
    var params = {};
    for (var i = 0, len = window_hash.length; i < len; i++) {
      var x = window_hash[i].split('=');
      params[x[0]] = x[1];
      if ((selected_tag.hasClass('color-all') && x[0] == 'colors') || (selected_tag.hasClass('size-all') && x[0] == 'size')) {
        params[x[0]] = selected_tag.data('id');
      }
    }
    var hash_array = [];
    for (var key in params) {
      hash_array.push(key + '=' + params[key]); 
    }
    window.location.hash = '#' + hash_array.join('&'); 
  }
  
  //set size according to the color selected
  this.setSize = function(product_color, size) {
    var size_quantities = product_color.data('size-quantity');
    for (var i = 0, len = size_quantities.length; i < len; i++) {
      if (size_quantities[i]) {
        size = size_quantities[i];
        break;
      }
    }
    return size;
  }
  
  //set current size and its price of the product color
  this.setCurrentSizeAndPrice = function($current_size) {
    if (!$current_size.hasClass('disabled')) {
      productDashBoard.setUrlHash($current_size);
    }
  }
  
}