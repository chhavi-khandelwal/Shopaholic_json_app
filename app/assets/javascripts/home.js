$(document).ready(function() {
  var product = new Product();
  product.getRecent();
  min_quantity = 0;
});

function Product() {
  var $main_container = $('#main-container');
  var product = this;

  this.addPolling = function() {
    setTimeout(function() { product.getRecent();}, 5000);
  }

  this.getRecent = function() {
    if($('#new-today').length == 1) {
      $.ajax({
        url: $('#latest-products-container').data('href'),
        dataType: 'json',
        async: false, 
      }).done(function(data) {
        $('#latest-products-container').html('');
        var published_products = data.products;
        for (var i in published_products) {
          product.getProductDetails(published_products, i);
          product.checkSoldOut(published_products[i], i);
        }
      }).complete(function() {
        product.addPolling();
      });
    }    
  }

  this.checkSoldOut = function(published_product, i) {
    var latest_product = $('#product_color_' + i);
    if (!published_product.size_flag) {
      lastest_products_image = $('.latest-products-image').append($('<img>', {class: 'sold-out', 'src': '/assets/sold_out.jpg'}));
    }
    else {
      latest_product.find('.quick-view.btn').on('click', this.viewProduct);
    }
  }

  this.getProductDetails = function(published_products, i) {
    var latest_product = $('<div/>', {class: 'latest-products', id: ('product_color_' + i)}).appendTo($('#latest-products-container'));
    var product_image = $('<img>').attr('src', published_products[i].image);
    product.displayProductImage(product_image, latest_product);
    product.displayQuickViewBtn(published_products, i, product_image);
    var latest_products_desc = $('<div/>').addClass('latest-products-desc').appendTo(latest_product);
    product.getContent(published_products, i, latest_products_desc);
  }

  this.displayProductImage = function(product_image, latest_product) {
    $('<div/>').addClass('latest-products-image').html(product_image).appendTo(latest_product);
  }

  this.displayQuickViewBtn = function(published_products, i, product_image) {
    var quick_view = product.createQuickViewBtn(published_products, i);
    quick_view.insertAfter(product_image);

  }

  this.createQuickViewBtn = function(published_products, i) {
    return ($('<a/>').attr({'data-href': '/products/' + published_products[i].id + '/colors/' + i, class: 'quick-view visibility btn'}).html('Quick View'));
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
      url: $(this).data('href'),
      dataType: 'json'
    }).complete(function(data) {
      $('#side-panel').remove();
      var response = data.responseJSON;
      var productFocus = product.getProductFocus();
      product.displayProductDetails(response, productFocus);
      $main_container.html(productFocus);
    });
  }

  this.displayProductDetails = function(response, productFocus) {
    var productAngles = $('<div/>', {class: 'product-angles'}).appendTo(productFocus);
    product.getImageViews(response, productAngles);
    var productInFocus = product.displayProductInFocus(response,  productFocus);
    product.appendContainer(productInFocus, productFocus);
    var offeredSizes = product.getOfferedSizes(response);
    product.appendContainer(offeredSizes, productFocus);
    var productDetails = product.getProductDescription(response);
    product.appendContainer(productDetails, productFocus);
    var availableColors = product.getAvailableColors(response);
    product.appendContainer(availableColors, productFocus);
  }

  this.appendContainer = function(nest, main) {
    nest.appendTo(main);
  }

  this.getImageViews = function(response, productAngles) {
    var current_color = response.current_color['id'];
    var images = response.images;
    for (var image_key in images[current_color]['small']) {
      var image = product.getCurrentProductImage(response, image_key, 'medium');
      $('<div/>', {class: 'angle', 'data-focussed-image': images[current_color]['medium'][image_key] }).append(image.addClass('small-image')).appendTo(productAngles);
    }
  }

  this.getProductFocus = function() {
    var productFocus = $('<div/>', { class: 'product-focus span10 offset1' })
        .append($('<div/>', {class: 'alert fade in alert-danger visibility', id: 'before-add'}));
    return productFocus;    
  }

  this.displayProductInFocus = function(response,  productFocus) {
    var image = product.getCurrentProductImage(response, 0, 'medium')
    var productInFocus = $('<div/>', { class: 'product-in-focus' }).append(image);
    return productInFocus;
  }

  this.getCurrentProductImage = function(response, key, size) {
    var current_color = response.current_color['id'];
    var images = response.images;
    var image = $('<img>', {'src': images[current_color][size][key]});
    return image;
  }

  this.getOfferedSizes = function(response) {
    var sizeNameTag = $('<div/>', { id: 'size-name', class: 'block-tile'});
    var offeredSizesContainer = $('<div/>', { id: 'offer-sizes' }).append(sizeNameTag);
    sizeNameTag.append($('<p/>', { class: 'inline-tile' }).html('SELECT SIZE - '))
    product.getCurrentProductSize(response, sizeNameTag);
    product.displaySizeContainer(response, offeredSizesContainer);
    var sizePrice = product.getPrice(response);
    sizePrice.appendTo(offeredSizesContainer);
    return offeredSizesContainer;
  }

  this.getFirstSize = function(response) {
    var sizes = product.getSizes(response); 
    for(key in sizes)
    {
      if(sizes[key].quantity > min_quantity)
        return sizes[key];
    }
  }

  this.getCurrentProductSize = function(response, sizeNameTag) {
    var currentSize = product.getFirstSize(response);
    currentSize = currentSize.name;
    $('<span/>', {id: 'selected-size-value', class:'inline-tile'}).append($('<strong/>')
      .html(currentSize))
      .appendTo(sizeNameTag);
  }

  this.getSizes = function(response) {
    var currentProductColors = response.products.colors;
    var current_color = response.current_color['id'];
    var sizes;
    for (var key in currentProductColors) {
      if (currentProductColors[key].id == current_color) {
        sizes = currentProductColors[key]['sizes'];
        break;
      }
    }
    return sizes;
  }

  this.displaySizeContainer = function(response, offeredSizesContainer) {
    var sizes = product.getSizes(response);
    var sizeContainer = $('<div/>', { class: 'size-container' }).appendTo(offeredSizesContainer);
    for (var key in sizes) {
      var size = product.getSizeContainer(sizes, key);
      size.appendTo(sizeContainer)
      .append($('<span/>').html(sizes[key].name));
    }
  }

  this.getSizeContainer = function(sizes, key) {
    var size_class ='size-all'
    if(sizes[key].quantity <= min_quantity)
      size_class += ' disabled' 
    var sizeContainer = $('<div/>', { class: size_class, id: sizes[key].id, 'data-price': sizes[key].price, 'data-discounted-price': sizes[key].discounted_price });
    return sizeContainer;
  }

  this.getPrice = function(response) {
    var sizePrice = $('<div/>', { id: 'size-price' });
    var size = product.getFirstSize(response);
    sizePrice.append($('<p/>', {id: 'real-price'}).html('Real ' + size.price))
      .append($('<p/>', {id: 'discounted-price'}).html('Discounted ' + size.discounted_price));
    return sizePrice;
  }

  this.getProductDescription = function(response) {
    var current_product = response.products;
    var detailsContainer = $('<div/>', { id: 'details-tab-container' });
    $('<div/>', { id: 'details-tab' }).append($('<p/>').html('Details'))
      .appendTo(detailsContainer);
    var contentTab = $('<div/>', { id: 'details-tab-content' }).appendTo(detailsContainer);
    product.getBasicDetails(current_product, contentTab);
    $('<div/>', {class: 'cart-btn'}).append($('<a/>', { class: 'btn btn-success add-btn', id: 'add-cart', 'data-href': '/carts'}).html('Add To Cart')).appendTo(detailsContainer);
    return detailsContainer;
  }

  this.getBasicDetails = function(current_product, contentTab) {
    $('<div/>').append($('<h5/>').html(current_product.title)).appendTo(contentTab);
    $('<div/>').append(product.getContentTag(current_product.description)).appendTo(contentTab);
    $('<div/>').append(product.getContentTag(current_product.brand['name'])).appendTo(contentTab);
  }

  this.getContentTag = function(textVal) {
    var contentTag = $('<p/>', {class: 'inliner-tile'}).html(textVal);
    return contentTag;
  }

  this.getAvailableColors = function(response) {
    var availColorContainer = $('<div/>', { id: 'color-avail' });
    var productColors = response.products.colors;
    var images = response.images;
    for (var key in productColors) {
      var productColor = productColors[key];
      product.displayAvailableColor(productColor, availColorContainer, images);
    }
    return availColorContainer;
  }

  this.displayAvailableColor = function(productColor, availColorContainer, images) {
    var colorId = productColor.id;
    var productImages = images[colorId];
    $('<div/>', { class: 'color-all'})
      .data({'images': product.getImages(productImages, 'small'), 'focussed-image': productImages['medium'][0], 'image-angles': product.getImages(productImages, 'medium'), 'sizes': product.getSizeDetails(productColor, 'name'), 'size-ids': product.getSizeDetails(productColor, 'id'), 'size-price': product.getSizeDetails(productColor, 'price'), 'size-discounted-price': product.getSizeDetails(productColor, 'discounted_price'), 'size-quantity': product.getSizeDetails(productColor, 'quantity') }).append($('<img>', { 'src': productImages['small'][0], class: 'small-image'}))
      .appendTo(availColorContainer);

  }

  this.getImages = function(images, size) {
    var images = images[size];
    var img_collection = [];
    for (var key in images) {
      img_collection.push(images[key]);
    }
    return img_collection;
  }

  this.getSizeDetails = function(productColor, key) {
    var sizeDetail = [];
    for (var size_key in productColor.sizes) {
      var size = productColor.sizes[size_key];
      sizeDetail.push(size[key]);
    }
    return sizeDetail;
  }
}