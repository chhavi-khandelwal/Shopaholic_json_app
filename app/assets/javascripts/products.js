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
    $main_container.on('click', '.angle', function() { productDashBoard.changeFocussedImage($(this)) });
    $main_container.on('click', '.color-all', this.changeProductAngles);
    $main_container.on('click', '.size-all', function() { productDashBoard.setUrlHash($(this)) });
  }
  
  //get focussed image of the product color
  this.getFocussedImage = function(product_angle) {
    return ("<img src=" + product_angle.data('focussed-image') + ">");
  }
  
  //change focussed image of the product color on clicking the different color
  this.changeFocussedImage = function(product_color) {
    $('.product-in-focus').html(productDashBoard.getFocussedImage(product_color));
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
  
  //set product color details acc. to color change
  this.setAngles = function(product_color, sizes) {
    var product_angles = productDashBoard.setImageAngles(product_color);
    var product_sizes = productDashBoard.setSizes(product_color, sizes);
    $('.product-angles').html(product_angles);
    $('.size-container').html(product_sizes);
    productDashBoard.changeFocussedImage(product_color);
    productDashBoard.setCurrentSizeAndPrice($('.size-all').not('.disabled').first());
  }
  
  //set different angles of the productcolor image
  this.setImageAngles = function(product_color) {
    var small_images = product_color.data('images');
    var medium_images = product_color.data('image-angles');
    var product_angles = [];
    for(var i = 0; i < small_images.length; i++) {
      product_angles.push(productDashBoard.getProductAngle(small_images[i], medium_images[i]));
    }
    return product_angles;
  }
  
  //get container for angle of the product to be displayed
  this.getProductAngle = function(small_image, medium_image) {
    var productAngle = $('<div/>').addClass('angle')
      .attr('data-focussed-image', medium_image)
      .html("<img src=" + small_image + " class='small-image'>");
    return productAngle;
  }
  
  //set sizes to be displayed of a particular color
  this.setSizes = function(product_color, sizes) {
    var color_id = product_color.data('id');
    var size_ids = product_color.data('size-ids');
    var size_quantities = product_color.data('size-quantity');
    var product_sizes = [];
    for(var i = 0; i < size_ids.length; i++) {
      var size_class ='size-all';
      if(!size_quantities[i])
        size_class += ' disabled';
      if (size_ids[i] == hashData['size']) {
        size_class += ' selected'
      }
      product_sizes.push(productDashBoard.getSizeContainer(product_color, sizes[i], size_class));
    }
    return product_sizes;
  }
  
  //get container to display size detail
  this.getSizeContainer = function(product_color, size, size_class) {
    var size_ids = product_color.data('size-ids');
    var size_prices = product_color.data('size-price');
    var size_discounted_prices = product_color.data('size-discounted-price');
    return ($('<div/>').addClass(size_class)
    .attr({ 'data-id': size_ids, 'data-price': size_prices, 'data-discounted-price': size_discounted_prices })
    .html("<span>" + size + "</span>"));
  }
  
  //set current size and its price of the product color
  this.setCurrentSizeAndPrice = function($current_size) {
    productDashBoard.setUrlHash($current_size);
    productDashBoard.getSize($current_size);
    productDashBoard.setPrice($current_size);
  }
  
  //set price
  this.setPrice = function($current_size) {
    $('#real-price').html('Real ' + $current_size.data('price'));
    $('#discounted-price').html('Discounted ' + $current_size.data('discounted-price'));
  }
  
  //get size of the product color
  this.getSize = function(selected_size) {
    if(selected_size.hasClass('size-all disabled'))
      alert('Size currently not available...!!')
    else
    {
      $('#selected-size-value').find('strong').html(selected_size.find('span').html());
      selected_size.addClass('selected')
        .siblings()
        .removeClass('selected');
    } 
  }
}