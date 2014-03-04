$(document).ready(function() {
  var product = new Product();
  product.getRecent();
  product.bindEvents();
});

function Product() {
  var $main_container = $('#main-container');
  var product = this;

  this.getRecent = function() {
    if($('#new-today').length == 1) {
      $.ajax({
        url: $('#latest-products-container').data('href'),
        dataType: 'json'
      }).complete(function(data) {
        var published_products = data.responseJSON.products;
        for (var i in published_products) {
          product.getProductDetails(published_products, i);
        }
      });
    }    
  }

  this.getProductDetails = function(published_products, i) {
    var latest_product = $('<div/>').addClass('latest-products').appendTo($('#latest-products-container'));
    var product_image = $('<img>').attr('src', published_products[i].image);
    product.displayProductImage(product_image, latest_product);
    product.displayQuickViewBtn(published_products, i, product_image);
    var latest_products_desc = $('<div/>').addClass('latest-products-desc').appendTo(latest_product);
    product.getContent(published_products, i, latest_products_desc);
  }

  this.displayProductImage = function(product_image, latest_product) {
    $('<div/>').addClass('latest-products-image').html(product_image).appendTo(latest_product);
  }

  this.bindEvents = function() {
    $main_container.on('click', '.quick-view.btn', this.viewProduct);
  }

  this.displayQuickViewBtn = function(published_products, i, product_image) {
    var quick_view = product.createQuickViewBtn(published_products, i);
    quick_view.insertAfter(product_image);

  }

  this.createQuickViewBtn = function(published_products, i) {
    return ($('<a/>').attr({'href': '/products/' + published_products[i].id + '/colors/' + i, class: 'quick-view visibility btn'}).html('Quick View'));
  }

  this.getContent = function(published_products, i, latest_products_desc) {
    var title = published_products[i]['title'];
    product.getContentContainer(title, latest_products_desc);
    var description = (published_products[i]['description'].substring(0,20) + '...');
    product.getContentContainer(description, latest_products_desc);
    var brand = published_products[i]['brand'];
    product.getContentContainer(brand, latest_products_desc);
  }

  this.getContentContainer = function(value, latest_products_desc) {
    $('<div/>').append($('<h5/>')
                        .html(value))
      .appendTo(latest_products_desc);
  }

  this.viewProduct = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      dataType: 'json'
    }).complete(function(data) {
      var response = data.responseJSON;
      $main_container.html(response.product);
      $('#side-panel').remove();
    });
  }

}