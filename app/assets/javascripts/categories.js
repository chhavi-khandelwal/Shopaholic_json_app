$(document).ready(function() {
  productGrid = new ProductGrid();
  productGrid.bindEvents();
});

function ProductGrid() {
    var productGrid = this;
    oldHash = '';

    //binds click event to the input checkboxes
    this.bindEvents = function() {
      $('#main-container').on('change', 'input[type="checkbox"]', productGrid.setWindowHash);
    }
    
    //returns window hash on selecting filters
    this.getWindowHash = function() {
      var filterString = '', mergedFilterString = '';
      for (var i = 0, len = filters.length; i < len; i++) {
        var filter_tags = productGrid.getFilterTags(filters[i]);
        if (filter_tags.length > 0) {
          var filter_params = filters[i] + '=[' + filter_tags + ']';
          filterString = '&' + filter_params;
          mergedFilterString += filterString;
        }
      }
      return mergedFilterString;
    }
    
    //returns filters that are marked to filter products
    this.getFilterTags = function(filter) {
      var filter_tags = [];
      $('input[data-filter="' + filter + '"]').each(function() {
        if ($(this).prop('checked')) {
          filter_tags.push($(this).val());
        }
      });
      return filter_tags.join(',');
    }

    //set window hash according to the checked filters
    this.setWindowHash = function() {
      var hash = productGrid.getWindowHash();
      var window_hash = window.location.hash.split('&')[0];
      if (oldHash.length > 0) {
        window.location.hash = window.location.hash.replace(oldHash, hash);
      }
      else {
        window.location.hash = window_hash + hash;
      }
      oldHash = hash;
    }

    //filters the products from selected filter
    this.filterProducts = function() {
      var $gridProducts = $('.latest-products');
      $gridProducts.hide();
      var productfilter = [];
      for (var i = 0; i < filters.length; i++) {
        productfilter = productGrid.filterSelection(filters[i]);
        if (productfilter.length > 0) {
          $gridProducts = productGrid.getFilteredProducts(productfilter, $gridProducts);
        }
      }
      $gridProducts.show();
    }
    

    //selects the filtered products in an array
    this.filterSelection = function(filter) {
      var selectedProducts = [];
      var filters = $('#' + filter + '-filters' + ' input[type="checkbox"]:checked');
      if (filters.length > 0) {
        filters.each(function() {
          var filterSelector = filter + "='" + $(this).val() + "'"
          selectedProducts.push("div.latest-products[data-" + filterSelector + "]");
        });
      }
      return selectedProducts;
    }

    //filters the products on the basis of the selected products string using filter()
    this.getFilteredProducts = function(productfilter, $gridProducts) {
      var filteredProducts = this.getFilteredProductsString(productfilter);
      var $gridProducts = $gridProducts.filter(filteredProducts);
      return $gridProducts;
    }

    //creates and returns string of selectedProducts[]
    this.getFilteredProductsString = function(productfilter) {
      var products = productfilter.join();
      return products;
    }

}