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
        var response = data.responseJSON;
        var published_colors = response['colors'];
        var published_products = response.products;
        for (var i in published_colors) {
          if (published_products[published_colors[i].id]) {
            product.getProductDetails(published_colors, response, i);
          }
        }
      });
    }    
  }

  this.getProductDetails = function(published_colors, response, i) {
    var published_products = response.products;
    var latest_product = $('<div/>').addClass('latest-products').appendTo($('#latest-products-container'));
    var product_image = $('<img>').attr('src', response.images[published_colors[i].id]);
    $('<div/>').addClass('latest-products-image').html(product_image).appendTo(latest_product);
    var quick_view = product.createQuickViewBtn(published_colors, i);
    quick_view.insertAfter(product_image);
    var latest_products_desc = $('<div/>').addClass('latest-products-desc').appendTo(latest_product);
    product.getContent(response, i, latest_products_desc);
  }

  this.bindEvents = function() {
    $main_container.on('click', '.quick-view.btn', this.viewProduct);
  }

  this.createQuickViewBtn = function(published_colors, i) {
    return ($('<a/>').attr({'href': '/products/' + published_colors[i].product_id + '/colors/' + published_colors[i].id, class: 'quick-view visibility btn'}).html('Quick View'));
  }

  this.getContent = function(response, i, latest_products_desc) {
    var brands  = response.brands;
    var published_colors = response['colors'];
    var published_products = response.products;
    var title = published_products[published_colors[i].id]['title'];
    product.getContentContainer(title, latest_products_desc);
    var description = (published_products[published_colors[i].id]['description'].substring(0,20) + '...');
    product.getContentContainer(description, latest_products_desc);
    var brand = brands[published_colors[i].id]['name'];
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