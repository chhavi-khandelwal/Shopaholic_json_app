$(document).ready(function() {
  homeProduct = new HomeProductGrid();
  products = '';
  homeProduct.getRecent();
  min_quantity = 0;
});

function HomeProductGrid() {
  var $main_container = $('#main-container');
  var homeProduct = this;

  this.addPolling = function() {
    setTimeout(function() { homeProduct.getRecent(); }, 40000);
  }

  this.getRecent = function() {
    if($('#new-today').length == 1) {
      $.ajax({
        url: $('#latest-products-container').data('href'),
        dataType: 'json',
        async: false, 
      }).done(function(data) {
        $('#latest-products-container').html('');
        products = data;
        var url_hash = window.location.hash.split('-')[0];
        if (url_hash != '#products' && url_hash != '#categories')
        {
          for (var i in products) {
            var gridProduct = products[i];
            homeProduct.displayProducts(gridProduct);
          }
        }
      }).complete(function() {
        homeProduct.addPolling();
      });
    }    
  }

  this.displayProducts = function(product) {
    var productColors = product.colors;
    for (var color_key in product.colors) {
      var color = productColors[color_key];
      this.getProductDetails(product, color);
      this.checkSoldOut(color);
    }
  }


  this.checkSoldOut = function(color) {
    var latest_product = $('#product_color_' + color.id);
    if (color.quantity_flag) {
      var quickViewBtn = latest_product.find('.quick-view');
      quickViewBtn.on('click', this.viewProduct);
    }
    else {
      latest_product.find('.latest-products-image').append($('<img>', {class: 'sold-out', 'src': '/assets/sold_out.jpg'}));
    }
  }

  this.getProductDetails = function(product, color) {
    var latest_product = $('<div/>', {class: 'latest-products', id: ('product_color_' + color.id)}).appendTo($('#latest-products-container'));
    var product_image = $('<img>').attr('src', color.images[0]['medium']);
    this.displayProductImage(product_image, latest_product);
    this.displayQuickViewBtn(product, color, product_image);
    var latest_products_desc = $('<div/>').addClass('latest-products-desc').appendTo(latest_product);
    this.getContent(product, latest_products_desc);
  }

  this.displayProductImage = function(product_image, latest_product) {
    $('<div/>').addClass('latest-products-image').html(product_image).appendTo(latest_product);
  }

  this.displayQuickViewBtn = function(product, color, product_image) {
    var quick_view = this.createQuickViewBtn(product, color);
    quick_view.insertAfter(product_image);
  }

  this.createQuickViewBtn = function(product, color) {
    return ($('<a/>').attr({'data-href': '/products/' + product.id + '/colors/' + color.id, class: 'quick-view visibility btn'}).html('Quick View'));
  }

  this.getContent = function(product, latest_products_desc) {
    var title = product['title'];
    this.getContentContainer(title, latest_products_desc);
    var description = (product['description'].substring(0,20) + '...');
    this.getContentContainer(description, latest_products_desc);
    var brand = product.brand.name;
    this.getContentContainer(brand, latest_products_desc);
  }

  this.getContentContainer = function(value, latest_products_desc) {
    $('<div/>').append($('<h5/>')
                        .html(value))
      .appendTo(latest_products_desc);
  }

  this.viewProduct = function(event, change_hash) {
    var change_hash = change_hash || 'yes';
    if(event)
      event.preventDefault();
    var clickedQuickView = $(this);
    var url = homeProduct.getUrl(change_hash, $(this));
    $('#side-panel').remove();
    url = url.split('/');
    var displayedProduct = homeProduct.getDisplayedProduct(url);
    var displayedColor = homeProduct.getDisplayedColor(displayedProduct, url);
    var productFocus = homeProduct.getProductFocus();
    homeProduct.displayProductDetails(displayedProduct, displayedColor, productFocus);
    $main_container.html(productFocus);
  }

  this.getUrl = function(change_hash, current_product) {
    var url = '';
    if(change_hash == 'yes') {
      url = current_product.data('href');
      var url_params = url.split('/');
      window.location.hash = "#" + url_params[1] + "-" + url_params[2] + "-" + url_params[3] + "-" + url_params[4];
    }
    else {
      url = window.location.hash.replace(new RegExp('-','g'), '/');
      url = url.replace('#','/');
    }
    return url;
  }
// ***************************************************************************
  
  this.getDisplayedColor = function(displayedProduct, url) {
    var colorId = url[4];
    var displayedColors = displayedProduct.colors;
    var displayedColor = '';
    for (var color_key in displayedColors) {
      var currentColor = displayedColors[color_key];
      if (currentColor.id == colorId) {
        displayedColor = currentColor; 
        break;
      }
    }
    return displayedColor;
  }

  this.getDisplayedProduct = function(url) {
    var productId = url[2];
    var displayedProduct = ''; 
    for (var product_key in products) {
      var currentProduct = products[product_key];
      if (currentProduct.id == productId) {
        displayedProduct = currentProduct; 
        break;
      }
    }
    return displayedProduct;
  }

  //calls all the functions that display product
  this.displayProductDetails = function(displayedProduct, displayedColor, productFocus) {
    var productAngles = $('<div/>', {class: 'product-angles'}).appendTo(productFocus);
    homeProduct.getImageViews(displayedColor, productAngles);
    var productInFocus = homeProduct.displayProductInFocus(displayedColor.images);
    homeProduct.appendContainer(productInFocus, productFocus);
    var offeredSizes = homeProduct.getOfferedSizes(displayedColor);
    homeProduct.appendContainer(offeredSizes, productFocus);
    var productDetails = homeProduct.getProductDescription(displayedProduct);
    homeProduct.appendContainer(productDetails, productFocus);
    var availableColors = homeProduct.getAvailableColors(displayedProduct);
    homeProduct.appendContainer(availableColors, productFocus);
  }

  this.appendContainer = function(nest, main) {
    nest.appendTo(main);
  }

  this.getImageViews = function(displayedColor, productAngles) {
    var current_color = displayedColor['id'];
    var images = displayedColor.images;
    for (var image_key in images) {
      var image = homeProduct.getCurrentProductImage(images[image_key]['medium']);
      $('<div/>', {class: 'angle', 'data-focussed-image': images[image_key]['medium'] }).append(image.addClass('small-image')).appendTo(productAngles);
    }
  }

  this.getProductFocus = function() {
    var productFocus = $('<div/>', { class: 'product-focus span10 offset1' })
        .append($('<div/>', {class: 'alert fade in alert-danger visibility', id: 'before-add'}));
    return productFocus;    
  }

  this.displayProductInFocus = function(images) {
    var image = homeProduct.getCurrentProductImage(images[0]['medium']);
    var productInFocus = $('<div/>', { class: 'product-in-focus' }).append(image);
    return productInFocus;
  }

  this.getCurrentProductImage = function(image) {
    var image = $('<img>', {'src': image});
    return image;
  }

  this.getOfferedSizes = function(displayedColor) {
    var sizeNameTag = $('<div/>', { id: 'size-name', class: 'block-tile'});
    var offeredSizesContainer = $('<div/>', { id: 'offer-sizes' }).append(sizeNameTag);
    sizeNameTag.append($('<p/>', { class: 'inline-tile' }).html('SELECT SIZE - '))
    homeProduct.getCurrentProductSize(displayedColor, sizeNameTag);
    homeProduct.displaySizeContainer(displayedColor, offeredSizesContainer);
    var sizePrice = homeProduct.getPrice(displayedColor);
    sizePrice.appendTo(offeredSizesContainer);
    return offeredSizesContainer;
  }

  this.getFirstSize = function(displayedColor) {
    var sizes = displayedColor.sizes; 
    for(key in sizes) {
      if(sizes[key].quantity > min_quantity)
        return sizes[key];
    }
  }

  this.getCurrentProductSize = function(displayedColor, sizeNameTag) {
    var currentSize = homeProduct.getFirstSize(displayedColor);
    currentSize = currentSize.name;
    $('<span/>', {id: 'selected-size-value', class:'inline-tile'}).append($('<strong/>')
      .html(currentSize))
      .appendTo(sizeNameTag);
  }

  this.displaySizeContainer = function(displayedColor, offeredSizesContainer) {
    var sizes = displayedColor.sizes;
    var sizeContainer = $('<div/>', { class: 'size-container' }).appendTo(offeredSizesContainer);
    for (var key in sizes) {
      var size = homeProduct.getSizeContainer(sizes, key);
      size.appendTo(sizeContainer)
        .append($('<span/>').html(sizes[key].name));
    }
  }

  this.getSizeContainer = function(sizes, key) {
    var size_class ='size-all'
    if(sizes[key].quantity == min_quantity)
      size_class += ' disabled'; 
    var sizeContainer = $('<div/>', { class: size_class, 'data-id': sizes[key].id, 'data-price': sizes[key].price, 'data-discounted-price': sizes[key].discounted_price });
    return sizeContainer;
  }

  this.getPrice = function(displayedColor) {
    var sizePrice = $('<div/>', { id: 'size-price' });
    var size = homeProduct.getFirstSize(displayedColor);
    sizePrice.append($('<p/>', {id: 'real-price'}).html('Real ' + size.price))
      .append($('<p/>', {id: 'discounted-price'}).html('Discounted ' + size.discounted_price));
    return sizePrice;
  }

  this.getProductDescription = function(displayedProduct) {
    var detailsContainer = $('<div/>', { id: 'details-tab-container' });
    $('<div/>', { id: 'details-tab' }).append($('<p/>').html('Details'))
      .appendTo(detailsContainer);
    var contentTab = $('<div/>', { id: 'details-tab-content' }).appendTo(detailsContainer);
    homeProduct.getBasicDetails(displayedProduct, contentTab);
    $('<div/>', {class: 'cart-btn'}).append($('<a/>', { class: 'btn btn-success add-btn', id: 'add-cart', 'data-href': '/carts'}).html('Add To Cart')).appendTo(detailsContainer);
    return detailsContainer;
  }

  this.getBasicDetails = function(displayedProduct, contentTab) {
    $('<div/>').append($('<h5/>').html(displayedProduct.title)).appendTo(contentTab);
    $('<div/>').append(homeProduct.getContentTag(displayedProduct.description)).appendTo(contentTab);
    $('<div/>').append(homeProduct.getContentTag(displayedProduct.brand['name'])).appendTo(contentTab);
  }

  this.getContentTag = function(textVal) {
    var contentTag = $('<p/>', {class: 'inliner-tile'}).html(textVal);
    return contentTag;
  }

  this.getAvailableColors = function(displayedProduct) {
    var availColorContainer = $('<div/>', { id: 'color-avail' });
    var productColors = displayedProduct.colors;
    for (var key in productColors) {
      var productColor = productColors[key];
      homeProduct.displayAvailableColor(productColor, availColorContainer);
    }
    return availColorContainer;
  }

  this.displayAvailableColor = function(productColor, availColorContainer) {
    var productImages = productColor.images;
    $('<div/>', { class: 'color-all'})
      .data({'id': productColor.id,'images': homeProduct.getImages(productImages, 'small'), 'focussed-image': productImages[0]['medium'], 'image-angles': homeProduct.getImages(productImages, 'medium'), 'sizes': homeProduct.getSizeDetails(productColor, 'name'), 'size-ids': homeProduct.getSizeDetails(productColor, 'id'), 'size-price': homeProduct.getSizeDetails(productColor, 'price'), 'size-discounted-price': homeProduct.getSizeDetails(productColor, 'discounted_price'), 'size-quantity': homeProduct.getSizeDetails(productColor, 'quantity') }).append($('<img>', { 'src': productImages[0]['small'], class: 'small-image'}))
      .appendTo(availColorContainer);
  }

  this.getImages = function(images, size) {
    var img_collection = [];
    for (var key in images) {
      img_collection.push(images[key][size]);
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