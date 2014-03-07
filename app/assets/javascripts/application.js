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
    var min = Number(color.sizes[0].price);
    for(size_key in color.sizes)
    {
      if(color.sizes[size_key].price < min)
        min = color.sizes[size_key].price;
    }
    return min;
  }

  this.addPolling = function() {
    setTimeout(function() { categoryProduct.getProducts(); }, 40000);
  }

  this.getProducts = function(event) {
    event.preventDefault();
    var categoryId = $(this).attr('id');
    var productColors = [];
    var productBrands = [];
    categoryProduct.displayContainerGrid();
    for (var key in products) {
      var product = products[key];
      if (product.category.id == categoryId) {
        productBrands.push(product.brand.name);
        var colors = product.colors;
        for (var color_key in colors) {
          var color = colors[color_key];
          productColors.push(color.name);
          categoryProduct.displayProducts(color, product);
          categoryProduct.checkSoldOut(product.colors);
        }
      }
    }
    categoryProduct.displayFilters(productColors, productBrands);
  }

  this.displayFilters = function(productColors, productBrands) {
    var filterElements = categoryProduct.getFilterElementsHash(productColors, productBrands);
    categoryProduct.getFilters(filterElements);
  }
  
  this.displayContainerGrid = function() {
    var display_container = $('<div>', { id:'display-container', class:'span8' } );
    $('#main-container').html(display_container);
    display_container.append($('<div>', { id: 'latest-products-container' }));
  }

  this.checkSoldOut = function(colors) {
    for (var key in colors) {
      var color = colors[key];
      var latest_product = $('#product_' + color.id);
      if (color.quantity_flag) {
        var homeproduct = new HomeProductGrid();
        latest_product.find('.quick-view.btn').on('click', homeproduct.viewProduct );
      }
      else {
        latest_product.find('.latest-products-image').append($('<img>', {class: 'sold-out', 'src': '/assets/sold_out.jpg'}));
      }
    }
  }

  
  this.getFilterElementsHash = function(productColors, productBrands) {
    var productColors = $.unique(productColors);
    var productBrands = $.unique(productBrands);
    return ({ 'color': productColors, 'brand': productBrands });
  }

  this.displayProducts = function(color, product) {
    var image = color.images[0]['medium'];
    var latest_product = categoryProduct.createLatestProductContainer(product, color);
    $('#latest-products-container').append(latest_product);
    img_container = $('<div>', {class: 'latest-products-image'});
    latest_product.appendTo($('#latest-products-container')).append(img_container);
    categoryProduct.displayProductImage(product, color, image);
    latest_product.append(categoryProduct.getDescription(product, latest_product));
  }

  this.createLatestProductContainer = function(product, color) {
    return ($('<div>',{ 'class': "latest-products", 'id': "product_" + color['id'], 'data-color':  color.name, 'data-brand': product.brand.name, 'data-price': this.getMinPrice(color) }));
  }

  this.displayProductImage = function(product, color, image) {
    img_container.append($('<img>', {class: 'latest-color-image', 'src': image})).append($('<a/>', {class: 'quick-view visibility btn', 'data-href': ('/products/' + product.id + '/colors/' + color.id )})
        .html('Quick View'));
  }

  this.getDescription = function(product, latest_product) {
    var latest_products_desc = $('<div>', { class: 'latest-products-desc' }).append('<div><h5>' + product['title'] + '</h5></div>')
      .append($('<div><p class="inline-tile">' + product.description + '</p></div>'))
      .append('<div><p class="inliner-tile">' + product.brand.name + '</p> <b>Rs. ' + latest_product.data('price') + '</b></div>');
    return latest_products_desc;
  }

  this.getFilters = function(filterElements) {
    var filters = ['color', 'brand'];
    var filterContainer = $('<div/>', { id: 'filters', class: 'span2'});
    for (var i = 0, len = filters.length; i < len; i++) {
      var filterHeading = categoryProduct.getFilterHead(filters[i], filterContainer);
      var filterCollection = $('<div/>', {id: (filters[i] + '-filters')}).insertAfter(filterHeading);
      var filterTag = filterElements[filters[i]];
      categoryProduct.displayFilterTags(filterTag, filterCollection);
    }
    $('<div/>', { id: 'side-panel' }).appendTo('#main-container').append(filterContainer);
  }

  this.displayFilterTags = function(filterTag, filterCollection) {
    for (var j = 0, jLen = filterTag.length; j < jLen; j++) {
      $('<div/>', {class: 'filterElement'}).append($('<input>', {'type': 'checkbox', 'value': filterTag[j]}))
        .append($('<span/>', {class: 'filterName'}).html(filterTag[j]))
        .appendTo(filterCollection);
    }
  }

  this.getFilterHead = function(filterName, filterContainer) {
    var filterHead = $('<div/>', {class: 'filter-heading'}).html(filterName).appendTo(filterContainer);
    return filterHead;
  }
}



