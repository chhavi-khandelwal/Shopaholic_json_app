// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require_tree .
//= require twitter/bootstrap
//= require jquery.remotipart
//= require jquery.ui.all
//= require turbolinks


$(document).ready(function() {
  $('.row-fluid').css('min-height', $(window).height());
  var categoryProduct = new CategoryProduct();
  categoryProduct.bindEvents();
});

function CategoryProduct() {
  var categoryProduct = this;

  this.bindEvents = function() {
    $('.link-tile.category-tile').click(this.getProducts);
  }

  this.getMinPrice = function(color) {
    min = Number(color.sizes[0].price)
    for(size_key in color.sizes)
    {
      if(color.sizes[size_key].price < min)
        min = color.sizes[size_key].price;
    }
    return min;
  }

  this.getProducts = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      dataType: 'json'
    }).complete(function(data) {
      var response = data.responseJSON;
      var filters = data.responseJSON.filters;
      var display_container = $('<div>', { id:'display-container', class:'span8' } );
      $('#main-container').html(display_container);
      display_container.append($('<div>', { id: 'latest-products-container' }));
      categoryProduct.displayProducts(response)
      categoryProduct.displayFilters(filters);
    });
  }

  this.displayProducts = function(response) {
    var products = response.products;
    var images = response.images;
    for(key in products) {
      var product = products[key]
      for(color_key in product.colors) {
        var color = product.colors[color_key]
        if(color.published == true) {
          categoryProduct.getDetails(product, color, images);
        }
      }
    }
  }

  this.getDetails = function(product, color, images) {
    var latest_product = categoryProduct.createLatestProductContainer(product, color);
    $('#latest-products-container').append(latest_product);
    img_container = $('<div>', {class: 'latest-products-image'});
    latest_product.appendTo($('#latest-products-container')).append(img_container);
    categoryProduct.displayProductImage(product, color, images);
    latest_product.append(categoryProduct.getDescription(product, latest_product));
  }

  this.createLatestProductContainer = function(product, color) {
    return ($('<div>',{ 'class': "latest-products", 'id': "product_" + product['id'], 'data-color':  color.name, 'data-brand': product.brand.name, 'data-price': categoryProduct.getMinPrice(color) }));
  }

  this.displayProductImage = function(product, color, images) {
    img_container.append($('<img>', {class: 'latest-color-image', 'src': images[color.id]})).append($('<a/>', {class: 'quick-view visibility btn', href: ('/products/' + product.id + '/colors/' + color.id )})
        .html('Quick View'));
  }

  this.getDescription = function(product, latest_product) {
    return ($('<div>', { class: 'latest-products-desc' }).append('<div><h5>' + product['title'] + '</h5></div>')
      .append($('<div><p class="inline-tile">' + product.description + '</p></div>'))
      .append('<div><p class="inliner-tile">' + product.brand.name + '</p> <b>Rs. ' + latest_product.data('price') + '</b></div>'));
  }

  this.displayFilters = function(filters) {
    $('<div/>', { id: 'side-panel' }).appendTo('#main-container').append(filters);
  }
}



