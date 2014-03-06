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
      data: { 'size_id': $('.size-all.selected').attr('id') },
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

  this.bindEvents = function() {
    var $main_container = $('#main-container');
    $main_container.on('click', '.angle', function() { productDashBoard.changeFocussedImage($(this)) });
    $main_container.on('click', '.color-all', this.changeProductAngles);
    $main_container.on('click', '.size-all', function() { productDashBoard.setCurrentSizeAndPrice($(this)) });
  }

  this.getFocussedImage = function(product_angle) {
    return ("<img src=" + product_angle.data('focussed-image') + ">");
  }

  this.changeFocussedImage = function(product_color) {
    $('.product-in-focus').html(productDashBoard.getFocussedImage(product_color));
  }

  this.changeProductAngles = function() {
    var product_color = $(this);
    var sizes = product_color.data('sizes');
    var size = 'none';
    size = productDashBoard.setSize(product_color, size)
    if(size == 'none') {
      alert('color has no sizes');
    }
    else {
      $('#selected-size-value').find('strong').html(size);
      productDashBoard.setAngles(product_color, sizes);
    }
  }

  this.setSize = function(product_color, size) {
    var size_quantities = product_color.data('size-quantity');
    for(i = 0; i < size_quantities.length; i++)
    {
      if(size_quantities[i] > min_quantity)
      {
        size = size_quantities[i];
        break;
      }
    }
    return size;
  }

  this.setAngles = function(product_color, sizes) {
    var product_angles = productDashBoard.setImageAngles(product_color);
    var product_sizes = productDashBoard.setSizes(product_color, sizes);
    $('.product-angles').html(product_angles);
    $('.size-container').html(product_sizes);
    productDashBoard.changeFocussedImage(product_color);
    productDashBoard.setCurrentSizeAndPrice($('.size-all').not('.disabled').first());
  }

  this.setImageAngles = function(product_color) {
    var small_images = product_color.data('images');
    var medium_images = product_color.data('image-angles');
    var product_angles = [];
    for(var i = 0; i < small_images.length; i++) {
      product_angles.push($('<div/>').addClass('angle')
        .attr('data-focussed-image', medium_images[i])
        .html("<img src=" + small_images[i] + " class='small-image'>"));
    }
    return product_angles;
  }

  this.setSizes = function(product_color, sizes) {
    var size_ids = product_color.data('size-ids');
    var size_quantities = product_color.data('size-quantity');
    var product_sizes = [];
    for(var i = 0; i < size_ids.length; i++) {
      var size_class ='size-all'
      if(size_quantities[i] <= min_quantity)
        size_class += ' disabled'
      product_sizes.push(productDashBoard.getSizeContainer(product_color, sizes[i], size_class));
    }
    return product_sizes;
  }

  this.getSizeContainer = function(product_color, size, size_class) {
    var size_ids = product_color.data('size-ids');
    var size_prices = product_color.data('size-price');
    var size_discounted_prices = product_color.data('size-discounted-price');
    return ($('<div/>').addClass(size_class)
    .attr({ 'data-id': size_ids[i], 'data-price': size_prices[i], 'data-discounted-price': size_discounted_prices[i] })
    .html("<span>" + size + "</span>"));
  }

  this.setCurrentSizeAndPrice = function($current_size) {
    productDashBoard.getSize($current_size);
    productDashBoard.setPrice($current_size);
  }

  this.setPrice = function($current_size) {
    $('#real-price').html('Real ' + $current_size.data('price'));
    $('#discounted-price').html('Discounted ' + $current_size.data('discounted-price'));
  }

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