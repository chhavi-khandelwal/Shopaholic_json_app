$(document).ready(function() {
  filters = ["brand", "color"];
  hashData = {};
  var gridPage = new GridPage();
  gridPage.bindEvents();
});

function GridPage() {
  var gridPage = this;
  var $main_container = $('#main-container');
  var gridColors = [];
  var productFocus = $('.product-focus');

  this.bindEvents = function() {
    this.adjustHeight();
    this.bindCategoryNavLinksEvent();
    this.bindHashChange();
    if (window.location.hash != '') {
      this.displayFilteredProducts();
    }
  }

  this.adjustHeight = function() {
    $('.row-fluid').css('min-height', $(window).height());
  }

  this.bindCategoryNavLinksEvent = function() {
    $('.link-tile.category-tile').click(this.bindUrlHashChange);
  }

  this.displayFilteredProducts = function() {
    hashData = {};
    hashData = gridPage.extractHashData();
    for (key in hashData) {
      switch(key)
      {
        case 'products': gridPage.displayProduct();
        break;
        case 'categories': gridPage.displayCategoryProducts();
        break;
        default: gridPage.displayHomePageProducts();
      }
    }
    gridPage.displayHomePageProducts();
  }

  this.displayProduct = function() {
    gridPage.resetContainers();
    this.viewProduct();
  }

  this.displayHomePageProducts = function() {
    if ($.isEmptyObject(hashData)) {
      gridColors = productColors;
      gridPage.displayProducts();
    }
  }

  this.displayCategoryProducts = function() {
    gridPage.resetContainers();
    $('#side-panel').remove();
    gridColors = gridPage.getProductColors(hashData['categories']);
    gridPage.displayProducts();
    var filterHash = gridPage.getFiltersHash();
    gridPage.displayFilters(filterHash['colors'], filterHash['brands']);
    for (var i = 0, len = filters.length; i < len; i++) {
      if (hashData[filters[i]] != undefined) {
        gridPage.checkFilters(filters[i]);
      }
    }
    var productGrid = new ProductGrid();
    productGrid.filterProducts();
  }

  //mark checkboxes of filters to be true or false accordingly 
  this.checkFilters = function(filter) {
    var hash_filters = hashData[filter];
    $('#' + filter + '-filters').find('input[type="checkbox"]').each(function(index) {
      var filterElement = $(this);
      if ($.inArray(filterElement.attr('value'), hash_filters) != -1)
        filterElement.prop('checked', true);
      else
        filterElement.prop('checked', false);
    });
  }

  this.resetContainers = function() {
    $('#new-today').remove();
    $('#latest-products-container').html('');
    $('.product-focus').html('');
  }

  this.extractHashData = function() {
    var urlHash = {};
    var filterHashParams = [];
    var window_hash = window.location.hash;
    if (window_hash != '') {
      var window_hash_params = window_hash.split('#')[1].split('&');
      for (var i = 0, len = window_hash_params.length; i < len; i++) {
        var hashParams = window_hash_params[i].split('=');
        urlHash[hashParams[0]] = hashParams[1];
        var paramValue = hashParams[1];
        if (paramValue.indexOf('[') != -1) {
          var filtersHash = paramValue.split('[')[1].split(']')[0];
          filterHashParams = gridPage.getFilterHashParams(filtersHash);
          urlHash[hashParams[0]] = filterHashParams;
        }
      } 
    }
    return urlHash;
  }

  this.getFilterHashParams = function(filtersHash) {
    var filterHashParams = [];
    if (filtersHash.indexOf(',') != -1) {
      filterHashParams = filtersHash.split(',');
    }
    else {
      filterHashParams.push(filtersHash);
    }
    return filterHashParams;
  }


  this.getFiltersHash = function() {
    var colors = [], brands = [];
    for (var i = 0, len = gridColors.length; i < len; i++) {
      colors.push(gridColors[i].name);
      brands.push(gridColors[i].brand.name);
    }
    return ({
      'colors': colors,
      'brands': brands
    });
  }
  
  this.getProductColors = function(categoryId) {
    var colors = [];
    for (var i = 0, len = productColors.length; i < len; i++) {
      if (categoryId == productColors[i].category.id) {
        colors.push(productColors[i])
      }
    }
    return colors;
  }

  //displays products in the home grid
  this.displayProducts = function() {
    for (var i = 0, len = gridColors.length; i < len; i++) {
      var color = gridColors[i];
      this.getProductDetails(color);
      this.checkSoldOut(color);
    }
  }

  this.bindUrlHashChange = function(event) {
    if (event) {
      event.preventDefault();
    }
    gridPage.appendHashToUrl($(this));
    gridPage.bindHashChange();
  }

  this.bindHashChange = function() {
    window.onhashchange = function() {
      gridPage.displayFilteredProducts();
    }
  }

  this.appendHashToUrl = function(category) {
    var categoryId = category.attr('id');
    var hash = '#categories=' + categoryId;
    if (window.location.pathname.indexOf('carts') != -1) {
      window.location.href = window.location.origin + hash;
    }
    else {
      window.location.hash = hash;
    }
  }

  this.checkSoldOut = function(color) {
    var latest_product = $('#product_color_' + color.id);
    var selected_size_id = this.getSelectedAvailableSize(color);
    if (color.availability) {
      latest_product.on('click', function() { gridPage.setProductShowUrl(color, selected_size_id) });
    } 
    else {
      latest_product.find('.latest-products-image').append($('<img>', {
        class: 'sold-out',
        'src': '/assets/sold_out.jpg'
      }));
    }
  }

  this.getSelectedAvailableSize = function(color) {
    var sizes = color.sizes;
    for (var i in sizes) {
      if (sizes[i].quantity_available) {
        return sizes[i].id;
      }
    }
  }

  //get hash for filters to be displayed
  this.getFilterElementsHash = function(productColors, productBrands) {
    var productColors = $.unique(productColors);
    var productBrands = $.unique(productBrands);
    return ({
      'color': productColors,
      'brand': productBrands
    });
  }

  //display filterss related to particular category products
  this.displayFilters = function(productColors, productBrands) {
      var filterElements = this.getFilterElementsHash(productColors, productBrands);
      this.getFilters(filterElements);
  }

    //get filters to be displayed
    this.getFilters = function(filterElements) {
      var filters = ['color', 'brand'];
      var filterContainer = $('<div/>', {
        id: 'filters',
        class: 'span2'
      });
      for (var i = 0, len = filters.length; i < len; i++) {
        var filterHeading = this.getFilterHead(filters[i], filterContainer);
        var filterCollection = $('<div/>', {
            id: (filters[i] + '-filters')
        }).insertAfter(filterHeading);
        var filterTag = filterElements[filters[i]];
        this.displayFilterTags(filters[i], filterTag, filterCollection);
      }
      $('<div/>', {
        id: 'side-panel'
      }).insertBefore(productFocus).append(filterContainer);
    }

    //display filters
    this.displayFilterTags = function(filter, filterTag, filterCollection) {
      for (var j = 0, jLen = filterTag.length; j < jLen; j++) {
        $('<div/>', {
          class: 'filterElement'
        }).append($('<input/>', {
          id : filterTag[j],
          'type': 'checkbox',
          'value': filterTag[j],
          'data-filter': filter
        }))
        .append($('<label/>', {
            class: 'filterName'
        }).attr('for', filterTag[j])
          .html(filterTag[j]))
          .appendTo(filterCollection);
      }
    }

    //get filter heading and corresponding containers holding it
    this.getFilterHead = function(filterName, filterContainer) {
        var filterHead = $('<div/>', {
            class: 'filter-heading'
        }).html(filterName).appendTo(filterContainer);
        return filterHead;
    }

  //get product details in containers to be displayed
  this.getProductDetails = function(color) {
    var latest_product = $('<div/>', {class: 'latest-products', id: ('product_color_' + color.id), 'data-color': color.name, 'data-brand': color.brand.name }).appendTo($('#latest-products-container'));
    var product_image = $('<img>').attr('src', color.images[0]['medium']);
    this.displayProductImage(product_image, latest_product);
    var latest_products_desc = $('<div/>').addClass('latest-products-desc').appendTo(latest_product);
    this.getContent(color, latest_products_desc);
  }

  //displays product Image
  this.displayProductImage = function(product_image, latest_product) {
    $('<div/>').addClass('latest-products-image').html(product_image).appendTo(latest_product);
  }

  //get min price of the color to be displayed on the product label
  this.getMinPrice = function(color) {
    var min = Number(color.sizes[0].price);
    for (size_key in color.sizes) {
      if (color.sizes[size_key].price < min)
        min = color.sizes[size_key].price;
    }
    return min;
  }

  //get content for adding description to the product
  this.getContent = function(color, latest_products_desc) {
    var title = color['title'];
    var description = (color['description'].substring(0,20) + '..');
    var brand = color.brand.name + ' -Rs.' + this.getMinPrice(color);
    var content = [
    { Content: title },
    { Content: description },
    { Content: brand }
    ];
    var contentContainer = "<div><h5>${Content}</h5></div>";
    $.template("contentTemplate", contentContainer);
    $.tmpl("contentTemplate", content).appendTo(latest_products_desc);
  }
  
  //get product description content container
  this.getContentContainer = function(value, latest_products_desc) {
    $('<div/>').append($('<h5/>')
                        .html(value))
      .appendTo(latest_products_desc);
  }
  
  //view product after clicking quick view button
  this.viewProduct = function(event) {
    if(event)
      event.preventDefault();
    $('#side-panel').remove();
    var displayedColor = gridPage.getDisplayedColor();
    if (displayedColor.availability) {
      gridPage.getAlertContainer();
      gridPage.displayProductDetails(displayedColor);
    }
  }

  //get new url for product show
  this.setProductShowUrl = function(color, size_id) {
    window.location.hash = "#products=" + color.product_id + "&colors" + "=" + color.id + '&size=' + size_id;
  }

  
  //get product focus container
  this.getAlertContainer = function() {
    $('.product-focus').append($('<div/>', {class: 'alert fade in alert-success visibility', id: 'before-add'}));
  }


  //calls all the functions that display product
  this.displayProductDetails = function(displayedColor) {
    var productAngles = $('<div/>', {class: 'product-angles'}).appendTo(productFocus);
    this.getImageViews(displayedColor, productAngles);
    var productInFocus = this.displayProductInFocus(displayedColor.images);
    this.appendContainer(productInFocus);
    var offeredSizes = this.getOfferedSizes(displayedColor);
    this.appendContainer(offeredSizes);
    var productDetails = this.getProductDescription(displayedColor);
    this.appendContainer(productDetails);
    var availableColors = this.getAvailableColors(displayedColor);
    this.appendContainer(availableColors);
  }
  
  //appends containers
  this.appendContainer = function(nest) {
    nest.appendTo(productFocus);
  }
  
  //get image's different views containers
  this.getImageViews = function(displayedColor, productAngles) {
    var current_color = displayedColor['id'];
    var images = displayedColor.images;
    for (var image_key in images) {
      var image = this.getCurrentProductImage(images[image_key]['medium']);
      $('<div/>', {class: 'angle', 'data-focussed-image': images[image_key]['medium'], 'data-large-image': images[image_key]['large'] }).append(image.addClass('small-image')).appendTo(productAngles);
    }
    $('.angle:first').addClass('selected');
  }
  
  //display product in focus in the focus container
  this.displayProductInFocus = function(images) {
    var image = this.getCurrentProductImage(images[0]['medium'], images[0]['large']);
    var productInFocus = $('<div/>', { class: 'product-in-focus' }).append(image);
    image.elevateZoom({ zoomWindowPosition: 1, zoomWindowHeight: 200, zoomWindowWidth: 200 });
    return productInFocus;
  }
  
  //get image of the current product
  this.getCurrentProductImage = function(medium_image, large_image) {
    var image = $('<img>', {'src': medium_image, id: 'zoomed_image', 'data-zoom-image':large_image});
    return image;
  }
  
  //get sizes corresponding to a particular product color
  this.getOfferedSizes = function(displayedColor) {
    var sizeNameTag = $('<div/>', { id: 'size-name', class: 'block-tile'});
    var offeredSizesContainer = $('<div/>', { id: 'offer-sizes' }).append(sizeNameTag);
    sizeNameTag.append($('<p/>', { class: 'inline-tile' }).html('SELECT SIZE - '));
    this.getCurrentProductSize(displayedColor, sizeNameTag);
    this.displaySizeContainer(displayedColor, offeredSizesContainer);
    var sizePrice = this.getPrice(displayedColor);
    sizePrice.appendTo(offeredSizesContainer);
    return offeredSizesContainer;
  }

  //get first available size of the product color
  this.getFirstSize = function(displayedColor) {
    var sizes = displayedColor.sizes; 
    for(key in sizes) {
      if(sizes[key].quantity_available)
        return sizes[key];
    }
  }
  
  //get current product available size to be diaplayed
  this.getCurrentProductSize = function(displayedColor, sizeNameTag) {
    var currentSize = this.getFirstSize(displayedColor);
    currentSize = currentSize.name;
    $('<span/>', {id: 'selected-size-value', class:'inline-tile'}).append($('<strong/>')
      .html(currentSize))
      .appendTo(sizeNameTag);
  }

  //display size container that displays all the sizes
  this.displaySizeContainer = function(displayedColor, offeredSizesContainer) {
    var sizes = displayedColor.sizes;
    var sizeContainer = $('<div/>', { class: 'size-container' }).appendTo(offeredSizesContainer);
    for (var key in sizes) {
      var size = this.getSizeContainer(sizes, key);
      size.appendTo(sizeContainer)
        .append($('<span/>').html(sizes[key].name));
    }
  }
  
  //get size container
  this.getSizeContainer = function(sizes, key) {
    var size_class ='size-all'
    if(!sizes[key].quantity_available)
      size_class += ' disabled';
    if (hashData['size'] == sizes[key].id) {
      size_class += ' selected';
    }
    var sizeContainer = $('<div/>', { class: size_class, 'data-id': sizes[key].id, 'data-price': sizes[key].price, 'data-discounted-price': sizes[key].discounted_price });
    return sizeContainer;
  }
  
  //get price of that size to be displayed
  this.getPrice = function(displayedColor) {
    var sizePrice = $('<div/>', { id: 'size-price' });
    var size = this.getFirstSize(displayedColor);
    sizePrice.append($('<p/>', {id: 'real-price'}).html('Real ' + size.price))
      .append($('<p/>', {id: 'discounted-price'}).html('Discounted ' + size.discounted_price));
    return sizePrice;
  }
  
  //get product desciption to be displayed
  this.getProductDescription = function(displayedColor) {
    var detailsContainer = $('<div/>', { id: 'details-tab-container' });
    $('<div/>', { id: 'details-tab' }).append($('<p/>').html('Details'))
      .appendTo(detailsContainer);
    var contentTab = $('<div/>', { id: 'details-tab-content' }).appendTo(detailsContainer);
    this.getBasicDetails(displayedColor, contentTab);
    $('<div/>', {class: 'cart-btn'}).append($('<a/>', { class: 'btn btn-success add-btn', id: 'add-cart', 'data-href': '/carts'}).html('Add To Cart')).appendTo(detailsContainer);
    return detailsContainer;
  }
  
  //get basic details of the product to be displayed on the product show page
  this.getBasicDetails = function(displayedColor, contentTab) {
    $('<div/>').append($('<h5/>').html(displayedColor.title)).appendTo(contentTab);
    $('<div/>').append(this.getContentTag(displayedColor.description)).appendTo(contentTab);
    $('<div/>').append(this.getContentTag(displayedColor.brand['name'])).appendTo(contentTab);
  }
  
  //get description content tag
  this.getContentTag = function(textVal) {
    var contentTag = $('<p/>', {class: 'inliner-tile'}).html(textVal);
    return contentTag;
  }
  
  //get available colors of the product
  this.getAvailableColors = function(displayedColor) {
    var availColorContainer = $('<div/>', { id: 'color-avail' });
    var productColors = this.getAllProductColors(displayedColor);
    for (var i = 0, len = productColors.length; i < len; i++) {
      this.displayAvailableColor(productColors[i], availColorContainer);
    }
    return availColorContainer;
  }

  this.getAllProductColors = function(displayedColor) {
    var displayedColors = [];
    for (var i = 0, len = productColors.length; i < len; i++) {
      if (displayedColor.product_id == productColors[i].product_id) {
        displayedColors.push(productColors[i]);
      }
    }
    return displayedColors;
  }
  
  //display available colors of the product
  this.displayAvailableColor = function(productColor, availColorContainer) {
    var productImages = productColor.images;
    var availableColorContainer = this.getAvailableColorContainer(productColor, productImages);
    availableColorContainer.append($('<img>', { 'src': productImages[0]['small'], class: 'small-image'}))
      .appendTo(availColorContainer);
  }

  this.getAvailableColorContainer = function(productColor, productImages) {
    var availableColorContainer = $('<div/>', { class: 'color-all'})
      .data({'id': productColor.id, 'images': this.getImages(productImages, 'small'), 'focussed-image': productImages[0]['medium'], 'image-angles': this.getImages(productImages, 'medium'), 'sizes': this.getSizeDetails(productColor, 'name'), 'size-ids': this.getSizeDetails(productColor, 'id'), 'size-price': this.getSizeDetails(productColor, 'price'), 'size-discounted-price': this.getSizeDetails(productColor, 'discounted_price'), 'size-quantity': this.getSizeDetails(productColor, 'quantity_available') });
    return availableColorContainer;
  }
  
  //get images of the corresponding color
  this.getImages = function(images, size) {
    var img_collection = [];
    for (var key in images) {
      img_collection.push(images[key][size]);
    }
    return img_collection;
  }
  
  //get size details of the product color
  this.getSizeDetails = function(productColor, key) {
    var sizeDetail = [];
    for (var size_key in productColor.sizes) {
      var size = productColor.sizes[size_key];
      sizeDetail.push(size[key]);
    }
    return sizeDetail;
  }

  //get product color to be displayed on the product show page
  this.getDisplayedColor = function() {
    var colorId = hashData['colors'];
    var gridColors = productColors;
    for (var i = 0, len = gridColors.length; i < len; i++) {
      if (gridColors[i].id == parseInt(colorId)) {
        return gridColors[i];
      }
    }
  }
}