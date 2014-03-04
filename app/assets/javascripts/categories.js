$(document).ready(function() {
    var productGrid = new ProductGrid();
    productGrid.bindEvents();
});

function ProductGrid() {
    var productGrid = this;

    //binds click event to the input checkboxes
    this.bindEvents = function() {
      $('#main-container').on('click', 'input[type="checkbox"]', productGrid.filterProducts);
    }

    //filters the products from selected filter
    this.filterProducts = function() {
        console.log("a")
      var $gridProducts = $('.latest-products');
      $gridProducts.hide();
      var productfilter = [];
      var filters = ["brand", "color"];
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