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
  categoryProduct.extractData();
});

function CategoryProduct() {
  var categoryProduct = this;

  this.bindEvents = function() {
    $('.link-tile.category-tile').click(this.getProducts);
    window.onhashchange = function() {
      categoryProduct.extractData();
    }
  }

  this.extractData = function() {
    var window_params = window.location.hash.split('-')
    var controller = window_params[0];
    action_id = window_params[1];
    var hash_params = '', color_filters = [], brand_filters = [];
    if (window_params[2]) {
      hash_params = window_params[2];
    }
    switch(controller) {
      case '#categories':
        if ($('.link-tile.category-tile[id=' + action_id + ']').length == 1 && !hash_params.length) {
          categoryProduct.getProducts();
        } 
        else if (hash_params.length) {
          categoryProduct.getProducts(null, 'no');
          color_filters = categoryProduct.getFilterParams(hash_params);
          categoryProduct.checkFilters('color', color_filters);
          productGrid.filterProducts('no');
        }
        break;
      case '#products':
        homeProduct.viewProduct(null, 'no');
    }
  }

  this.getFilterParams = function(hash_params) {
      var color_params = '', color_filters = [], brand_filters = [];
    if (hash_params.indexOf('brand') != -1) {
      var filter_params =  hash_params.split('&');
      if (hash_params.indexOf('color') != -1) {
        color_params = filter_params[1].split('|')[1];
        color_filters.push(color_params);
      }
      if (color_params.indexOf(',') != -1) {
        color_filters = color_params.split(',');
      }
      brand_filters = categoryProduct.extractFiltersFromHash(filter_params[0]);
      categoryProduct.checkFilters('brand', brand_filters);
    }
    else {
       color_filters = categoryProduct.extractFiltersFromHash(hash_params);
    }
    return color_filters;
  }

  this.extractFiltersFromHash = function(hash_params) {
    var tag_filters = [];
    var filter_hash_params = hash_params.split('|')[1];
    tag_filters.push(filter_hash_params);
    if (filter_hash_params.indexOf(',') != -1)
      tag_filters = filter_hash_params.split(',');
    return tag_filters;
  }

  this.checkFilters = function(filter, hash_filters) {
    $('#' + filter + '-filters').find('input[type="checkbox"]').each(function(index) {
      if ($.inArray($(this).attr('value'), hash_filters) != -1)
        $(this).prop('checked', true);
      else
        $(this).prop('checked', false);
    });
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

  this.getProducts = function(event, change_hash) {
    var change_hash = change_hash || 'yes'
    if(event)
      event.preventDefault();
    var hash = '';
    var categoryId = $(this).attr('id') || action_id;
    if(change_hash == 'yes')
      window.location.hash = '#categories-' + categoryId;
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
      categoryProduct.displayFilterTags(filters[i], filterTag, filterCollection);
    }
    $('<div/>', { id: 'side-panel' }).appendTo('#main-container').append(filterContainer);
  }

  this.displayFilterTags = function(filter, filterTag, filterCollection) {
    for (var j = 0, jLen = filterTag.length; j < jLen; j++) {
      $('<div/>', {class: 'filterElement'}).append($('<input>', {'type': 'checkbox', 'value': filterTag[j], 'data-filter': filter}))
        .append($('<span/>', {class: 'filterName'}).html(filterTag[j]))
        .appendTo(filterCollection);
    }
  }

  this.getFilterHead = function(filterName, filterContainer) {
    var filterHead = $('<div/>', {class: 'filter-heading'}).html(filterName).appendTo(filterContainer);
    return filterHead;
  }
}



