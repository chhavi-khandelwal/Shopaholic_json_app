$(document).ready(function() {
  var productDashBoard = new ProductDashBoard();
  productDashBoard.bindEvents();

  $('#main-container').on('click', '#add-cart', function() {
    if($('.size-all.selected').length == 1)
    {
      $.ajax({
        url: $(this).data('href'),
        type: 'POST',
        data: { 'size_id': $('.size-all.selected').data('id') },
        dataType: 'json'
      }).complete(function(response) {
        response = response.responseJSON;
        $('#cart-count').text(response.cart_size)
        $('#cart-link').attr('href', '/carts/' + response.cart_id )
      });
    }
    else {
      $('#before-add').toggleClass('visibility').html('Select a size');
    }
  });
});

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
    productDashBoard.changeFocussedImage(product_color);
    var product_angles = productDashBoard.setImageAngles(product_color);
    var sizes = product_color.data('sizes');
    var product_sizes = productDashBoard.setSizes(product_color, sizes);
    $('.product-angles').html(product_angles);
    $('.size-container').html(product_sizes);
    $('#selected-size-value').find('strong').html(sizes[0]);
    productDashBoard.setCurrentSizeAndPrice($('.size-all').first());
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
    var size_prices = product_color.data('size-price');
    var size_discounted_prices = product_color.data('size-discounted-price');
    var product_sizes = [];
    for(var i = 0; i < size_ids.length; i++) {
      product_sizes.push($('<div/>').addClass('size-all')
        .attr({ 'data-id': size_ids[i], 'data-price': size_prices[i], 'data-discounted-price': size_discounted_prices[i] })
        .html("<span>" + sizes[i] + "</span>"));
    }
    return product_sizes;
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
    $('#selected-size-value').find('strong').html(selected_size.find('span').html());
    selected_size.addClass('selected')
      .siblings()
      .removeClass('selected');
  }
}