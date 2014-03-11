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
  categoryProduct.extractDataAndDisplayProducts();
});

function CategoryProduct() {
  var categoryProduct = this;

  //binds event on the category tiles in the placeholder to display corresponding products
  this.bindEvents = function() {
    $('.link-tile.category-tile').click(this.getProducts);
    window.onhashchange = function() {
      categoryProduct.extractDataAndDisplayProducts();
    }
  }
  
  //extract data to be displayed once url is changed and display accordingly
  this.extractDataAndDisplayProducts = function() {
    var window_params = window.location.hash.split('-')
    var controller = window_params[0];
    action_id = window_params[1];
    var hash_param = '';
    if (window_params[2]) {
      hash_param = window_params[2];
    }
    switch(controller) {
      case '#categories':
        if ($('.link-tile.category-tile[id=' + action_id + ']').length == 1 && !hash_param.length) {
          categoryProduct.getProducts();
        } 
        else if (hash_param.length) {
          categoryProduct.getProducts(null, 'no');
          categoryProduct.getPreviousStateOfFilters(hash_param);
          productGrid.filterProducts('no');
        }
        break;
      case '#products':
        homeProduct.viewProduct(null, 'no');
    }
  }
  
  //get previously marked filters extracted from the hash in the url
  this.getPreviousStateOfFilters = function(hash_param) {
      var color_param = '', color_filters = [], brand_filters = [];
    if (hash_param.indexOf('brand') != -1) {
      var filter_params =  hash_param.split('&');
      if (hash_param.indexOf('color') != -1) {
        color_filters = categoryProduct.extractFiltersFromHash(filter_params[1]);
      }
      brand_filters = categoryProduct.extractFiltersFromHash(filter_params[0]);
      categoryProduct.checkFilters('brand', brand_filters);
    }
    else {
       color_filters = categoryProduct.extractFiltersFromHash(hash_param);
    }
    categoryProduct.checkFilters('color', color_filters);
  }

  //extract filters from url hash  
  this.extractFiltersFromHash = function(hash_param) {
    var tag_filters = [];
    var filter_hash_param = hash_param.split('|')[1];
    tag_filters.push(filter_hash_param);
    if (filter_hash_param.indexOf(',') != -1)
      tag_filters = filter_hash_param.split(',');
    return tag_filters;
  }
  
  //mark checkboxes of filters to be true or false accordingly 
  this.checkFilters = function(filter, hash_filters) {
    $('#' + filter + '-filters').find('input[type="checkbox"]').each(function(index) {
      var filterElement = $(this);
      if ($.inArray(filterElement.attr('value'), hash_filters) != -1)
        filterElement.prop('checked', true);
      else
        filterElement.prop('checked', false);
    });
  }
  
  //get min price of the color to be displayed on the product label
  this.getMinPrice = function(color) {
    var min = Number(color.sizes[0].price);
    for(size_key in color.sizes)
    {
      if(color.sizes[size_key].price < min)
        min = color.sizes[size_key].price;
    }
    return min;
  }
  
  //get fresh data of products in the form of jason after every 40 secs
  this.addPolling = function() {
    setTimeout(function() { categoryProduct.getProducts(); }, 40000);
  }
  
  //get products and filters to be displayed related to particular category
  this.getProducts = function(event, change_hash) {
    var change_hash = change_hash || 'yes'
    if(event)
      event.preventDefault();
    var hash = '';
    var categoryId = $(this).attr('id') || action_id;
    if(change_hash == 'yes')
      window.location.hash = '#categories-' + categoryId;
    categoryProduct.displayContainerGrid();
    var gridProducts = categoryProduct.getAndDisplayCategoryGridProducts(products, categoryId);
    categoryProduct.displayFilters(gridProducts['colors'], gridProducts['brands']);
  }
  
  //display products related to particular category
  this.getAndDisplayCategoryGridProducts = function(products, categoryId) {
    var productColors = [], productBrands = [];
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
    return ({ 'colors': productColors, 'brands': productBrands });
  }
  
  //display filterss related to particular category products
  this.displayFilters = function(productColors, productBrands) {
    var filterElements = categoryProduct.getFilterElementsHash(productColors, productBrands);
    categoryProduct.getFilters(filterElements);
  }

  //diaplay container that displays products 
  this.displayContainerGrid = function() {
    var display_container = $('<div>', { id:'display-container', class:'span8' } );
    $('#main-container').html(display_container);
    display_container.append($('<div>', { id: 'latest-products-container' }));
  }
  
  //check and mark if the product is sold out
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

  //get hash for filters to be displayed
  this.getFilterElementsHash = function(productColors, productBrands) {
    var productColors = $.unique(productColors);
    var productBrands = $.unique(productBrands);
    return ({ 'color': productColors, 'brand': productBrands });
  }
  
  //display product of a category
  this.displayProducts = function(color, product) {
    var image = color.images[0]['medium'];
    var latest_product = categoryProduct.createLatestProductContainer(product, color);
    $('#latest-products-container').append(latest_product);
    img_container = $('<div>', {class: 'latest-products-image'});
    latest_product.appendTo($('#latest-products-container')).append(img_container);
    categoryProduct.displayProductImage(product, color, image);
    latest_product.append(categoryProduct.getDescription(product, latest_product));
  }
  
  //create container that holds the product
  this.createLatestProductContainer = function(product, color) {
    return ($('<div>',{ 'class': "latest-products", 'id': "product_" + color['id'], 'data-color':  color.name, 'data-brand': product.brand.name, 'data-price': this.getMinPrice(color) }));
  }
  
  //display product image
  this.displayProductImage = function(product, color, image) {
    img_container.append($('<img>', {class: 'latest-color-image', 'src': image})).append($('<a/>', {class: 'quick-view visibility btn', 'data-href': ('/products/' + product.id + '/colors/' + color.id )})
        .html('Quick View'));
  }
  
  //get description of a product
  this.getDescription = function(product, latest_product) {
    var latest_products_desc = $('<div>', { class: 'latest-products-desc' }).append('<div><h5>' + product['title'] + '</h5></div>')
      .append($('<div><p class="inline-tile">' + product.description + '</p></div>'))
      .append('<div><p class="inliner-tile">' + product.brand.name + '</p> <b>Rs. ' + latest_product.data('price') + '</b></div>');
    return latest_products_desc;
  }
  
  //get filters to be displayed
  this.getFilters = function(filterElements) {
    var filters = ['color', 'brand'];
    var filterContainer = $('<div/>', { id: 'filters', class: 'span2'});
    for (var i = 0, len = filters.length; i < len; i++) {
      var filterHeading = categoryProduct.getFilterHead(filters[i], filterContainer);
      var filterCollection = $('<div/>', {id: (filters[i] + '-filters')}).insertAfter(filterHeading);
      var filterTag = filterElements[filters[i]];
      categoryProduct.displayFilterTags(filters[i], filterTag, filterCollection);
    }
    $('<div/>', { id: 'side-panel' }).appendTo('#main-container').append(filterContainer);
  }
  
  //display filters
  this.displayFilterTags = function(filter, filterTag, filterCollection) {
    for (var j = 0, jLen = filterTag.length; j < jLen; j++) {
      $('<div/>', {class: 'filterElement'}).append($('<input>', {'type': 'checkbox', 'value': filterTag[j], 'data-filter': filter}))
        .append($('<span/>', {class: 'filterName'}).html(filterTag[j]))
        .appendTo(filterCollection);
    }
  }
  
  //get filter heading and corresponding containers holding it
  this.getFilterHead = function(filterName, filterContainer) {
    var filterHead = $('<div/>', {class: 'filter-heading'}).html(filterName).appendTo(filterContainer);
    return filterHead;
  }
}



